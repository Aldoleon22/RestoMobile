import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../axiosConfig';
import { IMG_URL } from '../../apiConfig';

export default function MenuScreen({ navigation,route }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const {id} = route.params;

  useEffect(() => {
    ApiService.get('/listemenu')
      .then(response => {
        setMenu(response.data.liste);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des menus :", error);
        setLoading(false);
      });
  }, []);


  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const filterMenu = () => {
    if (selectedCategory === 'all') return menu;
    return menu.filter(item => item.categorie === selectedCategory);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `${IMG_URL}/storage/photo/${item.photo}` }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.nom}</Text>
        <Text style={styles.priceText}>
          {item.prix} Ar
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setSelectedCategory('all')}>
          <Icon name="menu" size={30} color={selectedCategory === 'all' ? '#FFA500' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('plats')}>
          <Icon name="local-dining" size={30} color={selectedCategory === 'plats' ? '#FFA500' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('snack')}>
          <Icon name="fastfood" size={30} color={selectedCategory === 'snack' ? '#FFA500' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('bar')}>
          <Icon name="local-drink" size={30} color={selectedCategory === 'bar' ? '#FFA500' : '#000'} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filterMenu()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
        />
      )}
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart', { cart,id })}>
        <Text style={styles.cartButtonText}>Voir le Panier</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#fff',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 7,
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  cartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(10, 100, 255, 0.8)',
    borderRadius: 5,
    alignItems: 'center',
       marginBottom: 65
  },
  cartButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',

  },
});
