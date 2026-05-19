═══════════════════════════════════════════════════════════════════════════
NICTM LOST & FOUND SYSTEM - COMPLETE PROJECT FILES
═══════════════════════════════════════════════════════════════════════════
GREEN COLOR SCHEME | FIREBASE BACKEND | READY TO DEPLOY

Students: Osobase Oseyi Kelly, Igene Marvellous, Chiwendu Agape
Supervisor: Mr Nanle Dawurung
═══════════════════════════════════════════════════════════════════════════

📦 WHAT'S INCLUDED:
══════════════════
✅ index.html - Landing page (GREEN design)
✅ login.html - Login page
✅ register.html - Registration page
✅ dashboard.html - User dashboard
✅ report-lost.html - Report lost item
✅ report-found.html - Report found item with photo
✅ search.html - Search & browse items
✅ js/firebase-config.js - Firebase setup (EDIT THIS!)
✅ js/auth.js - Authentication logic
✅ js/app.js - Main app functions


🚀 QUICK START (3 STEPS):
══════════════════════════

STEP 1: SETUP FIREBASE (15 minutes)
────────────────────────────────────
1. Go to: https://console.firebase.google.com
2. Click "Add Project" → Name: "nictm-lost-found"
3. Enable Authentication:
   - Left menu → Authentication → Get Started
   - Email/Password → Toggle ON → Save

4. Create Firestore:
   - Left menu → Firestore Database → Create Database
   - Test mode → Next → Location: eur3 (europe-west) → Enable

5. Enable Storage:
   - Left menu → Storage → Get Started
   - Test mode → Next → Same location → Done

6. Get Config:
   - Click ⚙️ (Settings) → Project Settings
   - Scroll down → Click </> (Web icon)
   - Copy the firebaseConfig object
   - Paste it in js/firebase-config.js (replace YOUR_API_KEY etc.)


STEP 2: TEST LOCALLY (5 minutes)
─────────────────────────────────
1. Install VS Code Live Server extension
2. Right-click index.html → "Open with Live Server"
3. Your browser will open http://localhost:5500
4. Test: Register → Login → Report Item → Search


STEP 3: DEPLOY TO FIREBASE (10 minutes)
────────────────────────────────────────
1. Install Firebase CLI:
   npm install -g firebase-tools

2. Login to Firebase:
   firebase login

3. Initialize project (in this folder):
   firebase init

   Select:
   - Hosting
   - Use existing project: nictm-lost-found
   - Public directory: . (dot)
   - Single-page app: No
   - Don't overwrite files

4. Deploy:
   firebase deploy

5. Your site will be live at:
   https://nictm-lost-found.web.app


🎨 COLOR SCHEME:
════════════════
Primary Green: #10B981 (Emerald)
Light Green: #D1FAE5 (Background)
Dark: #1F2937 (Text)
White: #FFFFFF (Cards)


📚 FIREBASE SECURITY RULES (Add After Testing):
═══════════════════════════════════════════════

In Firebase Console:

FIRESTORE RULES:
────────────────
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /items/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.reportedBy;
    }
    
    match /claims/{claimId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}

STORAGE RULES:
──────────────
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}


🆘 TROUBLESHOOTING:
═══════════════════
Problem: Firebase not loading
Solution: Check js/firebase-config.js has YOUR config

Problem: Can't register
Solution: Check Firebase Authentication is enabled

Problem: Can't upload photos
Solution: Check Firebase Storage is enabled

Problem: "Permission denied" errors
Solution: Check Firestore is in "test mode" or add Security Rules above


📞 SUPPORT:
═══════════
For help, contact:
- Osobase Oseyi Kelly
- Igene Marvellous  
- Chiwendu Agape

Supervisor: Mr Nanle Dawurung


✅ YOU'RE READY TO BUILD!
═════════════════════════
1. Edit js/firebase-config.js with your Firebase config
2. Open index.html in browser
3. Register and start using the system!

Good luck! 🚀
