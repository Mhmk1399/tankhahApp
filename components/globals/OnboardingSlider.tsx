import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface OnboardingSliderProps {
  onComplete: () => void;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  onComplete,
}) => {
  const navigation = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const slides = [
    require("../../assets/images/test2.jpg"),
    require("../../assets/images/test3.jpg"),
    require("../../assets/images/test1.jpg"),
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);

    if (index === slides.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * width,
        animated: true,
      });
    }
  };
  const handleGetStarted = () => {
    onComplete();
    navigation.navigate("SignupScreen" as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <Image key={index} source={slide} style={styles.image} />
        ))}
      </ScrollView>

      {currentIndex < slides.length - 1 ? (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton]}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={24} color="#34A853" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.rightButton]}
            onPress={handleNext}
          >
            <Ionicons name="chevron-forward" size={24} color="#34A853" />
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Animated.View style={styles.buttonContent}>
              <Animated.Text style={styles.buttonText}>شروع کنید</Animated.Text>
              <View style={styles.iconContainer}>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: "100%",
    resizeMode: "cover",
  },
  navigationContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    transform: [{ translateY: -25 }],
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(5px)",
  },
  settingsButton: {
    padding: 20,
  },
  glowingIcon: {
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  getStartedButton: {
    backgroundColor: "rgba(37, 99, 235, 0.9)",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ffffff30",
    overflow: "hidden",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    padding: 8,
  },
});

export default OnboardingSlider;
