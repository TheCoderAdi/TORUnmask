import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
from preprocess import load_and_preprocess_data

X_train, X_test, y_train, y_test, scaler, feature_names = load_and_preprocess_data()

label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(y_train)
y_test = label_encoder.transform(y_test)

unique, counts = np.unique(y_train, return_counts=True)
print("🔥 Training Label Distribution:", dict(zip(unique, counts)))

unique_test, counts_test = np.unique(y_test, return_counts=True)
print("🎯 Test Label Distribution:", dict(zip(unique_test, counts_test)))

smote = SMOTE(sampling_strategy="auto", random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

unique_balanced, counts_balanced = np.unique(y_train_balanced, return_counts=True)
print("✅ Balanced Training Label Distribution:", dict(zip(unique_balanced, counts_balanced)))

best_params = {
    "n_estimators": 200,
    "max_depth": 25,
    "min_samples_split": 5,
    "min_samples_leaf": 1,
}

best_model = RandomForestClassifier(
    **best_params, class_weight="balanced", random_state=42, n_jobs=-1
)
best_model.fit(X_train_balanced, y_train_balanced)

y_pred = best_model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

train_acc = accuracy_score(y_train_balanced, best_model.predict(X_train_balanced))

print(f"📊 Train Accuracy: {train_acc:.4f} | 🎯 Test Accuracy: {acc:.4f}")
print(f"🔥 F1-Score: {f1:.4f} | ⚡ Precision: {precision:.4f} | 🔥 Recall: {recall:.4f}")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
joblib.dump(best_model, os.path.join(BASE_DIR, "best_model.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "scaler.pkl"))

feature_importances = pd.DataFrame(
    {"Feature": feature_names, "Importance": best_model.feature_importances_}
)
feature_importances = feature_importances.sort_values(by="Importance", ascending=False)
feature_importances.to_csv(os.path.join(BASE_DIR, "feature_importance.csv"), index=False)

print("✅ Optimized model and feature importance saved successfully!")
