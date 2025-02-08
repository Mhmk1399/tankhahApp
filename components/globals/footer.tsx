import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FooterProps {
  onAddPress?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddPress }) => {
  const router = useRouter();
  const scaleAnimation = new Animated.Value(1);
  const [isWalletModalVisible, setWalletModalVisible] = useState(false);
  const [walletData, setWalletData] = useState({
    walletBalance: 0,
    totalIncomes: 0,
    totalOutcomes: 0,
  });

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
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");

      router.replace("/LoginScreen");

      console.log("Logged out successfully!");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };
  const fetchWalletData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }
    const tokenData = JSON.parse(token);
    const actualToken = tokenData.token;
    try {
      const response = await fetch("https://tankhah.vercel.app/api/walet", {
        headers: {
          Authorization: `Bearer ${actualToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWalletData(data);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const handleWalletPress = async () => {
    await fetchWalletData();
    setWalletModalVisible(true);
  };

  const WalletModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isWalletModalVisible}
      onRequestClose={() => setWalletModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>اطلاعات کیف پول</Text>

          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>موجودی فعلی:</Text>
            <Text style={styles.walletValue}>
              {walletData.walletBalance.toLocaleString("fa-IR")} تومان
            </Text>
          </View>

          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>کل دریافتی‌ها:</Text>
            <Text style={styles.walletValue}>
              {walletData.totalIncomes.toLocaleString("fa-IR")} تومان
            </Text>
          </View>

          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>کل پرداختی‌ها:</Text>
            <Text style={styles.walletValue}>
              {walletData.totalOutcomes.toLocaleString("fa-IR")} تومان
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setWalletModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>بستن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleWalletPress}>
        <Animated.View style={styles.iconContainer}>
          <Ionicons name="wallet" size={24} color="#4361ee" />
          <Text style={styles.iconText}>کیف پول</Text>
        </Animated.View>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
        <Animated.View style={styles.iconContainer}>
          <Ionicons name="exit" size={24} color="#4361ee" />
          <Text style={styles.iconText}>خروج</Text>
        </Animated.View>
      </TouchableOpacity>

      <WalletModal />
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
    marginTop: -40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 24,
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  walletLabel: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  walletValue: {
    fontSize: 18,
    color: "#334155",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#4361ee",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Footer;
