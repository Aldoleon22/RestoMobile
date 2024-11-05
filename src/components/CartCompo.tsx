import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import ApiService from './../../axiosConfig'; // Import your API service

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems(); // Fetch cart items on component mount
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await ApiService.get('/commande'); // Adjust the endpoint as needed
      setCartItems(response.data); // Assuming your API returns an array of items
    } catch (error) {
      console.error("Erreur lors de la récupération des articles du panier :", error);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const updateQuantity = async (id, operation) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = operation === 'increase' ? item.quantity + 1 : Math.max(0, item.quantity - 1);

    // Update local state
    setCartItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));

    // Update in the database
    try {
      await ApiService.put(`/commande/${id}`, { quantity: newQuantity }); // Adjust the endpoint
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error);
      Alert.alert("Erreur lors de la mise à jour de la quantité");
    }
  };

  const removeItem = async (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));

    try {
      await ApiService.delete(`/commande/${id}`); // Adjust the endpoint
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      Alert.alert("Erreur lors de la suppression de l'article");
    }
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Votre panier est vide");
      return;
    }

    try {
      const response = await ApiService.post('/orders', { items: cartItems });
      if (response.data.success) {
        Alert.alert("Commande réussie", response.data.message);
        setCartItems([]); // Clear cart after order
      } else {
        Alert.alert("Erreur", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
      Alert.alert("Erreur lors de l'envoi de la commande");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'decrease')}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'increase')}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} Ar</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Panier</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total :</Text>
        <Text style={styles.totalAmount}>{totalAmount} Ar</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={submitOrder}>
        <Text style={styles.checkoutText}>Payer</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
