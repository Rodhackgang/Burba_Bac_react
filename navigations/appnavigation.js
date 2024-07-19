import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native"; // Ajout de StatusBar
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import ConnexionScreen from "../screens/ConnexionScreen";
import InscriptionScreen from "../screens/InscriptionScreen";
import Chatscreen from "../screens/Chatscreen";
import PaymentScreen from "../screens/PaymentScreen";
import { getItem } from "../utils/asyncStorage";
import PdfViewer from "../screens/PdfViewer";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [showOnboarding, setshowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded == 1) {
      setshowOnboarding(false);
    } else {
      setshowOnboarding(true);
    }
  };

  if (showOnboarding == null) {
    return null;
  }

  // Couleur de la StatusBar en fonction du statut de l'onboarding
  const statusBarColor = showOnboarding ? "#FFCE00" : "#FFCE00";

  return (
    <NavigationContainer>
      {/* Définition de la couleur de la StatusBar */}
      <StatusBar backgroundColor={statusBarColor} barStyle="dark-content" />
      <Stack.Navigator initialRouteName={showOnboarding ? "Onboarding" : "Home"}>
        <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name="PdfViewer" options={{ headerShown: false }} component={PdfViewer} />
        <Stack.Screen name="Connexion" options={{ headerShown: false }} component={ConnexionScreen} />
        <Stack.Screen name="Inscription" options={{ headerShown: false }} component={InscriptionScreen} />
        <Stack.Screen name="Paiement" options={{ headerShown: false }} component={PaymentScreen} />
        <Stack.Screen name="Chat" options={{ headerShown: false }} component={Chatscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
