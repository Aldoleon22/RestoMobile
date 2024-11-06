// src/Navigation.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeCompo';
import MenuScreen from './components/MenuCompo';
import CartScreen from './components/CartCompo';
import ProfileScreen from './components/ProfilCompo';
import Table from './components/TableCompo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Login from './Login';

const Tab = createBottomTabNavigator();

const Navigation = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFEB3B',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        paddingVertical: 10,
      },
      tabBarIconStyle: {
        marginBottom: 5,
      },
    }}>
    <Tab.Screen
      name="Table"
      component={Table}
      options={{
        title: 'Table',
        tabBarIcon: ({color, focused}) => (
          <View style={[styles.iconContainer, focused && styles.focused]}>
            <Icon name="table-restaurant" size={24} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: '',
        tabBarIcon: ({color, focused}) => (
          <View style={[styles.iconContainer, focused && styles.focused]}>
            <Icon name="home" size={24} color={focused ? '#000' : color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profil',
        headerShown: false,
        tabBarIcon: ({color, focused}) => (
          <View style={[styles.iconContainer, focused && styles.focused]}>
            <Icon name="person" size={24} color={color} />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  focused: {
    backgroundColor: '#FFF',
    borderWidth: 7,
    borderColor: '#FFEB3B',
    shadowColor: '#FFEB3B',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default Navigation;
