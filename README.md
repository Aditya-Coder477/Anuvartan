# Anuvartan

Anuvartan is an AI-powered post-discharge monitoring system designed to reduce hospital readmission rates. It provides a comprehensive web-based platform for patients, doctors, and nurses to ensure continuous care and timely interventions.

## Key Features

### 1. Patient Dashboard
- **AI Chatbot**: Interactive chat interface for patients to report symptoms and get instant guidance.
- **Wound Analysis**: Upload wound images for real-time AI analysis (Infection detection, healing progress).
- **Daily Check-ins**: Simple forms to log vitals and recovery status.

### 2. Doctor Dashboard
- **Patient Monitoring**: Real-time list of patients with AI-generated Risk Scores.
- **AI Alerts**: Critical alerts for high-risk patients or deteriorating conditions.
- **Detailed Insights**: Access to full patient history, chat logs, and wound analysis reports.

### 3. Nurse Dashboard
- **Visit Management**: View and manage daily home visit schedules.
- **Vitals Entry**: Digital forms to record vitals during home visits.
- **Patient Overview**: Quick access to patient status and assigned tasks.

## Architecture

The system follows a microservices architecture:

- **Frontend**: A unified Next.js web application serving all three dashboards (Patient, Doctor, Nurse).
- **Service Node**: Node.js/Express backend handling authentication, patient data, chat logic, and orchestration.
- **Service Python**: FastAPI AI service hosting the Machine Learning models (ResNet50 for vision, Risk Scoring models).

Data flows from the Frontend to the Node Service for business logic, which calls the Python Service for AI predictions when necessary. All data is persisted in the database (Firestore/SQLite).

## Tech Stack

### Frontend:
- Next.js 16
- React 19
- Tailwind CSS 4
- Lucide React (Icons)

### Backend (Logic):
- Node.js
- Express.js
- Multer (File uploads)
- Groq Cloud (Llama 3.3) (Chatbot assistance)
- Firebase Admin SDK (Firestore)

### Backend (AI):
- Python 3.10+
- FastAPI
- TensorFlow Lite (ResNet50 Vision Model)
- Scikit-learn/XGBoost (Risk Models)
- Pandas / Numpy

## Folder Structure

```
Anuvartan/
├── frontend/               # Next.js Web Application
│   ├── app/                # App Router (Pages for Doctor, Nurse, Patient)
│   ├── components/         # Reusable UI Components
│   ├── context/            # React Context (State Management)
│   ├── public/             # Static Assets
│   └── package.json
├── service-node/           # Node.js Backend Service
│   ├── public/             # Static Files
│   ├── index.js            # Main Server Entry Point
│   └── package.json        
├── service-python/         # Python AI Service
│   ├── dataset/            # hospital_readmissions(25k+ patient records) and wound detection(27k+ wound images)
│   ├── main.py             # FastAPI App Entry Point
│   ├── train_risk.py       # ML Training Scripts (Risk Model)
│   ├── train_vision.py     # Vision Model Training
│   ├── wound_model.tflite  # Pre-trained Vision Model
│   ├── risk_model.joblib   # Pre-trained Risk Model
│   └── requirements.txt
└── AICohortdocumentation/  # Project Documentation
```

## Installation / Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- npm or yarn

### 1. Setup Frontend
```bash
cd frontend
npm install
```

### 2. Setup Node Service
```bash
cd service-node
npm install
```

### 3. Setup Python Service
```bash
cd service-python
# Create virtual environment (optional but recommended)
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

## How to Run
You need to run all three services simultaneously (in separate terminals).

### Terminal 1: Frontend
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

### Terminal 2: Node Service
```bash
cd service-node
npm start
# Running on http://localhost:5000
```

### Terminal 3: Python Service
```bash
cd service-python
python main.py
# Running on http://localhost:8000
```
