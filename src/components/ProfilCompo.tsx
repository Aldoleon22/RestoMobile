import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Profil utilisateur</Text>
      <Button title="Se déconnecter" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
