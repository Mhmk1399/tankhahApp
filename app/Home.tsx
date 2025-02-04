import React, { useRef, useState } from "react";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AddRequest from "../components/globals/AddRequest";
import ManageRequests from "../components/globals/ManageRequests";
import TransactionList from "@/components/globals/TransactionList";
import TransactionsPage from "@/components/globals/TransactionPage";
import Footer from "@/components/globals/footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainPage from "@/components/globals/main";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Home = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const menuItems = [
    {
      id: "main",
      title: "صفحه اصلی",
      icon: "home-outline",
    },
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
    // {
    //   id: "help",
    //   title: "Help",
    //   icon: "help-circle-outline",
    // },
    {
      id: "logout",
      title: "خروج",
      icon: "exit-outline",
    },
  ];
  const handleAddPress = () => {
    setActiveComponent("payment");
  };

  const toggleSidebar = (open: boolean) => {
    setIsOpen(open);
    Animated.spring(slideAnim, {
      toValue: open ? 0 : -SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");

      router.replace("/LoginScreen");

      console.log("Logged out successfully!");
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const handleMenuClick = (id: string) => {
    if (id === "logout") {
      handleLogout();
      return;
    }
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
        return <MainPage />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text className="" style={styles.headerTitle}>
          تنخواه
        </Text>
      </View>

      {renderComponent()}

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => toggleSidebar(!isOpen)}
      >
        <Ionicons name="person-circle-outline" size={40} color="#4361ee" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.notificationsButton}>
        <MaterialIcons name="notifications" size={40} color="#4361ee" />
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
            <Ionicons
              name="close"
              size={30}
              style={{ position: "absolute", top: -30, left: 8 }}
              color={Colors.light.text}
            />
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
      <Footer onAddPress={handleAddPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    direction: "rtl",
  },
  settingsButton: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 9999,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsButton: {
    position: "absolute",
    left: 70,
    top: 20,
    zIndex: 9999,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.6,
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
    marginBottom: 30,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
    // elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "bold",
    backgroundColor: "transparent",
    marginTop: 14,
    color: "#6c757d",
  },
});

export default Home;
