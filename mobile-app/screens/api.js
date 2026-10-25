import axios from 'axios';


const api = axios.create({
  baseURL: 'http://10.0.141.213:5272/api/Users',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const register = async (name, email, dob) => {
  try {
    const response = await api.post('/register', { name, email, dob });
    return response.data;
  } catch (error) {
    console.error("Error in register:", error.response?.data || error.message);
    throw error;
  }
};


  //Step 2: Send OTP to email
 
export const sendOtp = async (email) => {
  try {
    const response = await api.post('/send-otp', { email });
    return response.data;
  } catch (error) {
    console.error("Error in sendOtp:", error.response?.data || error.message);
    throw error;
  }
};


 //Step 3: Verify OTP
 
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error in verifyOtp:", error.response?.data || error.message);
    throw error;
  }
};


 //Step 4: Register user credentials (username + password)

export const registerUser = async (email, username, password) => {
  try {
    const response = await api.post('/registerUser', {
      email,
      userName: username,
      hashedPassword: password 
    });
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error.response?.data || error.message);
    throw error;
  }
};
