const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
if (!fs.existsSync(serviceAccountPath)) {
    console.error("ERROR: serviceAccountKey.json not found.");
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// ID retrieved from previous logs for "adityarajsf315.00"
// "userId":"0Xn8RaKLMudrrXMJbP510rSze5A3"
const TARGET_ID = "0Xn8RaKLMudrrXMJbP510rSze5A3";

async function deletePatient() {
    console.log(`Deleting patient ${TARGET_ID}...`);
    try {
        await db.collection('patients').doc(TARGET_ID).delete();
        console.log("Deletion successful. ✅");
    } catch (error) {
        console.error("Error deleting patient:", error);
    }
}

deletePatient();
