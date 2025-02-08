import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';

interface Request {
  _id: string;
  amount: number;
  description: string;
  Date: string;
  status: "pending" | "approved" | "rejected";
  user: string;
}

const ManageRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    status: "",
  });
  const [userData, setUserData] = useState<{ name: string; role: string }>({
    name: "",
    role: "",
  });

  const statusOptions = [
    { value: "pending", label: "در انتظار", color: "#EAB308" },
    { value: "approved", label: "تایید شده", color: "#22C55E" },
    { value: "rejected", label: "رد شده", color: "#EF4444" },
  ];

  useEffect(() => {
    fetchRequests();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

      const response = await fetch("https://tankhah.vercel.app/api/auth", {
        headers: {
          Authorization: `Bearer ${actualToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data.users);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'خطا',
        text2: 'مشکل در دریافت اطلاعات کاربر',
      });
    }
  };

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("توکن نامعتبر");
      
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

      const response = await fetch("https://tankhah.vercel.app/api/request", {
        headers: {
          Authorization: `Bearer ${actualToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'خطا',
        text2: 'مشکل در دریافت درخواست‌ها',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (request: Request) => {
    setSelectedRequest(request);
    setEditForm({
      amount: request.amount.toString(),
      description: request.description,
      status: request.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("توکن نامعتبر");
      
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;

      const response = await fetch("https://tankhah.vercel.app/api/request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualToken}`,
        },
        body: JSON.stringify({
          id: selectedRequest._id,
          amount: Number(editForm.amount),
          description: editForm.description,
          status: editForm.status,
          Date: selectedRequest.Date,
        }),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'موفق',
          text2: 'درخواست با موفقیت بروزرسانی شد',
        });
        setIsEditModalOpen(false);
        fetchRequests();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'خطا',
        text2: 'مشکل در بروزرسانی درخواست',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>درخواستی موجود نیست</Text>
        <Text style={styles.emptySubtitle}>
          هنوز هیچ درخواستی ثبت نشده است
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>مدیریت درخواست ها</Text>

      <ScrollView style={styles.requestList}>
        {requests.map((request) => (
          <View key={request._id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.amount}>
                {new Intl.NumberFormat("fa-IR").format(request.amount)} تومان
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusOptions.find(
                      (s) => s.value === request.status
                    )?.color,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {statusOptions.find((s) => s.value === request.status)?.label}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{request.description}</Text>

            <View style={styles.requestFooter}>
              <Text style={styles.date}>
                {new Date(request.Date).toLocaleDateString("fa-IR")}
              </Text>
              {userData.role === "manager" && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(request)}
                >
                  <Text style={styles.editButtonText}>ویرایش</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ویرایش درخواست</Text>

            <TextInput
              style={styles.input}
              value={editForm.amount}
              onChangeText={(text) => setEditForm({ ...editForm, amount: text })}
              keyboardType="numeric"
              placeholder="مبلغ"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editForm.status}
                onValueChange={(itemValue) =>
                  setEditForm({ ...editForm, status: itemValue })
                }
              >
                {statusOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.description}
              onChangeText={(text) =>
                setEditForm({ ...editForm, description: text })
              }
              multiline
              numberOfLines={4}
              placeholder="توضیحات"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text style={styles.buttonText}>انصراف</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>ذخیره تغییرات</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F1F5F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F1F5F9",
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 17,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 24,
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  requestList: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom:60
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    elevation: 2,
  },
  statusText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  description: {
    color: "#475569",
    marginBottom: 16,
    lineHeight: 24,
    fontSize: 16,
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  date: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "94%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 28,
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    fontSize: 17,
    color: "#334155",
    backgroundColor: "#F8FAFC",
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
  },
  saveButton: {
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});


export default ManageRequests;
