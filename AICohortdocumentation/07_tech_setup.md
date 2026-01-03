# TECHNOLOGY STACK & DEVELOPMENT SETUP
## 100% FREE Tools और Best Practices

---

## Development Environment Setup

### Step 1: Install FREE Development Tools

```bash
# 1. NODE.JS (Backend + Frontend)
# Download: https://nodejs.org/
# Version: LTS (18.x or 20.x)
# Cost: FREE
# Why: JavaScript runtime for both frontend and backend

# 2. PYTHON 3.10+
# Download: https://www.python.org/downloads/
# Cost: FREE
# Why: ML models (scikit-learn, TensorFlow)

# 3. GIT
# Download: https://git-scm.com/
# Cost: FREE
# Why: Version control

# 4. VSCODE
# Download: https://code.visualstudio.com/
# Cost: FREE
# Why: Best code editor

# Verification commands:
node --version
npm --version
python --version
git --version
```

### Step 2: Setup FREE Development Database

```bash
# Option A: PostgreSQL (Production-grade, FREE)
# Download: https://www.postgresql.org/download/
# Cost: FREE (open-source)

# OR Option B: Use Heroku Free Tier (cloud-based)
# Signup: https://www.heroku.com/
# Cost: FREE for MVP (limited)

# OR Option C: Railway.app (better free tier)
# Signup: https://railway.app/
# Free credits: $5/month
# Cost: Effectively FREE for 1-2 months

# Install PostgreSQL locally (macOS):
brew install postgresql

# Start PostgreSQL:
brew services start postgresql

# Test:
psql postgres
```

### Step 3: Firebase Setup (Backend Services - FREE)

```bash
# Signup: https://firebase.google.com/
# Cost: FREE (Spark plan)

# Why:
├─ Authentication (ABHA login can integrate here)
├─ Cloud Storage (for wound photos)
├─ Cloud Functions (serverless backend)
├─ Realtime Database (for alerts)
├─ Hosting (deploy frontend)
└─ Free tier: Generous for MVP

# Create Firebase project:
# 1. Go to firebase.google.com
# 2. Click "Get Started"
# 3. Create new project: "arogya-pulse"
# 4. Enable Google Sign-In, Storage, Functions
# 5. Download Firebase credentials JSON
```

---

## Frontend Development

### Unified Mobile App (Flutter)

```bash
# Install Flutter SDK
# https://docs.flutter.dev/get-started/install

# Create new project
flutter create arogya_app

cd arogya_app

# Install dependencies:
flutter pub add http firebase_core firebase_messaging image_picker



# Project structure:
arogya-patient/
├── src/
│   ├── components/
│   │   ├── CheckinForm.jsx          (Daily check-in)
│   │   ├── MedicationReminder.jsx   (Med schedule)
│   │   ├── WoundUpload.jsx          (Photo upload)
│   │   ├── ProgressDashboard.jsx    (Timeline)
│   │   └── SOSButton.jsx            (Emergency)
│   ├── pages/
│   │   ├── Login.jsx                (ABHA login)
│   │   ├── Home.jsx                 (Main dashboard)
│   │   └── Settings.jsx             (Preferences)
│   ├── services/
│   │   ├── api.js                   (API calls)
│   │   ├── firebase.js              (Firebase setup)
│   │   └── notifications.js         (Push notifications)
│   └── App.jsx
├── package.json
└── app.json

# Development server:
npm start

# This opens on http://localhost:19000
# Scan with Expo Go app on phone
# Or open in browser for PWA

# Build for production:
eas build --platform all
```

### Example: Patient Checkin Form Component

