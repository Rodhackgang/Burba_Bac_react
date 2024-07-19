import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for local storage
import axios from 'axios';

import MathScreen from '../screens/MathScreen';
import PCScreen from '../screens/PCScreen';
import SVTScreen from '../screens/SVTScreen';
import ForumScreen from '../screens/ForumScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Chatscreen from '../screens/Chatscreen';
import PaymentScreen from '../screens/PaymentScreen';

const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isPremium, setIsPremium] = React.useState(false); // New state to store premium status

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectionValue = await AsyncStorage.getItem('connexion');
        const premiumValue = await AsyncStorage.getItem('isPremium'); // Fetch premium status as well
        setIsConnected(connectionValue === 'oui');
        setIsPremium(premiumValue === 'true'); // Set premium based on stored value

        // Check token and update premium status
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          axios.get('https://burbaapi-production.up.railway.app/api/user', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            }
          })
          .then((response) => {
            const user = response.data.user;
            if (user.isPremium) {
              AsyncStorage.setItem('isPremium', 'true');
              setIsPremium(true);
            } else {
              AsyncStorage.setItem('isPremium', 'false');
              setIsPremium(false);
            }
          })
          .catch((error) => {
            console.error('Error fetching premium status:', error);
          });
        }
      } catch (error) {
        console.error('Error retrieving connection from AsyncStorage:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Mathématiques"
        component={MathScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="math-compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Physique Chimie"
        component={PCScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="atom" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Science de la Vie et de la Terre"
        component={SVTScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-heart-outline" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name={isConnected ? (isPremium ? 'Discussion' : 'Abonnement') : 'Forum'}
        component={isConnected ? (isPremium ? Chatscreen : PaymentScreen) : ForumScreen} // Conditionally render screens
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            isConnected ? (
              isPremium ? (
                <MaterialCommunityIcons name="chat-outline" size={24} color="black" />
              ) : (
                <MaterialCommunityIcons name="diamond-outline" size={24} color="black" /> // Diamond icon for subscription
              )
            ) : (
              <MaterialCommunityIcons name="forum-outline" size={24} color="black" />
            )
          ),
          headerShown: route.name !== 'Discussion', // Hide header only for "Discussion" screen
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
