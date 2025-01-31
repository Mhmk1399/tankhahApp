import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
interface Request {
  _id: string;
  amount: number;
  description: string;
  Date: string;
  status: "pending" | "approved" | "rejected";
  user: string;
}

const CustomModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isVisible, onClose, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const ManageRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
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
    { value: "pending", label: "Pending", color: "#EAB308" },
    { value: "approved", label: "Approved", color: "#22C55E" },
    { value: "rejected", label: "Rejected", color: "#EF4444" },
  ];

  useEffect(() => {
    fetchRequests();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // Handle navigation to login
        return;
      }

      const response = await fetch("https://tankhah.vercel.app/api/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data.users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("https://tankhah.vercel.app/api/request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRequests(data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
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
      const response = await fetch("https://tankhah.vercel.app/api/request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        setIsEditModalOpen(false);
        fetchRequests();
        // Add toast notification here
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  if (requests.length === 0) {
    return (
      <View>
        <Text >No Requests Available</Text>
        <Text >
          You don't have any requests yet
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
                {new Intl.NumberFormat("en-US").format(request.amount)} Toman
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
                <Text style={styles.statusText}>{request.status}</Text>
              </View>
            </View>

            <Text style={styles.description}>{request.description}</Text>

            <View style={styles.requestFooter}>
              <Text style={styles.date}>
                {new Date(request.Date).toLocaleDateString()}
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

      <CustomModal
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>ویرایش درخواست</Text>

          <TextInput
            style={styles.input}
            value={editForm.amount}
            onChangeText={(text) => setEditForm({ ...editForm, amount: text })}
            keyboardType="numeric"
            placeholder="مبلغ"
          />

          <View>
            <Picker
              selectedValue={editForm.status}
              onValueChange={(itemValue) =>
                setEditForm({ ...editForm, status: itemValue })
              }
            >
              <Picker.Item label="در انتظار" value="pending" />
              <Picker.Item label="تایید شده" value="approved" />
              <Picker.Item label="رد شده" value="rejected" />
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
      </CustomModal>
    </View>
  );
};const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F8FAFC',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      marginVertical: 16,
      color: '#1E293B',
    },
    requestList: {
      flex: 1,
    },
    requestCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    requestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    amount: {
      fontSize: 18,
      fontWeight: '600',
      color: '#334155',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    description: {
      color: '#64748B',
      marginBottom: 16,
      lineHeight: 20,
    },
    requestFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    date: {
      color: '#94A3B8',
      fontSize: 14,
    },
    editButton: {
      backgroundColor: Colors.light.tint,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      elevation: 1,
    },
    editButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 24,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 24,
      color: '#1E293B',
    },
    input: {
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      color: '#334155',
    },
    pickerContainer: {
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      elevation: 1,
    },
    cancelButton: {
      backgroundColor: '#EF4444',
    },
    saveButton: {
      backgroundColor: Colors.light.tint,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
  });
  

export default ManageRequests;
