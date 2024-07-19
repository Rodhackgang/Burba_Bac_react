import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import correct FontAwesome5 package
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://burbaapi-production.up.railway.app/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const user = response.data.user;
          setUserName(user.name);

          if (user.isPremium) {
            setUserStatus('VIP (premium)');
          } else {
            setUserStatus('Pas d\'abonnement pour le moment');
          }
        } else {
          console.log('Aucun token trouvé dans AsyncStorage.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Home'); // Remplacez 'Home' par le nom de votre page d'authentification
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <FontAwesome5 name="user" size={80} color="black" style={styles.profileIcon} />
          <Text style={styles.profileTitle}>{userName}</Text>
          <Text style={styles.profileSubtitle}>
            {userStatus.includes('VIP') ? (
              <Text style={styles.vipStatus}>
                <FontAwesome5 name="circle" size={10} color="green" /> {userStatus}
              </Text>
            ) : (
              <Text style={styles.nonVipStatus}>
                <FontAwesome5 name="circle" size={10} color="red" /> {userStatus}
              </Text>
            )}
          </Text>
        </View>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('https://wa.me/22677701726')}>
          <FontAwesome5 name="whatsapp" size={24} color="#25D366" style={styles.icon} />
          <Text style={styles.sectionItem}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('https://t.me/Rodhackgang')}>
          <FontAwesome5 name="telegram" size={24} color="#0088cc" style={styles.icon} />
          <Text style={styles.sectionItem}>Telegram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('sms:+22677701726')}>
          <FontAwesome5 name="sms" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.sectionItem}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('tel:+22677701726')}>
          <FontAwesome5 name="phone" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.sectionItem}>Appel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('mailto:Samarodrigue690@gmail.com')}>
          <FontAwesome5 name="envelope" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.sectionItem}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('https://www.example.com/politique-de-confidentialite')}>
          <Text style={styles.sectionTitle}>Politique de confidentialité</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('https://www.example.com/conditions-dutilisation')}>
          <Text style={styles.sectionTitle}>Conditions d'utilisation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => handleLinkPress('https://www.example.com/a-propos')}>
          <Text style={styles.sectionTitle}>À propos de l'application</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={handleLogout}>
          <Text style={styles.sectionTitle}>Déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  vipStatus: {
    color: 'green',
  },
  nonVipStatus: {
    color: 'red',
  },
  section: {
    marginBottom: 20,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionItem: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
