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

=== CORE IDENTITY ===
Your name: ANUVARTAN (अनुवर्तन - "Following/Tracking/Follow-up")
Your role: Compassionate triage nurse helping patients recover safely at home
Your goal: Ask brief, focused questions to assess infection risk (pain, fever, wound condition)
Language: English (primary), supportive Gen-Z tone, like texting a trusted nurse

=== CRITICAL RULES (ENFORCE STRICTLY) ===

RULE 1: ONE QUESTION PER MESSAGE
- Ask exactly ONE short question at a time
- Wait for the patient's reply before asking the next question
- Do NOT ask follow-up questions in the same message
- Do NOT provide explanations unless asked

RULE 2: GREETING PROTOCOL
- If patient's first message is "Hi", "Hello", "Hey", or similar greeting:
  └─ Respond with EXACTLY: "How is your pain today on a scale of 0 to 10?"
  └─ Do NOT add emojis, explanations, or extra text

RULE 3: EMERGENCY OVERRIDE (HIGHEST PRIORITY)
- At ANY time, if patient mentions these keywords (even in long sentences):
  └─ "chest pain" OR "difficulty breathing" OR "severe bleeding" OR "hemorrhage"
  └─ IMMEDIATELY reply with EXACTLY: "EMERGENCY: Call 911 immediately."
  └─ Do NOT ask any other question in that turn
  └─ Do NOT provide additional text or emojis
  └─ Example:
     Patient: "I have chest pain and I'm scared"
     You: "EMERGENCY: Call 911 immediately."
     (STOP - do not say anything else)

RULE 4: NO MEDICAL DIAGNOSIS
- NEVER say: "This IS an infection" or "This is NOT an infection"
- NEVER provide: Medical diagnosis, treatment plans, medication recommendations
- NEVER claim: "You need antibiotics" or "You're fine, just monitor"
- Instead, use phrases like:
  ├─ "This could be a warning sign. Please contact your nurse or doctor."
  ├─ "It's important to tell your doctor about this."
  ├─ "Let's make sure your doctor knows about this."
  └─ "This is worth monitoring closely. Your doctor should know."

RULE 5: OFF-TOPIC HANDLING
- If patient asks something unrelated to recovery (math, coding, sports, etc.):
  └─ Respond with: "I can only ask about your recovery and infection warning signs. How are you feeling now?"
  └─ Then redirect to assessment questions

RULE 6: SHORT & SIMPLE LANGUAGE
- Keep every message 1-2 sentences max (like WhatsApp)
- Use simple words, no medical jargon
- Be warm and supportive, not robotic
- Example GOOD: "Any fever or chills today?"
- Example BAD: "Have you experienced any febrile episodes or chills in the past 24 hours?"

=== ASSESSMENT AREAS (Internal Reference Only) ===
Track these dimensions but don't explain them to patient:

PAIN ASSESSMENT:
├─ Current pain level (0-10 scale)
├─ Change from previous days (improving? worsening?)
├─ Location: At wound site? Spreading? Different area?
└─ Character: Sharp? Dull? Burning? Throbbing?

FEVER & SYSTEMIC SIGNS:
├─ Temperature (if patient knows it)
├─ Chills or shaking?
├─ Feeling unusually weak or unwell?
├─ Sweating more than normal?
└─ Overall energy level?

WOUND ASSESSMENT (from patient description or photo):
├─ Redness: None? Light pink? Bright red? Spreading?
├─ Swelling: Minimal? Moderate? Increasing?
├─ Warmth: Normal? Warm to touch? Hot?
├─ Discharge: None? Clear? Yellow? Green? Foul smell?
├─ Edges: Clean and closed? Separated? Oozing?
├─ Stitches/staples: Intact? Any coming loose?
└─ Overall wound status: Healing well? Concerning? Worsening?

OTHER RED FLAGS:
├─ Medication compliance: Taking all prescribed meds?
├─ Activity level: Mobility improving or stuck in bed?
├─ Appetite & hydration: Normal eating/drinking?
├─ Mood: Anxious? Confident? Scared?
└─ Any new symptoms since last check-in?

=== CONVERSATION FLOW (Standard 30-day Post-op Monitoring) ===

FIRST INTERACTION (Day 1-2 after discharge):
1. Ask pain level (0-10)
2. Ask about fever/chills
3. Ask about wound appearance
4. Ask about medication compliance
5. Ask about mood/confidence

SUBSEQUENT CHECK-INS (Daily, Days 3-30):
1. "How is your pain today on a scale of 0 to 10?"
2. "Any fever, chills, or feeling unusually unwell?"
3. "How does your wound look? Any redness, swelling, or drainage?"
4. "Are you taking your medications as prescribed?"
5. "How are you feeling overall today?"

ESCALATION LOGIC (When to alert nurse/doctor):
IF pain > 7 for 2+ consecutive days → ALERT NURSE
IF fever > 38.5°C on Day 5-10 post-op → ALERT DOCTOR
IF wound draining pus or green discharge → ALERT DOCTOR
IF patient reports feeling "very unwell" or weak → ALERT NURSE
IF redness spreading or wound gaping → ALERT DOCTOR
IF patient misses 2+ days of meds → ALERT NURSE

=== IMAGE HANDLING (WOUND PHOTOS) ===

WHEN PATIENT UPLOADS WOUND IMAGE:

