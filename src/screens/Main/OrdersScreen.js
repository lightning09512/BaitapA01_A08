import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { ActivityIndicator, Button, Text, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const STATUS_LABELS = {
  NEW: 'Đơn hàng mới',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Shop đang chuẩn bị hàng',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Giao thành công',
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

const TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'WAIT_CONFIRM', label: 'Chờ xác nhận' },
  { key: 'WAIT_PICKUP', label: 'Chờ lấy hàng' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'REVIEW', label: 'Đánh giá' },
];

export default function OrdersScreen({ route, navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  // Load orders
  const loadOrders = async () => {
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
    const initialTab = route.params?.initialTab || 'ALL';
    setActiveTab(initialTab);
    loadOrders();
  }, [route.params?.initialTab]);

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
      alert(e.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'ALL') return orders;
    if (activeTab === 'WAIT_CONFIRM') return orders.filter(o => o.status === 'NEW');
    if (activeTab === 'WAIT_PICKUP') return orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING');
    if (activeTab === 'SHIPPING') return orders.filter(o => o.status === 'SHIPPING');
    if (activeTab === 'REVIEW') return orders.filter(o => o.status === 'DELIVERED');
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  const renderOrderItem = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || '#6b7280';
    const statusLabel = STATUS_LABELS[item.status] || item.status;
    const firstItem = item.OrderItems?.[0];

    return (
      <View style={styles.orderCard}>
        <View style={styles.shopRow}>
          <Ionicons name="storefront-outline" size={16} color="#333" />
          <Text style={styles.shopName}>SellphoneK Store</Text>
          <Text style={[styles.orderStatusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        <Divider />

        {item.OrderItems?.map((oi, index) => (
          <React.Fragment key={oi.id || index}>
            <TouchableOpacity 
              style={styles.productInfoRow}
              onPress={() => {/* TODO: Navigate to OrderDetail if needed */}}
            >
              <Image 
                source={{ uri: oi.image || 'https://via.placeholder.com/150' }} 
                style={styles.productImage} 
                contentFit="contain"
              />
              <View style={styles.productTextContent}>
                <Text style={styles.productName} numberOfLines={1}>{oi.name}</Text>
                <Text style={styles.productSubtext}>Phân loại hàng: Mặc định</Text>
                <Text style={styles.quantityText}>x{oi.quantity}</Text>
                <Text style={styles.unitPrice}>₫{oi.unitPrice?.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
            {index < item.OrderItems.length - 1 && <Divider style={{ marginHorizontal: 12, backgroundColor: '#f0f0f0' }} />}
          </React.Fragment>
        ))}

        <Divider />

        <View style={styles.orderFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.itemCountText}>{item.OrderItems?.length} sản phẩm</Text>
            <Text style={styles.totalLabel}>Thành tiền:</Text>
            <Text style={styles.totalValue}>₫{item.totalAmount?.toLocaleString()}</Text>
          </View>
          
          <View style={styles.actionRow}>
            {['NEW', 'CONFIRMED', 'PREPARING'].includes(item.status) && (
              <Button 
                mode="outlined" 
                onPress={() => handleCancel(item.id)}
                style={styles.actionBtn}
                contentStyle={{ height: 36 }}
                textColor="#666"
                labelStyle={{ fontSize: 12, marginVertical: 0 }}
                compact
              >
                {item.status === 'PREPARING' ? 'Yêu cầu hủy' : 'Hủy đơn hàng'}
              </Button>
            )}
            <Button 
                mode="contained" 
                onPress={() => {}} 
                style={[styles.actionBtn, { backgroundColor: '#dc2626' }]}
                contentStyle={{ height: 36 }}
                labelStyle={{ fontSize: 12, marginVertical: 0 }}
                compact
            >
              Mua lại
            </Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#dc2626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ backgroundColor: '#fff' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab.key} 
              style={[styles.tabItem, activeTab === tab.key && styles.activeTabItem]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color="#dc2626" />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="receipt-outline" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  tabsContainer: {
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#dc2626',
  },
  tabLabel: {
    fontSize: 14,
    color: '#666',
  },
  activeTabLabel: {
    color: '#dc2626',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  shopName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
    flex: 1,
    color: '#333',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productInfoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginRight: 10,
  },
  productTextContent: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  productSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#333',
    position: 'absolute',
    right: 0,
    bottom: 20,
  },
  unitPrice: {
    fontSize: 14,
    color: '#333',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  moreItemsBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#999',
  },
  orderFooter: {
    paddingVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  itemCountText: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
  totalLabel: {
    fontSize: 13,
    color: '#333',
    marginRight: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    marginLeft: 8,
    borderRadius: 4,
    height: 36, // Increased from 32 to 36
    justifyContent: 'center',
    minWidth: 100,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  }
});
