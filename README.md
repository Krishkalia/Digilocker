# DigiLocker Clone - Secure Document Vault

A comprehensive, full-stack application acting as a secure digital document vault. 
Administrators can upload and issue official documents to specific users. Users log in via a mobile application to view their assigned documents securely. The mobile app strictly enforces "view-only" access — blocking screenshots, screen recording, and downloading, while rendering dynamic watermarks to prevent data leakage.

## 🚀 Features

### Mobile App (Users)
- **Secure Authentication**: Email/password login with JWT.
- **Biometric App Lock**: (In Development) FaceID/TouchID/PIN required to open the app.
- **View-Only Vault**: Users can only view issued documents.
- **Dynamic Watermarking**: A faint diagonal overlay of the user's email and current date is rendered across the screen.
- **Screenshot Prevention**: OS-level screenshot blocking on the Secure Viewer screen (`expo-screen-capture`).
- **Native Document Rendering**: Renders PDFs via embedded secure web views and images natively.

### Admin Dashboard (Administrators)
- **User Management**: Create, edit, and deactivate user accounts. Upload custom profile photos.
- **Document Issuance**: Upload official documents (PDF/Images) and assign them to specific users.
- **Custom Logos**: Add custom identifying logos for specific document types.
- **Real-time Status**: View uploaded documents, expiration dates, and access types.

### Backend (API)
- **Cloud Storage Integration**: Direct upload and delivery via Cloudinary.
- **Secure MongoDB Architecture**: Full relational-style mapping between Users, Documents, and Admin access.
- **Self-Ping Mechanism**: Built-in keep-alive for platforms like Render free tier.

---

## 🛠️ Technology Stack

- **Mobile Frontend**: React Native, Expo, NativeWind (Tailwind CSS for React Native)
- **Web Admin Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Backend API**: Node.js, Express.js, Mongoose, Multer
- **Database**: MongoDB
- **Cloud Storage**: Cloudinary

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for the mobile app)
- A [Cloudinary](https://cloudinary.com/) Account (for storing documents & images)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd DigiLocker
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/digilocker
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Run the database seeder to create an initial Admin account:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Admin Dashboard Setup
1. Open a new terminal and navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the API URL in `admin/src/api.js` points to your backend (default is `http://localhost:5000/api`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Mobile App (Frontend) Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the API URL in `frontend/src/config.js` (or context files) points to your backend network IP (e.g., `http://192.168.1.X:5000/api`) so your physical device can connect to it.
4. Start the Expo development server:
   ```bash
   npx expo start -c
   ```
5. Use the **Expo Go** app on your iOS or Android device to scan the generated QR code and test the app natively!

---

## 🔒 Security Notes
- **Never expose your Cloudinary API keys.**
- Documents are served directly to the mobile app for native rendering; they are not intended to be downloaded.
- The `expo-screen-capture` module strictly prevents Android screenshots inside the `SecureViewerScreen`. 

## 📝 License
This project is for demonstration and portfolio purposes.
