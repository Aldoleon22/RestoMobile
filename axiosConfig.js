import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

const ApiService = axios.create({
    baseURL: API_URL, // Utilisation de l'URL de base définie
});

// Ajouter un interceptor pour inclure le jeton d'accès dans les en-têtes
ApiService.interceptors.request.use(
    async config => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
        }
        return config;
    },
    error => Promise.reject(error)
);

export default ApiService;
