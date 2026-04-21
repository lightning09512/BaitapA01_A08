import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Text, Avatar, Badge, Divider, ActivityIndicator, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

export default function AdminChatListScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const loadConversations = async () => {
        try {
            const res = await api.get('/admin/chat/conversations');
            setConversations(res.data || []);
        } catch (e) {
            console.log('Load conversations error:', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [])
    );

    const filteredConversations = conversations.filter(c => 
        c.partner.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.partner.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatRow} 
            onPress={() => navigation.navigate('AdminChatDetail', { partner: item.partner })}
        >
            <View style={styles.avatarContainer}>
                <Avatar.Image 
                    size={54} 
                    source={{ uri: item.partner.avatar || 'https://i.pravatar.cc/150' }} 
                />
                {/* Optional online indicator if we had real-time status */}
                <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.partnerName} numberOfLines={1}>{item.partner.name || item.partner.username}</Text>
                    <Text style={styles.chatTime}>
                        {new Date(item.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={styles.chatFooter}>
                    <Text style={[styles.lastMsg, item.unreadCount > 0 && styles.unreadMsg]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <Badge style={styles.badge} size={22}>{item.unreadCount}</Badge>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#1e40af', '#1e3a8a']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trung tâm Hỗ trợ</Text>
                <TouchableOpacity onPress={loadConversations} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={22} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm tên khách hàng..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ fontSize: 14 }}
                    iconColor="#9ca3af"
                />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#1e40af" size="large" />
                    <Text style={{ marginTop: 12, color: '#6b7280' }}>Đang tải tin nhắn...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredConversations}
                    keyExtractor={item => item.partner.id.toString()}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Ionicons name="chatbubble-outline" size={60} color="#e5e7eb" />
                            <Text style={styles.emptyText}>Chưa có cuộc hội thoại nào mới.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 16, paddingTop: Platform.OS === 'android' ? 45 : 10,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    refreshBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
    searchContainer: { padding: 16, backgroundColor: 'transparent' },
    searchBar: { borderRadius: 12, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, height: 48 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    list: { paddingBottom: 20 },
    chatRow: { flexDirection: 'row', padding: 16, alignItems: 'center', backgroundColor: '#fff' },
    avatarContainer: { position: 'relative' },
    onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#fff' },
    chatInfo: { flex: 1, marginLeft: 16, marginRight: 8 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    partnerName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    chatTime: { fontSize: 12, color: '#9ca3af' },
    chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    lastMsg: { fontSize: 14, color: '#6b7280', flex: 1 },
    unreadMsg: { color: '#111827', fontWeight: 'bold' },
    badge: { backgroundColor: '#ef4444' },
    divider: { height: 1, backgroundColor: '#f3f4f6' },
    emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 16, fontSize: 15 },
});
