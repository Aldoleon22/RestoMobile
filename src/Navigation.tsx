import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeCompo';
import MenuScreen from './components/MenuCompo';
import CartScreen from './components/CartCompo';
import ProfileScreen from './components/ProfilCompo';
import TableScreen from './components/TableCompo';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFEB3B', // Couleur de fond de la barre de menu
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            paddingVertical: 10,
          },
          tabBarIconStyle: {
            marginBottom: 5,
          },
        }}
      >

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => (
              <Icon name="restaurant" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            title: 'Panier',
            tabBarIcon: ({ color }) => (
              <Icon name="shopping-cart" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => (
              <Icon name="person" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Table"
          component={TableScreen}
          options={{
            title: 'Table',
            tabBarIcon: ({ color }) => (
              <Icon name="table-restaurant" size={24} color={color} />
            ),
          }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
