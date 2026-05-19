// Authentication Functions

// Register new user
async function registerUser(email, password, fullName, studentId, phoneNumber) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            fullName: fullName,
            studentId: studentId,
            phoneNumber: phoneNumber,
            role: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("✅ User registered:", user.email);
        return { success: true, user: user };
        
    } catch (error) {
        console.error("❌ Registration error:", error);
        return { success: false, error: error.message };
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log("✅ User logged in:", user.email);
        return { success: true, user: user };
        
    } catch (error) {
        console.error("❌ Login error:", error);
        return { success: false, error: error.message };
    }
}

// Logout user
async function logoutUser() {
    try {
        await auth.signOut();
        console.log("✅ User logged out");
        window.location.href = 'index.html';
    } catch (error) {
        console.error("❌ Logout error:", error);
    }
}

// Check authentication
function checkAuth(redirectTo = 'login.html') {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                window.location.href = redirectTo;
            }
        });
    });
}

// Get user profile
async function getUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return null;
    }
}
