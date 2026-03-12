import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import api from '../../services/api';

export default function CartScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      const data = res.data || {};
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
      setTotalQuantity(data.totalQuantity || 0);
    } catch (e) {
      console.log('Load cart error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadCart);
    return unsubscribe;
  }, [navigation]);

  const setCartFromResponse = (data) => {
    setItems(data.items || []);
    setTotalAmount(data.totalAmount || 0);
    setTotalQuantity(data.totalQuantity || 0);
  };

  const changeQuantity = async (productId, newQty) => {
    try {
      let res;
      if (newQty <= 0) {
        res = await api.post('/cart/remove', { productId });
      } else {
        res = await api.put('/cart/update', { productId, quantity: newQty });
      }
      setCartFromResponse(res.data || {});
    } catch (e) {
      console.log('Update cart error:', e);
    }
  };

  const handleCheckout = async () => {
    if (!items.length) {
      alert('Giỏ hàng đang trống.');
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
      });
      alert(res.data?.message || 'Đặt hàng thành công!');
      // Sau khi đặt hàng, reload giỏ và chuyển sang màn đơn hàng
      await loadCart();
      navigation.navigate('Orders');
    } catch (e) {
      console.log('Checkout error:', e);
      alert(e.response?.data?.message || e.message || 'Đặt hàng thất bại');
    } finally {
      setPlacing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} ₫</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => changeQuantity(item.productId, item.quantity - 1)}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => changeQuantity(item.productId, item.quantity + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.lineTotalBox}>
        <Text style={styles.lineTotalText}>{item.lineTotal.toLocaleString()} ₫</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Giỏ Hàng</Text>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator animating color="#dc2626" />
        </View>
      ) : items.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6b7280' }}>Giỏ hàng đang trống.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Khối thanh toán */}
      <View style={styles.bottomSheet}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng số lượng</Text>
            <Text style={styles.summaryValue}>{totalQuantity} sản phẩm</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{totalAmount.toLocaleString()} ₫</Text>
          </View>

          <TextInput
            label="Địa chỉ nhận hàng (COD)"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={{ marginTop: 8 }}
          />
          <TextInput
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={{ marginTop: 8 }}
          />
          <TextInput
            label="Ghi chú cho đơn hàng (tùy chọn)"
            value={note}
            onChangeText={setNote}
            mode="outlined"
            multiline
            style={{ marginTop: 8 }}
          />

          <Button
            mode="contained"
            onPress={handleCheckout}
            style={{ marginTop: 12, backgroundColor: '#dc2626' }}
            loading={placing}
            disabled={placing || !items.length}
          >
            Đặt hàng (COD)
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Orders')}
            style={{ marginTop: 4 }}
            disabled={placing}
          >
            Xem lịch sử đơn hàng
          </Button>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  qtyValue: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  lineTotalBox: {
    justifyContent: 'flex-end',
  },
  lineTotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
});

