import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login'; // Chemin vers votre composant Login
import Navigation from './src/Navigation'; // Chemin vers votre composant Home

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Masquer l'en-tête et la flèche de retour
        />
        <Stack.Screen
          name="Home"
          component={Navigation}
          options={{ title: false , headerShown: false }} // Affiche l'en-tête pour l'écran d'accueil si nécessaire
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
