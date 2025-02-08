import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NotificationBox = () => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.notificationHeader}>
        <MaterialCommunityIcons name="bell-ring" size={24} color="#7C3AED" />
        <Text style={styles.notificationTitle}>پیام‌های جدید</Text>
      </View>

      <View style={styles.notificationItem}>
        <MaterialCommunityIcons name="message-text" size={20} color="#7C3AED" />
        <View style={styles.messageContent}>
          <Text style={styles.messageTitle}>افزایش حقوق</Text>
          <Text style={styles.messageTime}>۲ ساعت پیش</Text>
          <Text style={styles.messageText}>
            حقوق شما در این ماه ۱۵٪ افزایش یافت
          </Text>
        </View>
      </View>

      <Pressable style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>مشاهده همه پیام‌ها</Text>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#7C3AED" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 46,
    marginLeft: 16,
    marginRight: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    direction: "rtl",
    marginBottom: 80,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 8,
  },
  messageContent: {
    flex: 1,
    marginRight: 12,
    alignItems: "flex-start",
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  messageText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
    textAlign: "right",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  viewAllText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
});

export default NotificationBox;
