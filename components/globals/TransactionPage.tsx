import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "./loading";
import Toast from "react-native-toast-message";

interface NewCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddCategory: (category: { name: string; color: string }) => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isVisible,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1a73e8");

  const colors = [
    "#1a73e8",
    "#34A853",
    "#FBBC05",
    "#EA4335",
    "#9C27B0",
    "#2196F3",
    "#4CAF50",
    "#FF9800",
  ];

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("خطا", "لطفا نام دسته‌بندی را وارد کنید");
      return;
    }
    onAddCategory({ name, color: selectedColor });
    setName("");
    setSelectedColor("#1a73e8");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>دسته‌بندی جدید</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.categoryInput}
            value={name}
            onChangeText={setName}
            placeholder="نام دسته‌بندی"
            placeholderTextColor="#666"
          />

          <Text style={styles.colorSectionTitle}>انتخاب رنگ</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <Text style={styles.createButtonText}>ایجاد دسته‌بندی</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
}

interface TransactionForm {
  amount: string;
  category: Category;
  description: string;
  image: string;
  date: Date;
}

const TransactionsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  const [formData, setFormData] = useState<TransactionForm>({
    amount: "",
    category: {
      _id: "",
      name: "",
      color: "",
      user: "",
    },
    description: "",
    image: "",
    date: new Date(),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory: {
    name: string;
    color: string;
  }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("خطا", "لطفا وارد حساب کاربری خود شوید");
        return;
      }

      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;
      
      const response = await fetch(
        "https://tankhah.vercel.app/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${actualToken}`,
          },
          body: JSON.stringify(newCategory),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        Alert.alert("موفق", "دسته‌بندی با موفقیت اضافه شد");
        fetchCategories(); // Refresh categories list
      }
    } catch (error) {
      Alert.alert("خطا", "مشکلی در افزودن دسته‌بندی پیش آمد");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("لطفا دوباره وارد شوید");
      }
  
      // Parse the stored token object
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;
  
      const response = await fetch(
        "https://tankhah.vercel.app/api/categories",
        {
          headers: {
            Authorization: `Bearer ${actualToken}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCategories(data.categories);
      } else {
        throw new Error(data.error || "خطا در دریافت دسته‌بندی‌ها");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Toast.show({
        type: 'error',
        text1: 'خطا',
        text2: error instanceof Error ? error.message : 'An unknown error occurred',
        position: 'bottom'
      });
    } finally {
      setIsLoading(false);
    }
  };  

  const handleCategorySelect = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
    setIsCategoryModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.amount || !formData.category._id) {
        Alert.alert("خطا", "لطفا مبلغ و دسته‌بندی را وارد کنید");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("خطا", "لطفا دوباره وارد شوید");
        return;
      }
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

      const numericAmount = Number(formData.amount.replace(/,/g, ""));

      const transactionData = {
        amount: numericAmount,
        description: formData.description,
        category: formData.category._id,
        date: formData.date,
        image: formData.image,
      };

      const response = await fetch(
        "https://tankhah.vercel.app/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${actualToken}`,
          },
          body: JSON.stringify(transactionData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("موفق", "تراکنش با موفقیت ثبت شد");
        setFormData({
          amount: "",
          category: { _id: "", name: "", color: "", user: "" },
          description: "",
          image: "",
          date: new Date(),
        });
      } else {
        throw new Error(responseData.message || "خطا در ثبت تراکنش");
      }
    } catch (error) {
      Alert.alert("خطا", "مشکلی در ثبت تراکنش پیش آمد");
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

    if (!result.canceled && result.assets[0].base64) {
      setFormData((prev) => ({
        ...prev,
        image: `data:image/jpeg;base64,${result.assets[0].base64}`,
      }));
    }
  };

  if (isLoading) {
    return <Loading visible={isLoading} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ثبت تراکنش جدید</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={formData.amount}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, amount: text }))
          }
          placeholder="مبلغ"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Ionicons name="cloud-upload" size={24} color="#666" />
          <Text style={styles.uploadText}>
            {formData.image ? "تصویر انتخاب شد" : "آپلود تصویر رسید"}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          placeholder="توضیحات (اختیاری)"
          multiline
          numberOfLines={4}
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[
            styles.categoryButton,
            formData.category._id && styles.selectedCategory,
          ]}
          onPress={() => setIsCategoryModalOpen(true)}
        >
          <View style={styles.categoryButtonContent}>
            <Text
              style={[
                styles.categoryButtonText,
                formData.category._id && styles.selectedCategoryText,
              ]}
            >
              {formData.category.name || "انتخاب دسته‌بندی"}
            </Text>
            {formData.category.color && (
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: formData.category.color },
                ]}
              />
            )}
          </View>
          <Ionicons
            name="chevron-down"
            size={24}
            color={formData.category._id ? "#fff" : "#1a73e8"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>ثبت تراکنش</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalOpen}
        onRequestClose={() => setIsCategoryModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>انتخاب دسته‌بندی</Text>
              <TouchableOpacity onPress={() => setIsCategoryModalOpen(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category._id}
                  style={[
                    styles.categoryItem,
                    formData.category._id === category._id &&
                      styles.selectedItem,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <View style={styles.categoryItemContent}>
                    <View
                      style={[
                        styles.categoryColor,
                        { backgroundColor: category.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  {formData.category._id === category._id && (
                    <Ionicons name="checkmark" size={24} color="#1a73e8" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={() => {
                  setIsNewCategoryModalOpen(true);
                  setIsCategoryModalOpen(false);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#1a73e8" />
                <Text style={styles.addCategoryButtonText}>
                  افزودن دسته‌بندی جدید
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <NewCategoryModal
        isVisible={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#1a73e8",
  },
  form: {
    gap: 16,
  },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f0f7ff",
    marginTop: 10,
  },
  addCategoryButtonText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    color: "#666",
    marginTop: 8,
  },
  categoryButton: {
    direction: "rtl",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1a73e8",
    elevation: 2,
  },
  categoryButtonContent: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButtonText: {
    direction: "rtl",
    fontSize: 16,
    color: "#1a73e8",
    marginRight: 8,
  },
  selectedCategory: {
    direction: "rtl",
    backgroundColor: "#1a73e8",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#1a73e8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoriesList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    
    backgroundColor: "#f8f9fa",
  },
  categoryItemContent: {
    flexDirection: "row",
    
    alignItems: "center",
  },
  categoryColor: {
    width: 16,
    height: 16,

    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    marginRight: 5,
    color: "#333",
  },
  selectedItem: {
    backgroundColor: "#e8f0fe",
    borderWidth: 1,
    borderColor: "#1a73e8",
  },
  categoryInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
    marginBottom: 16,
  },
  colorSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButton: {
    backgroundColor: "#1a73e8",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TransactionsPage;
