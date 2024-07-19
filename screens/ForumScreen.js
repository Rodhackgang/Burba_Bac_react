import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ForumScreen = ({ navigation }) => {
  const connexion = () => {
    navigation.navigate('Connexion');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur le Forum</Text>
      <Text style={styles.description}>
        Connectez-vous pour accéder à plus d'épreuves et de fonctionnalités, y compris les discussions entre candidats.
      </Text>
      <TouchableOpacity 
        onPress={connexion}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Se Connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForumScreen;
