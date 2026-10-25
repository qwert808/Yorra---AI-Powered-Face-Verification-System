import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginPage from './screens/LoginPage'; 
import RegistrationStep1 from './screens/RegistrationStep1';
import FaceAuthPage from './screens/FaceAuthPage'; 
import RegistrationStep2 from './screens/RegistrationStep2'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegistrationStep1} 
          options={{ title: 'Create Account (Step 1/3)' }} 
        />
        <Stack.Screen 
          name="FaceAuth" 
          component={FaceAuthPage} 
          options={{ title: 'Verification (Step 2/3)' }}
        />
        <Stack.Screen 
          name="RegisterStep2" 
          component={RegistrationStep2} 
          options={{ title: 'Set Credentials (Step 3/3)' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
