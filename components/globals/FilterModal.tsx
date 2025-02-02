import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

interface FilterOptions {
  startDate: Date | null;
  endDate: Date | null;
  minAmount: string;
  maxAmount: string;
  searchText: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApplyFilters,
  initialFilters
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.filterModalOverlay}>
        <View style={styles.filterModalContent}>
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>فیلتر تراکنش‌ها</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterForm}>
            <Text style={styles.filterSectionTitle}>بازه زمانی</Text>
            <View style={styles.dateInputsContainer}>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateInputText}>
                  {localFilters.startDate ? 
                    localFilters.startDate.toLocaleDateString('fa-IR') : 
                    'از تاریخ'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateInputText}>
                  {localFilters.endDate ? 
                    localFilters.endDate.toLocaleDateString('fa-IR') : 
                    'تا تاریخ'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>محدوده مبلغ</Text>
            <View style={styles.amountInputsContainer}>
              <TextInput
                style={styles.amountInput}
                value={localFilters.minAmount}
                onChangeText={(text) => 
                  setLocalFilters(prev => ({...prev, minAmount: text}))}
                placeholder="حداقل مبلغ"
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.amountInput}
                value={localFilters.maxAmount}
                onChangeText={(text) => 
                  setLocalFilters(prev => ({...prev, maxAmount: text}))}
                placeholder="حداکثر مبلغ"
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
            </View>

            <Text style={styles.filterSectionTitle}>جستجو در توضیحات</Text>
            <TextInput
              style={styles.searchInput}
              value={localFilters.searchText}
              onChangeText={(text) => 
                setLocalFilters(prev => ({...prev, searchText: text}))}
              placeholder="جستجو..."
              placeholderTextColor="#666"
            />

            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.applyFilterButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyFilterButtonText}>اعمال فیلتر</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resetFilterButton}
                onPress={() => {
                  setLocalFilters({
                    startDate: null,
                    endDate: null,
                    minAmount: '',
                    maxAmount: '',
                    searchText: ''
                  });
                }}
              >
                <Text style={styles.resetFilterButtonText}>پاک کردن فیلترها</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterForm: {
    maxHeight: 500,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  dateInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dateInputText: {
    color: '#333',
    fontSize: 14,
  },
  amountInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    textAlign: 'right',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    textAlign: 'right',
  },
  filterActions: {
    marginTop: 24,
    gap: 12,
  },
  applyFilterButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFilterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetFilterButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetFilterButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default FilterModal;
