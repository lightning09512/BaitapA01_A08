import React, { useEffect, useState, useCallback } from 'react';
import {
    View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView,
} from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const STATUSES = ['ALL', 'NEW', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = {
    NEW: '#f59e0b', CONFIRMED: '#3b82f6', PREPARING: '#8b5cf6',
    SHIPPING: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444',
};
const STATUS_LABELS = {
    NEW: 'Mới', CONFIRMED: 'Đã xác nhận', PREPARING: 'Đang chuẩn bị',
    SHIPPING: 'Đang vận chuyển', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};
const NEXT_STATUS = {
    NEW: 'CONFIRMED', CONFIRMED: 'PREPARING', PREPARING: 'SHIPPING',
    SHIPPING: 'DELIVERED',
};

export default function AdminOrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Modal chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    const loadOrders = useCallback(async (pageToLoad = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        try {
            const statusParam = filterStatus !== 'ALL' ? `&status=${filterStatus}` : '';
            const res = await api.get(`/admin/orders?page=${pageToLoad}&limit=15${statusParam}`);
            const data = res.data;
            setOrders(prev => append ? [...prev, ...(data.items || [])] : (data.items || []));
            setHasMore(data.hasMore || false);
            setPage(pageToLoad);
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể tải đơn hàng');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filterStatus]);

    useEffect(() => { loadOrders(1); }, [filterStatus]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        Alert.alert(
            'Xác nhận',
            `Cập nhật trạng thái đơn hàng thành "${STATUS_LABELS[newStatus]}"?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xác nhận', onPress: async () => {
                        setUpdating(true);
                        try {
                            await api.post('/admin/orders/status', { orderId, newStatus });
                            Alert.alert('Thành công', `Đã cập nhật: ${STATUS_LABELS[newStatus]}`);
                            setSelectedOrder(null);
                            loadOrders(1);
                        } catch (e) {
                            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể cập nhật');
                        } finally {
                            setUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const color = STATUS_COLORS[item.status] || '#6b7280';
        const statusLabel = STATUS_LABELS[item.status] || item.status;
        return (
            <TouchableOpacity style={styles.orderCard} onPress={() => setSelectedOrder(item)}>
                <View style={styles.orderTop}>
                    <View>
                        <Text style={styles.orderId}>#{item.id.slice(-8)}</Text>
                        <Text style={styles.orderCustomer}>{item.User?.name || 'N/A'} — {item.phone}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
                        <Text style={[styles.statusText, { color }]}>{statusLabel}</Text>
                    </View>
                </View>
                <View style={styles.orderBottom}>
                    <Text style={styles.orderAddress} numberOfLines={1}>Địa chỉ: {item.address}</Text>
                    <Text style={styles.orderAmount}>{(item.totalAmount || 0).toLocaleString()} ₫</Text>
                </View>
                <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')} — {item.OrderItems?.length || 0} sản phẩm
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Đơn hàng</Text>
                <TouchableOpacity onPress={() => loadOrders(1)} style={styles.refreshBtn}>
                    <Ionicons name="refresh-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Filter tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {STATUSES.map(s => (
                    <TouchableOpacity key={s} onPress={() => setFilterStatus(s)}
                        style={[styles.filterChip, filterStatus === s && styles.filterChipActive]}>
                        <Text style={[styles.filterText, filterStatus === s && { color: '#fff' }]}>
                            {s === 'ALL' ? 'Tất cả' : STATUS_LABELS[s]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating color="#2563eb" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
                    onEndReached={() => hasMore && !loadingMore && loadOrders(page + 1, true)}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator animating color="#2563eb" /> : null}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>Không có đơn hàng nào.</Text>}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Modal chi tiết đơn hàng */}
            <Modal visible={!!selectedOrder} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {selectedOrder && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Chi tiết Đơn #{selectedOrder.id.slice(-8)}</Text>
                                    <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                                        <Ionicons name="close" size={22} color="#111827" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Khách hàng</Text>
                                        <Text style={styles.detailValue}>{selectedOrder.User?.name} ({selectedOrder.User?.username})</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>SĐT</Text>
                                        <Text style={styles.detailValue}>{selectedOrder.phone}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Địa chỉ</Text>
                                        <Text style={styles.detailValue}>{selectedOrder.address}</Text>
                                    </View>
                                    {selectedOrder.note ? (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Ghi chú</Text>
                                            <Text style={styles.detailValue}>{selectedOrder.note}</Text>
                                        </View>
                                    ) : null}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Trạng thái</Text>
                                        <Text style={[styles.detailValue, { color: STATUS_COLORS[selectedOrder.status], fontWeight: 'bold' }]}>
                                            {STATUS_LABELS[selectedOrder.status]}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Tổng tiền</Text>
                                        <Text style={[styles.detailValue, { color: '#dc2626', fontWeight: 'bold' }]}>
                                            {(selectedOrder.totalAmount || 0).toLocaleString()} ₫
                                        </Text>
                                    </View>

                                    <Text style={{ fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 }}>
                                        Sản phẩm ({selectedOrder.OrderItems?.length || 0}):
                                    </Text>
                                    {(selectedOrder.OrderItems || []).map(item => (
                                        <View key={item.id} style={styles.orderItemRow}>
                                            <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
                                            <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                                            <Text style={styles.orderItemTotal}>{(item.lineTotal || 0).toLocaleString()} ₫</Text>
                                        </View>
                                    ))}

                                    {/* Buttons cập nhật trạng thái */}
                                    {selectedOrder.cancelRequested && (
                                        <View style={styles.cancelAlert}>
                                            <Ionicons name="warning-outline" size={16} color="#b45309" />
                                            <Text style={{ color: '#b45309', marginLeft: 6, fontSize: 13 }}>Khách yêu cầu hủy đơn!</Text>
                                        </View>
                                    )}

                                    {NEXT_STATUS[selectedOrder.status] && (
                                        <Button mode="contained" loading={updating} disabled={updating}
                                            style={{ backgroundColor: STATUS_COLORS[NEXT_STATUS[selectedOrder.status]], marginTop: 12 }}
                                            onPress={() => handleUpdateStatus(selectedOrder.id, NEXT_STATUS[selectedOrder.status])}>
                                            → {STATUS_LABELS[NEXT_STATUS[selectedOrder.status]]}
                                        </Button>
                                    )}

                                    {(selectedOrder.status === 'NEW' || selectedOrder.status === 'CONFIRMED' || selectedOrder.cancelRequested) && (
                                        <Button mode="outlined" loading={updating} disabled={updating}
                                            style={{ borderColor: '#ef4444', marginTop: 8 }}
                                            labelStyle={{ color: '#ef4444' }}
                                            onPress={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}>
                                            Hủy đơn hàng
                                        </Button>
                                    )}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: {
        paddingTop: 48, paddingBottom: 14, paddingHorizontal: 16,
        backgroundColor: '#1e40af', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, marginLeft: 12 },
    refreshBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
    filterBar: { backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb', paddingVertical: 8, maxHeight: 52 },
    filterChip: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
        backgroundColor: '#f3f4f6', marginHorizontal: 4, borderWidth: 1, borderColor: '#e5e7eb',
    },
    filterChipActive: { backgroundColor: '#2563eb', borderColor: '#1d4ed8' },
    filterText: { fontSize: 13, color: '#374151', fontWeight: '500' },
    orderCard: {
        backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, elevation: 1,
    },
    orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    orderId: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
    orderCustomer: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1,
    },
    statusText: { fontSize: 12, fontWeight: '600' },
    orderBottom: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    orderAddress: { fontSize: 12, color: '#6b7280', flex: 1, marginRight: 8 },
    orderAmount: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
    orderDate: { fontSize: 11, color: '#9ca3af' },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalCard: {
        backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 20, maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
    },
    modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    detailRow: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7,
        borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#f3f4f6',
    },
    detailLabel: { fontSize: 13, color: '#6b7280', flex: 1 },
    detailValue: { fontSize: 13, color: '#111827', flex: 2, textAlign: 'right' },
    orderItemRow: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#f3f4f6',
    },
    orderItemName: { flex: 1, fontSize: 13, color: '#374151' },
    orderItemQty: { fontSize: 13, color: '#6b7280', marginHorizontal: 8 },
    orderItemTotal: { fontSize: 13, fontWeight: '600', color: '#111827' },
    cancelAlert: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7',
        borderRadius: 8, padding: 10, marginTop: 10,
    },
});
