import React, { useEffect, useState } from 'react';
import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import {Profile} from '../Style/ProfileStyle';
import LinearGradient from 'react-native-linear-gradient';
import user from './../../assets/user.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMG_URL } from '../../apiConfig';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({navigation}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <Text>Chargement des données...</Text>;
  }

// deconnection
const handleLogout = async () => {
  try {
    const response = await AsyncStorage.removeItem('userData');
    console.log('====================================');
    console.log(response);
    console.log('====================================');

    // navigation.navigate('Login'); // Remplace 'Login' par le nom de l'écran de connexion
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

  return (
   
    <View style={Profile.parent}>
      <LinearGradient
        colors={['#4CC9FE', '#B9E5E8', '#DFF2EB']} // Couleurs du dégradé
        style={Profile.gradient} // Style du dégradé
      >
        <View style={Profile.container}>
          <Text style={Profile.nom}>{user.nom}</Text>
          <Text style={Profile.prenom}>{user.prenom}</Text>
        </View>
        <View style={Profile.avatar}>
          <Image source={{ uri: `${IMG_URL}/storage/${user.photo}` }}
          style={Profile.img}/>
        </View>
        <Text style={Profile.role}>{user.Role}</Text>
        <TouchableOpacity onPress={handleLogout} style={Profile.logoutButtont}>
      <Text style={Profile.logoutText}>Déconnexion</Text>
    </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
