import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Burger au Poulet', price: 7.00, quantity: 3, image: 'https://example.com/burger.png' },
    { id: '2', name: 'Salade d’Avocat', price: 5.22, quantity: 1, image: 'https://example.com/salad.png' },
    { id: '3', name: 'Soupe de Légumes', price: 3.32, quantity: 2, image: 'https://example.com/soup.png' },
    { id: '4', name: 'Glace', price: 2.58, quantity: 5, image: 'https://example.com/icecream.png' },
  ]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

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
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'decrease')}><Text style={styles.quantityText}>-</Text></TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 'increase')}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Panier</Text>
      <Text style={styles.date}>Jeu, 6 Juin</Text>
      <Text style={styles.addOrder}>+ Ajouter à la commande</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total :</Text>
        <Text style={styles.totalAmount}>${totalAmount}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Payer</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: '#FFEB3B',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 2,
    alignItems: 'center',
    marginBottom: 30

  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',

  },
});

export default CartScreen;
