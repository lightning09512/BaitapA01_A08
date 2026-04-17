import React, { useEffect, useState, useCallback } from 'react';
import {
    View, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput as RNTextInput,
} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import api from '../../services/api';

export default function AdminUsersScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadUsers = useCallback(async (pageToLoad = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        try {
            const res = await api.get(`/admin/users?page=${pageToLoad}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ''}`);
            const data = res.data;
            setUsers(prev => append ? [...prev, ...(data.items || [])] : (data.items || []));
            setHasMore(data.hasMore || false);
            setPage(pageToLoad);
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search]);

    useEffect(() => { loadUsers(1); }, [search]);

    const handleToggleRole = (user) => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        Alert.alert(
            'Thay đổi quyền',
            `Đổi quyền của "${user.username}" thành "${newRole}"?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xác nhận', onPress: async () => {
                        try {
                            await api.post('/admin/users/role', { userId: user.id, newRole });
                            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                            Alert.alert('Thành công', `Đã đổi quyền thành ${newRole}`);
                        } catch (e) {
                            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể cập nhật quyền');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.userCard}>
            <Image
                source={{ uri: item.avatar || 'https://i.pravatar.cc/80' }}
                style={styles.avatar}
                contentFit="cover"
            />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Text style={styles.userName}>{item.name || item.username}</Text>
                    <View style={[styles.roleBadge, item.role === 'admin' ? styles.roleAdmin : styles.roleCustomer]}>
                        <Text style={styles.roleText}>{item.role || 'customer'}</Text>
                    </View>
                </View>
                <Text style={styles.userMeta}>@{item.username} • {item.email}</Text>
                <Text style={styles.userMeta}>
                    {item.phone || 'Chưa có SĐT'} • {item.points || 0} điểm •
                    {item.isVerified ? ' (Verified)' : ' (Unverified)'}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleRole(item)} style={styles.roleBtn}>
                <Ionicons
                    name={item.role === 'admin' ? 'shield-checkmark' : 'shield-outline'}
                    size={20}
                    color={item.role === 'admin' ? '#dc2626' : '#9ca3af'}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Người dùng</Text>
                <TouchableOpacity onPress={() => loadUsers(1)} style={styles.refreshBtn}>
                    <Ionicons name="refresh-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
                <Ionicons name="search-outline" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                <RNTextInput
                    style={styles.searchInput}
                    placeholder="Tìm theo tên, username, email..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating color="#059669" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
                    onEndReached={() => hasMore && !loadingMore && loadUsers(page + 1, true)}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator animating color="#059669" /> : null}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>Không có người dùng nào.</Text>}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: {
        paddingTop: 48, paddingBottom: 14, paddingHorizontal: 16,
        backgroundColor: '#065f46', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, marginLeft: 12 },
    refreshBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
    searchRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', margin: 12, paddingHorizontal: 12,
        borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb',
    },
    searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 10 },
    userCard: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10,
        padding: 12, marginBottom: 8, alignItems: 'center', elevation: 1, gap: 10,
    },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#e5e7eb' },
    userName: { fontSize: 14, fontWeight: '600', color: '#111827' },
    userMeta: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
    roleBadge: {
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
    },
    roleAdmin: { backgroundColor: '#fee2e2' },
    roleCustomer: { backgroundColor: '#f3f4f6' },
    roleText: { fontSize: 11, fontWeight: '600', color: '#374151' },
    roleBtn: { padding: 8 },
});
