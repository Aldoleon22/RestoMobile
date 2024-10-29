import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Choisissez l’ensemble d’icônes que vous préférez

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenue sur notre application de restaurant!</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu')}>
          <Icon name="restaurant-menu" size={24} color="#333" style={styles.icon} />
          <Text style={styles.menuButtonText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-cart" size={24} color="#333" style={styles.icon} />
          <Text style={styles.menuButtonText}>Panier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
          <Icon name="person" size={24} color="#333" style={styles.icon} />
          <Text style={styles.menuButtonText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 40,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    right: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuButton: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 5, // espace entre l'icône et le texte
  },
  menuButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});