```jsx
// src/components/CheckinForm.jsx
import React, { useState } from 'react';
import { submitCheckin } from '../services/api';

export default function CheckinForm() {
  const [pain, setPain] = useState(5);
  const [fever, setFever] = useState('');
  const [woundStatus, setWoundStatus] = useState('healthy');
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await submitCheckin({
        pain,
        fever,
        woundStatus,
        medsTaken: meds,
        timestamp: new Date()
      });
      alert('✅ Check-in saved successfully!');
      // Reset form
      setPain(5);
      setFever('');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">दैनिक स्वास्थ्य जांच</h1>
      
      <div className="mb-4">
        <label className="block font-semibold mb-2">दर्द (0-10)</label>
        <input
          type="range"
          min="0"
          max="10"
          value={pain}
          onChange={(e) => setPain(e.target.value)}
          className="w-full"
        />
        <span className="text-lg font-bold">{pain}/10</span>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">बुखार?</label>
        <input
          type="number"
          placeholder="°C में तापमान (optional)"
          value={fever}
          onChange={(e) => setFever(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">घाव की स्थिति</label>
        <select
          value={woundStatus}
          onChange={(e) => setWoundStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="healthy">स्वस्थ</option>
          <option value="swollen">सूजा हुआ</option>
          <option value="draining">तरल निकल रहा है</option>
          <option value="red">लाल/संक्रमित</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded font-bold"
      >
        {loading ? 'सहेज रहे हैं...' : 'सबमिट करें'}
      </button>
    </div>
  );
}
```

### Nurse Dashboard (React.js)

```bash
# Create Nurse Dashboard:
npx create-react-app arogya-nurse

cd arogya-nurse

# Install dependencies:
npm install axios firebase recharts socket.io-client

# Project structure:
arogya-nurse/
├── src/
│   ├── components/
│   │   ├── PatientAssignmentBoard.jsx  (Patient list)
│   │   ├── RealTimeAlerts.jsx          (Alerts)
│   │   ├── VisitScheduler.jsx          (Calendar)
│   │   ├── VisitReportForm.jsx         (After visit)
│   │   └── WoundValidation.jsx         (AI analysis)
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── PatientDetail.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── websocket.js
│   └── App.jsx
├── package.json
└── public/

# Development:
npm start

# Opens on http://localhost:3000
```

### Doctor Dashboard (Next.js)

```bash
# Create Doctor Dashboard:
npx create-next-app arogya-doctor

cd arogya-doctor

# Install dependencies:
npm install axios firebase recharts date-fns

# Project structure:
arogya-doctor/
├── app/
│   ├── components/
│   │   ├── PatientList.jsx
│   │   ├── RiskScoring.jsx
│   │   ├── UrgentAlerts.jsx
│   │   ├── PatientDetail.jsx
│   │   └── Recommendations.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── aiModels.js
│   ├── layout.jsx
│   └── page.jsx
├── package.json
└── next.config.js

# Development:
npm run dev

# Opens on http://localhost:3000
```

---

## Backend Development

### Express.js + Node.js API Server

```bash
# Create backend:
mkdir arogya-backend
cd arogya-backend

# Initialize:
npm init -y

# Install dependencies:
npm install express postgres cors dotenv

# Project structure:
arogya-backend/
├── routes/
│   ├── patient.js            (POST /api/patient/checkin)
│   ├── nurse.js              (GET /api/nurse/patients, etc)
│   ├── doctor.js             (GET /api/doctor/patients, etc)
│   ├── auth.js               (ABHA login)
│   └── ai.js                 (AI model endpoints)
├── models/
│   ├── Patient.js
│   ├── Checkin.js
│   ├── NurseVisit.js
│   └── DoctorAction.js
├── middleware/
│   ├── auth.js               (JWT verification)
│   └── errorHandler.js
├── database/
│   ├── connection.js
│   └── schema.sql
├── services/
│   ├── aiModel.js            (ML predictions)
│   └── notification.js       (Alert service)
├── server.js
└── .env

# server.js example:
const express = require('express');
const postgres = require('postgres');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'arogya_db',
  user: 'postgres',
  password: 'password'
});

// Routes
app.use('/api/patient', require('./routes/patient'));
app.use('/api/nurse', require('./routes/nurse'));
app.use('/api/doctor', require('./routes/doctor'));

// Start server
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});

# Run:
node server.js
```

### Example: Patient Checkin API Endpoint

