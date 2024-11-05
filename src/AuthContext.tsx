// src/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création du contexte d'authentification
export const AuthContext = createContext();

// Fournisseur d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur

  // Charger les données de l'utilisateur depuis AsyncStorage au démarrage de l'application
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData)); // Définir l'utilisateur si les données existent
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'utilisateur:", error);
      }
    };

    loadUserData();
  }, []);

  // Fonction pour déconnecter l'utilisateur
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData'); // Supprimer les données de l'utilisateur de AsyncStorage
      setUser(null); // Réinitialiser l'état de l'utilisateur
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
