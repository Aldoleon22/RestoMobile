import React from 'react';
import {View, Text, Button, Image} from 'react-native';
import {Profile} from '../Style/ProfileStyle';
import LinearGradient from 'react-native-linear-gradient';
import user from './../../assets/user.jpg';
export default function ProfileScreen({navigation}) {
  return (
    // <View style={{ padding: 20 }}>
    //   <Text>Profil utilisateur</Text>
    //   {/* <Button title="Se déconnecter" onPress={() => navigation.navigate('Login')} /> */}
    // </View>
    <View style={Profile.parent}>
      <LinearGradient
        colors={['#4CC9FE', '#B9E5E8', '#DFF2EB']} // Couleurs du dégradé
        style={Profile.gradient} // Style du dégradé
      >
        <View style={Profile.container}>
          <Text style={Profile.nom}>Ratsimiseta</Text>
          <Text style={Profile.prenom}>Bolo</Text>
        </View>
        <View style={Profile.avatar}>
          <Image source={require('./../../assets/user1.jpg')}
          style={Profile.img}/>
        </View>
      </LinearGradient>
    </View>
  );
}
