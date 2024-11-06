import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ApiService from '../../axiosConfig';
import { IMG_URL } from '../../apiConfig';

const CartScreen = ({ route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [numTable, setNumTable] = useState(null);
  const [commandeId, setCommandeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cart, id } = route.params;
  const [Cartvalidate, setCartvalidate] = useState({
    id: commandeId ? commandeId : '',
    table_id: '',
    menus_id: [],
    quantite: []
  });
  /////////////////////////////////////////////////
  // console.log('valideCart', Cartvalidate); ////
  // recuperation des elements slectionnes //////
  //////////////////////////////////////////////
  useEffect(() => {
    if (Array.isArray(cart)) {
      setCartItems(prevItems => {
        const updatedItems = [...prevItems];
        
        cart.forEach(newItem => {
          const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
          
          if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            updatedItems.push(newItem);
          }
        });
        
        return updatedItems;
      });
    }
    if (id) setNumTable(id);
  }, [cart, id]);

  useEffect(() => {
    updateCartValidate();
  }, [cartItems]);

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

  ////////////////////////
  // end recuperation ///
  //////////////////////

  ////////////////////////////////////
  /// check commande non archived ///
  //////////////////////////////////

  const fetchlastCommande = useCallback(async (id) => {
    try {
      const response = await ApiService.get(`/commande/table/${id}/last`);
      const derniereCommande = response.data.commande;

      if (derniereCommande && derniereCommande.archived === 0) {
        const listCommande = await ApiService.get(`/commande/tables/${id}`);
        const commandeActif = listCommande.data.commandes.filter(item => item.archived != 1);

        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item => ({ ...item })); 
          commandeActif.flatMap(item =>
            item.menus.forEach(menu => {
              const existingItem = updatedItems.find(item => item.id === menu.id);
              
              if (existingItem) {
                existingItem.quantity += menu.pivot.quantite;
              } else {
                updatedItems.push({
                  nom: menu.nom,
                  quantity: menu.pivot.quantite,
                  photo: menu.photo,
                  prix: menu.prix,
                  id: menu.id
                });
              }
            })
          );
        
          return updatedItems;
        });
        
        if (commandeActif.length > 0) {
          setCommandeId(commandeActif[0].id);
        }else{
          setCommandeId(null);
        }
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

  ///////////////////////////////////
  //// end commande non archived ///
  /////////////////////////////////

  //////////////////////////////////////////
  // action liée au items selectionnées ///
  ////////////////////////////////////////

  const totalAmount = cartItems.reduce((sum, item) => sum + item.prix * item.quantity, 0).toFixed(2);

  const updateQuantity = async (id, operation) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = operation === 'increase' ? item.quantity + 1 : Math.max(0, item.quantity - 1);

    // Update local state
    setCartItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));

    // Update in the database
    // try {
    //   await ApiService.put(`/commande/${id}`, { quantity: newQuantity }); // Adjust the endpoint
    // } catch (error) {
    //   console.error("Erreur lors de la mise à jour de la quantité :", error);
    //   Alert.alert("Erreur lors de la mise à jour de la quantité");
    // }
  };

  const removeItem = async (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    // try {
    //   await ApiService.delete(`/commande/${id}`);
    // } catch (error) {
    //   console.error("Erreur lors de la suppression de l'article :", error);
    //   Alert.alert("Erreur lors de la suppression de l'article");
    // }
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

  /////////////////////////////////////////////
  // ends action des items selectionnées//////
  ///////////////////////////////////////////

  /////////////////////////////////////////
  /// affichage des items selectionnées///
  ///////////////////////////////////////

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `${IMG_URL}/storage/photo/${item.photo}` }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nom}</Text>
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
      <Text style={styles.itemPrice}>{(item.prix * item.quantity).toFixed(2)} Ar</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
    </View>
  );

  //////////////////////////////////////////////
  // end affichage des items sellectionnées////
  ////////////////////////////////////////////

  ///////////////////////////////////////
  // ajout des nouvelles commandes /////
  ///////////////////////////////////// 

  const handlecommande = async () => {
    try {
      if (commandeId) {
        await ApiService.put(`/commande/update`, Cartvalidate);
      } else {
        await ApiService.post(`/commande/add`, Cartvalidate);
      }
      setCartItems([]);
    } catch (error) {
      console.log("Erreur lors de la commande :", error.response);
    }
  };
  /////////////////////////////////////
  /// end ajout nouvelles commandes///
  ///////////////////////////////////

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
    color: 'white',

  },
});

export default CartScreen;
