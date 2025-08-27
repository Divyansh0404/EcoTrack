from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "carbon_footprint_model.h5"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

try:
    model = load_model(str(MODEL_PATH))
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

label_map = { "Plastic": 0, "Metal": 1, "Glass": 2, "Textile": 3, "Steel": 4, "Chemical": 5 }

@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200

@app.post('/predict')
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data received"}), 400

        category = data.get("category")
        weight = data.get("weight")

        if category not in label_map:
            return jsonify({"error": "Invalid category"}), 400
        if weight is None:
            return jsonify({"error": "Weight is missing"}), 400

        weight = float(weight)
        encoded = label_map[category]
        input_wave = np.ones((1, 300, 1), dtype=np.float32) * weight
        prediction = float(model.predict(input_wave, verbose=0)[0][encoded])

        return jsonify({"predicted_emission": prediction, "category": category})
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)