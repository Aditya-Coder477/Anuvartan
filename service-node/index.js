const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');

// --- FIREBASE ADMIN SETUP ---
const admin = require("firebase-admin");

// Try to load serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
let db = null;
let dbActive = false;

if (fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = require(serviceAccountPath);
        // Check if already initialized to avoid error
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        db = admin.firestore();
        dbActive = true;
        console.log("🔥 Firebase Firestore Connected!");
    } catch (err) {
        console.error("❌ Firebase Init Error:", err.message);
    }
} else {
    console.warn("⚠️ serviceAccountKey.json NOT FOUND. Persistence disabled.");
}

require('dotenv').config({ path: path.join(__dirname, '.env') });
const Groq = require("groq-sdk");

const app = express();
const PORT = 5000;

console.log("Checking API Key:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");

// --- GROQ CONFIGURATION ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve uploaded images if saved locally (optional)

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SYSTEM_PROMPT = `
You are ANUVARTAN, a virtual triage nurse assistant for post-surgery recovery monitoring.
Ask brief, focused questions to assess infection risk (pain, fever, wound condition).
Keep messages short (1-2 sentences).
If emergency (chest pain, breathing issues, severe bleeding), say "EMERGENCY: Call 911".
`;

// --- API ENDPOINTS ---

// 1. GET ALL PATIENTS (Doctor Dashboard)
app.get('/api/doctor/patients', async (req, res) => {
    if (!dbActive) {
        // Fallback to empty or mock if DB down, but user requested persistence.
        return res.status(503).json({ error: "Database not active. Please add serviceAccountKey.json" });
    }

    try {
        const snapshot = await db.collection('patients').get();
        const patients = [];
        snapshot.forEach(doc => {
            patients.push(doc.data());
        });
        res.json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 2. PATIENT LOGIN / SYNC
app.post('/api/patient/login', async (req, res) => {
    const { userId, name, age, condition } = req.body;
    
    if (!dbActive) return res.status(503).json({ error: "DB inactive" });

    try {
        const docRef = db.collection('patients').doc(userId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            // Create new basic profile if not exists
            const newProfile = {
                userId,
                id: Date.now(),
                name: name || "Unknown",
                age: age || 30,
                condition: condition || "Post-Op",
                risk: 0,
                lastCheckup: new Date().toISOString().split('T')[0],
                today_aura: {
                    summary: { pain_score: 0, fever_celsius: 37.0, wound_status: "Pending Check-in", meds_taken: false, activity_level: "Unknown", mood: 3 },
                    transcript: [],
                    risk_analysis: { risk_score: 0, risk_band: "GREEN", top_factors: [], nurse_action_hint: "New patient." }
                },
                daily_checkins: []
            };
            await docRef.set(newProfile);
            return res.json(newProfile);
        }

        res.json(docSnap.data());
    } catch (error) {
        console.error("Login sync error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. CHAT MESSAGE & AI PROCESSING
app.post('/api/chat/message', upload.single('image'), async (req, res) => {
    const { userId, message } = req.body;
    const file = req.file;

    if (!dbActive) return res.status(503).json({ error: "DB inactive" });

    const docRef = db.collection('patients').doc(userId);
    
    // --- HANDLE IMAGE ---
    if (file) {
        try {
            console.log(`Processing image for ${userId}...`);
            const form = new FormData();
            form.append('file', file.buffer, { filename: file.originalname });
            
            // Call Python AI Service
            let aiResponse;
            try {
                aiResponse = await axios.post('http://localhost:8000/predict/wound', form, {
                    headers: { ...form.getHeaders() }
                });
            } catch (connErr) {
                console.error("Python Service Error:", connErr.message);
                return res.json({ response: "I'm having trouble analyzing the image right now (AI Service Offline). Please try text." });
            }
            
            const { risk_score, status, confidence } = aiResponse.data;
            
            // Construct System Message
            const aiMsg = {
                from: "AURA",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `[Image Analysis] Status: ${status} (Risk: ${risk_score}%).`
            };
            
            // Update DB (Photo + Transcript + Risk)
            // Note: We are mocking the photo URL since we aren't uploading to cloud storage in this MVP
            // in a real app, upload to Firebase Storage -> get URL -> save here.
            const newPhotoEntry = {
                date: new Date().toISOString().split('T')[0],
                day_post_op: 7, // derived/mock
                photo_url: "/placeholder_wound.jpg", 
                ai_infection_risk: risk_score,
                ai_severity: status,
                ai_findings: { redness_level_0_10: 5, swelling_level_0_10: 5 } // Mock findings from Vision details
            };

            await docRef.update({
                "today_aura.transcript": admin.firestore.FieldValue.arrayUnion(aiMsg),
                "today_aura.risk_analysis.risk_score": risk_score,
                "today_aura.risk_analysis.risk_band": risk_score > 70 ? "RED" : risk_score > 40 ? "YELLOW" : "GREEN",
                risk: risk_score,
                // Append using arrayUnion for photos if the field exists, else set it
                // "wound_photos": admin.firestore.FieldValue.arrayUnion(newPhotoEntry)
            });

            return res.json({ response: `I've analyzed the photo. It looks like ${status}. I've updated your chart.` });

        } catch (error) {
            console.error("Image processing failed:", error);
            return res.json({ response: "Error processing image." });
        }
    }

    // --- HANDLE TEXT ---
    try {
        const docSnap = await docRef.get();
        if (!docSnap.exists) return res.status(404).json({ error: "Patient not found" });
        
        const patientData = docSnap.data();
        // Get existing transcript from today_aura or fallback
        const transcript = patientData.today_aura?.transcript || [];
        
        // Context for Groq
        // Remap {from: 'PATIENT'|'AURA', text} -> {role: 'user'|'assistant', content}
        const groqHistory = [
            { role: "system", content: SYSTEM_PROMPT },
            ...transcript.map(t => ({
                role: t.from === "PATIENT" ? "user" : "assistant",
                content: t.text
            }))
        ];
        
        // Add current user msg
        groqHistory.push({ role: "user", content: message });
        
        // USER MSG OBJECT
        const userMsgObj = {
            from: "PATIENT",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: message
        };

        // Call Groq
        let botText = "I'm listening.";
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: groqHistory.slice(-10), // Limit context
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 150
            });
            botText = chatCompletion.choices[0]?.message?.content || "I didn't catch that.";
        } catch (gErr) {
            console.error("Groq API Error:", gErr.message);
            botText = "(AI Unavailable) Please contact your nurse directly.";
        }

        // BOT MSG OBJECT
        const botMsgObj = {
            from: "AURA",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: botText
        };

        // UPDATE FIRESTORE
        // We update `today_aura.transcript` to show in Nurse Dashboard
        await docRef.update({
            "today_aura.transcript": admin.firestore.FieldValue.arrayUnion(userMsgObj, botMsgObj)
        });

        res.json({ response: botText });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ response: "System error." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`📊 Mode: ${dbActive ? "PERSISTENT (Firestore)" : "IN-MEMORY (Fallback)"}`);
});