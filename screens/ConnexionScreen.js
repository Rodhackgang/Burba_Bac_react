import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import eyes from '../jsonfile/eyes.json';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnexionScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            showErrorMessage('Veuillez remplir tous les champs.');
            return;
        }
    
        const userData = { email, password };
    
        axios.post('https://burbaapi-production.up.railway.app/api/login', userData)
            .then(async (response) => {
                console.log('Login successful:', response.data);
                
                if (response.data.message === "invalid credentials" && response.data.success === false) {
                    showErrorMessage('Mot de passe invalide.');
                } else if (response.data.message === "user not found" && response.data.success === false) {
                    showErrorMessage('Utilisateur non trouvé.');
                } else {
                    // Save token to local storage
                    await AsyncStorage.setItem('token', response.data.token);
                    
                    // Save connexion status to local storage
                    await AsyncStorage.setItem('connexion', 'oui');
                    
                    // Check if the user is premium
                    if (response.data.data.isPremium) {
                        navigation.navigate('Chat');
                    } else {
                        navigation.navigate('Paiement');
                    }
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                showErrorMessage('Une erreur est survenue lors de la connexion.');
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
                    <Text style={styles.title}>Connexion</Text>
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
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>
                    <Text onPress={() => navigation.navigate('Inscription')} style={styles.connectText}>
                        Pas de compte ? S'inscrire
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

export default ConnexionScreen;
