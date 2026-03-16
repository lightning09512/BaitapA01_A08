import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function OrderStatsScreen({ navigation }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get('/orders/statistics');
                setStats(res.data);
            } catch (e) {
                console.log('Load order statistics error:', e);
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    if (loading) return <View style={styles.center}><ActivityIndicator animating color="#2563eb" /></View>;

    if (!stats || !stats.summary) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#6b7280' }}>Không thể tải dữ liệu thống kê.</Text>
            </View>
        );
    }

    const { summary, totalAmount } = stats;

    const renderStatCard = (title, data, icon, color) => (
        <Card style={[styles.statCard, { borderLeftColor: color }]}>
            <Card.Content style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={28} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.statTitle}>{title}</Text>
                    <Text style={[styles.statValue, { color }]}>{data.total.toLocaleString()} ₫</Text>
                    <Text style={styles.statSub}>{data.count} đơn hàng</Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#111827" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Thống Kê Dòng Tiền</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Tổng Tài Sản Đơn Hàng</Text>
                    <Text style={styles.totalValue}>{totalAmount.toLocaleString()} ₫</Text>
                </View>

                <Text style={styles.sectionTitle}>Chi tiết theo trạng thái</Text>

                {renderStatCard("Chờ xác nhận & Đang chuẩn bị", summary.PENDING, "time-outline", "#f59e0b")}
                {renderStatCard("Đang giao hàng", summary.SHIPPING, "car-outline", "#3b82f6")}
                {renderStatCard("Đã giao thành công", summary.DELIVERED, "checkmark-circle-outline", "#10b981")}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 12, elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    totalBox: { backgroundColor: '#1e3a8a', padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24, elevation: 4 },
    totalLabel: { color: '#bfdbfe', fontSize: 14, fontWeight: '500', marginBottom: 8 },
    totalValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
    statCard: { marginBottom: 12, backgroundColor: '#fff', borderLeftWidth: 4, borderRadius: 8 },
    cardContent: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    textContainer: { flex: 1 },
    statTitle: { fontSize: 14, color: '#4b5563', fontWeight: '500', marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statSub: { fontSize: 12, color: '#9ca3af', marginTop: 4 }
});
