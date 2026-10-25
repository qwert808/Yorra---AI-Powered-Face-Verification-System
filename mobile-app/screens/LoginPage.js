import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  const goToRegisterFlow = () => {
    navigation.navigate('FaceAuth'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yorra</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email/Username</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={goToRegisterFlow}>
            <Text style={styles.createAccountLink}>+Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#4F46E5', textAlign: 'center', marginBottom: 40, fontFamily: 'serif' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#4B5563', marginBottom: 8 },
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16 },
  forgotPassword: { textAlign: 'right', color: '#4F46E5', marginTop: 8, fontSize: 14, fontWeight: '500' },
  button: { backgroundColor: '#4F46E5', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  createAccountContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  createAccountText: { color: '#4B5563', fontSize: 14 },
  createAccountLink: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
});

export default LoginPage;
