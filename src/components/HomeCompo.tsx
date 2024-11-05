import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import ApiService from './../../axiosConfig';

export default function HomeScreen({ navigation }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a ref to store scrollable FlatLists
  const scrollRefs = useRef({});

  useEffect(() => {
    ApiService.get(`/listemenu`)
      .then(response => {
        console.log(response.data); // Log the response to check its structure
        setMenu(response.data.liste);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des menus :", error);
        setLoading(false);
      });
  }, []);

  // Function to filter menu items by category
  const filterMenuByCategory = (categorie) => {
    return menu.filter(item => item.categorie === categorie);
  };

  // Function to automatically scroll the FlatList
  const scrollAutomatically = (category, direction = 1) => {
    const scrollViewRef = scrollRefs.current[category];
    if (scrollViewRef) {
      let offset = 0;
      const scrollAmount = 1; // Adjust this value for scroll speed
      const interval = setInterval(() => {
        offset += direction * scrollAmount; // Adjust offset based on direction

        scrollViewRef.scrollToOffset({ offset, animated: true });

        // Stop scrolling if it goes out of bounds
        if (offset < 0 || offset > (scrollViewRef.props.data.length * 140) - 140) { // 140 is the width of the card
          clearInterval(interval);
        }
      }, 100); // Adjust the timing as needed
    }
  };

  // Start scrolling when the menu is loaded
  useEffect(() => {
    if (!loading) {
      scrollAutomatically('plats', 1); // Scroll right
      scrollAutomatically('snack', -1); // Scroll left (opposite direction)
      scrollAutomatically('bar', 1); // Scroll right
    }
  }, [loading]);

  if (loading) {
    return <Text>Loading...</Text>; // Display a loading message
  }

  return (
    <ScrollView style={styles.container}>
      {/* Section Plats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plats</Text>
        <FlatList
          ref={(ref) => { scrollRefs.current.plats = ref; }}
          data={filterMenuByCategory('plats')}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.popularCard}>
              <Image source={{ uri: `http://192.168.88.11:8000/storage/photo/${item.photo}` }} style={styles.popularImage} />
              <Text style={styles.popularText}>{item.nom}</Text>
              <Text style={styles.priceText}>{item.prix} Ar</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Section Snacks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Snacks</Text>
        <FlatList
          ref={(ref) => { scrollRefs.current.snack = ref; }}
          data={filterMenuByCategory('snack')}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.popularCard}>
              <Image source={{ uri: `http://192.168.88.16:8000/storage/photo/${item.photo}` }} style={styles.popularImage} />
              <Text style={styles.popularText}>{item.nom}</Text>
              <Text style={styles.priceText}>{item.prix} Ar</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Section Boissons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Boissons</Text>
        <FlatList
          ref={(ref) => { scrollRefs.current.bar = ref; }}
          data={filterMenuByCategory('bar')}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.popularCard}>
              <Image source={{ uri: `http://192.168.88.16:8000/storage/photo/${item.photo}` }} style={styles.popularImage} />
              <Text style={styles.popularText}>{item.nom}</Text>
              <Text style={styles.priceText}>{item.prix} Ar</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  popularCard: {
    width: 140,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  popularImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  popularText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  priceText: {
    fontSize: 14,
    color: '#FF6347',
  },
});
