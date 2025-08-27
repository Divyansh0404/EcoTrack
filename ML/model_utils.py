import numpy as np
from tensorflow.keras.models import load_model

# Load the trained model
model = load_model("carbon_emission_model.h5")

def preprocess_power_data(power_data):
    # Example: reshape to (1, 300, 1)
    arr = np.array(power_data).reshape(1, 300, 1)
    return arr

def predict_device_states(power_data):
    processed = preprocess_power_data(power_data)
    predictions = model.predict(processed)
    return predictions.tolist()
