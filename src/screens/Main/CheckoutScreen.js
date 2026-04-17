import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import api from '../../services/api';

export default function CheckoutScreen({ route, navigation }) {
  // Catching data from CartScreen
  const { 
    selectedItems, 
    displayTotalQuantity, 
    displayTotalAmount,
    availablePoints 
  } = route.params || {};

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [pointsToUse, setPointsToUse] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      alert('Không có sản phẩm nào để thanh toán.');
      return;
    }
    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ nhận hàng.');
      return;
    }
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại nhận hàng.');
      return;
    }

    setPlacing(true);
    try {
      const res = await api.post('/orders/checkout-cod', {
        address,
        phone,
        note,
        couponCode: couponCode.trim() || undefined,
        pointsToUse: Number(pointsToUse) || undefined,
        selectedProductIds: selectedItems
      });
      alert(res.data?.message || 'Đặt hàng thành công!');
      // Navigate to Orders screen
      navigation.replace('Orders');
    } catch (e) {
      console.log('Checkout error:', e);
      alert(e.response?.data?.message || e.message || 'Đặt hàng thất bại');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng sản phẩm:</Text>
                <Text style={styles.summaryValue}>{displayTotalQuantity} sản phẩm</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng tiền tạm tính:</Text>
                <Text style={styles.summaryValueTotal}>{displayTotalAmount?.toLocaleString()} ₫</Text>
            </View>
        </View>

        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            <TextInput
                label="Địa chỉ nhận hàng (Bắt buộc)"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Số điện thoại (Bắt buộc)"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextInput
                label="Ghi chú (Tùy chọn)"
                value={note}
                onChangeText={setNote}
                mode="outlined"
                multiline
                style={styles.input}
            />
        </View>

        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Mã giảm giá & Điểm thưởng</Text>
            <TextInput
                label="Mã giảm giá"
                value={couponCode}
                onChangeText={setCouponCode}
                mode="outlined"
                style={styles.input}
                autoCapitalize="characters"
            />
            <TextInput
                label={`Sử dụng điểm (Bạn có: ${availablePoints || 0})`}
                value={pointsToUse}
                onChangeText={setPointsToUse}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                placeholder="1 điểm = 1.000 ₫"
            />
        </View>

      </ScrollView>

      {/* Footer Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalPrice}>{displayTotalAmount?.toLocaleString()} ₫</Text>
        </View>
        <Button
            mode="contained"
            onPress={handleCheckout}
            loading={placing}
            disabled={placing}
            style={styles.checkoutBtn}
            labelStyle={styles.checkoutBtnText}
        >
            ĐẶT HÀNG (COD)
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  summaryValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#ffffff'
  },
  bottomBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  checkoutBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 4,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  }
});
