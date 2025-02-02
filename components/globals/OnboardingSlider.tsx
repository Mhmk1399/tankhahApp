import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OnboardingSliderProps {
  onComplete: () => void;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  const slides = [
    require('../../assets/111.jpg'),
    require('../../assets/112.jpg'),
    require('../../assets/113.jpg'),
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={slides[currentIndex]}
        style={styles.image}
      />
      
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
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={onComplete}
          >
            <Ionicons 
              name="settings" 
              size={32} 
              color="#fff"
              style={styles.glowingIcon}
            />
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
    height: '100%',
    resizeMode: 'cover',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 20,
  },
  glowingIcon: {
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
});

export default OnboardingSlider;
