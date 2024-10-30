import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { ToastAndroid } from 'react-native';
// Assurez-vous que le chemin est correct
import axios from 'axios';
const Table = () => {
    const [activeBlock, setActiveBlock] = useState(false);
    const [tables, setTables] = useState([]);
    const [data, setData] = useState({
        num_tables: '',
        places: '',
        type: 'Ronde', // Valeur par défaut
    });
    const [errors, setErrors] = useState({});

    // Récupération des tables
    const showTables = async () => {
        try {
            const response = await axios.get('http://192.168.88.12:8000/api/tables');
            setTables(response.data);
        } catch (error) {
            console.log("Erreur lors de la récupération des tables:", error);
        }
    };

    useEffect(() => {
        showTables();
    }, []);

    // Ajout d'une nouvelle table
    const handleSubmit = async () => {
        try {
            const response = await ApiService.post('/tables/add', data);
            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
            setTables(prevTables => [...prevTables, response.data.data]);
            setData({ num_tables: '', places: '', type: 'Ronde' });
            setActiveBlock(false);
            setErrors({});
        } catch (error) {
            console.error("Erreur lors de l'ajout de la table:", error);
            if (error.response && error.response.status === 400) {
                const validationErrors = error.response.data.errors || error.response.data;
                setErrors(validationErrors);
                ToastAndroid.show("Erreur de validation. Vérifiez les champs.", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Une erreur est survenue. Veuillez réessayer.", ToastAndroid.SHORT);
            }
        }
    };

    // Suppression d'une table
    const deleteTable = async (id) => {
        try {
            await axios.delete('http://192.168.88.12:8000/api/tables/delete/id');
            setTables(tables.filter(item => item.id !== id));
            ToastAndroid.show("Suppression réussie", ToastAndroid.SHORT);
        } catch (error) {
            console.error("Erreur lors de la suppression de la table:", error);
            ToastAndroid.show("Erreur lors de la suppression", ToastAndroid.SHORT);
        }
    };

    const renderTableItem = ({ item }) => (
        <View style={styles.tableItem}>
            <Text style={styles.tableTitle}>Table {item.num_tables}</Text>
            <Text>Places: {item.places}</Text>
            <Text>Type: {item.type}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Supprimer" color="#FF3D00" onPress={() => deleteTable(item.id)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Dashboard / Tables</Text>
            </View>

            <Button title="Ajouter une table" onPress={() => setActiveBlock(true)} />

            <FlatList
                data={tables}
                renderItem={renderTableItem}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
            />

            <Modal visible={activeBlock} animationType="slide">
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Ajouter une nouvelle table</Text>
                    <TextInput
                        placeholder="Numéro de la table"
                        keyboardType="numeric"
                        value={data.num_tables}
                        onChangeText={(text) => setData({ ...data, num_tables: text })}
                        style={styles.input}
                    />
                    {errors.num_tables && <Text style={styles.error}>{errors.num_tables[0]}</Text>}
                    <TextInput
                        placeholder="Nombre de personnes"
                        keyboardType="numeric"
                        value={data.places}
                        onChangeText={(text) => setData({ ...data, places: text })}
                        style={styles.input}
                    />
                    {errors.places && <Text style={styles.error}>{errors.places[0]}</Text>}
                    <TextInput
                        placeholder="Type de table (Ronde/Rectangle)"
                        value={data.type}
                        onChangeText={(text) => setData({ ...data, type: text })}
                        style={styles.input}
                    />
                    {errors.type && <Text style={styles.error}>{errors.type[0]}</Text>}
                    <View style={styles.buttonContainer}>
                        <Button title="Ajouter" onPress={handleSubmit} />
                        <Button title="Annuler" onPress={() => setActiveBlock(false)} color="#FF3D00" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    list: {
        marginBottom: 20,
    },
    tableItem: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    tableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalContent: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
});

export default Table;
