const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let db;
let auth;

try {
    // Check if serviceAccountKey.json exists
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
    
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        
        console.log("Firebase Admin Initialized with serviceAccountKey.json");
    } else {
        // Warning
        console.warn("WARNING: serviceAccountKey.json NOT FOUND in service-node directory.");
        console.warn("Backend operations requiring Database/Auth will fail.");
    }

    // Even if init failed, we export the symbols, they might throw later if used.
    // If init failed, default app might not be set.
    if (admin.apps.length > 0) {
        db = admin.firestore();
        auth = admin.auth();
    }

} catch (error) {
    console.error("Error initializing Firebase Admin:", error.message);
}

module.exports = { admin, db, auth };
