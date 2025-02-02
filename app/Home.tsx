import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import  AddRequest  from '../components/globals/AddRequest';
import ManageRequests from '../components/globals/ManageRequests';
import TransactionList from "@/components/globals/TransactionList";
import TransactionsPage from "@/components/globals/TransactionPage";
import OnboardingSlider from "@/components/globals/OnboardingSlider";
const SCREEN_WIDTH = Dimensions.get("window").width;

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const slideAnim = new Animated.Value(SCREEN_WIDTH);

  const menuItems = [
    {
      id: "request",
      title: "درخواست شارژ تنخواه",
      icon: "wallet-outline",
    },
    {
      id: "transactionOut",
      title: "لیست پرداختی ها",
      icon: "list-outline",
    },

    {
      id: "payment",
      title: "ثبت پرداخت",
      icon: "card-outline",
    },
    {
      id: "manageRequests",
      title: "مدیریت درخواست ها",
      icon: "settings-outline",
    },
    {
      id: "help",
      title: "Help",
      icon: "help-circle-outline",
    },
  ];

  const toggleSidebar = (open: boolean) => {
    Animated.spring(slideAnim, {
      toValue: open ? 0 : SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
    setIsOpen(open);
  };

  const handleMenuClick = (id: string) => {
    setActiveComponent(id);
    toggleSidebar(false);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      
      case "transactionOut":
        return <TransactionList />;
      case "payment":
        return <TransactionsPage />;
      case "request":
        return <AddRequest />;
      case "manageRequests":
        return <ManageRequests />;
      default:
        return <OnboardingSlider onComplete={() => setActiveComponent(null)} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderComponent()}

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => toggleSidebar(true)}
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>دشبورد مدیریت</Text>
          <TouchableOpacity onPress={() => toggleSidebar(false)}>
            <Ionicons name="close" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuClick(item.id)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={Colors.light.text}
              />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4361ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarHeader: {
    direction: "rtl",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 20,
    marginBottom: 20,
  },
  sidebarTitle: {
    padding: 10,
    direction: "rtl",
    fontSize: 20,
    fontWeight: "bold",
    color: "#4361ee",
  },
  menuContainer: {
    direction: "rtl",
    flex: 1,
    gap: 10,
    padding: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
    gap: 5,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default Home;
