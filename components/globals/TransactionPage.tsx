import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CategoryModal from './CategoryModal';

interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
}

const TransactionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: {
      _id: '',
      name: '',
      color: '',
      user: '',
    },
    description: '',
    image: '',
    date: new Date(),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('خطا', 'لطفا دوباره وارد شوید');
        return;
      }

      console.log('Fetching categories...');
      const response = await fetch('https://tankhah.vercel.app/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Categories response:', data);

      if (response.ok) {
        setCategories(data.categories);
      } else {
        throw new Error(data.message || 'خطا در دریافت دسته‌بندی‌ها');
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      Alert.alert('خطا', 'مشکلی در دریافت دسته‌بندی‌ها پیش آمد');
    } finally {
      setLoading(false);
    }
};


  const handleAddCategory = async (newCategory: { name: string; color: string }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://tankhah.vercel.app/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        Alert.alert('موفق', 'دسته‌بندی با موفقیت اضافه شد');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('خطا', 'مشکلی در افزودن دسته‌بندی پیش آمد');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.amount || !formData.category._id) {
        Alert.alert('خطا', 'لطفا مبلغ و دسته‌بندی را وارد کنید');
        return;
      }

      const numericAmount = Number(formData.amount.replace(/,/g, ''));
      console.log('Amount:', numericAmount);
      
      const transactionData = {
        amount: numericAmount,
        description: formData.description,
        category: formData.category._id,
        date: new Date(),
        image: formData.image
      };
      console.log('Transaction data:', JSON.stringify(transactionData));

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('خطا', 'لطفا دوباره وارد شوید');
        return;
      }

      const response = await fetch('https://tankhah.vercel.app/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        Alert.alert('موفق', 'تراکنش با موفقیت ثبت شد');
        setFormData({
          amount: '',
          category: { _id: '', name: '', color: '', user: '' },
          description: '',
          image: '',
          date: new Date(),
        });
      } else {
        throw new Error(responseData.message || 'خطا در ثبت تراکنش');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('خطا', error instanceof Error ? error.message : 'مشکلی در ثبت تراکنش پیش آمد');
    }
};


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        image: `data:image/jpeg;base64,${result.assets[0].base64}`
      }));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>در حال بارگذاری...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ثبت تراکنش جدید</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={formData.amount}
          onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
          placeholder="مبلغ"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Ionicons name="cloud-upload" size={24} color="#666" />
          <Text style={styles.uploadText}>آپلود تصویر رسید</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="توضیحات (اختیاری)"
          multiline
          numberOfLines={4}
          placeholderTextColor="#666"
        />

        <TouchableOpacity 
          style={styles.addCategoryButton}
          onPress={() => setIsCategoryModalOpen(true)}
        >
          <Pressable>
          <Text style={styles.addCategoryButtonText}>
            {formData.category.name || "انتخاب دسته‌بندی"}
          </Text>
          <Ionicons name="chevron-down" size={24} color="#fff" />
          </Pressable>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>ثبت تراکنش</Text>
        </TouchableOpacity>
      </View>

      <CategoryModal
        isVisible={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSelectCategory={(category) => setFormData(prev => ({ ...prev, category }))}
      />
    </ScrollView>
  );

};const styles = StyleSheet.create({  container: {    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a73e8',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#666',
    marginTop: 8,
  },
  addCategoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 8,
  },
  addCategoryButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionsPage;
