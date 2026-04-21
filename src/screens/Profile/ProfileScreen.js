import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Badge, Divider, Text } from 'react-native-paper';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});
    const [orderCounts, setOrderCounts] = useState({ 
        WAIT_CONFIRM: 0, 
        WAIT_PICKUP: 0, 
        SHIPPING: 0, 
        REVIEW: 0 
    });
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [profileRes, ordersRes] = await Promise.all([
                api.get('/profile'),
                api.get('/orders')
            ]);
            
            setUser(profileRes.data || {});
            
            const orders = ordersRes.data || [];
            const counts = { WAIT_CONFIRM: 0, WAIT_PICKUP: 0, SHIPPING: 0, REVIEW: 0 };
            
            orders.forEach(o => {
                if (o.status === 'NEW') counts.WAIT_CONFIRM++;
                else if (o.status === 'CONFIRMED' || o.status === 'PREPARING') counts.WAIT_PICKUP++;
                else if (o.status === 'SHIPPING') counts.SHIPPING++;
                else if (o.status === 'DELIVERED') counts.REVIEW++;
            });
            
            setOrderCounts(counts);
        } catch (e) {
            console.log('Load dashboard error:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const logout = async () => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const StatusIcon = ({ name, label, badge, onPress }) => (
        <TouchableOpacity style={styles.statusBox} onPress={onPress}>
            <View>
                <Ionicons name={name} size={28} color="#4b5563" />
                {badge > 0 && (
                    <Badge style={styles.badge} size={18}>{badge}</Badge>
                )}
            </View>
            <Text style={styles.statusLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const UtilityItem = ({ icon, label, subtext, color, onPress }) => (
        <TouchableOpacity style={styles.utilityBox} onPress={onPress}>
            <Ionicons name={icon} size={26} color={color || "#4b5563"} />
            <Text style={styles.utilityLabel}>{label}</Text>
            {subtext && <Text style={[styles.utilitySubtext, { color: color || '#666' }]}>{subtext}</Text>}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header Section */}
                <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerTopActions}>
                        <View style={{ flex: 1 }} />
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Ionicons name="settings-outline" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CartTab')}>
                                <Ionicons name="cart-outline" size={24} color="#fff" />
                                <Badge style={styles.headerBadge} size={16}>81</Badge>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Chat')}>
                                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.userInfoRow}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Image
                            source={{ uri: user.avatar || 'https://i.pravatar.cc/150' }}
                            style={styles.avatar}
                        />
                        <View style={styles.userTextContent}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.userName} numberOfLines={1}>{user.username || 'Người dùng'}</Text>
                                <View style={styles.tierBadge}>
                                    <Text style={styles.tierText}>Vàng</Text>
                                    <Ionicons name="chevron-forward" size={12} color="#f59e0b" />
                                </View>
                            </View>
                            <View style={styles.statsRow}>
                                <Text style={styles.statsText}>31 <Text style={styles.statsLabel}>Đang theo dõi</Text></Text>
                                <View style={styles.statsDivider} />
                                <Text style={styles.statsText}>0 <Text style={styles.statsLabel}>Người theo dõi</Text></Text>
                            </View>
                            {user.bio ? (
                                <Text style={styles.bioText} numberOfLines={1}>{user.bio}</Text>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                </LinearGradient>


                {/* Orders Section */}
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => navigation.navigate('Orders')}
                    >
                        <Text style={styles.sectionTitle}>Đơn mua</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.viewHistoryText}>Xem lịch sử mua hàng</Text>
                            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.statusRow}>
                        <StatusIcon 
                            name="wallet-outline" 
                            label="Chờ xác nhận" 
                            badge={orderCounts.WAIT_CONFIRM}
                            onPress={() => navigation.navigate('Orders', { initialTab: 'WAIT_CONFIRM' })}
                        />
                        <StatusIcon 
                            name="cube-outline" 
                            label="Chờ lấy hàng" 
                            badge={orderCounts.WAIT_PICKUP}
                            onPress={() => navigation.navigate('Orders', { initialTab: 'WAIT_PICKUP' })}
                        />
                        <StatusIcon 
                            name="bicycle-outline" 
                            label="Chờ giao hàng" 
                            badge={orderCounts.SHIPPING}
                            onPress={() => navigation.navigate('Orders', { initialTab: 'SHIPPING' })}
                        />
                        <StatusIcon 
                            name="star-outline" 
                            label="Đánh giá" 
                            badge={orderCounts.REVIEW}
                            onPress={() => navigation.navigate('Orders', { initialTab: 'REVIEW' })}
                        />
                    </View>
                    <Divider style={{ marginTop: 16 }} />
                    <TouchableOpacity style={styles.serviceItem}>
                        <Ionicons name="phone-portrait-outline" size={20} color="#10b981" />
                        <Text style={styles.serviceText}>Đơn Nạp điện thoại & Dịch vụ</Text>
                        <Text style={styles.serviceAction}>Giảm ₫80k</Text>
                        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity style={styles.serviceItem}>
                        <MaterialCommunityIcons name="food" size={20} color="#ef4444" />
                        <Text style={styles.serviceText}>Đơn SellphoneKFood</Text>
                        <Text style={styles.serviceAction}>Đang có ưu đãi</Text>
                        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* Utility Section */}
                <View style={styles.sectionCard}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 16, paddingTop: 16 }]}>Tiện ích của tôi</Text>
                    <View style={styles.utilityRow}>
                        <UtilityItem
                            icon="wallet-outline"
                            label="Ví SellphoneK"
                            subtext="Gói voucher 1.000.000₫"
                            color="#dc2626"
                            onPress={() => navigation.navigate('Wallet')}
                        />
                        <UtilityItem
                            icon="time-outline"
                            label="SellphoneK Later"
                            subtext="₫ 14.926.887"
                            color="#3b82f6"
                        />
                        <UtilityItem
                            icon="logo-usd"
                            label="Xu SellphoneK"
                            subtext="0 xu"
                            color="#f59e0b"
                        />
                        <UtilityItem
                            icon="ticket-outline"
                            label="Kho Voucher"
                            subtext="50+ Voucher"
                            color="#ef4444"
                            onPress={() => navigation.navigate('Wallet')}
                        />
                    </View>
                </View>

                {/* Menu List */}
                <View style={[styles.sectionCard, { marginTop: 10, paddingBottom: 10 }]}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>
                        <Ionicons name="heart-outline" size={24} color="#ef4444" style={{ marginRight: 15 }} />
                        <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                    <Divider style={styles.menuDivider} />
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewedProducts')}>
                        <Ionicons name="time-outline" size={24} color="#3b82f6" style={{ marginRight: 15 }} />
                        <Text style={styles.menuText}>Sản phẩm đã xem</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Text style={styles.logoutBtnText}>Đăng xuất</Text>
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 30,
        paddingHorizontal: 16,
    },
    headerTopActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 18,
        position: 'relative',
    },
    headerBadge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: '#fff',
        color: '#dc2626',
        fontWeight: 'bold',
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    userTextContent: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        maxWidth: width * 0.4,
    },
    tierBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    tierText: {
        fontSize: 11,
        color: '#f59e0b',
        fontWeight: 'bold',
        marginRight: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    statsText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: 'bold',
    },
    statsLabel: {
        fontWeight: 'normal',
        opacity: 0.9,
    },
    bioText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 6,
        fontStyle: 'italic',
    },
    statsDivider: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
        mx: 10,
        marginHorizontal: 10,
    },
    sectionCard: {
        backgroundColor: '#fff',
        marginTop: 12,
        paddingBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f3f4f6',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
    },
    viewHistoryText: {
        fontSize: 13,
        color: '#9ca3af',
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    serviceText: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
        marginLeft: 10,
    },
    serviceAction: {
        fontSize: 12,
        color: '#ef4444',
        marginRight: 4,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
    },
    statusBox: {
        alignItems: 'center',
        width: width / 4,
    },
    statusLabel: {
        fontSize: 12,
        color: '#4b5563',
        marginTop: 8,
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: '#dc2626',
    },
    utilityRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10,
    },
    utilityBox: {
        width: width / 4,
        alignItems: 'center',
        paddingVertical: 15,
    },
    utilityLabel: {
        fontSize: 11,
        color: '#374151',
        marginTop: 8,
        textAlign: 'center',
    },
    utilitySubtext: {
        fontSize: 9,
        marginTop: 4,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
    },
    menuDivider: {
        marginHorizontal: 16,
        backgroundColor: '#f3f4f6',
    },
    logoutBtn: {
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    logoutBtnText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});