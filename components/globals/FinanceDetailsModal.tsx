import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FinanceDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  amount: string;
  icon: "wallet" | "cash-multiple" | "chart-pie";
  color: string;
}

export const FinanceDetailsModal: React.FC<FinanceDetailsModalProps> = ({
  isVisible,
  onClose,
  title,
  amount,
  icon,
  color,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="light" style={styles.blurContainer}>
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View style={[styles.modalContent, { borderColor: color }]}>
            <MaterialCommunityIcons name={icon} size={50} color="#4361ee" />
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalAmount}>{amount} تومان</Text>

            {/* <View style={styles.detailsContainer}>
              <View
                style={[styles.detailItem, { backgroundColor: `${color}22` }]}
              >
                <Text style={styles.detailLabel}>تراکنش های اخیر</Text>
                <Text style={[styles.detailValue, { color }]}>12 مورد</Text>
              </View>

              <View
                style={[styles.detailItem, { backgroundColor: `${color}22` }]}
              >
                <Text style={styles.detailLabel}>میانگین ماهانه</Text>
                <Text style={[styles.detailValue, { color }]}>
                  4,800,000 تومان
                </Text>
              </View>
            </View> */}
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    backdropFilter: "blur(10px)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
  },
  detailsContainer: {
    width: "100%",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
