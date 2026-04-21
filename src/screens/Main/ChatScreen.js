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
import { Text, TextInput, IconButton, Avatar, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';
import { initiateSocket, getSocket } from '../../services/socket';

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const flatListRef = useRef();

    useEffect(() => {
        const initChat = async () => {
            try {
                // 1. Get profiles
                const [profileRes, supportRes] = await Promise.all([
                    api.get('/profile'),
                    api.get('/support-info')
                ]);
                
                setCurrentUser(profileRes.data);
                setAdminUser(supportRes.data);

                // 2. Load history
                const historyRes = await api.get(`/chat/history/${supportRes.data.id}`);
                setMessages(historyRes.data || []);
                
                // 3. Register socket
                const socket = await initiateSocket(profileRes.data.id);
                
                socket.on('receive_message', (msg) => {
                    if (msg.senderId === supportRes.data.id) {
                        setMessages(prev => [...prev, msg]);
                    }
                });

                socket.on('message_sent', (msg) => {
                    setMessages(prev => [...prev, msg]);
                });
            } catch (e) {
                console.log('Chat init error:', e);
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
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSend = () => {
        if (!content.trim() || !adminUser || !currentUser) return;

        const socket = getSocket();
        if (socket) {
            socket.emit('send_message', {
                senderId: currentUser.id,
                receiverId: adminUser.id,
                content: content.trim()
            });
            setContent('');
            // Optional: Haptic feedback here
        }
    };

    const renderMessage = ({ item }) => {
        const isMine = item.senderId === currentUser?.id;
        return (
            <View style={[styles.messageWrapper, isMine ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
                {!isMine && (
                    <Avatar.Image 
                        size={32} 
                        source={{ uri: adminUser?.avatar || 'https://i.pravatar.cc/150' }} 
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
                        {isMine && (
                             <Ionicons 
                                name={item.isRead ? "checkmark-done" : "checkmark"} 
                                size={14} 
                                color="rgba(255,255,255,0.7)" 
                                style={{ marginLeft: 4 }} 
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="#dc2626" size="large" />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>Đang kết nối hỗ trợ...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Hỗ trợ khách hàng</Text>
                    <View style={styles.headerStatusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.headerStatus}>Sẵn sàng giải đáp</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.headerIcon}>
                    <Ionicons name="call-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

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
                    <TouchableOpacity style={styles.inputAction}>
                        <Ionicons name="add-circle-outline" size={26} color="#6b7280" />
                    </TouchableOpacity>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="Nhập tin nhắn..."
                            style={styles.input}
                            mode="flat"
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            placeholderTextColor="#9ca3af"
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        paddingTop: Platform.OS === 'android' ? 45 : 10,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
    },
    backBtn: { padding: 4 },
    headerInfo: { flex: 1, marginLeft: 12 },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
    headerStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80', marginRight: 6 },
    headerStatus: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
    headerIcon: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
    listContent: { padding: 16, paddingBottom: 20 },
    messageWrapper: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
    myMessageWrapper: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    theirMessageWrapper: { alignSelf: 'flex-start' },
    avatar: { marginRight: 8, alignSelf: 'flex-end', marginBottom: 2 },
    bubble: { padding: 12, paddingHorizontal: 15, borderRadius: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    myBubble: { backgroundColor: '#dc2626', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 20 },
    myText: { color: '#fff' },
    theirText: { color: '#1f2937' },
    bubbleFooter: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
    timeText: { fontSize: 10 },
    myTime: { color: 'rgba(255,255,255,0.6)' },
    theirTime: { color: '#9ca3af' },
    inputArea: {
        flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb',
    },
    inputAction: { marginRight: 10 },
    inputWrapper: {
        flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20,
        paddingHorizontal: 12, marginRight: 10,
        justifyContent: 'center', minHeight: 40,
    },
    input: { backgroundColor: 'transparent', fontSize: 14, paddingVertical: 8, height: 40 },
    sendBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#dc2626',
        alignItems: 'center', justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: '#fca5a5' },
});
