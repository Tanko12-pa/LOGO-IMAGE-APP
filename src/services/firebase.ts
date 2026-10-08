import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DesignItem, Project, BrandKit, UserProfile } from '../types';

// 1. Initialize Firebase App & Services
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// 2. Validate Connection to Firestore on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    return false;
  }
}

// Automatically test connection
testConnection();

// 3. Error Handling conforming to Firebase Skill Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Authentication helpers
export async function signUpWithEmail(email: string, password: string, name?: string): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name && name.trim()) {
      try {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      } catch (profileErr) {
        console.warn('Could not update displayName on auth user:', profileErr);
      }
    }
    await ensureUserProfileExists(userCredential.user, name?.trim());
    return userCredential.user;
  } catch (error) {
    console.error('Email Sign-Up failed:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    await ensureUserProfileExists(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Email Sign-In failed:', error);
    throw error;
  }
}

export async function resetPasswordForEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await ensureUserProfileExists(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export function subscribeAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await ensureUserProfileExists(user);
      } catch (e) {
        console.warn('Failed ensuring user profile:', e);
      }
    }
    callback(user);
  });
}

// 5. Database Profile & Document Synchronization
export async function ensureUserProfileExists(user: FirebaseUser, customName?: string): Promise<void> {
  const userPath = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const now = Date.now();
      const trialEnds = new Date(now + 7 * 86400000).toISOString();
      const resolvedName = customName || user.displayName || (user.email ? user.email.split('@')[0] : 'Vision Creator');
      const avatar = user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}`;
      await setDoc(userDocRef, {
        email: user.email || 'user@logoimage.ai',
        name: resolvedName,
        avatarUrl: avatar,
        plan: 'TRIAL_7_DAYS',
        subscriptionStatus: 'trial',
        trialStartedAt: new Date(now).toISOString(),
        trialEndsAt: trialEnds,
        creditsRemaining: 150,
        creditsUsed: 0,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

export async function getUserProfileDoc(userId: string): Promise<Partial<UserProfile> | null> {
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    return snap.data() as Partial<UserProfile>;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
    return null;
  }
}

export function listenToUserProfileDoc(
  userId: string,
  onUpdate: (profile: Partial<UserProfile>) => void
): () => void {
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    return onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as Partial<UserProfile>);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
    return () => {};
  }
}

export async function saveDesignDoc(userId: string, design: DesignItem): Promise<void> {
  const path = `users/${userId}/designs/${design.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'designs', design.id);
    await setDoc(
      docRef,
      {
        userId,
        title: design.title.slice(0, 160),
        type: design.type,
        prompt: design.prompt.slice(0, 2000),
        enhancedPrompt: design.enhancedPrompt ? design.enhancedPrompt.slice(0, 3000) : '',
        url: design.url,
        svgCode: design.svgCode ? design.svgCode.slice(0, 500000) : '',
        aspectRatio: design.aspectRatio || '1:1',
        isFavorite: Boolean(design.isFavorite),
        projectId: design.projectId || '',
        createdAt: design.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDesignDoc(userId: string, designId: string): Promise<void> {
  const path = `users/${userId}/designs/${designId}`;
  try {
    const docRef = doc(db, 'users', userId, 'designs', designId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveProjectDoc(userId: string, project: Project): Promise<void> {
  const path = `users/${userId}/projects/${project.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'projects', project.id);
    await setDoc(
      docRef,
      {
        userId,
        name: project.name.slice(0, 120),
        description: project.description ? project.description.slice(0, 500) : '',
        brandKitId: project.brandKitId || '',
        itemsCount: project.itemsCount || 0,
        isArchived: Boolean(project.isArchived),
        isFavorite: Boolean(project.isFavorite),
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBrandKitDoc(userId: string, brandKit: BrandKit): Promise<void> {
  const path = `users/${userId}/brandKits/${brandKit.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'brandKits', brandKit.id);
    await setDoc(
      docRef,
      {
        userId,
        name: brandKit.name.slice(0, 120),
        industry: brandKit.industry.slice(0, 120),
        tagline: brandKit.tagline ? brandKit.tagline.slice(0, 200) : '',
        description: brandKit.description ? brandKit.description.slice(0, 800) : '',
        mission: brandKit.mission ? brandKit.mission.slice(0, 500) : '',
        palette: brandKit.palette || [],
        typography: brandKit.typography || {},
        primaryLogoSvg: brandKit.primaryLogoSvg ? brandKit.primaryLogoSvg.slice(0, 50000) : '',
        secondaryLogoSvg: brandKit.secondaryLogoSvg ? brandKit.secondaryLogoSvg.slice(0, 50000) : '',
        isDefault: Boolean(brandKit.isDefault),
        createdAt: brandKit.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserProfileDoc(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const updates: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (profile.name) updates.name = profile.name.slice(0, 128);
    if (profile.avatarUrl) updates.avatarUrl = profile.avatarUrl.slice(0, 1024);
    if (profile.plan) updates.plan = profile.plan;
    if (profile.trialStartedAt) updates.trialStartedAt = profile.trialStartedAt;
    if (profile.trialEndsAt) updates.trialEndsAt = profile.trialEndsAt;
    if (profile.subscriptionStatus) updates.subscriptionStatus = profile.subscriptionStatus;
    if (profile.creditsRemaining !== undefined) updates.creditsRemaining = profile.creditsRemaining;
    if (profile.creditsUsed !== undefined) updates.creditsUsed = profile.creditsUsed;

    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 6. Realtime Collection Listeners
export function listenToUserDesigns(
  userId: string,
  onUpdate: (designs: DesignItem[]) => void
): () => void {
  const path = `users/${userId}/designs`;
  try {
    const designsCol = collection(db, 'users', userId, 'designs');
    const q = query(designsCol);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: DesignItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            title: data.title || 'Untitled',
            type: data.type || 'logo',
            prompt: data.prompt || '',
            enhancedPrompt: data.enhancedPrompt || '',
            url: data.url || '',
            svgCode: data.svgCode || '',
            aspectRatio: data.aspectRatio || '1:1',
            palette: data.palette || ['#800020', '#F27430', '#FFE566', '#FFFFFF'],
            tags: data.tags || ['ai-generated', 'vector'],
            isFavorite: Boolean(data.isFavorite),
            projectId: data.projectId || undefined,
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function listenToUserProjects(
  userId: string,
  onUpdate: (projects: Project[]) => void
): () => void {
  const path = `users/${userId}/projects`;
  try {
    const projectsCol = collection(db, 'users', userId, 'projects');
    const q = query(projectsCol);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: Project[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || 'Untitled Project',
            description: data.description || '',
            brandKitId: data.brandKitId || undefined,
            itemsCount: data.itemsCount || 0,
            itemIds: [],
            isArchived: Boolean(data.isArchived),
            isFavorite: Boolean(data.isFavorite),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function listenToUserBrandKits(
  userId: string,
  onUpdate: (brandKits: BrandKit[]) => void
): () => void {
  const path = `users/${userId}/brandKits`;
  try {
    const brandKitsCol = collection(db, 'users', userId, 'brandKits');
    const q = query(brandKitsCol);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: BrandKit[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || 'Custom Brand Kit',
            industry: data.industry || 'Technology',
            tagline: data.tagline || '',
            description: data.description || '',
            mission: data.mission || '',
            palette: data.palette || [],
            typography: data.typography || {
              headingFont: 'Syne',
              bodyFont: 'Plus Jakarta Sans',
            },
            primaryLogoSvg: data.primaryLogoSvg || undefined,
            secondaryLogoSvg: data.secondaryLogoSvg || undefined,
            isDefault: Boolean(data.isDefault),
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
