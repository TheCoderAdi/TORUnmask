import os
import json
import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"csv"}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "src/best_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "src/scaler.pkl"))

LOG_FILE = os.path.join(BASE_DIR, "logs.txt")
ERROR_LOG = os.path.join(BASE_DIR, "error_logs.txt")


def log_request(features, prediction):
    """Log request data and model prediction."""
    log_data = {"features": features, "prediction": prediction}
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(log_data) + "\n")


def log_error(error_message):
    """Log errors separately."""
    with open(ERROR_LOG, "a") as f:
        f.write(json.dumps({"error": error_message}) + "\n")


def allowed_file(filename):
    """Check if uploaded file is allowed (CSV only)."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if "features" not in data:
            return jsonify({"error": "Missing 'features' key in request"}), 400

        features = np.array(data["features"]).reshape(1, -1)

        if features.shape[1] != scaler.n_features_in_:
            return jsonify({"error": f"Expected {scaler.n_features_in_} features, but got {features.shape[1]}."}), 400

        features_scaled = scaler.transform(features)

        predicted_class = model.predict(features_scaled)[0]
        prediction = "Non-Tor" if predicted_class == 0 else "Tor"

        log_request(data["features"], prediction)

        return jsonify({"prediction": prediction})

    except Exception as e:
        log_error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/predict-file", methods=["POST"])
def predict_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            df = pd.read_csv(filepath)

            if df.shape[1] != scaler.n_features_in_:
                return jsonify({"error": f"Expected {scaler.n_features_in_} features, but got {df.shape[1]}."}), 400

            features_scaled = scaler.transform(df.values)

            predicted_classes = model.predict(features_scaled)
            predictions = ["Non-Tor" if cls == 0 else "Tor" for cls in predicted_classes]

            for i in range(len(df)):
                log_request(df.iloc[i].tolist(), predictions[i])

            return jsonify({"predictions": predictions})

        else:
            return jsonify({"error": "Invalid file format. Only CSV is allowed."}), 400

    except Exception as e:
        log_error(str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
