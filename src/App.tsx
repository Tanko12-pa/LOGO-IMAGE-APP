import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { BiometricModal } from './components/BiometricModal';
import { LogmageAssistant } from './components/LogmageAssistant';
import { AppTour } from './components/AppTour';
import { DashboardView } from './components/views/DashboardView';
import { LogoGeneratorView } from './components/views/LogoGeneratorView';
import { ImageGeneratorView } from './components/views/ImageGeneratorView';
import { ComputerVisionView } from './components/views/ComputerVisionView';
import { A2AJudgeView } from './components/views/A2AJudgeView';
import { BrandStudioView } from './components/views/BrandStudioView';
import { ImageEditorView } from './components/views/ImageEditorView';
import { VideoMotionView } from './components/views/VideoMotionView';
import { TemplatesView } from './components/views/TemplatesView';
import { ProjectsView } from './components/views/ProjectsView';
import { GalleryViews } from './components/views/GalleryViews';
import { BillingView } from './components/views/BillingView';
import { AdminView } from './components/views/AdminView';
import { SettingsFeedbackView } from './components/views/SettingsFeedbackView';
import { PublicLandingView } from './components/views/PublicLandingView';
import {
  BrandKit,
  DesignItem,
  NavView,
  NotificationItem,
  Project,
  UserProfile,
  SyncStatus,
} from './types';
import { storageService, DEFAULT_BRAND_KIT } from './services/storageService';
import {
  subscribeAuthState,
  signInWithGoogle,
  logOut,
  saveDesignDoc,
  deleteDesignDoc,
  saveProjectDoc,
  saveBrandKitDoc,
  listenToUserDesigns,
  listenToUserProjects,
  listenToUserBrandKits,
} from './services/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Modals & Drawers
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // App Data State (Backed by Local Storage & Firestore)
  const [designs, setDesigns] = useState<DesignItem[]>(() => storageService.getDesigns());
  const [projects, setProjects] = useState<Project[]>(() => storageService.getProjects());
  const [brandKits, setBrandKits] = useState<BrandKit[]>(() => storageService.getBrandKits());
  const [activeBrandKit, setActiveBrandKit] = useState<BrandKit>(() =>
    storageService.getActiveBrandKit()
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    storageService.getUserProfile()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    storageService.getNotifications()
  );
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => storageService.getSyncStatus());
  const [searchQuery, setSearchQuery] = useState('');

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthState((user) => {
      setFirebaseUser(user);
      if (user) {
        setUserProfile((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          avatarUrl: user.photoURL || prev.avatarUrl,
        }));
        storageService.addNotification({
          title: 'Connected to Firebase',
          message: `Authenticated as ${user.email}. Real-time cloud sync active.`,
          type: 'success',
        });
        setNotifications(storageService.getNotifications());
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore Listeners when authenticated
  useEffect(() => {
    if (!firebaseUser) return;
    const unsubDesigns = listenToUserDesigns(firebaseUser.uid, (remoteDesigns) => {
      if (remoteDesigns.length > 0) {
        setDesigns(remoteDesigns);
        remoteDesigns.forEach((d) => storageService.saveDesign(d));
      }
    });
    const unsubProjects = listenToUserProjects(firebaseUser.uid, (remoteProjects) => {
      if (remoteProjects.length > 0) {
        setProjects(remoteProjects);
        remoteProjects.forEach((p) => storageService.saveProject(p));
      }
    });
    const unsubBrandKits = listenToUserBrandKits(firebaseUser.uid, (remoteKits) => {
      if (remoteKits.length > 0) {
        setBrandKits(remoteKits);
        remoteKits.forEach((k) => storageService.saveBrandKit(k));
      }
    });

    return () => {
      unsubDesigns();
      unsubProjects();
      unsubBrandKits();
    };
  }, [firebaseUser]);

  // Online / Offline state tracking & cloud re-synchronization
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Trigger cloud re-synchronization routine with persistent progress indicator in notification panel
      storageService.startOnlineSync((status) => {
        setSyncStatus(status);
        setNotifications(storageService.getNotifications());
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      const offlineStatus: SyncStatus = {
        isSyncing: false,
        progress: 0,
        statusText: 'Offline Mode Active. Assets cached locally and will synchronize upon reconnection.',
        lastSyncedAt: storageService.getSyncStatus().lastSyncedAt,
        pendingItemsCount: storageService.getDesigns().length,
      };
      storageService.saveSyncStatus(offlineStatus);
      storageService.updatePersistentSyncNotification(offlineStatus);
      storageService.addNotification({
        title: 'Offline Mode Active',
        message: 'All generated vectors and assets remain locally accessible.',
        type: 'info',
      });
      setSyncStatus(offlineStatus);
      setNotifications(storageService.getNotifications());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to background sync updates
    const unsubscribeSync = storageService.subscribeSyncStatus((status) => {
      setSyncStatus(status);
      setNotifications(storageService.getNotifications());
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeSync();
    };
  }, []);

  // Manual Trigger for Cloud Synchronization
  const handleTriggerSync = () => {
    storageService.startOnlineSync((status) => {
      setSyncStatus(status);
      setNotifications(storageService.getNotifications());
    });
  };

  // Toggle Offline/Online simulation for instant testing of sync resumption
  const handleToggleOfflineMode = () => {
    if (isOffline) {
      setIsOffline(false);
      // Trigger cloud re-synchronization routine with persistent progress indicator in notification panel
      storageService.startOnlineSync((status) => {
        setSyncStatus(status);
        setNotifications(storageService.getNotifications());
      });
    } else {
      setIsOffline(true);
      const offlineStatus: SyncStatus = {
        isSyncing: false,
        progress: 0,
        statusText: 'Offline Mode Active. Assets cached locally and will synchronize upon reconnection.',
        lastSyncedAt: storageService.getSyncStatus().lastSyncedAt,
        pendingItemsCount: storageService.getDesigns().length,
      };
      storageService.saveSyncStatus(offlineStatus);
      storageService.updatePersistentSyncNotification(offlineStatus);
      storageService.addNotification({
        title: 'Offline Mode Active',
        message: 'All generated vectors and assets remain locally accessible.',
        type: 'info',
      });
      setSyncStatus(offlineStatus);
      setNotifications(storageService.getNotifications());
    }
  };

  // Handlers
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign in error:', e);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setFirebaseUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const handleSaveDesign = (item: DesignItem) => {
    storageService.saveDesign(item);
    setDesigns(storageService.getDesigns());
    if (firebaseUser) {
      saveDesignDoc(firebaseUser.uid, item).catch((err) =>
        console.warn('Firestore design save warning:', err)
      );
    }
    storageService.addNotification({
      title: 'New Asset Generated',
      message: `"${item.title}" added to your designs library.`,
      type: 'success',
    });
    setNotifications(storageService.getNotifications());
  };

  const handleDeleteDesign = (id: string) => {
    storageService.deleteDesign(id);
    setDesigns(storageService.getDesigns());
    if (firebaseUser) {
      deleteDesignDoc(firebaseUser.uid, id).catch((err) =>
        console.warn('Firestore design delete warning:', err)
      );
    }
  };

  const handleToggleFavorite = (id: string) => {
    storageService.toggleFavorite(id);
    const updated = storageService.getDesigns();
    setDesigns(updated);
    if (firebaseUser) {
      const item = updated.find((d) => d.id === id);
      if (item) {
        saveDesignDoc(firebaseUser.uid, item).catch((err) =>
          console.warn('Firestore design update warning:', err)
        );
      }
    }
  };

  const handleSaveProject = (project: Project) => {
    storageService.saveProject(project);
    setProjects(storageService.getProjects());
    if (firebaseUser) {
      saveProjectDoc(firebaseUser.uid, project).catch((err) =>
        console.warn('Firestore project save warning:', err)
      );
    }
  };

  const handleDeleteProject = (id: string) => {
    storageService.deleteProject(id);
    setProjects(storageService.getProjects());
  };

  const handleUpdateBrandKit = (kit: BrandKit) => {
    storageService.saveBrandKit(kit);
    storageService.setActiveBrandKit(kit.id);
    setBrandKits(storageService.getBrandKits());
    setActiveBrandKit(kit);
    if (firebaseUser) {
      saveBrandKitDoc(firebaseUser.uid, kit).catch((err) =>
        console.warn('Firestore brandkit save warning:', err)
      );
    }
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    storageService.saveUserProfile(profile);
    setUserProfile(profile);
  };

  const handleMarkNotificationsRead = () => {
    storageService.markAllNotificationsRead();
    setNotifications(storageService.getNotifications());
  };

  const handleLockBiometric = () => {
    setIsBiometricLocked(true);
    setIsBiometricModalOpen(true);
  };

  const handleBiometricSuccess = () => {
    setIsBiometricLocked(false);
    setIsBiometricModalOpen(false);
  };

  const favoritesCount = designs.filter((d) => d.isFavorite).length;

  // Search filter across designs
  const displayedDesigns = searchQuery
    ? designs.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : designs;

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans ${
        userProfile.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* If Landing view is chosen, render full-width landing */}
      {currentView === 'landing' ? (
        <PublicLandingView onNavigate={(view) => setCurrentView(view)} />
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          {/* Single Left-Hand Panel (Sidebar) */}
          <Sidebar
            currentView={currentView}
            onSelectView={(view) => setCurrentView(view)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            favoriteCount={favoritesCount}
            projectCount={projects.length}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
            {/* Top Navigation */}
            <TopNav
              onSelectView={(view) => setCurrentView(view)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              onStartTour={() => setIsTourOpen(true)}
              onLockBiometric={handleLockBiometric}
              userProfile={userProfile}
              notifications={notifications}
              onMarkNotificationsRead={handleMarkNotificationsRead}
              isOffline={isOffline}
              onToggleOffline={handleToggleOfflineMode}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              syncStatus={syncStatus}
              onTriggerSync={handleTriggerSync}
              firebaseUser={firebaseUser}
              onSignInWithGoogle={handleSignInWithGoogle}
              onSignOut={handleSignOut}
              firebaseConnected={true}
            />

            {/* Dynamic Viewport */}
            <main className="flex-1 overflow-y-auto">
              {currentView === 'dashboard' && (
                <DashboardView
                  onNavigate={(view) => setCurrentView(view)}
                  designs={displayedDesigns}
                  projects={projects}
                  activeBrandKit={activeBrandKit}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenAssistant={() => setIsAssistantOpen(true)}
                  onStartTour={() => setIsTourOpen(true)}
                />
              )}

              {currentView === 'logo-generator' && (
                <LogoGeneratorView
                  activeBrandKit={activeBrandKit}
                  onSaveDesign={handleSaveDesign}
                  onNavigate={(view) => setCurrentView(view)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentView === 'image-generator' && (
                <ImageGeneratorView
                  activeBrandKit={activeBrandKit}
                  onSaveDesign={handleSaveDesign}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'computer-vision' && (
                <ComputerVisionView
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'a2a-judge' && (
                <A2AJudgeView
                  activeBrandKit={activeBrandKit}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'brand-studio' && (
                <BrandStudioView
                  activeBrandKit={activeBrandKit}
                  onUpdateBrandKit={handleUpdateBrandKit}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'image-editor' && (
                <ImageEditorView onNavigate={(view) => setCurrentView(view)} />
              )}

              {currentView === 'video-motion' && (
                <VideoMotionView onNavigate={(view) => setCurrentView(view)} />
              )}

              {currentView === 'templates' && (
                <TemplatesView onNavigate={(view) => setCurrentView(view)} />
              )}

              {currentView === 'projects' && (
                <ProjectsView
                  projects={projects}
                  onSaveProject={handleSaveProject}
                  onDeleteProject={handleDeleteProject}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {(currentView === 'my-designs' ||
                currentView === 'favorites' ||
                currentView === 'history') && (
                <GalleryViews
                  mode={currentView}
                  designs={displayedDesigns}
                  onToggleFavorite={handleToggleFavorite}
                  onDeleteDesign={handleDeleteDesign}
                  onNavigate={(view) => setCurrentView(view)}
                />
              )}

              {currentView === 'billing' && (
                <BillingView
                  userProfile={userProfile}
                  onUpdatePlan={(plan) => {
                    handleUpdateProfile({ ...userProfile, plan });
                    storageService.addNotification({
                      title: 'Plan Updated',
                      message: `Your account is now on the ${plan} plan.`,
                      type: 'success',
                    });
                    setNotifications(storageService.getNotifications());
                  }}
                />
              )}

              {currentView === 'admin' && <AdminView />}

              {currentView === 'settings' && (
                <SettingsFeedbackView
                  mode="settings"
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onTriggerBiometricSetup={() => setIsBiometricModalOpen(true)}
                />
              )}

              {currentView === 'feedback' && (
                <SettingsFeedbackView
                  mode="feedback"
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onTriggerBiometricSetup={() => setIsBiometricModalOpen(true)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Biometric Scanner Dialog */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onSuccess={handleBiometricSuccess}
        onCancel={isBiometricLocked ? undefined : () => setIsBiometricModalOpen(false)}
        title={isBiometricLocked ? 'Workspace Locked' : 'Biometric Security Check'}
        reason={
          isBiometricLocked
            ? 'Touch sensor or scan Face ID to resume your creative workspace'
            : 'Verify biometric identity to access encrypted brand assets'
        }
      />

      {/* LOGMAGE Interactive AI Assistant */}
      <LogmageAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentView={currentView}
        brandKit={activeBrandKit}
      />

      {/* App Tour */}
      <AppTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
      />
    </div>
  );
}