```javascript
// routes/patient.js
const express = require('express');
const router = express.Router();
const { submitCheckin, getProgress } = require('../services/patientService');

// POST daily checkin
router.post('/checkin', async (req, res) => {
  try {
    const { patientId, pain, fever, woundStatus, medsTaken } = req.body;
    
    // Validate input
    if (!patientId || pain < 0 || pain > 10) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    // Save to database
    const checkin = await submitCheckin({
      patientId,
      pain,
      fever,
      woundStatus,
      medsTaken,
      timestamp: new Date()
    });
    
    // Check for red flags
    const redFlags = checkRedFlags({ pain, fever, woundStatus });
    
    // Notify nurse/doctor if red flag
    if (redFlags.length > 0) {
      notifyNurse(patientId, redFlags);
      notifyDoctor(patientId, redFlags);
    }
    
    res.json({ 
      success: true, 
      checkinId: checkin.id,
      redFlags: redFlags
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET patient progress
router.get('/progress/:patientId', async (req, res) => {
  try {
    const progress = await getProgress(req.params.patientId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## AI/ML Models Setup

### Python Backend for AI Models

```bash
# Create ML backend:
mkdir arogya-ml
cd arogya-ml

# Create virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies:
pip install flask tensorflow scikit-learn xgboost pandas numpy pillow

# Project structure:
arogya-ml/
├── models/
│   ├── wound_detection.py      (ResNet50)
│   ├── risk_scoring.py         (Logistic Regression)
│   ├── anomaly_detection.py    (Isolation Forest)
│   └── recommendations.py      (XGBoost)
├── api/
│   ├── app.py                  (Flask server)
│   └── endpoints.py            (Model endpoints)
├── data/
│   ├── training_data.csv
│   └── pretrained_models/
├── utils/
│   ├── preprocessing.py
│   └── gradcam.py             (Explainability)
├── requirements.txt
└── main.py

# requirements.txt:
flask==2.3.0
tensorflow==2.13.0
scikit-learn==1.2.0
xgboost==1.7.0
pillow==10.0.0
numpy==1.24.0
pandas==2.0.0
opencv-python==4.8.0

# Install from requirements:
pip install -r requirements.txt
```

### Example: Wound Detection Model (Minimal Fine-tuning)

```python
# models/wound_detection.py
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input
import numpy as np
from utils.gradcam import generate_gradcam

