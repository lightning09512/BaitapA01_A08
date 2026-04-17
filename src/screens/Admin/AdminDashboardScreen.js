import React, { useEffect, useRef, useState } from 'react';
import {
    Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Animated,
} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../services/api';

const { width } = Dimensions.get('window');

const STATUS_COLORS = {
    NEW: '#f59e0b', CONFIRMED: '#3b82f6', PREPARING: '#8b5cf6',
    SHIPPING: '#06b6d4', DELIVERED: '#22c55e', CANCELLED: '#ef4444',
};
const STATUS_LABELS = {
    NEW: 'Mới', CONFIRMED: 'Xác nhận', PREPARING: 'Chuẩn bị',
    SHIPPING: 'Vận chuyển', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};

function StatCard({ icon, value, color }) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
            </View>
        </View>
    );
}

export default function AdminDashboardScreen({ navigation }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể tải thống kê.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadStats(); }, []);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['TOKEN', 'USER_ROLE']);
        setAuthToken(null);
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSub}>SellphoneK Management</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating color="#dc2626" size="large" />
                </View>
            ) : (
                <Animated.ScrollView style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}>
                    {/* Stats tổng quan */}
                    <Text style={styles.sectionTitle}>Tổng quan</Text>
                    <View style={styles.statsRow}>
                        <StatCard icon="cube-outline" value={stats?.totalProducts || 0} color="#dc2626" />
                        <StatCard icon="people-outline" value={stats?.totalUsers || 0} color="#3b82f6" />
                        <StatCard icon="receipt-outline" value={stats?.totalOrders || 0} color="#8b5cf6" />
                    </View>

                    {/* Doanh thu */}
                    <Text style={styles.sectionTitle}>Doanh thu (Đã giao)</Text>
                    <View style={styles.revenueCard}>
                        <View style={styles.revenueItem}>
                            <Text style={styles.revenueLabel}>Tháng này</Text>
                            <Text style={styles.revenueValue}>
                                {(stats?.revenue?.thisMonth || 0).toLocaleString()} ₫
                            </Text>
                        </View>
                        <View style={styles.revenueDivider} />
                        <View style={styles.revenueItem}>
                            <Text style={styles.revenueLabel}>Tháng trước</Text>
                            <Text style={[styles.revenueValue, { color: '#6b7280' }]}>
                                {(stats?.revenue?.lastMonth || 0).toLocaleString()} ₫
                            </Text>
                        </View>
                        <View style={styles.revenueDivider} />
                        <View style={styles.revenueItem}>
                            <Text style={styles.revenueLabel}>Tổng doanh thu</Text>
                            <Text style={[styles.revenueValue, { color: '#22c55e' }]}>
                                {(stats?.revenue?.total || 0).toLocaleString()} ₫
                            </Text>
                        </View>
                    </View>

                    {/* Đơn hàng theo trạng thái */}
                    <Text style={styles.sectionTitle}>Đơn hàng theo trạng thái</Text>
                    <View style={styles.statusGrid}>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <View key={key} style={[styles.statusCard, { borderColor: STATUS_COLORS[key] }]}>
                                <Text style={[styles.statusCount, { color: STATUS_COLORS[key] }]}>
                                    {stats?.orderByStatus?.[key] || 0}
                                </Text>
                                <Text style={styles.statusLabel}>{label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Top sản phẩm */}
                    <Text style={styles.sectionTitle}>Top 5 Bán chạy</Text>
                    <View style={styles.topProductList}>
                        {(stats?.topProducts || []).map((p, i) => (
                            <View key={p.id} style={styles.topProductRow}>
                                <Text style={styles.topProductRank}>#{i + 1}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.topProductName} numberOfLines={1}>{p.name}</Text>
                                    <Text style={styles.topProductSold}>Đã bán: {p.soldQuantity}</Text>
                                </View>
                                <Text style={styles.topProductPrice}>{p.price.toLocaleString()} ₫</Text>
                            </View>
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <Text style={styles.sectionTitle}>Quản lý</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#fee2e2' }]} onPress={() => navigation.navigate('AdminProducts')}>
                            <Ionicons name="phone-portrait-outline" size={28} color="#dc2626" />
                            <Text style={[styles.actionLabel, { color: '#dc2626' }]}>Sản phẩm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#dbeafe' }]} onPress={() => navigation.navigate('AdminOrders')}>
                            <Ionicons name="list-outline" size={28} color="#2563eb" />
                            <Text style={[styles.actionLabel, { color: '#2563eb' }]}>Đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#d1fae5' }]} onPress={() => navigation.navigate('AdminUsers')}>
                            <Ionicons name="people-outline" size={28} color="#059669" />
                            <Text style={[styles.actionLabel, { color: '#059669' }]}>Người dùng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#fef3c7' }]} onPress={loadStats}>
                            <Ionicons name="refresh-outline" size={28} color="#d97706" />
                            <Text style={[styles.actionLabel, { color: '#d97706' }]}>Làm mới</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </Animated.ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: {
        paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16,
        backgroundColor: '#991b1b',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    logoutBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
    sectionTitle: {
        fontSize: 16, fontWeight: '700', color: '#111827',
        marginHorizontal: 16, marginTop: 20, marginBottom: 10,
    },
    statsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8 },
    statCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12,
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderLeftWidth: 4, elevation: 2,
    },
    statIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: 11, color: '#6b7280', marginBottom: 2 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    revenueCard: {
        marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16,
        flexDirection: 'row', elevation: 2,
    },
    revenueItem: { flex: 1, alignItems: 'center' },
    revenueLabel: { fontSize: 11, color: '#6b7280', marginBottom: 6 },
    revenueValue: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
    revenueDivider: { width: 1, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
    statusGrid: {
        flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8,
    },
    statusCard: {
        width: (width - 56) / 3, backgroundColor: '#fff', borderRadius: 10,
        padding: 12, alignItems: 'center', borderWidth: 2, elevation: 1,
    },
    statusCount: { fontSize: 22, fontWeight: 'bold' },
    statusLabel: { fontSize: 11, color: '#6b7280', marginTop: 3 },
    topProductList: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
    topProductRow: {
        flexDirection: 'row', alignItems: 'center', padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f3f4f6', gap: 10,
    },
    topProductRank: { fontSize: 16, fontWeight: 'bold', color: '#dc2626', width: 28 },
    topProductName: { fontSize: 14, fontWeight: '600', color: '#111827' },
    topProductSold: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    topProductPrice: { fontSize: 13, fontWeight: 'bold', color: '#dc2626' },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
    actionCard: {
        width: (width - 54) / 2, borderRadius: 14, padding: 18,
        alignItems: 'center', elevation: 1,
    },
    actionLabel: { fontSize: 14, fontWeight: '700', marginTop: 8 },
});
