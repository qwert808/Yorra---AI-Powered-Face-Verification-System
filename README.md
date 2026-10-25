# Yorra — AI-Powered Face Verification Prototype

Yorra is a computer vision project that integrates a React Native mobile application with a Python Flask backend to perform facial detection and gender classification using pre-trained deep learning models.

The project explores the practical integration of AI models into mobile applications, covering image capture, data transmission, image processing, model inference and API response handling.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [AI Models](#ai-models)
- [Application Workflow](#application-workflow)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Key Learnings](#key-learnings)
- [References](#references)
- [Licence](#licence)

## Overview

Yorra was developed to explore how computer vision models can be integrated into a mobile application through a dedicated backend service.

The mobile application captures a facial image using the device's front-facing camera and transmits it to a Flask API. The backend decodes the image, detects a face using OpenCV's Deep Neural Network (DNN) module, and applies a pre-trained classification model to predict a binary gender category.

The resulting classification is returned to the mobile application, which handles the outcome and proceeds through the relevant application flow.

### Project Objectives

- Integrate pre-trained computer vision models into a mobile application.
- Develop a REST API for image processing and model inference.
- Implement Base64 image transmission between the mobile frontend and Python backend.
- Handle image decoding, model-loading failures and network errors.
- Explore the practical application of computer vision in mobile-based verification workflows.

## Key Features

- **Facial Detection:** Detect faces in input images using a pre-trained SSD ResNet-10 model.
- **Gender Classification:** Apply a CaffeNet-based model to classify a detected face as male or female.
- **Mobile Camera Integration:** Capture images using Expo Camera.
- **REST API Integration:** Exchange image data and classification results between the mobile application and Flask backend.
- **Image Processing Pipeline:** Decode Base64 data and convert images into OpenCV-compatible arrays.
- **Response Handling:** Process successful responses, classification failures and backend errors.
- **Modular Architecture:** Separate the mobile interface from the backend inference pipeline.

## Technology Stack

| Category | Technologies |
|---|---|
| Programming Languages | Python, JavaScript |
| Mobile Development | React Native, Expo |
| Camera Integration | Expo Camera |
| Navigation | React Navigation |
| HTTP Communication | Axios |
| Backend Framework | Flask |
| Cross-Origin Requests | Flask-CORS |
| Computer Vision | OpenCV |
| Numerical Processing | NumPy |
| Face Detection | SSD with ResNet-10 backbone |
| Gender Classification | CaffeNet (AlexNet variant) |
| Model Format | Caffe |

## System Architecture

Yorra follows a client–server architecture that separates mobile interaction from computer vision processing.

```text
┌──────────────────────────────────┐
│       React Native Mobile App    │
│                                  │
│  Camera Access                   │
│  Image Capture                   │
│  Base64 Encoding                 │
│  HTTP Requests using Axios       │
└────────────────┬─────────────────┘
                 │
                 │ POST Request
                 ▼
┌──────────────────────────────────┐
│          Flask Backend           │
│                                  │
│  Receive Image Data              │
│  Decode Base64 Image             │
│  Process Image with OpenCV       │
│  Detect Face                     │
│  Classify Facial Gender          │
└────────────────┬─────────────────┘
                 │
                 │ JSON Response
                 ▼
┌──────────────────────────────────┐
│      Mobile Result Handling      │
│                                  │
│  Process Verification Outcome    │
│  Display Result or Error         │
│  Navigate through App Flow       │
└──────────────────────────────────┘
```

## AI Models

### 1. Face Detection — SSD ResNet-10

The face detection component uses a pre-trained Single Shot MultiBox Detector (SSD) with a ResNet-10 backbone. The model is loaded using OpenCV's Deep Neural Network module.

| Parameter | Configuration |
|---|---|
| Architecture | SSD |
| Backbone | ResNet-10 |
| Input Dimensions | 300 × 300 |
| Confidence Threshold | 0.5 |
| Framework | Caffe |
| Inference Library | OpenCV DNN |

The model identifies facial regions in an input image. The documented pipeline selects the largest detected face for subsequent processing.

### 2. Gender Classification — CaffeNet

The classification component uses a pre-trained CaffeNet model, an AlexNet variant, to predict a binary gender category from a cropped facial image.

| Parameter | Configuration |
|---|---|
| Architecture | CaffeNet (AlexNet variant) |
| Input Dimensions | 227 × 227 |
| Output Classes | Male, Female |
| Framework | Caffe |
| Inference Library | OpenCV DNN |

The detected face is cropped and resized before being passed to the classification model.

**Note:** The model predicts a binary category based on facial appearance. This prediction is not reliable proof of a person's identity or gender identity and should not be treated as secure authentication.

## Application Workflow

1. The user opens the mobile application and grants camera permission.
2. The front-facing camera captures a facial image.
3. The application encodes the image as a Base64 string.
4. Axios sends the encoded image to the Flask backend in a JSON request.
5. The backend decodes the image and converts it into an OpenCV-compatible array.
6. The face detection model identifies facial regions.
7. The selected face is cropped and resized to the classification model's input dimensions.
8. The gender classification model predicts a category.
9. The backend returns a JSON response containing the result.
10. The mobile application processes the response and displays the appropriate outcome.

## Getting Started

### Prerequisites

Before running the project, ensure that the following are installed:

- Python
- Node.js and npm
- Expo-compatible mobile development environment
- Required Caffe model configuration and weight files

### Backend Setup

Install the Python dependencies:

```bash
pip install flask flask-cors opencv-python numpy
```

Start the Flask backend by running the server entry point:

```bash
python server.py
```

The backend processes incoming image requests and returns the corresponding classification results.

### Mobile Application Setup

Install the JavaScript dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Open the application on a compatible mobile device or emulator and grant the required camera permissions.

**Network configuration:** When testing on a physical device, the backend must be accessible through the computer's local network IP address. The device and computer must be able to communicate over the network.

The backend and mobile application must be configured to use matching API routes and compatible request formats.

## API Reference

### Face Verification

**Method:** `POST`

**Endpoint:** `/api/auth/verify-face`

The endpoint receives a Base64-encoded facial image, processes it through the computer vision pipeline and returns the resulting classification status.

#### Request Body

```json
{
  "image_base64": "<base64-encoded JPEG image>"
}
```

#### Successful Response

```json
{
  "status": "success",
  "verified": true,
  "message": "Verification successful"
}
```

#### Classification Failure

```json
{
  "status": "failure",
  "verified": false,
  "message": "Gender verification failed"
}
```

#### Error Response

```json
{
  "status": "error",
  "message": "AI models failed to load. Contact support."
}
```

The response examples represent the documented API contract. Actual response codes and error messages depend on the backend implementation.

## Limitations

- **No liveness detection:** The current pipeline does not establish whether an image comes from a live person or a photograph.
- **Classification reliability:** Gender classification can produce inaccurate predictions and is not a reliable identity verification method.
- **Single-face processing:** The documented pipeline selects one detected face rather than providing a multi-face selection interface.
- **Limited authentication functionality:** The described implementation does not establish a complete, database-backed identity authentication system.
- **Development-oriented networking:** Production deployment requires HTTPS, secure configuration and appropriate access controls.
- **No published benchmark results:** Accuracy, inference latency and generalisation performance require systematic evaluation before quantitative claims can be made.

## Future Improvements

Potential improvements include:

- Investigating face-recognition models such as FaceNet or ArcFace for consent-based identity matching.
- Implementing liveness detection and presentation-attack resistance.
- Integrating a secure database for user records and verification data.
- Implementing appropriate authentication and authorisation mechanisms.
- Deploying the backend with HTTPS and production-grade configuration.
- Containerising the application with Docker.
- Supporting multiple detected faces with a selection interface.
- Adding automated tests, structured logging and performance monitoring.
- Evaluating model performance, reliability and fairness across representative datasets.

These are proposed enhancements rather than claims about existing functionality.

## Key Learnings

The project provides practical experience with:

- Integrating pre-trained deep learning models into a mobile application.
- Developing REST APIs for computer vision inference.
- Capturing, encoding, transmitting and decoding image data.
- Loading and executing Caffe models using OpenCV DNN.
- Managing dependencies between a mobile frontend and Python backend.
- Handling errors across image-processing and network communication workflows.
- Understanding the limitations of AI-based facial classification in authentication-related applications.

## References

- [OpenCV Documentation](https://docs.opencv.org/)
- [OpenCV DNN Module](https://docs.opencv.org/4.x/d2/d58/tutorial_table_of_content_dnn.html)
- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)

Third-party model implementations and weights should be attributed to their original sources. Review their respective licences before redistribution.

## Licence

The project's licence should be documented in a `LICENSE` file in the repository. Third-party model files and dependencies may be subject to separate licensing terms.

---

**Yorra** — Exploring computer vision, mobile application development and AI-powered image-processing workflows.
