import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function CheckoutScreen({ route, navigation }) {
  // Catching data from previous screen
  const { 
    selectedItems = [], 
    checkoutItems = [],
    displayTotalQuantity = 0, 
    displayTotalAmount = 0,
    availablePoints: passedPoints = 0
  } = route.params || {};

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [pointsToUse, setPointsToUse] = useState('');
  const [placing, setPlacing] = useState(false);
  const [availablePoints, setAvailablePoints] = useState(passedPoints);

  // Refresh points if name/points passed was 0 (from ProductDetail)
  useEffect(() => {
    if (passedPoints === 0) {
      api.get('/users/wallet')
        .then(res => setAvailablePoints(res.data?.points || 0))
        .catch(() => {});
    }
  }, []);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Delivery Address Section */}
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color="#dc2626" />
                <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            </View>
            <TextInput
                label="Địa chỉ nhận hàng (Bắt buộc)"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
            />
            <TextInput
                label="Số điện thoại (Bắt buộc)"
                value={phone}
                onChangeText={setPhone}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
            />
            <TextInput
                label="Ghi chú (Tùy chọn)"
                value={note}
                onChangeText={setNote}
                mode="outlined"
                multiline
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
            />
        </View>

        {/* Product List Section */}
        <View style={[styles.sectionCard, { padding: 0 }]}>
            <View style={[styles.sectionHeader, { padding: 16, paddingBottom: 8 }]}>
                <Ionicons name="bag-handle" size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
            </View>
            
            {checkoutItems.map((item, index) => (
                <View key={item.productId || index}>
                    <View style={styles.productRow}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price?.toLocaleString()} ₫</Text>
                            <Text style={styles.productQty}>Số lượng: x{item.quantity}</Text>
                        </View>
                    </View>
                    {index < checkoutItems.length - 1 && <Divider style={styles.divider} />}
                </View>
            ))}

            <View style={styles.itemSummary}>
                 <Text style={styles.itemSummaryText}>Tổng cộng ({displayTotalQuantity} sản phẩm): </Text>
                 <Text style={styles.itemSummaryValue}>{displayTotalAmount?.toLocaleString()} ₫</Text>
            </View>
        </View>

        {/* Discount & Points Section */}
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="pricetag" size={20} color="#f59e0b" />
                <Text style={styles.sectionTitle}>Mã giảm giá & Điểm thưởng</Text>
            </View>
            <TextInput
                label="Mã giảm giá"
                value={couponCode}
                onChangeText={setCouponCode}
                mode="outlined"
                style={styles.input}
                autoCapitalize="characters"
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
                right={<TextInput.Icon icon="ticket-outline" color="#9ca3af" />}
            />
            <TextInput
                label={`Sử dụng điểm (Bạn có: ${availablePoints || 0})`}
                value={pointsToUse}
                onChangeText={setPointsToUse}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                placeholder="1 điểm = 1.000 ₫"
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
                right={<TextInput.Icon icon="star-outline" color="#f59e0b" />}
            />
        </View>

        {/* Payment Summary Section */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
            <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
                <Text style={styles.summaryPrice}>{displayTotalAmount?.toLocaleString()} ₫</Text>
            </View>
            <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={styles.summaryPrice}>0 ₫</Text>
            </View>
            <Divider style={{ my: 10 }} />
            <View style={styles.summaryLine}>
                <Text style={[styles.summaryLabel, { fontSize: 16, fontWeight: 'bold', color: '#111827' }]}>Tổng thanh toán</Text>
                <Text style={[styles.summaryPrice, { fontSize: 18, color: '#dc2626', fontWeight: 'bold' }]}>
                    {displayTotalAmount?.toLocaleString()} ₫
                </Text>
            </View>
        </View>

      </ScrollView>

      {/* Footer Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBarContainer}>
            <Text style={styles.totalBarLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalBarPrice}>{displayTotalAmount?.toLocaleString()} ₫</Text>
        </View>
        <TouchableOpacity
            onPress={handleCheckout}
            disabled={placing}
            style={[styles.checkoutBtn, placing && { opacity: 0.7 }]}
        >
            <Text style={styles.checkoutBtnText}>
                {placing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
            </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Android Shadow
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  productRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  productQty: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
  },
  itemSummary: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  itemSummaryText: {
    fontSize: 13,
    color: '#6b7280',
  },
  itemSummaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryPrice: {
    fontSize: 13,
    color: '#111827',
  },
  bottomBar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  totalBarContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  totalBarLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  totalBarPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  checkoutBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backBtn: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 5
  }
});
