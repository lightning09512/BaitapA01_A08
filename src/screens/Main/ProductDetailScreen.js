import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Text, TextInput } from 'react-native-paper';
import { getProductSpecs } from '../../data/productSpecs';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // For review submission
    // const [rating, setRating] = useState(5);
    // const [comment, setComment] = useState('');
    // const [submitting, setSubmitting] = useState(false);

    // Toast notification
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const toastOpacity = React.useRef(new Animated.Value(0)).current;

    const showToast = (msg) => {
        setToastMessage(msg);
        setToastVisible(true);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.delay(1800),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setToastVisible(false));
    };

    useEffect(() => {
        const load = async () => {
            try {
                const productId = route.params.id;

                // Increase view count
                await api.post(`/products/${productId}/view`).catch(e => console.log(e));

                // Fetch product data
                const res = await api.get(`/products/${productId}`);
                const productData = res.data;
                setProduct(productData);

                // Default to first variant if exists
                if (productData.Variants && productData.Variants.length > 0) {
                    setSelectedVariant(productData.Variants[0]);
                }

                // Fetch extra data in parallel
                const [favRes, revRes, simRes] = await Promise.all([
                    api.get(`/favorites/check/${productId}`).catch(() => ({ data: { isFavorite: false } })),
                    api.get(`/products/${productId}/reviews`).catch(() => ({ data: [] })),
                    api.get(`/products/${productId}/similar`).catch(() => ({ data: [] }))
                ]);

                setIsFavorite(favRes.data?.isFavorite || false);
                setReviews(revRes.data || []);
                setSimilarProducts(simRes.data || []);
            } catch (e) {
                console.log('Product detail error:', e);
            }
        };
        load();
    }, [route.params.id]);

    const toggleFavorite = async () => {
        try {
            const res = await api.post('/favorites/toggle', { productId: product.id });
            setIsFavorite(res.data.isFavorite);
        } catch (error) {
            console.log("Lỗi khi thêm yêu thích:", error);
        }
    };

