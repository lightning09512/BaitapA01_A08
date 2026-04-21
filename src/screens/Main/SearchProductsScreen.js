import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import api from '../../services/api';

const PAGE_SIZE = 12;

export default function SearchProductsScreen({ route, navigation }) {
    const initialKeyword = route?.params?.initialKeyword || '';
    const initialCategory = route?.params?.initialCategory || 'All';
    const initialBrand = route?.params?.initialBrand || 'All';
    const [keyword, setKeyword] = useState(initialKeyword);
    const [debouncedKeyword, setDebouncedKeyword] = useState(initialKeyword);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedBrand, setSelectedBrand] = useState(initialBrand);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword.trim().replace(/\s+/g, ' '));
        }, 350);
        return () => clearTimeout(timer);
    }, [keyword]);

    const fetchProducts = useCallback(async (pageToLoad = 1, append = false) => {
        const normalized = debouncedKeyword.trim();
        const hasCategoryFilter = selectedCategory && selectedCategory !== 'All';
        const hasBrandFilter = selectedBrand && selectedBrand !== 'All';

        if (!normalized && !hasCategoryFilter && !hasBrandFilter) {
            setProducts([]);
            setHasMore(false);
            setPage(1);
            setLoadError('');
            return;
        }

        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            setLoadError('');
            const params = [`page=${pageToLoad}`, `limit=${PAGE_SIZE}`];
            if (normalized) params.push(`search=${encodeURIComponent(normalized)}`);
            if (hasCategoryFilter) params.push(`category=${encodeURIComponent(selectedCategory)}`);
            if (hasBrandFilter) params.push(`brand=${encodeURIComponent(selectedBrand)}`);
            const query = params.join('&');

            const res = await api.get(`/products?${query}`);
            const payload = res.data || {};
            let items = [];
            let more = false;

            if (Array.isArray(payload)) {
                items = payload;
            } else if (Array.isArray(payload.items)) {
                items = payload.items;
                more = !!payload.hasMore;
            } else if (Array.isArray(payload.rows)) {
                // Defensive branch for alternate backend response shape.
                items = payload.rows;
                more = !!payload.hasMore;
            }

            // Fallback: if backend pagination returns empty unexpectedly, try non-paginated search then filter locally.
            if (!append && items.length === 0) {
                const rawParams = [];
                if (normalized) rawParams.push(`search=${encodeURIComponent(normalized)}`);
                if (hasCategoryFilter) rawParams.push(`category=${encodeURIComponent(selectedCategory)}`);
                if (hasBrandFilter) rawParams.push(`brand=${encodeURIComponent(selectedBrand)}`);
                const rawQuery = rawParams.length ? `?${rawParams.join('&')}` : '';
                const rawRes = await api.get(`/products${rawQuery}`);
                const rawPayload = rawRes.data || [];
                const rawItems = Array.isArray(rawPayload)
                    ? rawPayload
                    : (Array.isArray(rawPayload.items) ? rawPayload.items : []);
                items = rawItems.slice(0, PAGE_SIZE);
                more = rawItems.length > PAGE_SIZE;
            }

            setProducts(prev => (append ? [...prev, ...items] : items));
            setHasMore(more);
            setPage(pageToLoad);
        } catch (e) {
            console.log('Search products error:', e);
            setLoadError('Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại.');
            if (!append) setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [debouncedKeyword, selectedCategory, selectedBrand]);

    useEffect(() => {
        fetchProducts(1, false);
    }, [fetchProducts]);

    const resultText = useMemo(() => {
        if (!debouncedKeyword && selectedCategory === 'All' && selectedBrand === 'All') {
            return 'Nhập từ khóa để tìm kiếm sản phẩm';
        }
        if (!debouncedKeyword && selectedCategory !== 'All' && selectedBrand !== 'All') {
            return `Kết quả cho ${selectedCategory} - ${selectedBrand}`;
        }
        if (!debouncedKeyword && selectedCategory !== 'All') return `Kết quả danh mục "${selectedCategory}"`;
        if (!debouncedKeyword && selectedBrand !== 'All') return `Kết quả thương hiệu "${selectedBrand}"`;
        return `Kết quả cho "${debouncedKeyword}"`;
    }, [debouncedKeyword, selectedCategory, selectedBrand]);

    const handleLoadMore = () => {
        if (loading || loadingMore || !hasMore) return;
        fetchProducts(page + 1, true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
        >
            <Surface style={styles.cardSurface} elevation={1}>
                <Image source={{ uri: item.image }} style={styles.image} contentFit="contain" />
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.meta} numberOfLines={1}>
                        {item.brand || 'Không rõ thương hiệu'} - {item.category || 'Khác'}
                    </Text>
                    <Text style={styles.price}>{(item.price || 0).toLocaleString()} ₫</Text>
                </View>
            </Surface>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#111827" />
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#dc2626" />
                    <RNTextInput
                        style={styles.searchInput}
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholder="Bạn cần tìm gì hôm nay?"
                        placeholderTextColor="#94a3b8"
                        returnKeyType="search"
                    />
                </View>
            </View>

            <Text style={styles.resultLabel}>{resultText}</Text>
            {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
                <View style={styles.filterRow}>
                    {selectedCategory !== 'All' && (
                        <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedCategory('All')}>
                            <Text style={styles.filterText}>Danh mục: {selectedCategory} ×</Text>
                        </TouchableOpacity>
                    )}
                    {selectedBrand !== 'All' && (
                        <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedBrand('All')}>
                            <Text style={styles.filterText}>Hãng: {selectedBrand} ×</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {!!loadError && <Text style={styles.errorText}>{loadError}</Text>}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator animating color="#dc2626" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp.</Text>
                        </View>
                    }
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator animating color="#dc2626" />
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        paddingTop: 52,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8
    },
    searchBox: {
        flex: 1,
        height: 44,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#111827',
        fontSize: 14
    },
    resultLabel: {
        marginTop: 10,
        marginHorizontal: 16,
        color: '#334155',
        fontWeight: '600'
    },
    errorText: {
        marginTop: 6,
        marginHorizontal: 16,
        color: '#dc2626',
        fontSize: 13
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        marginHorizontal: 16,
        gap: 8
    },
    filterChip: {
        backgroundColor: '#fff1f2',
        borderColor: '#fecdd3',
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    filterText: {
        color: '#be123c',
        fontSize: 12,
        fontWeight: '600'
    },
    listContent: {
        padding: 16,
        paddingBottom: 24
    },
    card: {
        marginBottom: 12
    },
    cardSurface: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff'
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        backgroundColor: '#f8fafc'
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center'
    },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a'
    },
    meta: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4
    },
    price: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '900',
        color: '#dc2626'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 28
    },
    emptyText: {
        color: '#94a3b8'
    },
    footerLoader: {
        paddingVertical: 10
    }
});
