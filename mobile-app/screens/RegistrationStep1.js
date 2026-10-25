import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { register, sendOtp, verifyOtp } from './api';

const RegistrationStep1 = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
 
  const handleSendOtp = async () => {
  try {
    if (!name || !email || !dob) {
      Alert.alert("Missing Info", "Please fill out all fields first.");
      return;
    }

    await register(name, email, dob);
    await sendOtp(email);                  
    Alert.alert("OTP Sent", "An OTP has been sent to your email.");
  } catch (error) {
    console.error(error);
    Alert.alert("Error", error.response?.data?.message ||"Something went wrong.");
  }
};

const handleVerifyAndContinue = async () => {
  try {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Enter a valid OTP.');
      return;
    }

    await verifyOtp(email, otp);
    navigation.navigate('RegistrationStep2');
  } catch (error) {
    console.error(error);
    Alert.alert('OTP Failed', error.response?.data?.message || 'Invalid OTP.');
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Step 1 of 2: Personal Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View style={styles.otpContainer}>
          <TextInput style={styles.otpInput} value={otp} onChangeText={setOtp} placeholder="OTP" keyboardType="number-pad" />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendOtp}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyAndContinue}>
          <Text style={styles.verifyButtonText}>Verify & Continue</Text>        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegistrationStep1;