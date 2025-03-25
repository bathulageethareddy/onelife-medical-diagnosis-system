import os
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from different origins

# Path to your Diabetes model file
DIABETES_MODEL_PATH = os.path.join(os.path.dirname(__file__), "diabetes.pkl")

# Load the Diabetes model
with open(DIABETES_MODEL_PATH, "rb") as file:
    diabetes_model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or "input_data" not in data:
            return jsonify({"error": "Invalid input data."}), 400

        input_data = np.array(data.get("input_data")).reshape(1, -1)  # Ensure proper shape

        # Perform prediction using the loaded model
        prediction = diabetes_model.predict(input_data).tolist()

        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
