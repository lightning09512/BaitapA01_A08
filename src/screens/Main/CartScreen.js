import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function CartScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      const data = res.data || {};
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
      setTotalQuantity(data.totalQuantity || 0);

      const walletRes = await api.get('/users/wallet').catch(() => null);
      if (walletRes && walletRes.data) {
          setAvailablePoints(walletRes.data.points || 0);
      }
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

const changeQuantity = async (productId, variantId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, variantId);
      return;
    }
    try {
      const res = await api.put('/cart/update', { productId, variantId, quantity: newQty });
      setCartFromResponse(res.data || {});
    } catch (e) {
      console.log('Update cart error:', e);
    }
  };

  const handleRemoveItem = (productId, variantId) => {
    Alert.alert(
      "Xóa sản phẩm",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await api.post('/cart/remove', { productId, variantId });
              setCartFromResponse(res.data || {});
            } catch (e) {
              console.log('Remove item error:', e);
            }
          } 
        }
      ]
    );
  };

  const navigateToCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.');
      return;
    }
    navigation.navigate('Checkout', {
      selectedItems,
      checkoutItems: items.filter(item => {
          const key = `${item.productId}-${item.variantId || ''}`;
          return selectedItems.includes(key);
      }),
      displayTotalQuantity,
      displayTotalAmount,
      availablePoints
    });
  };

  const toggleSelect = (key) => {
    setSelectedItems(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length && items.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => `${item.productId}-${item.variantId || ''}`));
    }
  };

  const displayTotalAmount = items
    .filter(item => selectedItems.includes(`${item.productId}-${item.variantId || ''}`))
    .reduce((sum, item) => sum + item.lineTotal, 0);

  const displayTotalQuantity = items
    .filter(item => selectedItems.includes(`${item.productId}-${item.variantId || ''}`))
    .reduce((sum, item) => sum + item.quantity, 0);

  const renderItem = ({ item }) => {
    const itemKey = `${item.productId}-${item.variantId || ''}`;
    const isSelected = selectedItems.includes(itemKey);
    return (
      <View style={styles.itemCard}>
        <TouchableOpacity 
           onPress={() => toggleSelect(itemKey)}
           style={{ justifyContent: 'center', marginRight: 10 }}
        >
           <Ionicons name={isSelected ? "checkbox" : "square-outline"} size={26} color={isSelected ? "#dc2626" : "#9ca3af"} />
        </TouchableOpacity>
        <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="contain" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.variantName ? (
              <Text style={styles.variantLabel} numberOfLines={1}>
                  Phân loại: {item.variantName}
              </Text>
          ) : null}
          <Text style={styles.itemPrice}>{item.price.toLocaleString()} ₫</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQuantity(item.productId, item.variantId, item.quantity - 1)}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQuantity(item.productId, item.variantId, item.quantity + 1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineTotalBox}>
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => handleRemoveItem(item.productId, item.variantId)}
          >
            <Ionicons name="trash-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.lineTotalText}>{item.lineTotal.toLocaleString()} ₫</Text>
        </View>
      </View>
    );
  };

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
          keyExtractor={(item) => `${item.productId}-${item.variantId || ''}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Khối thanh toán */}
      <View style={styles.bottomSheet}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          
          <TouchableOpacity 
             style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
             onPress={toggleSelectAll}
          >
             <Ionicons 
                name={selectedItems.length === items.length && items.length > 0 ? "checkbox" : "square-outline"} 
                size={24} 
                color={selectedItems.length === items.length && items.length > 0 ? "#dc2626" : "#9ca3af"} 
             />
             <Text style={{ fontWeight: '600', marginLeft: 8 }}>Chọn tất cả</Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Tổng thanh toán</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>
              {displayTotalAmount.toLocaleString()} ₫
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={navigateToCheckout}
            style={{ backgroundColor: '#dc2626', borderRadius: 8, justifyContent: 'center' }}
            labelStyle={{ fontSize: 14, fontWeight: 'bold', marginHorizontal: 16 }}
            disabled={selectedItems.length === 0}
          >
            Mua ngay
          </Button>

        </View>
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
    marginBottom: 2,
  },
  variantLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 2,
  },
  lineTotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  deleteBtn: {
    padding: 4,
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