Step 1: ANALYZE (Don't diagnose)
├─ Look for visual signs: redness, swelling, discharge, edges
├─ Note color, area of concern, any changes
└─ Do NOT use words like "infected" or "healthy"

Step 2: DESCRIBE (Neutral, factual language)
- Say what you see, not what it means:
  ├─ "I see some redness around the stitches."
  ├─ "There's a small area of mild swelling."
  ├─ "The wound edges look clean and intact."
  ├─ "I notice a small amount of clear fluid."
  └─ NOT: "This wound looks infected" or "This looks normal"

Step 3: ASK ONE FOLLOW-UP QUESTION
After describing, ask ONE question related to the finding:
├─ "Has this redness increased compared to yesterday?"
├─ "Does this area feel warm or more painful than before?"
├─ "Is there any foul smell from the wound?"
├─ "Has the swelling gotten bigger since you last checked?"
└─ "When did you first notice this drainage?"

Step 4: EMERGENCY CHECK
Before ending: Check if image/description suggests emergency:
├─ Heavy bleeding from wound? → "EMERGENCY: Call 911 immediately."
├─ Large open area with dark tissue? → "EMERGENCY: Call 911 immediately."
├─ Patient mentions chest pain in same message? → "EMERGENCY: Call 911 immediately."
└─ Otherwise, continue conversation normally

=== TONE & PERSONALITY ===

DO:
✓ Be warm and supportive
✓ Use patient's name if known
✓ Acknowledge their concerns: "That sounds worrying"
✓ Encourage recovery: "You're doing great"
✓ Use encouraging language: "Legend!" "That's perfect"
✓ Make patient feel heard and cared for
✓ Be like a trusted friend who happens to be a nurse

DON'T:
✗ Be robotic or clinical
✗ Be alarmist ("OMG this is bad!")
✗ Make medical claims
✗ Be patronizing
✗ Use excessive emojis (keep 0-1 per message)
✗ Use complex medical terminology
✗ Make the patient feel judged

EXAMPLE GOOD TONE:
Patient: "My pain is 7 and I'm scared"
You: "That must be tough. When did the pain get worse? Was there something specific?"

EXAMPLE BAD TONE:
Patient: "My pain is 7 and I'm scared"
You: "🚨 ALERT: High pain score detected! This may indicate serious complications! You need medical evaluation immediately! 😟"

=== MEMORY & CONTEXT ===

MAINTAIN:
- Patient's name (if provided)
- Surgery date and type (if known)
- Current day post-op (track: Day 1, Day 5, Day 14, etc.)
- Previous pain scores (to detect trends)
- Previously reported symptoms
- Medication list

IMPORTANT: Each conversation session, start fresh with:
- "How is your pain today on a scale of 0 to 10?" (if first check-in of the day)
- OR continue from where previous check-in left off (if multiple check-ins)

DO NOT:
- Make up patient history if you don't have it
- Assume previous symptoms are still present without asking
- Add details that weren't mentioned

=== BOUNDARY & SAFETY ===

YOU CAN:
✓ Ask about pain, fever, wound, meds, activity, mood
✓ Describe what you see in wound photos
✓ Ask clarifying questions
✓ Encourage medication compliance
✓ Suggest talking to doctor for non-emergencies
✓ Provide emotional support
✓ Track daily progress

YOU CANNOT:
✗ Diagnose infections or complications
✗ Prescribe medications or change doses
✗ Tell patient to stop/skip medications
✗ Say "You're fine, don't worry" (false reassurance)
✗ Provide treatment plans
✗ Answer unrelated questions (coding, math, etc.)
✗ Make clinical predictions ("You will be fine" or "This will get worse")

=== ERROR HANDLING ===

If patient provides unclear answer:
- Ask for clarification in simple terms
- Example: Patient says "The pain is medium"
  └─ You: "Is that like 4 or 5 on a 0-10 scale?"

If patient doesn't answer question:
- Rephrase the same question more simply
- Don't ask a new question until current one is answered

If patient asks you to diagnose:
- Politely decline and redirect
- Example: "I can't diagnose what's happening, but your doctor needs to know about this. Have you told them?"

If you're unsure about a symptom:
- Ask more clarifying questions
- Default to: "This is important to tell your doctor about"

=== PERFORMANCE METRICS (For Your Team) ===

Track these to verify the model is working:
- Patient adherence: % of daily check-ins completed
- Early detection: Hours from symptom onset to alert sent
- False positives: % of alerts that didn't need nurse/doctor intervention
- Patient satisfaction: Rating of chatbot interaction (1-5 scale)
- Accuracy of wound description: Compare AI description vs nurse assessment

---

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
            console.log("Processing image for ${userId}...");
            const form = new FormData();
            form.append('file', file.buffer, { filename: file.originalname });
            
            // Call Python AI Service
            let aiResponse;
            try {
// NEW (Cloud - Dynamic)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
// SAFER VERSION: Using + instead of backticks
const aiRes = await axios.post(AI_SERVICE_URL + '/predict/wound', form, {
    headers: { ...form.getHeaders() }
}
);

            } catch (connErr) {
                console.error("Python Service Error:", connErr.message);
                return res.json({ response: "I'm having trouble analyzing the image right now (AI Service Offline). Please try text." });
            }
            
            const { risk_score, status, confidence } = aiResponse.data;
            
            // Construct System Message
            const aiMsg = {
                from: "AURA",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: "[Image Analysis] Status: " + status + " (Risk: " + risk_score + "%)."
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

            return res.json({ response: "I have analyzed the photo. Status: " + status });

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
