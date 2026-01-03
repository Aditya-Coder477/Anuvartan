import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import re

# FIX 1: Use a relative path so it works in Antigravity/Project folders
# FIX 1: Use relative path based on script location
# This ensures it finds the file regardless of where the command is run from
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "hospital_readmissions.csv")

def preprocess_and_train():
    # Check current directory for the file
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        print("Expected 'hospital_readmissions.csv' to be in the same folder as 'train_risk.py'")
        return

    print(f"Loading dataset from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # --- Preprocessing ---
    print("Preprocessing...")
    
    # FIX 2: Robust Target Mapping (Case Insensitive)
    # Maps 'no', 'NO', 'No' -> 0. Everything else -> 1
    if df['readmitted'].dtype == 'object':
        df['readmitted'] = df['readmitted'].apply(lambda x: 0 if str(x).upper() == 'NO' else 1)
    
    # Ensure target is integer
    df['readmitted'] = df['readmitted'].astype(int)

    # Age Range Handling
    def parse_age(age_str):
        try:
            clean = str(age_str).replace('[', '').replace(')', '')
            low, high = clean.split('-')
            return (int(low) + int(high)) / 2
        except:
            return 0 
            
    if 'age' in df.columns and df['age'].dtype == 'object':
        df['age'] = df['age'].apply(parse_age)

    # Drop columns
    columns_to_drop = ['encounter_id', 'patient_nbr'] 
    df = df.drop(columns=[c for c in columns_to_drop if c in df.columns])

    # One-Hot Encoding
    categorical_cols = df.select_dtypes(include=['object']).columns
    print(f"Categorical columns to encode: {list(categorical_cols)}")
    
    df = pd.get_dummies(df, columns=categorical_cols, dummy_na=True)
    
    # Convert booleans to int
    for col in df.columns:
        if df[col].dtype == 'bool':
            df[col] = df[col].astype(int)

    # Prepare X and y
    X = df.drop(columns=['readmitted'])
    y = df['readmitted']

    # Regex clean column names for XGBoost
    regex = re.compile(r"\[|\]|<", re.IGNORECASE)
    X.columns = [regex.sub("_", col) if any(x in str(col) for x in set(('[', ']', '<'))) else col for col in X.columns]

    # Handle non-numeric
    non_numeric = X.select_dtypes(exclude=['int', 'float', 'bool', 'int32', 'int64', 'float32', 'float64']).columns
    for col in non_numeric:
        X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)

    print(f"Target Y unique values: {y.unique()}")
    
    # --- Training ---
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Classifier...")
    
    # FIX 3: Removed 'eval_metric' from constructor (Line 103 fix)
    model = xgb.XGBClassifier(
        objective='binary:logistic',
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1
    )
    
    # Pass eval_metric here if needed, or omit if not using eval_set
    model.fit(X_train, y_train)
    
    # --- Evaluation ---
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Model Accuracy: {acc:.4f}")
    
    # --- Save ---
    # FIX 4: Ensure output directory exists (Line 119 protection)
    output_model_path = 'risk_model.joblib'
    output_cols_path = 'risk_model_columns.joblib'
    
    try:
        joblib.dump(model, output_model_path)
        joblib.dump(list(X.columns), output_cols_path)
        print(f"Model saved successfully to '{output_model_path}'")
    except Exception as e:
        print(f"Error saving model: {e}")

if __name__ == "__main__":
    preprocess_and_train()