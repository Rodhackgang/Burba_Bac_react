import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = () => {
    const navigation = useNavigation();
    const [paymentNumber, setPaymentNumber] = useState('');
    const [validationStarted, setValidationStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // Adjusted time for testing purposes
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (validationStarted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [validationStarted, timeLeft]);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                axios.get('http://192.168.1.70:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    }
                })
                .then((response) => {
                    if (response.data.user.isPremium) {
                        navigation.navigate('Chat');
                    } else {
                        console.log('L\'utilisateur n\'a pas d\'abonnement VIP');
                    }
                })
                .catch((error) => {
                    console.error('Erreur lors de la requête :', error);
                });
            } else {
                console.log('Aucun token trouvé dans AsyncStorage.');
            }
        };

        const intervalId = setInterval(checkPremiumStatus, 1000); // Check every 2 minutes

        return () => clearInterval(intervalId); // Clear the interval on component unmount
    }, [navigation]);

    const handlePaymentNumberChange = (text) => {
        setPaymentNumber(text);
    };

    const handleValidation = async () => {
        if (paymentNumber.trim() === '' || paymentNumber.length < 8) {
            Alert.alert('Erreur', 'Veuillez entrer un numéro valide (8 chiffres).');
            return;
        }

        const storedToken = await AsyncStorage.getItem('token');
        const formData = { numero: paymentNumber };

        setIsLoading(true);
        axios.post('http://192.168.1.70:5000/api/demandeVip', formData, {
            headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            setIsLoading(false);
            if (response.data.success) {
                Alert.alert("Succès", "Demande envoyée avec succès. La vérification prend 2H");
                setValidationStarted(true); // Start the timer after successful validation request
            } else {
                Alert.alert("Erreur", "Une erreur est survenue. Merci de réessayer.");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.error('Erreur lors de la requête :', error);
            Alert.alert("Erreur", "Erreur lors de la requête. Merci de réessayer.");
        });
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Devenir Premium</Text>
                    <Text style={styles.title}>sur Burba</Text>
                </View>
                <Text style={styles.subtitle}>Pour débloquer les avantages premium, effectuez un paiement de 2000F sur ce numéro:</Text>
                <Animatable.View animation="fadeInLeft" delay={500}>
                    <Text style={styles.paymentInfo}>Numéro: <Text style={styles.bold}>77 70 17 26</Text></Text>
                </Animatable.View>
                <Animatable.View animation="fadeInRight" delay={700}>
                    <Text style={styles.paymentInfo}>Nom: <Text style={styles.bold}>Nom de la personne</Text></Text>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" delay={900}>
                    <Text style={styles.advantagesTitle}>Avantages:</Text>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" delay={1100}>
                    <Text style={styles.advantagesItem}>• Déblocage du forum pour échanger, partager des documents et des images</Text>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" delay={1300}>
                    <Text style={styles.advantagesItem}>• Discussion avec l'intelligence artificielle pour des recherches approfondies</Text>
                </Animatable.View>
                <Text style={styles.instructions}>Après avoir fait le paiement, veuillez renseigner le numéro utilisé pour le paiement:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez le numéro de paiement"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    value={paymentNumber}
                    onChangeText={handlePaymentNumberChange}
                />
                <TouchableOpacity style={styles.button} onPress={handleValidation}>
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
                {isLoading && <ActivityIndicator size="large" color="#1E90FF" style={styles.loading} />}
                {validationStarted && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Validation en cours, veuillez patienter...</Text>
                        <Text style={styles.progressText}>Temps restant: {formatTime(timeLeft)}</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#666',
    },
    paymentInfo: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
    },
    advantagesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    advantagesItem: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 5,
        color: '#666',
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loading: {
        marginTop: 20,
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        color: '#333',
    },
});

export default PaymentScreen;
