import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, IconButton, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function NotificationScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data || []);
        } catch (e) {
            console.log('Load notifications error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.log("Error marking as read", error);
        }
    };

    const renderItem = ({ item }) => (
        <Card style={[styles.card, !item.isRead && styles.unreadCard]}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications" size={24} color={!item.isRead ? '#2563eb' : '#9ca3af'} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
            </Card.Content>
        </Card>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator animating color="#2563eb" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Thông báo</Text>
                {notifications.some(n => !n.isRead) ? (
                    <IconButton icon="check-all" onPress={markAllAsRead} />
                ) : (
                    <View style={{ width: 48 }} /> 
                )}
            </View>

            {notifications.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="notifications-off-outline" size={60} color="#d1d5db" />
                    <Text style={styles.emptyText}>Bạn chưa có thông báo nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', elevation: 4, paddingTop: 40, paddingBottom: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    emptyText: { color: '#6b7280', fontSize: 16, marginTop: 16 },
    card: { marginBottom: 12, backgroundColor: '#ffffff' },
    unreadCard: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1 },
    cardContent: { flexDirection: 'row', alignItems: 'flex-start' },
    iconContainer: { marginRight: 12, marginTop: 4 },
    textContainer: { flex: 1 },
    title: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 4 },
    unreadText: { color: '#111827', fontWeight: 'bold' },
    message: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
    time: { fontSize: 12, color: '#9ca3af' },
    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6', marginTop: 8 }
});
