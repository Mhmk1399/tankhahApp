import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import OnboardingSlider from "../components/globals/OnboardingSlider";
import SignupScreen from "./SignupScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.navigate("Home" as never);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showOnboarding ? (
        <OnboardingSlider onComplete={handleOnboardingComplete} />
      ) : (
        <SignupScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