/*
    const submitReview = async () => {
        ...
    };
*/

    if (!product) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }

    const specs = getProductSpecs(product.name);
    
    // Derived data
    const discount = product.discountPercent || 0;
    const sold = product.soldQuantity || 0;
    const views = product.viewCount || 0;
    const reviewCount = product.reviewCount || reviews.length;

    // Derived states for variations
    const variants = product.Variants || [];
    const ramOptions = [...new Set(variants.map(v => v.ram))].filter(Boolean);
    const romOptions = [...new Set(variants.map(v => v.rom))].filter(Boolean);
    const colorOptions = [...new Set(variants.map(v => v.color))].filter(Boolean);

    const activePrice = selectedVariant ? selectedVariant.price : product.price;
    const oldPrice = activePrice / (1 - discount / 100);

    const renderSimilarItem = ({ item }) => (
        <TouchableOpacity
            style={styles.similarCard}
            onPress={() => navigation.push('ProductDetail', { id: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.similarImage} contentFit="contain" />
            <Text style={styles.similarName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.similarPrice}>{(item.price || 0).toLocaleString()} ₫</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#111827" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle} numberOfLines={1}>Thông tin sản phẩm</Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="share-outline" size={24} color="#111827" />
                    <TouchableOpacity onPress={toggleFavorite}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color="#dc2626"
                            style={{ marginLeft: 16 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Hình sản phẩm */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: product.image }} style={styles.mainImage} contentFit="contain" />
                </View>

                {/* Thông tin cơ bản */}
                <View style={styles.infoCard}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Ionicons key={s} name="star" size={14} color="#f59e0b" />
                        ))}
                        <Text style={styles.ratingCount}> ({reviewCount} đánh giá)</Text>
                        <Text style={styles.soldText}> • Đã bán {sold.toLocaleString()}</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{(activePrice || 0).toLocaleString()} ₫</Text>
                        {discount > 0 && (
                            <Text style={styles.oldPriceText}>{(oldPrice || 0).toLocaleString()} ₫</Text>
                        )}
                        {discount > 0 && <Badge style={styles.discountBadge}>-{discount}%</Badge>}
                    </View>
                </View>

                {/* Chọn cấu hình (Biến thể) */}
                {variants.length > 0 && (
                    <View style={styles.variationSection}>
                        {ramOptions.length > 0 && (
                            <View style={styles.optContainer}>
                                <Text style={styles.optTitle}>Chọn RAM:</Text>
                                <View style={styles.chipRow}>
                                    {ramOptions.map(ram => (
                                        <TouchableOpacity 
                                            key={ram} 
                                            style={[styles.chip, selectedVariant?.ram === ram && styles.chipActive]}
                                            onPress={() => {
                                                const found = variants.find(v => v.ram === ram && (v.rom === selectedVariant?.rom || true));
                                                if (found) setSelectedVariant(found);
                                            }}
                                        >
                                            <Text style={[styles.chipText, selectedVariant?.ram === ram && styles.chipTextActive]}>{ram}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {romOptions.length > 0 && (
                            <View style={styles.optContainer}>
                                <Text style={styles.optTitle}>Chọn bộ nhớ (ROM):</Text>
                                <View style={styles.chipRow}>
                                    {romOptions.map(rom => (
                                        <TouchableOpacity 
                                            key={rom} 
                                            style={[styles.chip, selectedVariant?.rom === rom && styles.chipActive]}
                                            onPress={() => {
                                                const found = variants.find(v => v.rom === rom && (v.ram === selectedVariant?.ram || true));
                                                if (found) setSelectedVariant(found);
                                            }}
                                        >
                                            <Text style={[styles.chipText, selectedVariant?.rom === rom && styles.chipTextActive]}>{rom}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {colorOptions.length > 1 && (
                             <View style={styles.optContainer}>
                                <Text style={styles.optTitle}>Chọn màu sắc:</Text>
                                <View style={styles.chipRow}>
                                    {colorOptions.map(color => (
                                        <TouchableOpacity 
                                            key={color} 
                                            style={[styles.chip, selectedVariant?.color === color && styles.chipActive]}
                                            onPress={() => {
                                                const found = variants.find(v => v.color === color && v.ram === selectedVariant?.ram && v.rom === selectedVariant?.rom);
                                                if (found) setSelectedVariant(found);
                                            }}
                                        >
                                            <Text style={[styles.chipText, selectedVariant?.color === color && styles.chipTextActive]}>{color}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Khuyến mãi hấp dẫn */}
                <View style={styles.promoSection}>
                    <View style={styles.promoHeader}>
                        <MaterialCommunityIcons name="gift-outline" size={20} color="#dc2626" />
                        <Text style={styles.promoTitle}>Khuyến mãi hấp dẫn</Text>
                    </View>
                    <View style={styles.promoBody}>
                        <View style={styles.promoItemRow}>
                            <View style={styles.promoDot} />
                            <Text style={styles.promoItemText}>Giảm thêm đến 5% tối đa 500.000đ khi thanh toán qua ứng dụng Momo.</Text>
                        </View>
                        <View style={styles.promoItemRow}>
                            <View style={styles.promoDot} />
                            <Text style={styles.promoItemText}>Mở thẻ tín dụng VIB nhận E-voucher đến 600K.</Text>
                        </View>
                        <View style={styles.promoItemRow}>
                            <View style={styles.promoDot} />
                            <Text style={styles.promoItemText}>Trợ giá thu cũ đổi mới lên đến 2.000.000đ.</Text>
                        </View>
                    </View>
                </View>

                {/* Cam kết bán hàng */}
                <View style={styles.commitSection}>
                    <Text style={styles.commitTitle}>Cam kết CellphoneK</Text>
                    <View style={styles.commitGrid}>
                        <View style={styles.commitItem}>
                            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#dc2626" />
                            <Text style={styles.commitText}>Hàng chính hãng</Text>
                        </View>
                        <View style={styles.commitItem}>
                            <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#dc2626" />
                            <Text style={styles.commitText}>Giao hàng cực siêu tốc</Text>
                        </View>
                        <View style={styles.commitItem}>
                            <MaterialCommunityIcons name="sync-circle" size={24} color="#dc2626" />
                            <Text style={styles.commitText}>Lỗi 1 đổi 1 30 ngày</Text>
                        </View>
                        <View style={styles.commitItem}>
                            <MaterialCommunityIcons name="wallet-outline" size={24} color="#dc2626" />
                            <Text style={styles.commitText}>Trả góp 0% cực dễ</Text>
                        </View>
                    </View>
                </View>

                {/* Thông số kỹ thuật */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitleSpec}>Thông số kỹ thuật</Text>
                    <View style={styles.specTable}>
                        {specs.map((spec, index) => (
                            <View key={index} style={[styles.specRow, index % 2 === 0 ? styles.specRowEven : styles.specRowOdd]}>
                                <Text style={styles.specLabel}>{spec.label}</Text>
                                <Text style={styles.specValue}>{spec.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Mô tả sản phẩm */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đặc điểm nổi bật</Text>
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>{product.description}</Text>
                    </View>
                </View>

                {/* Sản phẩm tương tự */}
                {similarProducts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
                        <FlatList
                            data={similarProducts}
                            keyExtractor={item => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderSimilarItem}
                            contentContainerStyle={{ paddingVertical: 8 }}
                        />
                    </View>
                )}

                {/* Đánh giá sản phẩm */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>

                    {/* Header Đánh giá tổng quan */}
                    <View style={styles.reviewSummaryRow}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827' }}>5.0<Text style={{ fontSize: 16, color: '#6b7280' }}>/5</Text></Text>
                            <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                                {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name="star" size={18} color="#f59e0b" />)}
                            </View>
                            <Text style={{ fontSize: 13, color: '#6b7280' }}>{reviewCount} đánh giá</Text>
                        </View>
                    </View>

                    {/* Danh sách bình luận */}
                    {reviews.length > 0 ? (
                        <View style={{ marginTop: 16 }}>
                            {reviews.slice(0, 5).map(rev => (
                                <View key={rev.id} style={styles.reviewItem}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: rev.avatar || 'https://i.pravatar.cc/150' }} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
                                            <Text style={{ fontWeight: 'bold', color: '#111827' }}>{rev.name}</Text>
                                            <Badge style={{ backgroundColor: '#10b981', color: '#fff', marginLeft: 8 }} size={16}>Đã mua</Badge>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Ionicons key={s} name={s <= rev.rating ? "star" : "star-outline"} size={14} color="#facc15" />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 14, color: '#374151', marginTop: 4, paddingLeft: 36 }}>{rev.comment}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: '#6b7280', alignSelf: 'center', marginVertical: 10 }}>Chưa có đánh giá nào.</Text>
                    )}

                    {/* Khung viết review đã được chuyển sang trang Đơn hàng */}
                    <View style={{ padding: 16, alignItems: 'center' }}>
                         <Text style={{ color: '#6b7280', textAlign: 'center' }}>
                             Vui lòng vào phần Đơn mua để đánh giá sản phẩm sau khi đã nhận hàng.
                         </Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Bar giống CellphoneS */}
            <View style={styles.bottomBarFixed}>
                <TouchableOpacity style={styles.iconActionBtn}>
                    <Ionicons name="call-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconActionBtnCenter}>
                    <Text style={styles.iconActionBtnCenterText}>Trả góp 0%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buyNowBtn}
                    onPress={async () => {
                        try {
                            await api.post('/cart/add', { 
                                productId: product.id, 
                                quantity: 1, 
                                variantId: selectedVariant?.id 
                            });
                        } catch (e) {
                            console.log('Add to cart error:', e);
                        }
                        
                        const variantName = selectedVariant ? `${selectedVariant.ram || ''} / ${selectedVariant.rom || ''}` : '';
                        const itemToBuy = {
                            productId: product.id,
                            variantId: selectedVariant?.id,
                            name: product.name,
                            variantName: variantName,
                            image: product.image,
                            price: activePrice,
                            quantity: 1,
                            lineTotal: activePrice
                        };
                        navigation.navigate('Checkout', {
                            selectedItems: [product.id],
                            checkoutItems: [itemToBuy],
                            displayTotalQuantity: 1,
                            displayTotalAmount: activePrice,
                            availablePoints: 0
                        });
                    }}
                >
                    <Text style={styles.buyNowBtnTitle}>Mua ngay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconActionBtn, { marginRight: 0 }]}
                    onPress={async () => {
                        try {
                            await api.post('/cart/add', { 
                                productId: product.id, 
                                quantity: 1, 
                                variantId: selectedVariant?.id 
                            });
                            showToast('✓  Đã thêm vào giỏ hàng');
                        } catch (e) {
                            console.log('Add to cart error:', e);
                            showToast('Không thể thêm vào giỏ hàng');
                        }
                    }}
                >
                    <Ionicons name="cart-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            {/* Toast nhỏ */}
            {toastVisible && (
                <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#ffffff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
    headerTitle: { flex: 1, marginHorizontal: 12, fontSize: 16, fontWeight: 'bold', color: '#111827' },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    scroll: { flex: 1 },
    imageWrapper: { backgroundColor: '#ffffff', paddingVertical: 16, alignItems: 'center' },
    mainImage: { width: width * 0.85, height: 300 },

    infoCard: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 16, marginBottom: 8 },
    productName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8, lineHeight: 28 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    ratingCount: { fontSize: 13, color: '#2563eb' },
    soldText: { fontSize: 13, color: '#6b7280' },

    priceContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
    priceText: { fontSize: 24, fontWeight: 'bold', color: '#dc2626' },
    oldPriceText: { fontSize: 14, color: '#9ca3af', textDecorationLine: 'line-through', marginBottom: 4 },
    discountBadge: { backgroundColor: '#fee2e2', color: '#dc2626', marginBottom: 4, fontWeight: 'bold' },

    variationSection: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingBottom: 16, marginBottom: 8 },
    optContainer: { marginTop: 12 },
    optTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
    chipActive: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
    chipText: { fontSize: 13, color: '#4b5563' },
    chipTextActive: { color: '#dc2626', fontWeight: 'bold' },

    promoSection: { backgroundColor: '#ffffff', padding: 16, marginBottom: 8 },
    promoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    promoTitle: { fontSize: 16, fontWeight: 'bold', color: '#dc2626', marginLeft: 6 },
    promoBody: { borderWidth: 1, borderColor: '#fca5a5', borderRadius: 8, padding: 12, backgroundColor: '#fef2f2' },
    promoItemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
    promoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#dc2626', marginTop: 6, marginRight: 8 },
    promoItemText: { fontSize: 13, color: '#111827', flex: 1, lineHeight: 20 },

    commitSection: { backgroundColor: '#ffffff', padding: 16, marginBottom: 8 },
    commitTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
    commitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    commitItem: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', padding: 10, borderRadius: 8, marginBottom: 8 },
    commitText: { fontSize: 12, color: '#374151', marginLeft: 8, flex: 1 },

    section: { backgroundColor: '#ffffff', padding: 16, marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
    sectionTitleSpec: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },

    specTable: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' },
    specRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 },
    specRowEven: { backgroundColor: '#f3f4f6' },
    specRowOdd: { backgroundColor: '#ffffff' },
    specLabel: { flex: 1, fontSize: 13, color: '#4b5563', fontWeight: '500' },
    specValue: { flex: 2, fontSize: 13, color: '#111827', fontWeight: '500' },

    descriptionCard: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8 },
    descriptionText: { fontSize: 14, color: '#374151', lineHeight: 24 },

    similarCard: { width: 140, marginRight: 12, padding: 8, borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 8 },
    similarImage: { width: '100%', height: 120, marginBottom: 8 },
    similarName: { fontSize: 13, fontWeight: '500', color: '#111827', marginBottom: 4 },
    similarPrice: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },

    reviewSummaryRow: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 16 },
    reviewItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    writeReviewBox: { padding: 16, backgroundColor: '#f9fafb', borderRadius: 12, marginTop: 16 },

    bottomBarFixed: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, alignItems: 'center' },
    iconActionBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, marginRight: 8, backgroundColor: '#fff' },
    iconActionBtnCenter: { paddingHorizontal: 12, height: 44, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#3b82f6', borderRadius: 8, marginRight: 8, backgroundColor: '#fff' },
    iconActionBtnCenterText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 13 },
    buyNowBtn: { flex: 1, backgroundColor: '#ef4444', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8, height: 44 },
    buyNowBtnTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

    toast: { position: 'absolute', bottom: 85, alignSelf: 'center', backgroundColor: 'rgba(30,30,30,0.85)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, elevation: 20 },
    toastText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});