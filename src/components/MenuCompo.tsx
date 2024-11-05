import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    Modal,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { TiMinusOutline, TiPlusOutline } from 'react-icons/ti'; // Replace with a compatible icon library
import ApiService from './../../axiosConfig';
import { useNavigation, useRoute } from '@react-navigation/native';


const Nouveaux = () => {
    const route = useRoute();
    const tableId = route.params?.tableId;
    const [commandeId, setCommandeId] = useState(null);
    const [selectRepas, setSelectRepas] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Tous');
    const [modalVisible, setModalVisible] = useState(false);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ApiService.get('/listemenu');
            const fetchedMenu = response.data.liste;
            setMenu(fetchedMenu);
            const uniqueCategories = ['Tous', ...new Set(fetchedMenu.map(item => item.categorie))];
            setCategories(uniqueCategories);
        } catch (error) {
            setError("Erreur lors de la récupération des données.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectReservation = (repas) => {
        const existingRepas = selectRepas.find(item => item.id === repas.id);
        if (existingRepas) {
            setSelectRepas(selectRepas.map(item =>
                item.id === repas.id ? { ...item, quantite: item.quantite + 1 } : item
            ));
        } else {
            setSelectRepas([...selectRepas, { ...repas, quantite: 1 }]);
        }
    };

    const handleRemoveRepas = (repas) => {
        setSelectRepas(prevSelected => prevSelected.filter(selected => selected.id !== repas.id));
    };

    const handleIncrementQuantite = (repas) => {
        setSelectRepas(selectRepas.map(item =>
            item.id === repas.id ? { ...item, quantite: item.quantite + 1 } : item
        ));
    };

    const handleDecrementQuantite = (repas) => {
        setSelectRepas(selectRepas.map(item =>
            item.id === repas.id && item.quantite > 1 ? { ...item, quantite: item.quantite - 1 } : item
        ));
    };

    const filterMenuByCategory = () => {
        if (activeCategory === 'Tous') return menu;
        return menu.filter(item => item.categorie === activeCategory);
    };
const handlePasserCommande = async () => {
    if (selectRepas.length === 0) {
        Alert.alert("Erreur", "Veuillez sélectionner au moins un repas avant de passer la commande.");
        return;
    }

    // Prepare the payload according to what your backend expects
    const itemsToSend = selectRepas.map(repas => ({
        menus_id: repas.id,   // Use the correct field name expected by your backend
        quantite: repas.quantite,
    }));

    try {
        const response = await ApiService.post(`/commande/add`, {
            items: itemsToSend,
            tableId: tableId,  // Include tableId if needed
        });

        if (response.data.success) {
            toast.success("Commande validée avec succès");
            navigation.navigate('Table');
        } else {
            Alert.alert("Erreur", response.data.message || "Une erreur s'est produite lors de la validation de la commande.");
        }
    } catch (error) {
        if (error.response) {
            console.error("Erreur lors de l'envoi de la commande :", error.response.data);
            Alert.alert("Erreur", error.response.data.message || "Une erreur s'est produite lors de l'envoi de la commande.");
        } else {
            console.error("Erreur lors de l'envoi de la commande :", error.message);
            Alert.alert("Erreur", "Une erreur s'est produite lors de l'envoi de la commande.");
        }
    }
};


    if (loading) return <Text>Chargement...</Text>;
    if (error) return <Text>{error}</Text>;
    if (!menu.length) return <Text>Aucune donnée disponible</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.categoryContainer}>
                {categories.map(category => (
                    <Button
                        key={category}
                        title={category}
                        onPress={() => setActiveCategory(category)}
                    />
                ))}
            </View>

            <ScrollView>
                <FlatList
                    data={filterMenuByCategory()}
                    renderItem={({ item }) => (
                        <View style={styles.menuItem}>
                            <Image source={{ uri:'http://192.168.88.11:8000/storage/${item.photo}' }} style={styles.image} />
                            <View style={styles.details}>
                                <Text style={styles.nom}>{item.nom}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.prix}>{item.prix} Ar</Text>
                                <Button title="Ajouter" onPress={() => handleSelectReservation(item)} />
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </ScrollView>

            {selectRepas.length > 0 && (
                <View style={styles.commande}>
                    <Text style={styles.commandeTitle}>Votre commande : {selectRepas.length} repas</Text>
                    <Text style={styles.commandeTotal}>
                        Prix total : {selectRepas.reduce((total, repas) => total + repas.prix * repas.quantite, 0)} Ar
                    </Text>
                    <Button title="Passer la commande" onPress={handlePasserCommande} />
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <Button title="Fermer" onPress={() => setModalVisible(false)} />
                    {/* Modal content goes here */}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    details: {
        flex: 1,
        paddingLeft: 10,
    },
    nom: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: 'grey',
    },
    prix: {
        fontSize: 16,
        color: 'green',
    },
    commande: {
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginTop: 10,
    },
    commandeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commandeTotal: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Nouveaux;