// Main Application Logic

// Report Lost Item
async function reportLostItem(itemData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        
        const docRef = await db.collection('items').add({
            reportType: 'lost',
            category: itemData.category,
            title: itemData.title,
            description: itemData.description,
            location: itemData.location,
            dateReported: itemData.dateReported,
            photoUrl: itemData.photoUrl || null,
            status: 'active',
            reportedBy: user.uid,
            reportedByEmail: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("✅ Lost item reported:", docRef.id);
        return { success: true, itemId: docRef.id };
        
    } catch (error) {
        console.error("❌ Error reporting lost item:", error);
        return { success: false, error: error.message };
    }
}

// Report Found Item with Photo
async function reportFoundItem(itemData, photoFile) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        
        let photoUrl = null;
        
        if (!storage) {
            throw new Error("Firebase Storage not available. Check firebase-config.js and ensure firebase-storage-compat.js is loaded.");
        }
        if (photoFile) {
            const storageRef = storage.ref();
            const photoRef = storageRef.child(`photos/${Date.now()}_${photoFile.name}`);
            const snapshot = await photoRef.put(photoFile);
            photoUrl = await snapshot.ref.getDownloadURL();
            console.log("✅ Photo uploaded:", photoUrl);
        }
        
        const docRef = await db.collection('items').add({
            reportType: 'found',
            category: itemData.category,
            title: itemData.title,
            description: itemData.description,
            location: itemData.location,
            dateReported: itemData.dateReported,
            photoUrl: photoUrl,
            status: 'active',
            reportedBy: user.uid,
            reportedByEmail: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("✅ Found item reported:", docRef.id);
        return { success: true, itemId: docRef.id };
        
    } catch (error) {
        console.error("❌ Error reporting found item:", error);
        return { success: false, error: error.message };
    }
}

// Search Items
async function searchItems(filters = {}) {
    try {
        let query = db.collection('items').where('status', '==', 'active');
        
        if (filters.reportType) {
            query = query.where('reportType', '==', filters.reportType);
        }
        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        
        query = query.orderBy('createdAt', 'desc');
        
        const snapshot = await query.get();
        const items = [];
        
        snapshot.forEach(doc => {
            items.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Found ${items.length} items`);
        return items;
        
    } catch (error) {
        console.error("❌ Error searching items:", error);
        return [];
    }
}

// Get item by ID
async function getItemById(itemId) {
    try {
        const doc = await db.collection('items').doc(itemId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching item:", error);
        return null;
    }
}

// Get user's items
async function getUserItems(uid) {
    try {
        const snapshot = await db.collection('items')
            .where('reportedBy', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        
        return items;
    } catch (error) {
        console.error("❌ Error fetching user items:", error);
        return [];
    }
}

// Get user claims
async function getUserClaims(uid) {
    try {
        const snapshot = await db.collection('claims')
            .where('claimantId', '==', uid)
            .get();

        const claims = [];
        snapshot.forEach(doc => {
            claims.push({ id: doc.id, ...doc.data() });
        });

        return claims;
    } catch (error) {
        console.error("❌ Error fetching user claims:", error);
        return [];
    }
}

// Submit Claim
async function submitClaim(itemId, claimData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        
        const docRef = await db.collection('claims').add({
            itemId: itemId,
            claimantId: user.uid,
            claimantEmail: user.email,
            verificationDetails: claimData.verificationDetails,
            status: 'pending',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("✅ Claim submitted:", docRef.id);
        return { success: true, claimId: docRef.id };
        
    } catch (error) {
        console.error("❌ Error submitting claim:", error);
        return { success: false, error: error.message };
    }
}

// Format date
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB');
}

// Time ago
function timeAgo(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hrs ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    return formatDate(timestamp);
}

// Get user role
async function getUserRole(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (!doc.exists) return 'user';
        return doc.data().role || 'user';
    } catch (error) {
        console.error('❌ Error fetching user role:', error);
        return 'user';
    }
}

// Get all items for admin
async function getAdminItems() {
    try {
        const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (error) {
        console.error('❌ Error fetching admin items:', error);
        return [];
    }
}

// Update item fields
async function updateItem(itemId, updates) {
    try {
        await db.collection('items').doc(itemId).update(updates);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating item:', error);
        return { success: false, error: error.message };
    }
}

// Delete item record
async function deleteItem(itemId) {
    try {
        await db.collection('items').doc(itemId).delete();
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting item:', error);
        return { success: false, error: error.message };
    }
}

// Load admin items into dashboard
async function loadAdminItems() {
    const adminItems = await getAdminItems();
    const container = document.getElementById('admin-items');
    if (!container) return;

    if (adminItems.length === 0) {
        container.innerHTML = '<p style="color:var(--gray);">No reported items found yet.</p>';
        return;
    }

    container.innerHTML = adminItems.map(item => {
        return `<div style="background:var(--light);padding:18px;border-radius:18px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
            <div style="max-width:65%;">
                <div style="font-weight:700;color:var(--dark);font-size:16px;margin-bottom:6px;">${item.title || 'Untitled item'} <span style="font-size:12px;color:var(--gray);">(${item.reportType || 'lost'})</span></div>
                <div style="color:var(--gray);font-size:14px;margin-bottom:6px;">${item.description || 'No description provided.'}</div>
                <div style="color:var(--gray);font-size:13px;">Reported by: ${item.reportedByEmail || 'Unknown'}</div>
                <div style="color:var(--gray);font-size:13px;">Location: ${item.location || 'Unknown'}</div>
                <div style="color:var(--gray);font-size:13px;">Status: ${item.status || 'active'} — ${timeAgo(item.createdAt)}</div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                <button onclick="markResolved('${item.id}')" style="border:0;background:#10B981;color:white;padding:10px 14px;border-radius:12px;cursor:pointer;">Mark Resolved</button>
                <button onclick="deleteAdminItem('${item.id}')" style="border:0;background:#EF4444;color:white;padding:10px 14px;border-radius:12px;cursor:pointer;">Delete</button>
            </div>
        </div>`;
    }).join('');
}

window.markResolved = async function(itemId) {
    const result = await updateItem(itemId, { status: 'resolved' });
    if (result.success) loadAdminItems();
    else alert('Unable to mark resolved: ' + result.error);
};

window.deleteAdminItem = async function(itemId) {
    if (!confirm('Delete this reported item permanently?')) return;
    const result = await deleteItem(itemId);
    if (result.success) loadAdminItems();
    else alert('Unable to delete item: ' + result.error);
};
