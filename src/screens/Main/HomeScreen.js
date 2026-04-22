
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Platform,
    RefreshControl,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ActivityIndicator, Badge, Surface, Text } from 'react-native-paper';
import api from '../../services/api';
import { disconnectSocket, initSocket } from '../../services/socket';

const { width } = Dimensions.get('window');

// Mapping categories to illustrative images (Cellphones style)
const CATEGORY_IMAGES = {
    'Phone': 'https://cdn-icons-png.freepik.com/512/13/13398.png',
    'Laptop': 'https://cdn-icons-png.flaticon.com/512/428/428001.png',
    'Tablet': 'https://cdn-icons-png.flaticon.com/512/1530/1530457.png',
    'Watch': 'https://cdn-icons-png.flaticon.com/512/2972/2972144.png',
    'Audio': 'https://cdn-icons-png.flaticon.com/512/3127/3127289.png',
    'Accessory': 'https://static.vecteezy.com/system/resources/previews/054/035/608/non_2x/keyboard-and-mouse-set-icon-features-a-sleek-and-modern-design-perfect-for-representing-computer-peripherals-tech-accessories-or-gaming-setups-vector.jpg',
};

export default function HomeScreen({ navigation }) {
    const [searchInput, setSearchInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [products, setProducts] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingBest, setLoadingBest] = useState(true);
    const [loadingDiscount, setLoadingDiscount] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const PAGE_SIZE = 10;
    const categoryOptions = categories.filter((c) => c && c !== 'All');
    const brandOptions = ['All', ...brands.filter((b) => b && b !== 'All')];

    const fetchInitial = async () => {
        try {
            // Fetch individually with catch to stay robust
            const [catRes, brandRes, bestRes, discountRes] = await Promise.all([
                api.get('/categories').catch(e => ({ data: [] })),
                api.get('/brands').catch(e => ({ data: [] })),
                api.get('/products/best-selling?limit=10').catch(e => ({ data: [] })),
                api.get('/products/by-discount?limit=20').catch(e => ({ data: [] })),
            ]);

            const cats = Array.isArray(catRes.data) ? catRes.data : [];
            const brs = Array.isArray(brandRes.data) ? brandRes.data : [];

            setCategories(cats);
            setBrands(brs);

            setSelectedCategory(''); // No category selected by default instead of 'All'
            setSelectedBrand('All');

            setBestSelling(Array.isArray(bestRes.data) ? bestRes.data : []);
            setDiscountProducts(Array.isArray(discountRes.data) ? discountRes.data : []);
        } catch (e) {
            console.log('Home initial load error:', e);
        } finally {
            setLoadingBest(false);
            setLoadingDiscount(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    const fetchProducts = async (pageToLoad = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoadingMain(true);

        try {
            const params = [];
            // Home page keeps category/brand recommendations.
            if (selectedCategory) {
                params.push(`category=${encodeURIComponent(selectedCategory)}`);
            }
            if (selectedBrand) {
                params.push(`brand=${encodeURIComponent(selectedBrand)}`);
            }
            params.push(`page=${pageToLoad}`);
            params.push(`limit=${PAGE_SIZE}`);
            const query = params.length ? `?${params.join('&')}` : '';
            const res = await api.get(`/products${query}`);
            const payload = res.data;
            const items = Array.isArray(payload) ? payload : payload.items || [];
            const more = Array.isArray(payload) ? false : !!payload.hasMore;

            setProducts(prev => (append ? [...prev, ...items] : items));
            setHasMore(more);
            setPage(pageToLoad);
        } catch (e) {
            console.log('Home products load error:', e);
        } finally {
            setLoadingMain(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchProducts(1, false);
    }, [selectedCategory, selectedBrand]);

    const submitSearch = () => {
        const normalized = searchInput.trim().replace(/\s+/g, ' ');
        if (!normalized) return;
        navigation.navigate('SearchProducts', { initialKeyword: normalized });
    };

    const openSearchWithFilters = (category = selectedCategory, brand = selectedBrand) => {
        const normalized = searchInput.trim().replace(/\s+/g, ' ');
        navigation.navigate('SearchProducts', {
            initialKeyword: normalized,
            initialCategory: category || 'All',
            initialBrand: brand || 'All'
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            const loadUnreadCount = async () => {
                try {
                    const res = await api.get('/notifications');
                    const unreadList = (res.data || []).filter(n => !n.isRead);
                    setUnreadNotifCount(unreadList.length);
                } catch (e) {
                    console.log('Load unread notifications error:', e);
                }
            };
            loadUnreadCount();

            const setupSocket = async () => {
                try {
                    const profRes = await api.get('/profile');
                    const user = profRes.data;
                    if (user && user.username) {
                        const socket = initSocket(user.username);
                        socket.on('new_notification', (notif) => {
                            setUnreadNotifCount(prev => prev + 1);
                        });
                    }
                } catch (e) {
                    console.log('Setup socket error:', e);
                }
            };
            setupSocket();

            return () => {
                disconnectSocket();
            };
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchInitial();
        fetchProducts(1, false);
    };

    const handleLoadMore = () => {
        if (!hasMore || loadingMore || loadingMain) return;
        fetchProducts(page + 1, true);
    };

    const renderProductCard = (item, type = 'normal') => {
        const isSmall = type === 'grid';
        const isLarge = type === 'best';

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.productCard,
                    isSmall && styles.productCardSmall,
                    isLarge && styles.productCardLarge
                ]}
                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                activeOpacity={0.8}
            >
                <Surface style={styles.cardSurface} elevation={1}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={isLarge ? styles.imgLarge : (isSmall ? styles.imgSmall : styles.img)}
                            contentFit="contain"
                            transition={200}
                        />
                        {typeof item.discountPercent === 'number' && item.discountPercent > 0 && (
                            <View style={styles.discountFloatingBadge}>
                                <Text style={styles.discountFloatingText}>-{item.discountPercent}%</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.productCardContent}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.productPrice}>{(item.price || 0).toLocaleString()} ₫</Text>
                        </View>
                        <View style={styles.productCardFooter}>
                            <Ionicons name="star" size={10} color="#f59e0b" />
                            <Text style={styles.ratingText}>5.0</Text>
                            <View style={styles.footerDivider} />
                            <Text style={styles.soldText}>Đã bán {(item.soldQuantity || 0).toLocaleString()}</Text>
                        </View>
                    </View>
                </Surface>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#dc2626', '#ef4444']} style={styles.header}>
                <View style={styles.logoRow}>
                    <Text style={styles.logoText}>SellPhoneK</Text>
                    <View style={styles.locationBadge}>
                        <Ionicons name="location-outline" size={14} color="#fff" />
                        <Text style={styles.locationText}>TP. HCM</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                        <View>
                            <Ionicons name="notifications-outline" size={26} color="#fff" />
                            {unreadNotifCount > 0 && (
                                <Badge size={16} style={styles.badgeAbsolute}>
                                    {unreadNotifCount}
                                </Badge>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchIconBox}>
                            <Ionicons name="search" size={20} color="#dc2626" />
                        </View>
                        <RNTextInput
                            placeholder="Săn deal hot ngay hôm nay..."
                            value={searchInput}
                            onChangeText={setSearchInput}
                            onSubmitEditing={submitSearch}
                            returnKeyType="search"
                            style={styles.searchInput}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                    <TouchableOpacity style={styles.qrButton}>
                        <Ionicons name="barcode-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                {/* Trending Searches Section */}
                <View style={styles.trendingWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
                        <Text style={styles.trendingTitle}>Xu hướng:</Text>
                        {bestSelling.slice(0, 5).map((item) => (
                            <TouchableOpacity
                                key={`trending-${item.id}`}
                                style={styles.trendingItem}
                                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                            >
                                {item.image && (
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.trendingIcon}
                                        contentFit="contain"
                                    />
                                )}
                                <Text style={styles.trendingText} numberOfLines={1}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#dc2626']} />}
                onScroll={({ nativeEvent }) => {
                    const paddingToBottom = 100;
                    if (
                        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
                        nativeEvent.contentSize.height - paddingToBottom
                    ) {
                        handleLoadMore();
                    }
                }}
                scrollEventThrottle={200}
            >
                {/* Categories Section (Cellphones Square Cards) */}
                <View style={styles.categoryWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                        {categoryOptions.map(cat => {
                            const isActive = cat === selectedCategory;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={styles.categoryCard}
                                    onPress={() => {
                                        setSelectedCategory(cat);
                                        setPage(1);
                                        openSearchWithFilters(cat, selectedBrand);
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <View style={[styles.categoryImageContainer, isActive && styles.categoryImageContainerActive]}>
                                        <Image
                                            source={{ uri: CATEGORY_IMAGES[cat] || 'https://cdn-icons-png.flaticon.com/512/1170/1170577.png' }}
                                            style={styles.categoryImage}
                                            contentFit="contain"
                                        />
                                    </View>
                                    <Text style={[styles.categoryCardLabel, isActive && styles.categoryCardLabelActive]} numberOfLines={1}>
                                        {cat}
                                    </Text>
                                    {isActive && <View style={styles.cardActiveIndicator} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Brands Section (Cellphones Pilled Buttons) */}
                <View style={styles.brandWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandScroll}>
                        {brandOptions.map(brand => {
                            const isActive = brand === selectedBrand;
                            return (
                                <TouchableOpacity
                                    key={brand}
                                    style={[styles.brandPill, isActive && styles.brandPillActive]}
                                    onPress={() => {
                                        setSelectedBrand(brand);
                                        setPage(1);
                                        openSearchWithFilters(selectedCategory, brand);
                                    }}
                                    activeOpacity={0.85}
                                >
                                    <Text style={[styles.brandText, isActive && styles.brandTextActive]}>
                                        {brand}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Best Sellers Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <Ionicons name="flame" size={20} color="#f97316" />
                            <Text style={styles.sectionTitle}>Bán chạy nhất (TOP 10)</Text>
                        </View>
                        <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
                    </View>
                    {loadingBest ? (
                        <ActivityIndicator animating color="#f97316" style={{ marginVertical: 20 }} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bestContentScroll}>
                            {bestSelling.map(item => renderProductCard(item, 'best'))}
                        </ScrollView>
                    )}
                </View>

                {/* Main Product Grid */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
                    </View>
                    {loadingMain ? (
                        <ActivityIndicator animating color="#dc2626" style={{ marginVertical: 20 }} />
                    ) : products.length === 0 ? (
                        <Text style={styles.emptyText}>Rất tiếc, không tìm thấy sản phẩm nào.</Text>
                    ) : (
                        <View style={styles.grid}>
                            {products.map(item => renderProductCard(item, 'grid'))}
                        </View>
                    )}
                    {hasMore && !loadingMain && (
                        <View style={styles.loadingMoreBox}>
                            {loadingMore ? (
                                <ActivityIndicator animating color="#dc2626" />
                            ) : (
                                <Text style={styles.loadingMoreText}>Vuốt để xem thêm</Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Discounted Section */}
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, { backgroundColor: '#fef2f2', padding: 8, borderRadius: 8 }]}>
                        <View style={styles.sectionTitleRow}>
                            <Ionicons name="flash" size={20} color="#dc2626" />
                            <Text style={[styles.sectionTitle, { color: '#dc2626' }]}>Giảm giá sốc (TOP 20)</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>🔥 Giảm tới 50%</Text>
                    </View>
                    {loadingDiscount ? (
                        <ActivityIndicator animating color="#dc2626" style={{ marginVertical: 20 }} />
                    ) : (
                        <View style={[styles.grid, { marginTop: 10 }]}>
                            {discountProducts.map(item => renderProductCard(item, 'grid'))}
                        </View>
                    )}
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingChatBtn}
                onPress={() => navigation.navigate('Chat')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#ef4444', '#b91c1c']}
                    style={styles.floatingChatGradient}
                >
                    <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
                    <View style={styles.floatingChatBadge} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    floatingChatBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    floatingChatGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingChatBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ade80',
        borderWidth: 2,
        borderColor: '#fff',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        gap: 4,
    },
    locationText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchContainer: {
        flex: 1,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#1e293b',
        height: '100%',
    },
    qrButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Trending Searches
    trendingWrap: {
        marginTop: 15,
        marginBottom: 5,
    },
    trendingScroll: {
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    trendingTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 8,
    },
    trendingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
    },
    trendingIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    trendingText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        maxWidth: 120,
    },

    // Category Overhaul (Cellphones Style)
    categoryWrap: {
        marginTop: 15,
    },
    categoryScroll: {
        paddingHorizontal: 10,
    },
    categoryCard: {
        width: 96,
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    categoryImageContainer: {
        width: 84,
        height: 84,
        backgroundColor: '#f8fafc',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        padding: 11,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryImageContainerActive: {
        borderColor: '#dc2626',
        backgroundColor: '#fff5f5',
        elevation: 4,
        shadowColor: '#dc2626',
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryCardLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        textAlign: 'center',
    },
    categoryCardLabelActive: {
        color: '#dc2626',
    },
    cardActiveIndicator: {
        position: 'absolute',
        top: -2,
        right: 15,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#dc2626',
        borderWidth: 1,
        borderColor: '#fff',
    },

    // Brands (Cellphones Style)
    brandWrap: {
        marginTop: 10,
    },
    brandScroll: {
        paddingHorizontal: 16,
        paddingBottom: 2,
    },
    brandPill: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 24,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginRight: 10,
    },
    brandPillActive: {
        borderColor: '#dc2626',
        borderWidth: 1.5,
        backgroundColor: '#fef2f2',
    },
    brandText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '600',
    },
    brandTextActive: {
        color: '#dc2626',
    },

    section: {
        paddingHorizontal: 16,
        marginTop: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#94a3b8',
    },
    seeAll: {
        fontSize: 12,
        color: '#dc2626',
    },
    bestContentScroll: {
        paddingRight: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        marginBottom: 16,
    },
    cardSurface: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    productCardSmall: {
        width: (width - 48) / 2,
    },
    productCardLarge: {
        width: 185,
        marginRight: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#f8fafc',
    },
    img: {
        width: '100%',
        height: 160,
    },
    imgSmall: {
        width: '100%',
        height: 140,
    },
    imgLarge: {
        width: '100%',
        height: 160,
    },
    discountFloatingBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#dc2626',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomRightRadius: 12,
    },
    discountFloatingText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    productCardContent: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        height: 40,
        lineHeight: 20,
        marginBottom: 8,
    },
    priceContainer: {
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '900',
        color: '#dc2626',
    },
    productCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 11,
        color: '#64748b',
        marginLeft: 2,
    },
    footerDivider: {
        width: 1,
        height: 10,
        backgroundColor: '#cbd5e1',
        marginHorizontal: 6,
    },
    soldText: {
        fontSize: 11,
        color: '#64748b',
    },
    loadingMoreBox: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingMoreText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    badgeAbsolute: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#f59e0b',
        color: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#94a3b8',
    }
});