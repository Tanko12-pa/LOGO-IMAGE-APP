# Security Specification & Threat Model

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified by an authenticated, email-verified user whose `request.auth.uid == userId`.
2. **Subcollection Relational Isolation**: Designs (`/users/{userId}/designs/{designId}`), Projects (`/users/{userId}/projects/{projectId}`), and BrandKits (`/users/{userId}/brandKits/{brandKitId}`) must strictly match the parent `{userId}`, preventing cross-tenant write, read, or injection.
3. **Immutability of Critical Identity**: `userId` and `createdAt` are immutable once written; tampering during updates is rejected.
4. **Strict Schema & Size Bounding**: All string fields are constrained to max lengths (e.g., title <= 160, prompt <= 2000, id <= 128) to prevent Denial of Wallet and payload injection.
5. **Admin RBAC Isolation**: Admins are looked up exclusively in the trusted `/admins/{adminId}` path and must match verified email tokens. No self-assigned admin privileges in user documents.
6. **No Blanket Reads or Query Delegation**: List queries evaluate document security directly against authenticated identity.

---

## 2. The "Dirty Dozen" Payloads (Designed to Fail)

1. **Payload 1: Unauthenticated Profile Write**
   - Attempt: `POST /users/victim-uid` without `request.auth`
   - Expect: `PERMISSION_DENIED`
2. **Payload 2: Identity Spoofing Cross-User Write**
   - Attempt: Auth user `attacker-uid` attempts `POST /users/victim-uid`
   - Expect: `PERMISSION_DENIED`
3. **Payload 3: Unverified Email User Write**
   - Attempt: Auth user with `email_verified: false` attempts to write design
   - Expect: `PERMISSION_DENIED`
4. **Payload 4: Ghost Field Injection (Shadow Update)**
   - Attempt: Updating user profile with `{ "isAdmin": true, "role": "superadmin" }`
   - Expect: `PERMISSION_DENIED` (affectedKeys violation)
5. **Payload 5: Immortality Breach (Tampering with createdAt)**
   - Attempt: Modifying existing `createdAt` timestamp to backdate an asset
   - Expect: `PERMISSION_DENIED`
6. **Payload 6: Resource Poisoning (Giant ID string)**
   - Attempt: Creating `/users/{userId}/designs/{designId}` with a 2KB junk string ID
   - Expect: `PERMISSION_DENIED` (isValidId regex & size violation)
7. **Payload 7: Giant Prompt Overflow (Denial of Wallet)**
   - Attempt: Inserting design with a 10MB prompt string
   - Expect: `PERMISSION_DENIED`
8. **Payload 8: Self-Admin Privilege Escalation**
   - Attempt: Non-admin writes to `/admins/attacker-uid`
   - Expect: `PERMISSION_DENIED`
9. **Payload 9: Cross-Tenant Asset Theft**
   - Attempt: User `attacker-uid` attempts `GET /users/victim-uid/designs/secret-design`
   - Expect: `PERMISSION_DENIED`
10. **Payload 10: Non-owner Brand Kit Overwrite**
    - Attempt: User `user-a` attempts update on `/users/user-b/brandKits/bk-1`
    - Expect: `PERMISSION_DENIED`
11. **Payload 11: Invalid Plan Injection**
    - Attempt: Writing `{ plan: "FREE_FOREVER_ENTERPRISE_HACK" }`
    - Expect: `PERMISSION_DENIED`
12. **Payload 12: Blanket Read Query Scraping**
    - Attempt: Listing all documents without user filter
    - Expect: `PERMISSION_DENIED`

---

## 3. Test Runner Reference
All 12 attacks are tested and proven blocked by the rules in `firestore.rules`.
