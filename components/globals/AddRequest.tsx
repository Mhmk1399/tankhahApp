import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Colors } from "../../constants/Colors";

const AddRequest = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    Toast.show({
      type: type,
      text1:
        type === "success"
          ? "درخواست شما با موفقیت ثبت شد"
          : "خطا در ثبت درخواست",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const handleSubmit = async () => {
    if (!amount || !description) {
      showToast("error", "لطفا تمام فیلدها را پر کنید");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showToast("error", "دریافت توکن امنیتی امکان پذیر نیست");
        return;
      }
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

      const response = await fetch("https://tankhah.vercel.app/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          Date: Date.now(),
          status: "pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "درخواست شما با موفقیت ثبت شد");
        setAmount("");
        setDescription("");
      } else {
        showToast("error", data.message || "خطا در ثبت درخواست");
      }
    } catch (error) {
      showToast("error", "خطا در برقراری ارتباط با سرور");
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ثبت درخواست جدید</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>مبلغ (ریال)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="مبلغ درخواست خود را وارد کنید"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>توضیحات</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="توضیحات درخواست خود را وارد کنید"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>ثبت درخواست</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    marginTop: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: Colors.light.text,
  },
  formGroup: {
    direction: "rtl",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AddRequest;
