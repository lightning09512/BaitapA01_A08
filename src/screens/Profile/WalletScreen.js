import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function WalletScreen({ navigation }) {
    const [points, setPoints] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get('/users/wallet');
                setPoints(res.data?.points || 0);
                setCoupons(res.data?.coupons || []);
            } catch (e) {
                console.log('Load wallet error:', e);
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    if (loading) return <View style={styles.center}><ActivityIndicator animating color="#f59e0b" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            {/* Card hiển thị Điểm */}
            <View style={styles.pointsCard}>
                <Ionicons name="star" size={32} color="#facc15" style={{ marginBottom: 8 }} />
                <Text style={styles.pointsTitle}>Điểm tích lũy hiện tại</Text>
                <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
                <Text style={styles.pointsSubtitle}>1 điểm = 1.000đ (Áp dụng khi thanh toán)</Text>
            </View>

            <Text style={styles.sectionTitle}>Mã giảm giá của bạn ({coupons.length})</Text>

            {coupons.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Ionicons name="ticket-outline" size={40} color="#9ca3af" />
                    <Text style={styles.emptyText}>Bạn chưa có mã giảm giá nào.</Text>
                    <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Hãy đánh giá sản phẩm đã mua để nhận thêm mã giảm giá nhé!</Text>
                </View>
            ) : (
                coupons.map((coupon, index) => (
                    <Card key={index} style={styles.couponCard}>
                        <Card.Content style={styles.couponContent}>
                            <View style={styles.couponLeft}>
                                <Text style={styles.discountText}>Giảm {coupon.discountPercent}%</Text>
                            </View>
                            <View style={styles.couponRight}>
                                <Text style={styles.couponCode}>Mã: {coupon.code}</Text>
                                <Text style={styles.couponDesc}>{coupon.description}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    pointsCard: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    pointsTitle: { color: '#bfdbfe', fontSize: 14, fontWeight: '500', marginBottom: 4 },
    pointsValue: { color: '#ffffff', fontSize: 40, fontWeight: 'bold' },
    pointsSubtitle: { color: '#bfdbfe', fontSize: 12, marginTop: 8 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
    emptyCard: { backgroundColor: '#ffffff', borderRadius: 8, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed' },
    emptyText: { fontSize: 15, color: '#374151', fontWeight: '500', marginTop: 12 },
    couponCard: { marginBottom: 12, backgroundColor: '#ffffff' },
    couponContent: { flexDirection: 'row', padding: 0, alignItems: 'center' },
    couponLeft: { backgroundColor: '#fee2e2', padding: 16, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, justifyContent: 'center', alignItems: 'center', width: 90 },
    discountText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
    couponRight: { flex: 1, padding: 16, justifyContent: 'center' },
    couponCode: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    couponDesc: { fontSize: 13, color: '#4b5563' }
});
