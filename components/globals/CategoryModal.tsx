import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CategoryModal = ({ isVisible, onClose }: CategoryModalProps) => {
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#1a73e8'
  });

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://tankhah.vercel.app/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://tankhah.vercel.app/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        await fetchCategories();
        setIsAddModalVisible(false);
        setNewCategory({ name: '', color: '#1a73e8' });
        Alert.alert('موفق', 'دسته‌بندی جدید با موفقیت اضافه شد');
      }
    } catch (error) {
      Alert.alert('خطا', 'مشکلی در افزودن دسته‌بندی پیش آمد');
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
    }
  }, [isVisible]);

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>دسته‌بندی‌ها</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
                <Ionicons name="add-circle" size={24} color="#1a73e8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryList}>
              {categories.map((category: { _id: string; name: string; color: string }) => (
                <TouchableOpacity
                  key={category._id}
                  style={[styles.categoryItem, { borderRightColor: category.color }]}
                >
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.addModalContainer}>
          <View style={styles.addModalContent}>
            <Text style={styles.addModalTitle}>افزودن دسته‌بندی جدید</Text>
            
            <TextInput
              style={styles.input}
              placeholder="نام دسته‌بندی"
              value={newCategory.name}
              onChangeText={(text) => setNewCategory(prev => ({ ...prev, name: text }))}
            />
            
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                color={newCategory.color}
                onColorChange={(color) => setNewCategory(prev => ({ ...prev, color }))}
                thumbSize={30}
                sliderSize={20}
                noSnap={true}
                row={false}
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>انصراف</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.addButton]}
                onPress={handleAddCategory}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>افزودن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryList: {
    maxHeight: '80%',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderRightWidth: 4,
  },
  categoryName: {
    fontSize: 16,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  addModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  addModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlign: 'right',
  },
  colorPickerContainer: {
    height: 200,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#1a73e8',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CategoryModal;
