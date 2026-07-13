# Project Context: Secure "View-Only" Document Vault App

## 1. Project Summary
Build a mobile application acting as a secure digital document vault (DigiLocker-style) where an **Admin** uploads and issues official documents to specific **Users**. Users can only **view** their assigned documents — never download, edit, share, or easily screenshot them.

---

## 2. Design Reference — MUST MATCH EXACTLY

**All UI screens must be built to be visually identical ("same to same") to the reference designs provided in the `/design` folder of this project.**

- Match colors, spacing, typography, card shapes, border radius, icon styles, header curves, and layout structure exactly as shown in the design folder — pixel-for-pixel, not "inspired by."
- Do not introduce new layout patterns, spacing systems, or components that are not present in the reference designs.
- Where a design shows government/reference branding (emblem, issuer logos), replace only the branding assets (logo, name, emblem) with this app's own branding — but keep every layout, spacing, and style decision identical.
- Primary color: indigo-violet (`#4B39EF` / `#5B3FE0`) for headers/accents, white backgrounds, light grey (`#E5E5E5`) card borders/dividers, orange (`#F5820D`) for standout CTA buttons, red (`#D32F2F`) for destructive actions (Logout).
- Screens included in the design folder: Splash, Home Dashboard, Issued Documents list, Secure Document Viewer, Profile, Menu/Settings, Bottom Navigation.
- If any screen needed for the workflows below is not covered in the design folder, extend the existing design system consistently rather than inventing a new style.

---

## 3. Tech Stack
- **Mobile Frontend:** React Native (cross-platform iOS + Android)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (schema below adapted to collections/documents)
- **Cloud Storage:** Cloudinary (private/authenticated delivery, signed URLs)
- **Auth:** Email/password + biometric app-lock (FaceID/TouchID/PIN)

---

## 4. Database Schema (from ER diagram)
> The tables below map to MongoDB collections. Foreign keys become `ObjectId` references (or embedded sub-documents where noted); junction tables like `USER_DOCUMENT` and `ACCESS_USER` become their own collections rather than SQL join tables.

### USER
| Field | Notes |
|---|---|
| USER_ID | PK |
| USERNAME | |
| PASSWORD_HASH | |
| EMAIL | |
| PHONE_NUMBER | |
| IS_ACTIVE | |
| CREATED_AT | |

### ADMIN_USER
| Field | Notes |
|---|---|
| ADMIN_ID | PK |
| ADMIN_USERNAME | |
| ADMIN_EMAIL | |
| ADMIN_PASSWORD_HASH | |

### DOCUMENT_TYPE
| Field | Notes |
|---|---|
| DOCUMENT_TYPE_ID | PK |
| TYPE_NAME | e.g. PDF, IMAGE, CERTIFICATE |

### DOCUMENT
| Field | Notes |
|---|---|
| DOCUMENT_ID | PK |
| DOCUMENT_NAME | |
| CLOUD_STORAGE_URL | Cloudinary secure/private asset reference — temporary signed URL generated on demand, not a permanent link |
| EXPIRY_DATE | |
| UPLOAD_TIMESTAMP | |
| DOCUMENT_TYPE_ID | FK → DOCUMENT_TYPE. One document type has many documents ("uploads and manages"). |

An Admin issues/manages Documents, and Documents are served via short-lived signed URLs (never permanent public links).

### USER_DOCUMENT (junction table — assigns a document to a user)
| Field | Notes |
|---|---|
| USER_DOCUMENT_ID | PK |
| USER_ID | FK → USER |
| DOCUMENT_ID | FK → DOCUMENT |
| ACCESS_TYPE | Always `'VIEW_ONLY'` |
| LAST_VIEWED_AT | |

One USER can have many USER_DOCUMENT rows; one DOCUMENT can be assigned to many USER_DOCUMENT rows. This table is what powers the "Issued Documents" list per user.

### ROLE_ACCESS
| Field | Notes |
|---|---|
| ROLE_ID | PK |
| ROLE_NAME | `'ADMIN'`, `'USER'` |
| PERMISSIONS | JSON array, e.g. `['UPLOAD_DOCS','MANAGE_USERS','VIEW_MY_DOCS']` |

### ACCESS_USER
| Field | Notes |
|---|---|
| DOCUMENT_ID | PK (per diagram) |
| ADMIN_ID | FK → ADMIN_USER |
| ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD_HASH | duplicated from ADMIN_USER in the source diagram |

> ⚠️ **Note on ACCESS_USER:** in the source ER diagram this table's fields duplicate ADMIN_USER rather than clearly modeling "which admin has access to manage which user's documents." Before implementing, confirm the intended purpose is an admin-to-user (or admin-to-document) access-control mapping, and drop the duplicated admin credential columns — an FK reference to ADMIN_USER is sufficient. Implement as an `ADMIN_USER_ACCESS` table (`ADMIN_ID` FK, `USER_ID` FK, `GRANTED_AT`) unless clarified otherwise.

---

## 5. Core Workflows

### Admin Flow (Document Issuance)
1. Admin logs into a secure Web Admin Dashboard.
2. Selects a target User.
3. Uploads a document + metadata (name, type, expiry).
4. File is stored in a private cloud bucket; a `DOCUMENT` row and a `USER_DOCUMENT` mapping row are created.

### User Flow (Document Viewing)
1. User logs into the mobile app (credentials + biometric unlock).
2. Backend fetches `USER_DOCUMENT` rows for that `USER_ID`, joined with `DOCUMENT` for display metadata.
3. On tap, backend generates a short-lived signed URL for `CLOUD_STORAGE_URL` (expires in minutes).
4. Document opens in the restricted, native in-app viewer. `LAST_VIEWED_AT` is updated.

---

## 6. Security & Data Leak Prevention (required, not optional)
- **Temporary URLs only** — never expose permanent public links.
- **Native rendering** — draw documents on a native canvas / dedicated PDF component; no web-view browsers with built-in Save/Print.
- **OS-level screenshot blocking** — Android `FLAG_SECURE`, iOS screen-recording/screenshot listeners to blur or block capture.
- **Dynamic watermarking** — faint diagonal overlay with user ID, email, and timestamp across the viewer.
- **App lock** — FaceID/TouchID/PIN required to open the app.
- **Secure Viewer screen** contains only a Back button — no share, download, or menu options, matching the reference design.

---

## 7. Screens to Build (all styled per `/design` folder)
1. Splash Screen
2. Login (email/password + biometric option)
3. Home Dashboard
4. Issued Documents Tab (list, pulled from `USER_DOCUMENT` + `DOCUMENT`)
5. Secure Document Viewer (locked-down, watermarked)
6. Search screen
7. Profile screen (from `USER` fields)
8. Menu/Settings screen (App Lock, Change PIN, Notifications, Switch Account, Logout)
9. Sticky bottom navigation: Home, Search, Issued, Menu

---

## 8. Open Items to Confirm Before/During Build
- Exact intended structure of `ACCESS_USER` (see note in section 4).
- Whether a full custom Web Admin Dashboard is in scope for this build, or a lightweight portal is acceptable for MVP.
- File type/size restrictions (recommend limiting to PDF/JPEG/PNG initially to control storage cost).
- Whether SMS OTP auth is required (adds recurring cost) or email/password is sufficient for v1.
- Offline document viewing is out of scope unless explicitly requested (requires local encrypted storage, expands scope significantly).
