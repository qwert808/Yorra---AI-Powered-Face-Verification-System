from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64

app = Flask(__name__)
CORS(app)

HAAR_CASCADE_PATH = os.path.join("models", "haarcascade_frontalface_default.xml")
GENDER_PROTO = os.path.join("models", "deploy_gender.prototxt")
GENDER_MODEL = os.path.join("models", "gender_net.caffemodel")

models_loaded = False
face_cascade = None
gender_net = None
GENDER_LIST = ['Male', 'Female']

try:
    print("Loading face detection model (Haar Cascade)")
    face_cascade = cv2.CascadeClassifier(HAAR_CASCADE_PATH)
    
    print("Loading gender detection model...")
    gender_net = cv2.dnn.readNet(GENDER_MODEL, GENDER_PROTO)
    
    if face_cascade.empty():
        raise IOError(f"Could not load Haar Cascade file: {HAAR_CASCADE_PATH}")

    models_loaded = True
    print("All models loaded successfully")

except Exception as e:
    print(f" FATAL: Model loading failed: {str(e)}")


def detect_and_predict_gender(image):
    # Convert image to grayscale for the Haar Cascade detector
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Check if any faces were found
    if len(faces) > 0:
        # Get the first face found
        (x, y, w, h) = faces[0]
        face = image[y:y+h, x:x+w]
        
        if face.shape[0] < 20 or face.shape[1] < 20:
            return None

        # Preprocess the face for the gender model
        face_blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), (78.4263377603, 87.7689143744, 114.895847746), swapRB=False)
        gender_net.setInput(face_blob)
        preds = gender_net.forward()
        gender = GENDER_LIST[preds.argmax()]
        return gender
        
    return None

@app.route("/api/auth/verify-face", methods=['POST'])
def verify_face():
    if not models_loaded:
        return jsonify({"status": "error", "message": "AI models on the server are not loaded."}), 500
    
    data = request.get_json()
    if not data or 'image_base64' not in data:
        return jsonify({"status": "error", "message": "No image data provided"}), 400

    try:
        img_data = base64.b64decode(data['image_base64'])
        npimg = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Could not decode image")
    except Exception as e:
        return jsonify({"status": "error", "message": f"Invalid image data: {e}"}), 400

    predicted_gender = detect_and_predict_gender(image)

    if predicted_gender == "Female":
        return jsonify({'status': 'success', 'message': 'Verification successful. Welcome!', 'verified': True})
    elif predicted_gender == "Male":
        return jsonify({'status': 'failure', 'message': 'Verification failed: User is not female.', 'verified': False})
    else:
        return jsonify({'status': 'failure', 'message': 'No face detected or prediction failed.', 'verified': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
