import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, r"./Tor-NonTor.csv")

def load_and_preprocess_data(filepath=DATA_PATH):
    """Load dataset, clean, and preprocess."""
    df = pd.read_csv(filepath)

    df.columns = df.columns.str.strip()

    drop_columns = [
        "Source IP", "Source Port", "Destination IP", "Destination Port", "Protocol",
        "Active Max", "Active Mean", "Active Min", "Idle Mean", "Idle Min", "Idle Max", "Active Std", "Idle Std"
    ]
    df.drop(columns=[col for col in drop_columns if col in df.columns], inplace=True)

    df["label"] = df["label"].map({"nonTOR": 0, "TOR": 1})

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(df.median(), inplace=True)

    X = df.drop("label", axis=1)
    y = df["label"]

    feature_names = X.columns.tolist()

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

    return X_train, X_test, y_train, y_test, scaler, feature_names

if __name__ == "__main__":
    X_train, X_test, y_train, y_test, scaler, feature_names = load_and_preprocess_data()

    data_dir = os.path.join(BASE_DIR, "../data")
    os.makedirs(data_dir, exist_ok=True)
    
    pd.DataFrame(X_train, columns=feature_names).to_csv(os.path.join(data_dir, "X_train.csv"), index=False)
    pd.DataFrame(X_test, columns=feature_names).to_csv(os.path.join(data_dir, "X_test.csv"), index=False)
    pd.DataFrame(y_train).to_csv(os.path.join(data_dir, "y_train.csv"), index=False)
    pd.DataFrame(y_test).to_csv(os.path.join(data_dir, "y_test.csv"), index=False)

    print("✅ Preprocessing complete! Low-importance features removed.")
