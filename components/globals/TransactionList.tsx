import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
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

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://tankhah.vercel.app/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => setSelectedTransaction(item)}
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('fa-IR')}
        </Text>
        <Text style={styles.amount}>
          {item.amount.toLocaleString('fa-IR')} تومان
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
                  {new Date(selectedTransaction.date).toLocaleDateString('fa-IR')}
                </Text>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>توضیحات:</Text>
                <Text style={styles.modalValue}>{selectedTransaction.description}</Text>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>مبلغ:</Text>
                <Text style={styles.modalValue}>
                  {selectedTransaction.amount.toLocaleString('fa-IR')} تومان
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>لیست تراکنش‌ها</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setDateModalOpen(true)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>هیچ تراکنشی موجود نیست</Text>
          </View>
        }
      />

      <TransactionModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  filterButton: {
    backgroundColor: '#4361ee',
    padding: 10,
    borderRadius: 12,
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748B',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default TransactionList;
