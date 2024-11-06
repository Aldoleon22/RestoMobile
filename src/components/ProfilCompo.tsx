import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Profile } from '../Style/ProfileStyle';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './../AuthContext';
import { IMG_URL } from '../../apiConfig';

export default function ProfileScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);  // Get setUser to update the auth context
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setdata] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setdata(JSON.parse(userData));
          
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Remove user data and token
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('token');
      
      // Update context
      setUser(null); // Set the user to null to update the context and re-render

      // Reset navigation stack to go to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Ensure 'Login' is the name of your login screen
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={Profile.parent}>
      <LinearGradient
        colors={['#4CC9FE', '#B9E5E8', '#DFF2EB']}
        style={Profile.gradient}
      >
        <View style={Profile.container}>
          {/* Your user data */}
          {user ? (
            <View>
            <Text style={Profile.nom}>{user.nom}</Text>
            <Text style={Profile.prenom}>{user.prenom}</Text>
            </View>
          ) : (
            <Text style={Profile.nom}>Chargement...</Text> // Display loading if user data is not yet loaded
          )}
        </View>
        {user ? (
                  <View style={Profile.avatar}>
                  <Image source={{ uri: `${IMG_URL}/storage/${user.photo}` }}
                  style={Profile.img}/>
                </View>
        ):(
          <Text>Chargement...</Text>
        )}

        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout} style={Profile.logoutButtont}>
          <Text style={Profile.logoutText}>{isLoggingOut ? 'Déconnexion en cours...' : 'Déconnexion'}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
