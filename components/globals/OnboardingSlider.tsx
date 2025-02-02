import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OnboardingSliderProps {
  onComplete: () => void;
}

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const slides = [
    require('../../assets/images/test2.jpg'),
    require('../../assets/images/test3.jpg'),
    require('../../assets/images/test1.jpg'),
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
        animated: true
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * width,
        animated: true
      });
    }
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
          <Image
            key={index}
            source={slide}
            style={styles.image}
          />
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
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    transform: [{ translateY: -25 }],
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
