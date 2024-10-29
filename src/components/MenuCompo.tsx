import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image } from 'react-native';

const sampleMenu = [
  { id: '1', name: 'Pizza Margherita', price: 8.99, image: 'https://media.istockphoto.com/id/1442417585/fr/photo/personne-recevant-un-morceau-de-pizza-au-pepperoni-au-fromage.jpg?s=612x612&w=0&k=20&c=xNz2rodZQQARx16BlXTkht9E19aw4ziOMm6UOjW5DKM=' },
  { id: '2', name: 'Pâtes Carbonara', price: 10.99, image: 'https://static.750g.com/images/1200-675/f6ad72f2ac5f330143bd9bc27566dee6/comment-realiser-des-pates-carbonara-comme-en-italie.jpg' },
  { id: '3', name: 'Salade César', price: 7.99, image: 'https://www.galbani.fr/wp-content/uploads/2020/04/AdobeStock_157570276-2.jpeg' },
  { id: '4', name: 'Pizza Margherita', price: 8.99, image: 'https://media.istockphoto.com/id/1442417585/fr/photo/personne-recevant-un-morceau-de-pizza-au-pepperoni-au-fromage.jpg?s=612x612&w=0&k=20&c=xNz2rodZQQARx16BlXTkht9E19aw4ziOMm6UOjW5DKM=' },
  { id: '5', name: 'Pâtes Carbonara', price: 10.99, image: 'https://static.750g.com/images/1200-675/f6ad72f2ac5f330143bd9bc27566dee6/comment-realiser-des-pates-carbonara-comme-en-italie.jpg' },
  { id: '6', name: 'Salade César', price: 7.99, image: 'https://www.galbani.fr/wp-content/uploads/2020/04/AdobeStock_157570276-2.jpeg' },
];

export default function MenuScreen({ navigation }) {
  const [cart, setCart] = useState([]);

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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
        <Button title="Ajouter au Panier" onPress={() => addToCart(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notre Menu</Text>
      <FlatList
        data={sampleMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2} // Affichez 2 éléments par ligne
        key={Math.random()} // Force un nouveau rendu
      />
      <Button title="Voir le Panier" onPress={() => navigation.navigate('Cart', { cart })} />
    </View>
  );
}

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
    flex: 1,
    flexDirection: 'column', // Changer en colonne
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  image: {
    width: 100, // Taille de l'image
    height: 100, // Taille de l'image
    borderRadius: 8,
    marginBottom: 10, // Espacement entre l'image et le texte
  },
  textContainer: {
    alignItems: 'center', // Centrer le texte
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold', // Ajouter du gras au nom du plat
  },
  priceText: {
    fontSize: 14,
    color: '#666', // Couleur pour le prix
  },
});
