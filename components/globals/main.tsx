import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationBox from "./notification";
import PersianDate from "./date";
import { FinanceDetailsModal } from "./FinanceDetailsModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FinanceBoxProps {
  title: string;
  amount: string;
  icon: "wallet" | "cash-multiple" | "chart-pie";
  color: string;
}
const FinanceBox: React.FC<FinanceBoxProps> = ({
  title,
  amount,
  icon,
  color,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [walletData, setWalletData] = useState({
    walletBalance: 0,
    totalIncomes: 0,
    totalOutcomes: 0,
  });

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();
    setModalVisible(true);
  };
  const fetchWalletData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

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

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.financeBox,
            {
              backgroundColor: color,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={30} color="#4361ee" />
          <View style={styles.textContainer}>
            <Text style={styles.boxTitle}>{title}</Text>
            <Text style={styles.amount}>{amount} تومان</Text>
          </View>
        </Animated.View>
      </Pressable>

      <FinanceDetailsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={title}
        amount={amount}
        icon={icon}
        color={color}
      />
    </>
  );
};

const MainPage = () => {
  const [walletData, setWalletData] = useState({
    walletBalance: 0,
    totalIncomes: 0,
    totalOutcomes: 0
  });

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error("Token not found");
      return;
    }
    const tokenData = JSON.parse(token);
    const actualToken = tokenData.token;
    try {
      const response = await fetch('https://tankhah.vercel.app/api/walet', {
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

  return (
    <>
      <PersianDate />
      <View style={styles.box}>
        <FinanceBox
          title="مانده وجه"
          amount={walletData.walletBalance.toLocaleString("fa-IR")}
          icon="wallet"
          color="#fff"
        />
        <FinanceBox
          title="خالص دریافت ماهانه"
          amount={walletData.totalIncomes.toLocaleString("fa-IR")}
          icon="cash-multiple"
          color="#fff"
        />
        <FinanceBox
          title="خالص پرداخت ماهانه"
          amount={walletData.totalOutcomes.toLocaleString("fa-IR")}
          icon="chart-pie"
          color="#fff"
        />
      </View>
      <NotificationBox />
    </>
  );
};
const styles = StyleSheet.create({
  box: {
    padding: 16,
    marginTop: 0,
    gap: 12,
    direction: "ltr",
  },
  financeBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#4361ee",
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
    alignItems: "flex-end",
  },
  boxTitle: {
    color: "#284b63",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amount: {
    color: "#adb5bd",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default MainPage;
