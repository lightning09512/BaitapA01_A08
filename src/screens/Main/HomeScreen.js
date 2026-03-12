
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { ActivityIndicator, Badge, Text, TextInput } from 'react-native-paper';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingBest, setLoadingBest] = useState(true);
    const [loadingDiscount, setLoadingDiscount] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 10;

    // Load category, best-selling, discount list lần đầu
    useEffect(() => {
        let cancelled = false;

        const fetchInitial = async () => {
            try {
                const [catRes, bestRes, discountRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products/best-selling?limit=10'),
                    api.get('/products/by-discount?limit=20'),
                ]);
                if (cancelled) return;

                setCategories(['All', ...(catRes.data || [])]);
                setBestSelling(bestRes.data || []);
                setDiscountProducts(discountRes.data || []);
            } catch (e) {
                console.log('Home initial load error:', e);
            } finally {
                if (!cancelled) {
                    setLoadingBest(false);
                    setLoadingDiscount(false);
                }
            }
        };

        fetchInitial();
        return () => {
            cancelled = true;
        };
    }, []);

    // Hàm dùng chung để load sản phẩm với phân trang (lazy loading)
    const fetchProducts = async (pageToLoad = 1, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoadingMain(true);
        }
        try {
            const params = [];
            if (search) params.push(`search=${encodeURIComponent(search)}`);
            if (selectedCategory && selectedCategory !== 'All') {
                params.push(`category=${encodeURIComponent(selectedCategory)}`);
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

    // Load danh sách sản phẩm theo search + category (reset về trang 1)
    useEffect(() => {
        fetchProducts(1, false);
    }, [search, selectedCategory]);

    const handleLoadMore = () => {
        if (!hasMore || loadingMore || loadingMain) return;
        fetchProducts(page + 1, true);
    };

    const renderProductCard = (item, small = false) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.card, small && styles.cardSmall]}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.image }} style={small ? styles.imgSmall : styles.img} resizeMode="contain" />
            <Text style={styles.name} numberOfLines={2}>
                {item.name}
            </Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price.toLocaleString()} ₫</Text>
                {typeof item.discountPercent === 'number' && item.discountPercent > 0 && (
                    <Badge style={styles.discountBadge}>-{item.discountPercent}%</Badge>
                )}
            </View>
            {typeof item.soldQuantity === 'number' && (
                <Text style={styles.soldText}>Đã bán {item.soldQuantity.toLocaleString()}</Text>
            )}
        </TouchableOpacity>
    );

    // Chia mảng sản phẩm giảm giá thành các hàng 2 cột
    const discountRows = [];
    for (let i = 0; i < discountProducts.length; i += 2) {
        discountRows.push(discountProducts.slice(i, i + 2));
    }

    return (
        <View style={styles.container}>
            {/* Thanh header giống app thương mại */}
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Text style={styles.logoText}>SellPhoneK</Text>
                    <View style={styles.locationBadge}>
                        <Ionicons name="location-outline" size={16} color="#fff" />
                        <Text style={styles.locationText}>TP. HCM</Text>
                    </View>
                    <Ionicons name="notifications-outline" size={22} color="#fee2e2" />
                </View>
                <View style={styles.searchRow}>
                    <TextInput
                        placeholder="Bạn muốn mua gì hôm nay?"
                        value={search}
                        onChangeText={setSearch}
                        mode="outlined"
                        dense
                        style={styles.searchInput}
                        outlineStyle={{ borderRadius: 999, borderColor: 'transparent' }}
                        left={<TextInput.Icon icon="magnify" />}
                    />
                    <TouchableOpacity style={styles.qrButton}>
                        <Ionicons name="qr-code-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    const paddingToBottom = 40;
                    if (
                        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
                        nativeEvent.contentSize.height - paddingToBottom
                    ) {
                        handleLoadMore();
                    }
                }}
                scrollEventThrottle={200}
            >
                {/* Top 10 bán chạy (ngang) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Bán chạy nhất</Text>
                        <Text style={styles.sectionSubtitle}>Top 10</Text>
                    </View>
                    {loadingBest ? (
                        <ActivityIndicator animating color="#f97316" />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {bestSelling.map(item => (
                                <View key={item.id} style={styles.bestItemWrapper}>
                                    {renderProductCard(item)}
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Thanh category ngang */}
                <View style={styles.section}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map(cat => {
                            const isActive = cat === selectedCategory;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            isActive && styles.categoryTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Sản phẩm theo search + category (grid 2 cột) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Tất cả sản phẩm</Text>
                        <Text style={styles.sectionSubtitle}>
                            {products.length} mặt hàng
                        </Text>
                    </View>
                    {loadingMain ? (
                        <ActivityIndicator animating color="#ef4444" />
                    ) : products.length === 0 ? (
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp.</Text>
                    ) : (
                        <View style={styles.grid}>
                            {products.map(item => renderProductCard(item, true))}
                        </View>
                    )}
                    {hasMore && !loadingMain && (
                        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 4 }}>
                            {loadingMore ? (
                                <ActivityIndicator animating color="#ef4444" />
                            ) : (
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                    Kéo xuống dưới cùng để tải thêm sản phẩm...
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* 20 sản phẩm giảm giá (grid 2 cột) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Giảm giá sốc</Text>
                        <Text style={styles.sectionSubtitle}>20 sản phẩm ưu đãi</Text>
                    </View>
                    {loadingDiscount ? (
                        <ActivityIndicator animating color="#22c55e" />
                    ) : discountProducts.length === 0 ? (
                        <Text style={styles.emptyText}>Hiện chưa có chương trình giảm giá.</Text>
                    ) : (
                        discountRows.map((row, idx) => (
                            <View key={idx} style={styles.discountRow}>
                                {row.map(item => (
                                    <View key={item.id} style={styles.discountCol}>
                                        {renderProductCard(item, true)}
                                    </View>
                                ))}
                                {row.length === 1 && <View style={styles.discountCol} />}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const CARD_WIDTH = (width - 32) / 2; // padding 16 * 2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fee2e2',
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 12,
        paddingBottom: 12,
        backgroundColor: '#dc2626',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f97316',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 4,
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
    },
    qrButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#b91c1c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: 12,
        paddingTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#6b7280',
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#fee2e2',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    categoryChipActive: {
        backgroundColor: '#dc2626',
        borderColor: '#b91c1c',
    },
    categoryText: {
        fontSize: 13,
        color: '#b91c1c',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
    },
    cardSmall: {
        padding: 8,
    },
    img: {
        width: '100%',
        height: 140,
        marginBottom: 8,
    },
    imgSmall: {
        width: '100%',
        height: 110,
        marginBottom: 6,
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        color: '#dc2626',
        fontWeight: 'bold',
        fontSize: 13,
    },
    discountBadge: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        fontSize: 10,
    },
    soldText: {
        marginTop: 2,
        fontSize: 11,
        color: '#6b7280',
    },
    emptyText: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 8,
    },
    bestItemWrapper: {
        width: width * 0.5,
        paddingRight: 8,
    },
    discountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    discountCol: {
        flex: 1,
        marginRight: 4,
    },
});