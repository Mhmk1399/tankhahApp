import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface FormErrors {
  name?: string;
  password?: string;
  phoneNumber?: string;
}

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const API_URL = 'https://tankhah.vercel.app/api/auth';

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (name.length < 3) {
      newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = 'رمز عبور باید شامل حروف بزرگ، کوچک و اعداد باشد';
    }

    if (!phoneNumber.match(/^09[0-9]{9}$/)) {
      newErrors.phoneNumber = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate('LoginScreen' as never);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('خطا در ثبت نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ساخت حساب کاربری</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="نام کاربری"
            value={name}
            onChangeText={setName}
            textAlign="right"
          />
          {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}

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

          <TextInput
            style={styles.input}
            placeholder="شماره همراه"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            textAlign="right"
          />
          {errors.phoneNumber && (
            <Text style={styles.fieldError}>{errors.phoneNumber}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>ثبت نام</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen' as never)}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>ورود به حساب کاربری</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    gap: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 2,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#2563eb',
    fontSize: 14,
  },
});
