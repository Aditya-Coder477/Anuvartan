const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin (Reuse existing logic or simplified)
// We assume serviceAccountKey.json is present (verified in previous steps)
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
if (!fs.existsSync(serviceAccountPath)) {
    console.error("ERROR: serviceAccountKey.json not found. Cannot seed data.");
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Initialize if not already (though this is a standalone script)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const patients = [
    {
        userId: "P-2026-001",
        name: "Arun Singh",
        age: 54,
        condition: "Post-Surgery (Appendectomy)",
        risk: 68,
        lastCheckup: "2026-01-02",
        // Merging Doctor View
        profile: {
            sex: "Male",
            surgery_type: "Laparoscopic appendectomy",
            surgery_date: "2025-12-26",
            discharge_date: "2025-12-28",
            day_post_op: 7,
            primary_doctor: "Dr. Neha Sharma",
            comorbidities: ["Hypertension", "Type 2 Diabetes"]
        },
        overall_status: {
            current_risk_score: 68,
            current_band: "YELLOW",
            ai_flag: "Monitor closely – mild fever with wound changes on POD 7.",
            trend_summary: "Pain stable 5-6; temp gradually rising (37.2→37.9); wound redness mildly increased; 100% med compliance."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-27", pain: 7, fever_celsius: 37.2, risk_score: 52, risk_band: "YELLOW", wound_status: "clean", meds_taken: true, activity: "bed_rest", mood: 3},
            {day_post_op: 2, date: "2025-12-28", pain: 6, fever_celsius: 37.0, risk_score: 48, risk_band: "GREEN", wound_status: "clean", meds_taken: true, activity: "short_walk", mood: 3},
            {day_post_op: 3, date: "2025-12-29", pain: 6, fever_celsius: 37.1, risk_score: 45, risk_band: "GREEN", wound_status: "clean", meds_taken: true, activity: "short_walk", mood: 4},
            {day_post_op: 4, date: "2025-12-30", pain: 5, fever_celsius: 37.0, risk_score: 43, risk_band: "GREEN", wound_status: "clean", meds_taken: true, activity: "moderate_walk", mood: 4},
            {day_post_op: 5, date: "2025-12-31", pain: 5, fever_celsius: 37.5, risk_score: 55, risk_band: "YELLOW", wound_status: "mild redness", meds_taken: true, activity: "normal", mood: 3},
            {day_post_op: 6, date: "2026-01-01", pain: 6, fever_celsius: 37.8, risk_score: 64, risk_band: "YELLOW", wound_status: "mild redness", meds_taken: true, activity: "reduced", mood: 2},
            {day_post_op: 7, date: "2026-01-02", pain: 5, fever_celsius: 37.9, risk_score: 68, risk_band: "YELLOW", wound_status: "redness + swelling", meds_taken: true, activity: "rest", mood: 3}
        ],
        // Merging Nurse View
        today_aura: {
            summary: {
                pain_score: 5,
                fever_celsius: 37.9,
                wound_status: "mild redness, slight swelling, no visible pus",
                meds_taken: true,
                activity_level: "walking inside home",
                mood: 3
            },
            transcript: [
                {from: "AURA", time: "08:10", text: "Good morning Arun! How is your pain today on a scale of 0 to 10?"},
                {from: "PATIENT", time: "08:10", text: "Around 5. Better than yesterday but still uncomfortable when I stand up."},
                {from: "AURA", time: "08:11", text: "Any fever, chills, or feeling unusually unwell today?"},
                {from: "PATIENT", time: "08:11", text: "No chills. I felt a bit warm at night, last thermometer reading was 37.9."},
                {from: "AURA", time: "08:11", text: "How does your wound look? Any redness, swelling, or drainage?"},
                {from: "PATIENT", time: "08:12", text: "A little red around the stitches and slightly puffy, but no pus or bad smell."},
                {from: "AURA", time: "08:12", text: "Are you taking your prescribed medicines on time?"},
                {from: "PATIENT", time: "08:12", text: "Yes, all doses on schedule."}
            ],
            risk_analysis: {
                risk_score: 68,
                risk_band: "YELLOW",
                top_factors: [
                    {feature: "Fever 37.9°C", impact: "+18%"},
                    {feature: "Pain 5/10 on POD 7", impact: "+15%"},
                    {feature: "Mild wound redness + swelling", impact: "+12%"},
                    {feature: "Good medication adherence", impact: "-10%"}
                ],
                nurse_action_hint: "Monitor today. Consider home visit if pain or redness increases by tomorrow."
            }
        },
        ai_insights: {
            risk_curve: [52, 48, 45, 43, 55, 64, 68],
            model_breakdown: [
                {feature: "Fever trend (37.0 → 37.9)", contribution: "+22%"},
                {feature: "Wound redness mild increase", contribution: "+15%"},
                {feature: "Pain plateau", contribution: "+12%"},
                {feature: "Good medication adherence", contribution: "-12%"}
            ],
            doctor_summary: "Mild upward trend in temperature and local wound changes on POD 6–7. No red-flag signs yet. Recommend close follow-up; consider tele-consult if symptoms worsen."
        },
        aura_recent_chats: [
            {
                date: "2026-01-02",
                messages: [
                    {from: "AURA", time: "08:10", text: "Good morning Arun! How is your pain today on a scale of 0 to 10?"},
                    {from: "PATIENT", time: "08:10", text: "Around 5."},
                    {from: "AURA", time: "08:11", text: "Any fever or chills?"},
                    {from: "PATIENT", time: "08:11", text: "Thermometer showed 37.9 last night."}
                ]
            }
        ]
    },
    {
        userId: "P-2026-002",
        name: "Priya Sharma",
        age: 42,
        condition: "Post-Surgery (Cholecystectomy)",
        risk: 32,
        lastCheckup: "2026-01-02",
        profile: {
            sex: "Female",
            surgery_type: "Laparoscopic cholecystectomy",
            surgery_date: "2025-12-28",
            discharge_date: "2025-12-29",
            day_post_op: 5,
            primary_doctor: "Dr. Rajesh Kumar"
        },
        overall_status: {
            current_risk_score: 32,
            current_band: "GREEN",
            ai_flag: "Excellent recovery trajectory. Continue current monitoring.",
            trend_summary: "Pain steadily declining, consistently afebrile, normal wound healing."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-29", pain: 6, fever_celsius: 37.0, risk_score: 42, risk_band: "YELLOW"},
            {day_post_op: 2, date: "2025-12-30", pain: 4, fever_celsius: 36.9, risk_score: 35, risk_band: "GREEN"},
            {day_post_op: 3, date: "2025-12-31", pain: 3, fever_celsius: 36.8, risk_score: 28, risk_band: "GREEN"},
            {day_post_op: 4, date: "2026-01-01", pain: 2, fever_celsius: 36.7, risk_score: 25, risk_band: "GREEN"},
            {day_post_op: 5, date: "2026-01-02", pain: 2, fever_celsius: 36.8, risk_score: 32, risk_band: "GREEN"}
        ],
        today_aura: {
            summary: {
                pain_score: 2,
                fever_celsius: 36.8,
                wound_status: "clean, no redness, edges closed",
                meds_taken: true,
                activity_level: "normal walking, cooking light meals",
                mood: 5
            },
            transcript: [
                {from: "AURA", time: "09:43", text: "Good morning Priya! How is your pain today on a scale of 0 to 10?"},
                {from: "PATIENT", time: "09:43", text: "Just 2. Almost gone now."},
                {from: "AURA", time: "09:44", "text": "Any fever, chills, or feeling unwell?"},
                {from: "PATIENT", time: "09:44", "text": "No fever, feeling normal. Thermometer showed 36.8."},
                {from: "AURA", time: "09:44", "text": "How does your wound look?"},
                {from: "PATIENT", time: "09:45", "text": "Looks great! No redness, scars are closing nicely."}
            ],
            risk_analysis: {
                risk_score: 32,
                risk_band: "GREEN",
                top_factors: [
                    {feature: "Pain 2/10 POD 5", impact: "+5%"},
                    {feature: "Afebrile 36.8°C", impact: "-15%"},
                    {feature: "Normal wound healing", impact: "-20%"},
                    {feature: "Full medication compliance", impact: "-12%"}
                ],
                nurse_action_hint: "Excellent recovery. Continue routine monitoring."
            }
        },
        ai_insights: {
            risk_curve: [42, 35, 28, 25, 32],
            model_breakdown: [
                {feature: "Steady pain decline", contribution: "-25%"},
                {feature: "Consistently afebrile", contribution: "-30%"},
                {feature: "Normal wound healing", contribution: "-25%"}
            ],
            doctor_summary: "Textbook uncomplicated recovery. No intervention needed. Ready for discharge from close monitoring in 2–3 days."
        },
        aura_recent_chats: [
            {
                date: "2026-01-02",
                messages: [
                    {from: "AURA", time: "09:43", text: "Good morning! How is your pain on a scale of 0 to 10?"},
                    {from: "PATIENT", time: "09:43", text: "Just 2."},
                    {from: "AURA", time: "09:44", text: "Great! Any fever or chills?"},
                    {from: "PATIENT", time: "09:44", text: "No, feeling normal."}
                ]
            }
        ]
    },
    {
        userId: "P-2026-003",
        name: "Rajesh Patel",
        age: 62,
        condition: "Post-Surgery (Hernia Repair)",
        risk: 82,
        lastCheckup: "2026-01-02",
        profile: {
            sex: "Male",
            surgery_type: "Open inguinal hernia repair",
            surgery_date: "2025-12-25",
            discharge_date: "2025-12-27",
            day_post_op: 8,
            primary_doctor: "Dr. Amit Desai"
        },
        overall_status: {
            current_risk_score: 82,
            current_band: "RED",
            ai_flag: "URGENT: Classic SSI pattern. High fever + wound discharge + missed medications. Recommend immediate evaluation.",
            trend_summary: "Rapid deterioration POD 6 onward. Textbook surgical site infection presentation."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-27", pain: 5, fever_celsius: 37.1, risk_score: 45, risk_band: "GREEN"},
            {day_post_op: 2, date: "2025-12-28", pain: 4, fever_celsius: 37.0, risk_score: 40, risk_band: "GREEN"},
            {day_post_op: 4, date: "2025-12-30", pain: 4, fever_celsius: 37.2, risk_score: 42, risk_band: "GREEN"},
            {day_post_op: 6, date: "2026-01-01", pain: 6, fever_celsius: 38.0, risk_score: 72, "risk_band": "YELLOW"},
            {day_post_op: 7, date: "2026-01-02-early", pain: 7, fever_celsius: 38.4, risk_score: 78, "risk_band": "RED"},
            {day_post_op: 8, date: "2026-01-02", pain: 8, fever_celsius: 38.7, risk_score: 82, "risk_band": "RED"}
        ],
        today_aura: {
            summary: {
                pain_score: 8,
                fever_celsius: 38.7,
                wound_status: "red, swollen, yellow discharge, foul smell",
                meds_taken: false,
                activity_level: "bedbound, very uncomfortable",
                mood: 1
            },
            transcript: [
                {from: "AURA", time: "10:15", "text": "Good morning Rajesh. How is your pain today on a scale of 0 to 10?"},
                {from: "PATIENT", time: "10:15", "text": "It's 8. I can barely stand. The wound is draining something yellow."},
                {from: "AURA", time: "10:16", "text": "Are you having any fever or chills?"},
                {from: "PATIENT", time: "10:16", "text": "Yes, very hot. Thermometer says 38.7. I feel terrible."},
                {from: "AURA", time: "10:17", "text": "This is important. Have you contacted your doctor about these symptoms?"},
                {from: "PATIENT", time: "10:18", "text": "Not yet, I was hoping it would get better but it's getting worse."}
            ],
            risk_analysis: {
                risk_score: 82,
                risk_band: "RED",
                top_factors: [
                    {feature: "High fever 38.7°C", impact: "+35%"},
                    {feature: "Severe pain 8/10", impact: "+25%"},
                    {feature: "Purulent discharge + foul smell", impact: "+30%"},
                    {feature: "Missed medications", impact: "+18%"},
                    {feature: "Bedbound", impact: "+12%"}
                ],
                nurse_action_hint: "URGENT: Contact doctor immediately. Suspected surgical site infection. Home visit or hospital evaluation needed TODAY."
            }
        },
        ai_insights: {
            risk_curve: [45, 40, 42, 72, 78, 82],
            model_breakdown: [
                {feature: "High fever 38.7°C on POD 8", contribution: "+35%"},
                {feature: "Severe pain 8/10", contribution: "+25%"},
                {feature: "Purulent wound discharge", contribution: "+30%"},
                {feature: "Medication non-compliance", contribution: "+18%"}
            ],
            doctor_summary: "URGENT CASE: Classic SSI presentation with fever spike, severe pain, and purulent drainage. Recommend same-day evaluation. Order: blood culture, wound culture, imaging (ultrasound or CT). Consider IV antibiotics and possible OR intervention if abscess confirmed."
        },
        aura_recent_chats: [
            {
                date: "2026-01-02",
                messages: [
                    {from: "AURA", time: "10:15", text: "How is your pain today?"},
                    {from: "PATIENT", time: "10:15", text: "8 out of 10. Wound is draining yellow stuff."},
                    {from: "AURA", time: "10:16", text: "Any fever?"},
                    {from: "PATIENT", time: "10:16", text: "38.7. I feel very sick."}
                ]
            }
        ]
    },
    {
        userId: "P-2026-004",
        name: "Sunita Devi",
        age: 35,
        condition: "Post-Surgery (C-Section)",
        risk: 28,
        lastCheckup: "2026-01-02",
        profile: {
            sex: "Female",
            surgery_type: "Caesarean section",
            surgery_date: "2025-12-23",
            discharge_date: "2025-12-25",
            day_post_op: 10,
            primary_doctor: "Dr. Meera Nair"
        },
        overall_status: {
            current_risk_score: 28,
            current_band: "GREEN",
            ai_flag: "Perfect recovery. Patient ready for routine postpartum care.",
            trend_summary: "Rapid pain resolution, no fever, excellent wound healing throughout."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-25", pain: 5, fever_celsius: 37.2, risk_score: 38, risk_band: "GREEN"},
            {day_post_op: 3, date: "2025-12-27", pain: 3, fever_celsius: 36.8, risk_score: 22, risk_band: "GREEN"},
            {day_post_op: 5, date: "2025-12-29", pain: 2, fever_celsius: 36.7, risk_score: 15, risk_band: "GREEN"},
            {day_post_op: 7, date: "2025-12-31", pain: 1, fever_celsius: 36.6, risk_score: 12, risk_band: "GREEN"},
            {day_post_op: 10, date: "2026-01-02", pain: 1, fever_celsius: 36.6, risk_score: 28, risk_band: "GREEN"}
        ],
        today_aura: {
            summary: {
                pain_score: 1,
                fever_celsius: 36.6,
                wound_status: "fully healed, scar forming, no redness",
                meds_taken: true,
                activity_level: "normal with newborn care, light household",
                mood: 5
            },
            transcript: [
                {from: "AURA", time: "11:28", text: "Good morning Sunita! How is your pain today on a scale of 0 to 10?"},
                {from: "PATIENT", time: "11:28", text: "Just 1. Feels almost normal now!"},
                {from: "AURA", time: "11:29", text: "Wonderful! Any fever or chills?"},
                {from: "PATIENT", time: "11:29", text: "No, thermometer is 36.6. I'm doing great."},
                {from: "AURA", time: "11:30", text: "How is your incision? Any redness or drainage?"},
                {from: "PATIENT", time: "11:30", text: "All healed. Just a scar forming. Very happy!"}
            ],
            risk_analysis: {
                risk_score: 28,
                risk_band: "GREEN",
                top_factors: [
                    {feature: "Minimal pain 1/10 POD 10", impact: "-8%"},
                    {feature: "Normal temperature 36.6°C", impact: "-18%"},
                    {feature: "Fully healed incision", impact: "-25%"},
                    {feature: "Perfect medication compliance", impact: "-15%"}
                ],
                nurse_action_hint: "Excellent recovery. Patient ready for routine care. Can discharge from close monitoring."
            }
        },
        ai_insights: {
            risk_curve: [38, 22, 15, 12, 28],
            model_breakdown: [
                {feature: "Rapid pain decline", contribution: "-30%"},
                {feature: "Afebrile throughout", contribution: "-35%"},
                {feature: "Normal wound progression", contribution: "-30%"}
            ],
            doctor_summary: "Uncomplicated postoperative course. Patient progressing excellently. Can be discharged from close monitoring with routine postpartum and infant care instructions."
        }
    },
    {
        userId: "P-2026-005",
        name: "Vikram Reddy",
        age: 48,
        condition: "Post-Surgery (Hernia Repair)",
        risk: 75,
        lastCheckup: "2026-01-02",
        profile: {
            sex: "Male",
            surgery_type: "Laparoscopic hernia repair",
            surgery_date: "2025-12-29",
            discharge_date: "2025-12-30",
            day_post_op: 4,
            primary_doctor: "Dr. Sanjay Verma"
        },
        overall_status: {
            current_risk_score: 75,
            current_band: "RED",
            ai_flag: "High-risk case: Severe pain with medication non-compliance. Urgent nurse intervention needed.",
            trend_summary: "High pain from POD 1; worsening on POD 3-4 due to missed medications; temperature rising."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-30", pain: 7, fever_celsius: 37.1, risk_score: 55, risk_band: "YELLOW"},
            {day_post_op: 2, date: "2025-12-31", pain: 6, fever_celsius: 37.2, risk_score: 50, risk_band: "YELLOW"},
            {day_post_op: 3, date: "2026-01-01", pain: 8, fever_celsius: 37.5, risk_score: 68, risk_band: "YELLOW"},
            {day_post_op: 4, date: "2026-01-02", pain: 9, fever_celsius: 37.8, risk_score: 75, risk_band: "RED"}
        ],
        today_aura: {
            summary: {
                pain_score: 9,
                fever_celsius: 37.8,
                wound_status: "swollen, very tender, minimal visible redness",
                meds_taken: false,
                activity_level: "bedbound, uncomfortable",
                mood: 2
            },
            transcript: [
                {from: "AURA", time: "12:10", text: "Good afternoon Vikram. How is your pain today?"},
                {from: "PATIENT", time: "12:10", text: "9 out of 10! I can't move. This is terrible."},
                {from: "AURA", time: "12:11", text: "Any fever today?"},
                {from: "PATIENT", time: "12:11", text: "Yes, felt hot. Thermometer showed 37.8."},
                {from: "AURA", time: "12:12", text: "Are you taking your pain medications and antibiotics as prescribed?"},
                {from: "PATIENT", time: "12:12", text: "No, I forgot. I thought the pain would pass on its own."},
                {from: "AURA", time: "12:13", text: "It's really important to take your medications. Please start them now and contact your nurse or doctor immediately."},
                {from: "PATIENT", time: "12:14", text: "Okay, I will. Sorry."}
            ],
            risk_analysis: {
                risk_score: 75,
                risk_band: "RED",
                top_factors: [
                    {feature: "Severe pain 9/10 POD 4", impact: "+30%"},
                    {feature: "Elevated fever 37.8°C", impact: "+20%"},
                    {feature: "Significant swelling", impact: "+18%"},
                    {feature: "MISSED MEDICATIONS x2 days", impact: "+35%"},
                    {feature: "Bedbound status", impact: "+15%"}
                ],
                nurse_action_hint: "RED FLAG: Medication non-compliance + severe pain + fever. Urgent nurse visit or phone call today. May need escalation."
            }
        },
        ai_insights: {
            risk_curve: [55, 50, 68, 75],
            model_breakdown: [
                {feature: "Severe pain 9/10 POD 4", contribution: "+30%"},
                {feature: "Medication non-compliance", contribution: "+35%"},
                {feature: "Rising fever", contribution: "+20%"},
                {feature: "High pain trajectory worsening", contribution: "+25%"}
            ],
            doctor_summary: "High-risk case driven primarily by medication non-compliance and inadequate pain control. URGENT: Phone call to patient to reinforce medication importance, arrange nurse home visit today or tomorrow, consider stronger pain management plan. Risk of complications increasing if compliance not improved."
        },
        aura_recent_chats: [
            {
                date: "2026-01-02",
                messages: [
                    {from: "AURA", time: "12:10", text: "How is your pain?"},
                    {from: "PATIENT", time: "12:10", text: "9 out of 10. Can't move."},
                    {from: "AURA", time: "12:12", text: "Are you taking your medications?"},
                    {from: "PATIENT", time: "12:12", text: "No, I forgot them."}
                ]
            }
        ]
    },
    {
        userId: "P-2026-006",
        name: "Meera Joshi",
        age: 55,
        condition: "Post-Surgery (Hysterectomy)",
        risk: 72,
        lastCheckup: "2026-01-02",
        profile: {
            sex: "Female",
            surgery_type: "Hysterectomy",
            surgery_date: "2025-12-27",
            discharge_date: "2025-12-29",
            day_post_op: 6,
            primary_doctor: "Dr. Priya Singh"
        },
        overall_status: {
            current_risk_score: 72,
            current_band: "YELLOW",
            ai_flag: "Watch closely: Minor wound dehiscence with serous drainage on POD 6. Likely superficial; monitor for infection.",
            trend_summary: "Stable pain POD 1-4; wound edges began separating POD 5; low-grade fever persistent; drainage remains clear."
        },
        daily_checkins: [
            {day_post_op: 1, date: "2025-12-29", pain: 6, fever_celsius: 37.2, risk_score: 48, risk_band: "GREEN"},
            {day_post_op: 2, date: "2025-12-30", pain: 5, fever_celsius: 37.3, risk_score: 45, risk_band: "GREEN"},
            {day_post_op: 3, date: "2025-12-31", pain: 4, fever_celsius: 37.4, risk_score: 42, risk_band: "GREEN"},
            {day_post_op: 4, date: "2026-01-01", pain: 4, fever_celsius: 37.2, risk_score: 40, risk_band: "GREEN"},
            {day_post_op: 5, date: "2026-01-02-early", pain: 4, fever_celsius: 37.5, risk_score: 65, "risk_band": "YELLOW"},
            {day_post_op: 6, date: "2026-01-02", pain: 4, fever_celsius: 37.6, risk_score: 72, "risk_band": "YELLOW"}
        ],
        today_aura: {
            summary: {
                pain_score: 4,
                fever_celsius: 37.6,
                wound_status: "edges separating slightly, clear drainage, mild redness halo",
                meds_taken: true,
                activity_level: "limited walking with support",
                mood: 3
            },
            transcript: [
                {from: "AURA", time: "13:38", text: "Good afternoon Meera! How is your pain today on a scale of 0 to 10?"},
                {from: "PATIENT", time: "13:38", text: "Around 4. Manageable with medicine."},
                {from: "AURA", time: "13:39", "text": "Any fever, chills, or feeling unusual?"},
                {from: "PATIENT", time: "13:39", "text": "Slight warm feeling. Thermometer says 37.6."},
                {from: "AURA", time: "13:39", "text": "How does your wound look today? Any changes?"},
                {from: "PATIENT", time: "13:40", "text": "The edges look a bit separated with clear fluid coming out. Little red around it."}
            ],
            risk_analysis: {
                risk_score: 72,
                risk_band: "YELLOW",
                top_factors: [
                    {feature: "Wound edge dehiscence", impact: "+22%"},
                    {feature: "Clear serous drainage", impact: "+15%"},
                    {feature: "Low-grade fever 37.6°C", impact: "+18%"},
                    {feature: "Mild redness halo", impact: "+12%"},
                    {feature: "Good medication compliance", impact: "-10%"}
                ],
                nurse_action_hint: "Schedule home visit today/tomorrow. Assess wound edges, may need reinforcement or dressing change. Monitor for infection signs."
            }
        },
        ai_insights: {
            risk_curve: [48, 45, 42, 40, 65, 72],
            model_breakdown: [
                {feature: "Minor wound dehiscence POD 5-6", contribution: "+22%"},
                {feature: "Serous drainage (low infection risk)", contribution: "+15%"},
                {feature: "Persistent low-grade fever", contribution: "+18%"},
                {feature: "Mild erythema halo", contribution: "+12%"}
            ],
            doctor_summary: "Minor superficial wound dehiscence with clear serous drainage. Likely self-limiting if managed properly. Recommend: nurse home visit for wound assessment and possible reinforcement; maintain current antibiotic cover; recheck in 2 days. If discharge becomes purulent or fever rises >38.5, escalate to evaluation."
        },
        aura_recent_chats: [
            {
                date: "2026-01-02",
                messages: [
                    {from: "AURA", time: "13:38", text: "How is your pain today?"},
                    {from: "PATIENT", time: "13:38", "text": "Around 4."},
                    {from: "AURA", time: "13:39", "text": "Any fever?"},
                    {from: "PATIENT", time: "13:39", "text": "37.6 on thermometer."}
                ]
            }
        ],
        wound_photos: [
            {
                date: "2026-01-02",
                day_post_op: 6,
                photo_url: "/demo/wound/P-2026-006-day6.jpg",
                ai_infection_risk: 35,
                ai_severity: "Mild",
                ai_findings: {
                    redness_level_0_10: 3,
                    swelling_level_0_10: 2,
                    drainage: "Clear serous, minimal",
                    edges: "Mildly separated, not gaping"
                }
            }
        ]
    }
];

async function seedData() {
    console.log(`Seeding ${patients.length} patients...`);
    const batch = db.batch();

    for (const patient of patients) {
        // Use userId as the document ID
        const docRef = db.collection('patients').doc(patient.userId);
        batch.set(docRef, patient);
    }

    try {
        await batch.commit();
        console.log("Seeding complete! ✅");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seedData();
