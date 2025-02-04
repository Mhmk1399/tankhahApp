import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface FooterProps {
  onAddPress?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddPress }) => {
  const router = useRouter();
  const scaleAnimation = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnimation, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  const renderIcon = (
    name: keyof typeof Ionicons.glyphMap,
    label: string,
    _route: string
  ) => (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => {
        animatePress();
        router.push("/");
      }}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: scaleAnimation }] },
        ]}
      >
        <Ionicons name={name} size={24} color="#4361ee" />
        <Text style={styles.iconText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderIcon("home", "خانه", "/")}
      {renderIcon("document-text", "فاکتورها", "")}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          animatePress();
          if (onAddPress) {
            onAddPress();
          }
        }}
      >
        <Animated.View
          style={[
            styles.addButtonInner,
            { transform: [{ scale: scaleAnimation }] },
          ]}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </Animated.View>
      </TouchableOpacity>

      {renderIcon("wallet", "کیف پول", "")}
      {renderIcon("people", "گروه‌ها", "")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    flex: 1.2,
    alignItems: "center",
  },
  addButtonInner: {
    backgroundColor: "#4361ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    color: "#4361ee",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "500",
  },
});

export default Footer;
