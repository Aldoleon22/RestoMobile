import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import Navigation from './src/Navigation';
import { AuthProvider, AuthContext } from './src/AuthContext';
import MenuScreen from './src/components/MenuCompo';
import CartScreen from './src/components/CartCompo';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
      {!user ? (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Home" component={Navigation} options={{ headerShown: false }} />
      )}
       {/* <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />cnd */}
      <Stack.Screen name='Menu' component={MenuScreen} options={{headerShown: true }} />
      <Stack.Screen name='Cart' component={CartScreen} options={{headerShown: true }} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
