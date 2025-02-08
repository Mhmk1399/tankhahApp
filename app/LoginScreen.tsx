import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface FormErrors {
  phoneNumber?: string;
  password?: string;
}

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useRouter();
  const API_URL = "https://tankhah.vercel.app/api/auth";

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!phoneNumber.match(/^09[0-9]{9}$/)) {
      newErrors.phoneNumber = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = "رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate("Home" as never);
        try {
          const tokenData = {
            token: data.token,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          };

          await AsyncStorage.setItem("token", JSON.stringify(tokenData));
          console.log(tokenData)
          console.log("Token stored successfully with expiration!");
        } catch (error) {
          console.error("Error storing token:", error);
        }

        // Store token securely
        await SecureStore.setItemAsync("userToken", data.token);

        // If remember me is checked, store additional flag
        if (rememberMe) {
          await SecureStore.setItemAsync("rememberMe", "true");
        }
      }
    } catch (err) {
      console.error(err);
      setError("ورود به سیستم با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ورود به حساب کاربری</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="شماره همراه خود را وارد کنید"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            textAlign="right"
          />
          {errors.phoneNumber && (
            <Text style={styles.fieldError}>{errors.phoneNumber}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="رمز ورود"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textAlign="right"
          />
          {errors.password && (
            <Text style={styles.fieldError}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.rememberContainer}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text style={styles.rememberText}>مرا به خاطر بسپار</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword" as never)}
          style={styles.forgotPassword}
        >
          <Text style={styles.linkText}>فراموشی رمز عبور</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>ورود به سیستم</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home" as never)}
          style={styles.registerLink}
        >
          <Text style={styles.linkText}>ثبت نام</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 50,
    position: "relative", // Ensure the background layer is in the correct order
  },
  lottieBackground: {
    position: "absolute", // This will make sure the Lottie animation is behind the form
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    inset: 10,
    zIndex: -1, // Ensures the form is on top of the animation
  },
  formContainer: {
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  inputContainer: {
    gap: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  rememberText: {
    marginRight: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 10,
  },
  fieldError: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 2,
    textAlign: "right",
  },
  forgotPassword: {
    alignItems: "flex-start",
    marginBottom: 15,
  },
  registerLink: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#2563eb",
    fontSize: 14,
  },
});
