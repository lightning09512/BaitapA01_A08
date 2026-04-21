import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    Keyboard,
    StatusBar,
} from 'react-native';
import { Text, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { initiateSocket, getSocket } from '../../services/socket';

export default function AdminChatDetailScreen({ route, navigation }) {
    const { partner } = route.params;
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);
    const flatListRef = useRef();

    useEffect(() => {
        const initChat = async () => {
            try {
                const profileRes = await api.get('/profile');
                setAdminUser(profileRes.data);

                const historyRes = await api.get(`/chat/history/${partner.id}`);
                setMessages(historyRes.data || []);
                
                const socket = await initiateSocket(profileRes.data.id);
                
                socket.on('receive_message', (msg) => {
                    if (msg.senderId === partner.id) {
                        setMessages(prev => [...prev, msg]);
                    }
                });

                socket.on('message_sent', (msg) => {
                    if (msg.receiverId === partner.id) {
                        setMessages(prev => [...prev, msg]);
                    }
                });
            } catch (e) {
                console.log('Admin Chat init error:', e);
            } finally {
                setLoading(false);
            }
        };

        initChat();

        return () => {
            const socket = getSocket();
            if (socket) {
                socket.off('receive_message');
                socket.off('message_sent');
            }
        };
    }, [partner.id]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSend = () => {
        if (!content.trim() || !adminUser) return;

        const socket = getSocket();
        if (socket) {
            socket.emit('send_message', {
                senderId: adminUser.id,
                receiverId: partner.id,
                content: content.trim()
            });
            setContent('');
        }
    };

    const renderMessage = ({ item }) => {
        const isMine = item.senderId === adminUser?.id;
        return (
            <View style={[styles.messageWrapper, isMine ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
                {!isMine && (
                    <Avatar.Image 
                        size={32} 
                        source={{ uri: partner.avatar || 'https://i.pravatar.cc/150' }} 
                        style={styles.avatar} 
                    />
                )}
                <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                        {item.content}
                    </Text>
                    <View style={styles.bubbleFooter}>
                        <Text style={[styles.timeText, isMine ? styles.myTime : styles.theirTime]}>
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {isMine && item.isRead && (
                             <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#2563eb" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#1e40af', '#1e3a8a']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{partner.name || partner.username}</Text>
                    <Text style={styles.headerStatus}>Khách hàng đang chờ...</Text>
                </View>
                <Avatar.Image size={38} source={{ uri: partner.avatar || 'https://i.pravatar.cc/150' }} />
            </LinearGradient>

            <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#1e40af" style={{ marginRight: 4 }} />
                <Text style={styles.adminText}>Chế độ Quản trị viên</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputArea}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="Nhập phản hồi nhanh..."
                            style={styles.input}
                            mode="flat"
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            multiline
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={handleSend}
                        disabled={!content.trim()}
                        style={[styles.sendBtn, !content.trim() && styles.sendBtnDisabled]}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        paddingTop: Platform.OS === 'android' ? 45 : 10,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    },
    backBtn: { padding: 4 },
    headerInfo: { flex: 1, marginLeft: 12 },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
    headerStatus: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
    adminBadge: { padding: 4, backgroundColor: '#dbeafe', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    adminText: { fontSize: 11, color: '#1e40af', fontWeight: 'bold' },
    listContent: { padding: 16, paddingBottom: 20 },
    messageWrapper: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
    myMessageWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    theirMessageWrapper: { alignSelf: 'flex-start' },
    avatar: { marginRight: 8, alignSelf: 'flex-end' },
    bubble: { padding: 12, borderRadius: 18, elevation: 1 },
    myBubble: { backgroundColor: '#2563eb', borderBottomRightRadius: 2 },
    theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2 },
    messageText: { fontSize: 15, lineHeight: 20 },
    myText: { color: '#fff' },
    theirText: { color: '#1f2937' },
    bubbleFooter: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
    timeText: { fontSize: 10 },
    myTime: { color: 'rgba(255,255,255,0.7)' },
    theirTime: { color: '#9ca3af' },
    inputArea: {
        flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb',
    },
    inputWrapper: {
        flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20,
        paddingHorizontal: 15, marginRight: 10, minHeight: 45, justifyContent: 'center',
    },
    input: { backgroundColor: 'transparent', fontSize: 14, height: 45 },
    sendBtn: {
        width: 45, height: 45, borderRadius: 23, backgroundColor: '#2563eb',
        alignItems: 'center', justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: '#93c5fd' },
});
