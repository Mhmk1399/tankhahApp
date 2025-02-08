import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "./FilterModal";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: {
    name: string;
    color: string;
  };
}

interface StartDate {
  year: number;
  month: number;
  day: number;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [originalTransactions, setOriginalTransactions] = useState<Transaction[]>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    minAmount: "",
    maxAmount: "",
    searchText: "",
  });
  const [startDate, setStartDate] = useState<StartDate>({
    year: 1402,
    month: 1,
    day: 1,
  });
  const [endDate, setEndDate] = useState<StartDate>({
    year: 1402,
    month: 1,
    day: 1,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);
  const handleResetFilters = () => {
    setFilterOptions({
      startDate: null,
      endDate: null,
      minAmount: '',
      maxAmount: '',
      searchText: ''
    });
    setTransactions(originalTransactions);
  };
  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }
      const tokenData = JSON.parse(token);
      const actualToken = tokenData.token;
      const response = await fetch(
        "https://tankhah.vercel.app/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${actualToken}`,
          },
        }
      );
      const data = await response.json();
      setTransactions(data);
      setOriginalTransactions(data); // Store original data

    } catch (error) {
      console.log("Error fetching transactions:", error);
      console.error("Error fetching transactions:", error);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => setSelectedTransaction(item)}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString("fa-IR")}
        </Text>
        <Text style={styles.amount}>
          {item.amount.toLocaleString("fa-IR")} تومان
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const TransactionModal = () => (
    <Modal
      visible={!!selectedTransaction}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedTransaction(null)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setSelectedTransaction(null)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>جزئیات تراکنش</Text>
          {selectedTransaction && (
            <>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>تاریخ:</Text>
                <Text style={styles.modalValue}>
                  {new Date(selectedTransaction.date).toLocaleDateString(
                    "fa-IR"
                  )}
                </Text>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>توضیحات:</Text>
                <Text style={styles.modalValue}>
                  {selectedTransaction.description}
                </Text>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>مبلغ:</Text>
                <Text style={styles.modalValue}>
                  {selectedTransaction.amount.toLocaleString("fa-IR")} تومان
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    
    const filteredTransactions = transactions.filter(transaction => {
      // Date range filter
      if (newFilters.startDate && new Date(transaction.date) < newFilters.startDate) {
        return false;
      }
      if (newFilters.endDate && new Date(transaction.date) > newFilters.endDate) {
        return false;
      }
  
      // Amount range filter
      const transactionAmount = transaction.amount;
      const minAmount = newFilters.minAmount ? parseInt(newFilters.minAmount) : 0;
      const maxAmount = newFilters.maxAmount ? parseInt(newFilters.maxAmount) : Infinity;
      
      if (transactionAmount < minAmount || transactionAmount > maxAmount) {
        return false;
      }
  
      // Description search filter
      if (newFilters.searchText && !transaction.description.toLowerCase().includes(newFilters.searchText.toLowerCase())) {
        return false;
      }
  
      return true;
    });
  
    setTransactions(filteredTransactions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>لیست تراکنش‌ها</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalOpen(true)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>هیچ تراکنشی موجود نیست</Text>
          </View>
        }
      />

      <TransactionModal />
      <FilterModal
        isVisible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filterOptions}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    flex: 1,
    backgroundColor: "#fffff",
    padding:20,
    marginBottom: 50
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
   
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    fontFamily: "IRANSans",
  },
  filterButton: {
    backgroundColor: "#4361ee",
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 15,
    color: "#64748B",
    fontFamily: "IRANSans",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    fontFamily: "IRANSans",
  },
  description: {
    fontSize: 16,
    color: "#475569",
    textAlign: "right",
    lineHeight: 24,
    fontFamily: "IRANSans",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    width: "90%",
    maxWidth: 400,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1E293B",
    fontFamily: "IRANSans",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
  },
  modalField: {
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalLabel: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 8,
    fontFamily: "IRANSans",
  },
  modalValue: {
    fontSize: 18,
    color: "#334155",
    fontWeight: "600",
    fontFamily: "IRANSans",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#64748B",
    textAlign: "center",
    fontFamily: "IRANSans",
    lineHeight: 28,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#64748B',
  },
  modalActions: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});


export default TransactionList;


