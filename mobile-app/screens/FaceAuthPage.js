import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

const FaceAuthPage = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerify = async () => {
    if (!cameraRef.current) {
      Alert.alert("Camera Error", "Camera is not ready");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: true,
        exif: false
      });

      if (!photo.base64) {
        throw new Error("Failed to capture image");
      }

      const response = await axios.post('http://10.0.129.124:5000/api/auth/verify-face', {
        image_base64: photo.base64
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        navigation.navigate('Register');
      } else {
        Alert.alert(
          "Verification Failed",
          response.data.message || "Could not verify your identity",
          [{ text: "Try Again" }]
        );
      }
    } catch (error) {
      let errorMessage = "An error occurred";
      
      if (error.response) {
        // Handle server errors
        if (error.response.data?.message?.includes('AI models')) {
          errorMessage = "Server is currently unavailable. Please try later.";
        } else {
          errorMessage = error.response.data?.message || "Server error";
        }
      } else if (error.message.includes('timeout')) {
        errorMessage = "Connection timeout. Check your network.";
      } else {
        errorMessage = error.message || "Unknown error";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need access to your camera for face verification
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />
      
      <View style={styles.overlay}>
        <Text style={styles.title}>Face Verification</Text>
        <Text style={styles.subtitle}>Align your face within the oval</Text>
        
        <View style={styles.faceOutline} />
        
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.processingText}>Verifying...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={isProcessing}
          >
            <Text style={styles.verifyButtonText}>Verify Identity</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 5,
    textShadowOffset: { width: 1, height: 1 }
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 3
  },
  faceOutline: {
    width: 250,
    height: 350,
    borderRadius: 175,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed'
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    elevation: 3
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#F3F4F6'
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827'
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#374151'
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  processingContainer: {
    alignItems: 'center'
  },
  processingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16
  }
});

export default FaceAuthPage;