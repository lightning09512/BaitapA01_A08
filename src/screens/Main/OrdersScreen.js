import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import api from '../../services/api';

const STATUS_LABELS = {
  NEW: 'Đơn hàng mới',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Shop đang chuẩn bị hàng',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao thành công',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLORS = {
  NEW: '#0ea5e9',
  CONFIRMED: '#22c55e',
  PREPARING: '#f97316',
  SHIPPING: '#facc15',
  DELIVERED: '#16a34a',
  CANCELLED: '#6b7280',
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (e) {
      console.log('Load orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleCancel = async (orderId) => {
    try {
      const res = await api.post('/orders/cancel', { orderId });
      alert(res.data?.message || 'Đã xử lý yêu cầu hủy đơn.');
      loadOrders();
    } catch (e) {
      console.log('Cancel order error:', e);
      alert(e.response?.data?.message || e.message || 'Không thể hủy đơn hàng');
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || '#6b7280';
    const statusLabel = STATUS_LABELS[item.status] || item.status;
    const created = item.createdAt ? new Date(item.createdAt) : null;
    const firstItem = item.OrderItems?.[0];

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.orderId}>Mã đơn: #{item.id}</Text>
          <View style={[styles.statusChip, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
        {created && (
          <Text style={styles.dateText}>
            Ngày đặt: {created.toLocaleDateString()} {created.toLocaleTimeString()}
          </Text>
        )}
        {firstItem && (
          <Text style={styles.itemsText}>
            {firstItem.name}
            {item.OrderItems.length > 1 ? ` và ${item.OrderItems.length - 1} sản phẩm khác` : ''}
          </Text>
        )}
        <View style={styles.footerRow}>
          <Text style={styles.totalText}>{item.totalAmount.toLocaleString()} ₫</Text>
          {(item.status === 'NEW' || item.status === 'CONFIRMED' || item.status === 'PREPARING') && (
            <Button
              mode="outlined"
              textColor="#dc2626"
              style={styles.cancelButton}
              onPress={() => handleCancel(item.id)}
            >
              {item.status === 'PREPARING' ? 'Yêu cầu hủy' : 'Hủy đơn'}
            </Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Đơn Hàng Của Tôi</Text>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator animating color="#dc2626" />
        </View>
      ) : orders.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6b7280' }}>Bạn chưa có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  itemsText: {
    marginTop: 6,
    fontSize: 13,
    color: '#374151',
  },
  footerRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  cancelButton: {
    borderColor: '#fecaca',
    backgroundColor: '#fff7ed',
  },
});