class WoundDetectionModel:
    def __init__(self):
        # Load pre-trained ResNet50 (already trained on ImageNet)
        self.model = ResNet50(
            weights='imagenet',
            include_top=False,
            input_shape=(224, 224, 3)
        )
        
        # Add classification head (few parameters to train)
        self.classifier = tf.keras.Sequential([
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(2, activation='softmax')  # Healthy vs Infected
        ])
        
    def fine_tune(self, training_data, epochs=5):
        """
        Fine-tune on hospital's own patient data
        Time: 2-3 hours on GPU
        """
        X_train, y_train = training_data
        
        # Only train the classifier, keep ResNet50 frozen
        self.model.trainable = False
        
        # Compile
        optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
        self.classifier.compile(
            optimizer=optimizer,
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Train
        self.classifier.fit(X_train, y_train, epochs=epochs)
        
    def predict(self, image_path):
        """
        Predict infection risk from wound photo
        """
        # Load and preprocess image
        img = load_img(image_path, target_size=(224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        # Get ResNet50 features
        features = self.model.predict(img_array)
        
        # Classify
        prediction = self.classifier.predict(features)
        
        # Extract results
        healthy_prob = prediction[0][0] * 100
        infected_prob = prediction[0][1] * 100
        
        # Generate Grad-CAM for explainability
        grad_cam = generate_gradcam(self.model, img_array)
        
        return {
            'infection_risk': infected_prob,
            'confidence': max(healthy_prob, infected_prob),
            'grad_cam': grad_cam,  # Visual explanation
            'findings': self.extract_findings(infected_prob)
        }
    
    def extract_findings(self, risk_score):
        """Generate human-readable findings"""
        findings = []
        
        if risk_score > 60:
            findings.append('✓ Possible infection signs detected')
            findings.append('✓ Erythema (redness) visible')
            findings.append('⚠️ Recommend culture swab + antibiotics')
        elif risk_score > 30:
            findings.append('⚠️ Possible early infection')
            findings.append('⚠️ Swelling/redness present')
            findings.append('→ Monitor closely')
        else:
            findings.append('✅ Wound appears healthy')
        
        return findings

# Usage:
model = WoundDetectionModel()

# Fine-tune on your hospital's data (one-time, 2 hours)
# model.fine_tune((X_train, y_train), epochs=5)

# Predict on new patient
result = model.predict('/path/to/wound/photo.jpg')
print(f"Infection risk: {result['infection_risk']:.1f}%")
print(f"Findings: {result['findings']}")
```

### Example: Risk Scoring Model

```python
# models/risk_scoring.py
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import pickle
import numpy as np

class RiskScoringModel:
    def __init__(self):
        self.model = LogisticRegression()
        self.scaler = StandardScaler()
        
    def train(self, X_train, y_train):
        """
        Train on hospital's past 500 patient outcomes
        y = [0 = recovered, 1 = readmitted]
        """
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        
        # Save for later
        with open('risk_model.pkl', 'wb') as f:
            pickle.dump((self.model, self.scaler), f)
        
    def predict(self, patient_features):
        """
        Predict risk for new patient
        Features: [days_post_op, fever, pain, wound_status, med_compliance, age, comorbidities]
        """
        features_array = np.array([patient_features])
        features_scaled = self.scaler.transform(features_array)
        
        risk_prob = self.model.predict_proba(features_scaled)[0][1]
        risk_percent = risk_prob * 100
        
        return {
            'risk_score': risk_percent,
            'status': self._risk_level(risk_percent),
            'color': '🟢' if risk_percent < 30 else ('🟡' if risk_percent < 60 else '🔴')
        }
    
    def _risk_level(self, risk_percent):
        if risk_percent < 30:
            return 'LOW (Monitor normally)'
        elif risk_percent < 60:
            return 'MODERATE (Watch closely)'
        else:
            return 'HIGH (May need intervention)'

# Usage:
model = RiskScoringModel()

# Example patient features
patient = [
    7,      # Days post-op
    38.5,   # Fever (°C)
    4,      # Pain (0-10)
    2,      # Wound status (0=normal, 1=swollen, 2=draining)
    95,     # Medication compliance (%)
    32,     # Age
    0       # Comorbidities count
]

result = model.predict(patient)
print(f"Risk: {result['risk_score']:.1f}% {result['color']}")
print(f"Status: {result['status']}")
```

---

## Database Schema (PostgreSQL)

```sql
-- Database setup
CREATE DATABASE arogya_db;

-- Patient table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    abha_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT,
    phone VARCHAR(20),
    discharge_date DATE NOT NULL,
    diagnosis VARCHAR(255),
    hospital_id INT,
    surgeon_id INT,
    nurse_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily check-ins
CREATE TABLE checkins (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id),
    check_in_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pain_score INT CHECK (pain_score >= 0 AND pain_score <= 10),
    fever DECIMAL(4,1),
    wound_status VARCHAR(50), -- healthy/swollen/draining/red
    meds_taken BOOLEAN[],
    activity_level VARCHAR(50),
    mood INT CHECK (mood >= 1 AND mood <= 5),
    photo_url VARCHAR(500),
    red_flags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nurse visit reports
CREATE TABLE nurse_visits (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id),
    nurse_id INT,
    visit_date TIMESTAMP,
    blood_pressure VARCHAR(20),
    heart_rate INT,
    temperature DECIMAL(4,1),
    o2_sat INT,
    wound_photo_url VARCHAR(500),
    observations TEXT,
    escalation_flag BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor actions
CREATE TABLE doctor_actions (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id),
    doctor_id INT,
    action_type VARCHAR(100), -- tele-consult, lab-order, escalation
    action_details JSONB,
    date_taken DATE,
    outcome VARCHAR(50), -- completed, pending, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient outcomes (for AI learning)
CREATE TABLE outcomes (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id),
    monitoring_end_date DATE,
    outcome VARCHAR(100), -- recovered, readmitted, complications
    outcome_notes TEXT,
    days_to_recovery INT,
    complications TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_patient_abha ON patients(abha_id);
CREATE INDEX idx_checkins_patient ON checkins(patient_id);
CREATE INDEX idx_checkins_date ON checkins(check_in_date);
CREATE INDEX idx_nurse_visits_patient ON nurse_visits(patient_id);
```

---

## Deployment (FREE Options)

### Frontend Deployment

```bash
# Option 1: Vercel (RECOMMENDED - FREE for open source)
# Patient App deployment:
npm run build
vercel

# Nurse Dashboard:
cd arogya-nurse
npm run build
vercel

# Doctor Dashboard:
cd arogya-doctor
npm run build
vercel

# Cost: FREE (includes SSL, CI/CD, CDN)

# Option 2: Netlify
# Same process, equally good
```

### Backend Deployment

```bash
# Option 1: Railway.app (FREE tier, $5/month)
# Sign up: https://railway.app/

# Deploy Node.js backend:
npm install -g railway
railway login
railway init
railway up

# Cost: FREE credits, then ₹500-1000/month for production

# Option 2: Render.com (FREE tier)
# Sign up: https://render.com/
# Deploy directly from GitHub
# Cost: FREE, with some limitations

# Option 3: Heroku (phased out free tier, not recommended anymore)
```

### Database Deployment

```bash
# Option 1: Supabase (PostgreSQL in cloud, FREE)
# Sign up: https://supabase.com/
# Free tier: 500MB storage, unlimited API calls
# Perfect for MVP

# Connect from Node.js:
const sql = postgres('postgresql://user:password@host:5432/arogya');

# Option 2: Railway PostgreSQL
# Included in Railway.app free tier
```

---

## Development Workflow (Complete)

```bash
# 1. Create project directory
mkdir arogya-pulse
cd arogya-pulse

# 2. Initialize Git
git init
git config user.name "Your Name"
git config user.email "email@example.com"

# 3. Create .gitignore
echo "node_modules/
.env
.env.local
__pycache__/
*.pyc
venv/
.DS_Store" > .gitignore

# 4. Create backend
mkdir backend
cd backend
npm init -y
npm install express postgres cors dotenv

# 5. Create frontend
cd ..
npx create-react-app frontend

# 6. Create ML backend
mkdir ml
cd ml
python3 -m venv venv
source venv/bin/activate
pip install flask tensorflow scikit-learn

# 7. Start development
# Terminal 1 (Backend):
cd backend
node server.js

# Terminal 2 (Frontend):
cd frontend
npm start

# Terminal 3 (ML):
cd ml
python app.py

# All running on:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# ML API: http://localhost:5001
```

---

## Cost Breakdown (First 3 Months)

```
Development (First 3 months):
├─ Development tools: ₹0 (ALL FREE)
├─ Hosting (Vercel + Railway): ₹0 (FREE tier)
├─ Database (Supabase): ₹0 (FREE tier)
├─ Firebase: ₹0 (Spark plan)
└─ Total: ₹0 🎉

After MVP validation (Scale to 1000 patients):
├─ Vercel/Netlify hosting: ₹5,000/month
├─ Railway backend: ₹5,000/month
├─ Supabase database: ₹10,000/month (500GB storage)
├─ AWS S3 (wound photos): ₹3,000/month
├─ SendGrid (emails): ₹2,000/month
├─ Twilio (WhatsApp): ₹5,000/month
└─ Total: ₹30,000/month (~$360/month)

For 400 hospital discharges/month:
├─ Cost per patient: ₹30,000 / (400 × 30 days) = ₹2.50/patient/day
├─ Hospital pays: ₹50-100/discharge = ₹20,000-40,000/month
├─ Margin: 40-50% 💰
```

---

## Next Steps

1. **Clone repository template** (if exists)
2. **Setup local development** (follow steps above)
3. **Start with Patient Dashboard** (simplest to build)
4. **Add AI models** (pre-trained, minimal fine-tuning)
5. **Build Nurse Dashboard**
6. **Build Doctor Dashboard**
7. **Deploy to Vercel + Railway**
8. **Test with hospital partners**

You now have everything needed to build Arogya-Pulse with ZERO development costs! 🚀
