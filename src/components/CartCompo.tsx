import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartScreen = ({ route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [numTable, setNumTable] = useState(null);
  const [commandeId, setCommandeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cart, id } = route.params;
  const [Cartvalidate, setCartvalidate] = useState({
    id: commandeId,
    table_id: '',
    menus_id: [],
    quantite: []
  });

  useEffect(() => {
    if (cart) setCartItems(cart);
    if (id) setNumTable(id);
  }, [cart, id]);

  useEffect(() => {
    updateCartValidate();
  }, [cartItems, commandeId]);

  const updateCartValidate = useCallback(() => {
    const menuId = cartItems.map(item => item.id);
    const quantite = cartItems.map(item => item.quantity);
    setCartvalidate(prevCartvalidate => ({
      ...prevCartvalidate,
      id: commandeId,
      table_id: id,
      menus_id: menuId,
      quantite: quantite,
    }));
  }, [cartItems, id, commandeId]);

  const fetchlastCommande = useCallback(async (id) => {
    try {
      const response = await axios.get(`http://192.168.88.18:8000/api/commande/table/${id}/last`);
      const derniereCommande = response.data.commande;

      if (derniereCommande && derniereCommande.archived === 0) {
        const listCommande = await axios.get(`http://192.168.88.18:8000/api/commande/tables/${id}`);
        const commandeActif = listCommande.data.commandes.filter(item => item.archived != 1);

        setCartItems(
          commandeActif.flatMap(item =>
            item.menus.map(menu => ({
              nom: menu.nom,
              quantity: menu.pivot.quantite,
              photo: menu.photo,
              prix: menu.prix,
              id: menu.id
            }))
          )
        );

        if (commandeActif.length > 0) setCommandeId(commandeActif[0].id);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération de la commande :", error);
    }
    finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchlastCommande(id);
  }, [id, fetchlastCommande]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0).toFixed(2);

  const updateQuantity = (id, operation) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = operation === 'increase' ? item.quantity + 1 : Math.max(0, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `http://192.168.88.18:8000/storage/photo/${item.photo}` }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nom}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'decrease')}><Text style={styles.quantityText}>-</Text></TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'increase')}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>{(item.prix * item.quantity).toFixed(2)} Ar</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
    </View>
  );

  const handlecommande = async () => {
    try {
      if (commandeId) {
        await axios.put(`http://192.168.88.18:8000/api/commande/update`, Cartvalidate);
      } else {
        await axios.post(`http://192.168.88.18:8000/api/commande/add`, Cartvalidate);
      }
      setCartItems([]);
    } catch (error) {
      console.log("Erreur lors de la commande :", error.response);
    }
  };

  return (
    <>
    {  loading ? (
        <ActivityIndicator size="large" color="#1096FF" style={{alignItems:'center', justifyContent: 'center'}}/>
      ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.container}>
          <Text style={styles.header}>Table N° : {numTable}</Text>
          <Text style={styles.date}>Jeu, 6 Juin</Text>
          <Text style={styles.addOrder}>+ Ajouter à la commande</Text>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total :</Text>
            <Text style={styles.totalAmount}>{totalAmount} Ar</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handlecommande}>
            <Text style={styles.checkoutText}>Ajouter à la commande</Text>
          </TouchableOpacity>
        </View>
      )
    }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#555',
  },
  addOrder: {
    color: '#999',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 5,
  },
  deleteText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: 'rgba(10, 100, 255, 0.8)',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 2,
    alignItems: 'center',
    marginBottom: 50,


  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',

  },
});

export default CartScreen;
