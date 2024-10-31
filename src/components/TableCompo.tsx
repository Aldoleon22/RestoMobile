import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

const TableCompo = ({navigation}) => {

    const [Tables, SetTable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const Stack = createStackNavigator();
    const handlegetTable = (async () => {
        try {
            const response = await axios.get('http://192.168.88.18:8000/api/tables');
            SetTable(response.data);
        }
        catch (error) {
            console.log('error lors de chargement');
            setError('Impossible de charger les tables');
        }
        finally{
            setLoading(false);
        }
    });

    useEffect(() => {
        handlegetTable();
    }, []);

    const handlecommande = ((id) =>{
        navigation.navigate('Menu',{id});
    })
    return (
        <View style={styles.fluidContent}>

        {loading ? (
                <ActivityIndicator size="large" color="#1096FF" style={{alignItems:'center', justifyContent: 'center'}}/>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
            <ScrollView>
                {Tables.map((tables) => (
                    <View style={styles.tablecontent} key={tables.id}>
                        <View style={styles.tableHead}>
                            <Text>
                                <Icon name="table-restaurant" size={60} color={'grey'} />
                            </Text>
                            <Text style={styles.numero}>
                                {tables.num_tables}
                            </Text>
                        </View>
                        <View style={styles.description}>
                            <View style={styles.textestyle}><Icon name="double-arrow" size={25} style={styles.icons} /> <Text style={{ marginTop: 5, }}> Table de type {tables.type}</Text></View>
                            <View style={styles.textestyle}><Icon name="double-arrow" size={25} style={styles.icons} /> <Text
                                style={{ marginTop: 5, }}> Table a {tables.places} personnes</Text></View>
                        </View>
                        <View style={styles.btnaction}>
                            <Button title='Passer au commande' onPress={() => handlecommande(tables.id)}/>
                            <Text><Icon name="shopping-cart" size={45} color={'green'} /></Text>
                        </View>
                    </View>
                ))
                }
            </ScrollView>
            )
        }    
        </View>
    )
}

const styles = StyleSheet.create({
    fluidContent: {
        marginBottom: 50,
    },
    content: {
        padding: 20,
    },
    tableHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    tablecontent: {
        padding: 15,
        borderColor: 'rgba(16,150,255,1)',
        borderWidth: 2,
        margin: 15,
        borderRadius: 10,
    },
    description: {
        marginTop: 30,
        marginBottom: 30,
    },
    textestyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    icons: {

    },
    numero: {
        fontSize: 20,
        fontWeight: 500,
        padding: 10,
        backgroundColor: 'rgba(16,150,255,1)',
        borderRadius: 10,
        color: 'white',
    },
    btnaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    }

})

export default TableCompo