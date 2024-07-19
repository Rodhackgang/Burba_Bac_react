import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import eyes from '../jsonfile/eyes.json';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InscriptionScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const animation = useRef(null);

    const errorOpacity = useRef(new Animated.Value(0)).current;
    const progressBarWidth = useRef(new Animated.Value(0)).current;

    const showErrorMessage = (message) => {
        setError(message);
        setShowError(true);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(errorOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(progressBarWidth, {
                    toValue: 300,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ]),
            Animated.delay(1000),
            Animated.parallel([
                Animated.timing(errorOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(progressBarWidth, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ]),
        ]).start(() => {
            setShowError(false);
            setError('');
        });
    };

    useEffect(() => {
        if (animation.current) {
            animation.current.pause();
        }
    }, []);

    const handleInputChange = (setter) => (text) => {
        setter(text);
    };

    const handleRegistration = () => {
        if (name.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            showErrorMessage('Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            showErrorMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        const userData = { name, email, password };

        axios.post('https://burbaapi-production.up.railway.app/api/register', userData)
    .then((response) => {
        console.log('Registration successful:', response.data);

        // Check if the registration response indicates user already exists
        if (response.data.message === "user already exists" && response.data.success === false) {
            showErrorMessage('L\'utilisateur existe déjà.');
            setTimeout(() => {
                navigation.navigate('Connexion');
            }, 3000); // Redirection after 1 second
        } else {
            // Save token to AsyncStorage
            AsyncStorage.setItem('userToken', response.data.token)
                .then(() => {
                    console.log('Token saved successfully');
                    
                    // Enregistrer la variable connexion dans AsyncStorage
                    AsyncStorage.setItem('connexion', 'oui')
                        .then(() => {
                            console.log('Connexion status saved successfully');
                            navigation.navigate('Paiement');
                        })
                        .catch((error) => {
                            console.error('Failed to save connexion status:', error);
                            showErrorMessage('Une erreur est survenue lors de l\'enregistrement du statut de connexion.');
                        });
                })
                .catch((error) => {
                    console.error('Failed to save token:', error);
                    showErrorMessage('Une erreur est survenue lors de l\'enregistrement du token.');
                });
        }
    })
    .catch((error) => {
        console.error('Registration error:', error);
        showErrorMessage('Une erreur est survenue lors de l\'inscription.');
    });

    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
        if (!passwordVisible) {
            playAnimation();
        } else {
            resetAndPauseAnimation();
        }
    };

    const playAnimation = () => {
        if (animation.current) {
            animation.current.play();
            setTimeout(() => {
                animation.current.pause();
            }, 3000);
        }
    };

    const resetAndPauseAnimation = () => {
        if (animation.current) {
            animation.current.reset();
            animation.current.pause();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {showError && (
                <Animated.View style={[styles.errorContainer, { opacity: errorOpacity }]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
                </Animated.View>
            )}
            <View style={styles.container}>
                <View style={styles.greenBackground}>
                    <LottieView
                        ref={animation}
                        source={eyes}
                        loop={false}
                        style={styles.lottieAnimation}
                    />
                </View>
                <View style={styles.whiteBackground}>
                    <Text style={styles.title}>Inscription</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre nom"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={handleInputChange(setName)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={handleInputChange(setEmail)}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Entrez votre mot de passe"
                            placeholderTextColor="#888"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={handleInputChange(setPassword)}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={24} color="#888" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmer votre mot de passe"
                            placeholderTextColor="#888"
                            secureTextEntry={!passwordVisible}
                            value={confirmPassword}
                            onChangeText={handleInputChange(setConfirmPassword)}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={24} color="#888" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>
                    <Text onPress={() => navigation.navigate('Connexion')} style={styles.connectText}>
                        Déjà un compte ? Se connecter
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    container: {
        flex: 1,
    },
    greenBackground: {
        flex: 1,
        backgroundColor: '#1E90FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteBackground: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
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
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 12,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    connectText: {
        marginBottom: 20,
        color: '#1E90FF',
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    errorText: {
        color: 'black',
        fontSize: 20,
        marginBottom: 10,
        marginTop: 30,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'red',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        width: '100%',
    },
});

export default InscriptionScreen;
