from flask import Flask, request, jsonify
import cv2
import numpy as np
import os
import base64

app = Flask(__name__)

# --- Model and Configuration Loading ---
FACE_PROTO = os.path.join("face_detector", "deploy.prototxt.txt")
FACE_MODEL = os.path.join("face_detector", "res10_300x300_ssd_iter_140000.caffemodel")
GENDER_PROTO = os.path.join("gender_detector", "gender_deploy.prototxt")
GENDER_MODEL = os.path.join("gender_detector", "gender_net.caffemodel")

face_net = cv2.dnn.readNet(FACE_MODEL, FACE_PROTO)
gender_net = cv2.dnn.readNet(GENDER_MODEL, GENDER_PROTO)

GENDER_LIST = ['Male', 'Female']

def detect_and_predict_gender(image):
    (h, w) = image.shape[:2]
    blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()

    if len(detections) > 0:
        i = np.argmax(detections[0, 0, :, 2])
        confidence = detections[0, 0, i, 2]

        if confidence > 0.5:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            face = image[startY:endY, startX:endX]
            if face.shape[0] < 10 or face.shape[1] < 10: return None
            face_blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), (78.4263377603, 87.7689143744, 114.895847746), swapRB=False)
            gender_net.setInput(face_blob)
            preds = gender_net.forward()
            gender = GENDER_LIST[preds[0].argmax()]
            return gender
    return None

@app.route('/verify-face', methods=['POST'])
def verify_face():
    # We get the JSON data from the request
    data = request.get_json()
    if not data or 'image_base64' not in data:
        return jsonify({"error": "No image data provided"}), 400

    # We decode the base64 string into an image
    try:
        img_data = base64.b64decode(data['image_base64'])
        npimg = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Could not decode image")
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {e}"}), 400

    predicted_gender = detect_and_predict_gender(image)

    if predicted_gender:
        return jsonify({"gender": predicted_gender})
    else:
        return jsonify({"error": "No face detected or prediction failed"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
