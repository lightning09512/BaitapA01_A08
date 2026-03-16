import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { Badge, Button, Text, TextInput } from 'react-native-paper';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    
    // For review submission
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const productId = route.params.id;
                
                // Increase view count
                await api.post(`/products/${productId}/view`).catch(e => console.log(e));

                // Fetch product data
                const res = await api.get(`/products/${productId}`);
                setProduct(res.data);

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

    const submitReview = async () => {
        if (!comment.trim()) {
            alert('Vui lòng nhập nội dung đánh giá');
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post(`/products/${product.id}/reviews`, { rating, comment });
            alert(res.data.message || 'Đánh giá thành công');
            setReviews([res.data.review, ...reviews]);
            setComment('');
            setRating(5);
        } catch (error) {
            console.log("Lỗi đánh giá:", error);
            alert('Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!product) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }

    const discount = product.discountPercent || 0;
    const sold = product.soldQuantity || 0;
    const views = product.viewCount || 0;
    const reviewCount = product.reviewCount || reviews.length;

    const renderSimilarItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.similarCard}
            onPress={() => navigation.push('ProductDetail', { id: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.similarImage} contentFit="contain" />
            <Text style={styles.similarName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.similarPrice}>{item.price.toLocaleString()} ₫</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={22} color="#111827" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle} numberOfLines={1}>Thông tin sản phẩm</Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="share-outline" size={22} color="#111827" />
                    <TouchableOpacity onPress={toggleFavorite}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={22}
                            color="#ef4444"
                            style={{ marginLeft: 12 }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
                {/* Hình sản phẩm */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: product.image }} style={styles.mainImage} contentFit="contain" />
                </View>

                {/* Thông tin cơ bản */}
                <View style={styles.infoCard}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>{product.price.toLocaleString()} ₫</Text>
                        {discount > 0 && <Badge style={styles.discountBadge}>Giảm {discount}%</Badge>}
                    </View>
                    <View style={styles.metaRow}>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#facc15" />
                            <Text style={styles.ratingText}>5.0</Text>
                            <Text style={styles.ratingCount}>({reviewCount} ĐGNX)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Text style={styles.soldText}>{views} lượt xem</Text>
                            {sold > 0 && <Text style={styles.soldText}>Đã bán {sold.toLocaleString()}</Text>}
                        </View>
                    </View>
                </View>

                {/* Khung nhập đánh giá (Khuyến khích review) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Viết đánh giá sản phẩm</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#16a34a', marginBottom: 8 }}>Nhận ngay 100 điểm & Mã KM 10% khi duyệt!</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
                        <Text style={{ marginRight: 8, color: '#374151' }}>Số sao:</Text>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons name={star <= rating ? "star" : "star-outline"} size={24} color="#facc15" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        mode="outlined"
                        placeholder="Nội dung đánh giá của bạn (tối thiểu 10 ký tự)..."
                        multiline
                        numberOfLines={3}
                        value={comment}
                        onChangeText={setComment}
                        style={{ backgroundColor: '#fff', marginBottom: 8 }}
                    />
                    <Button 
                        mode="contained" 
                        onPress={submitReview} 
                        loading={submitting} 
                        disabled={submitting}
                        style={{ backgroundColor: '#2563eb' }}
                    >
                        Gửi Đánh Giá
                    </Button>
                </View>

                {/* Danh sách Đánh giá */}
                {reviews.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Khách hàng nhận xét ({reviews.length})</Text>
                        </View>
                        {reviews.slice(0, 5).map(rev => (
                            <View key={rev.id} style={styles.reviewItem}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: rev.avatar || 'https://i.pravatar.cc/150' }} style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }} />
                                        <Text style={{ fontWeight: '600', color: '#111827' }}>{rev.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Ionicons key={s} name={s <= rev.rating ? "star" : "star-outline"} size={14} color="#facc15" />
                                        ))}
                                    </View>
                                </View>
                                <Text style={{ fontSize: 14, color: '#374151' }}>{rev.comment}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Khuyến mãi */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Khuyến mãi hấp dẫn</Text>
                    </View>
                    <View style={styles.promoCard}>
                        <Text style={styles.promoItem}>1. Trả góp 0% lãi suất, kỳ hạn tới 12 tháng.</Text>
                        <Text style={styles.promoItem}>2. Giảm thêm 5% khi mua kèm phụ kiện.</Text>
                        <Text style={styles.promoItem}>3. Miễn phí giao hàng nội thành cho đơn từ 2.000.000đ.</Text>
                    </View>
                </View>

                {/* Mô tả */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                    </View>
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>{product.description}</Text>
                    </View>
                </View>

                {/* Sản phẩm tương tự */}
                {similarProducts.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Sản phẩm tương tự</Text>
                        </View>
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
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomPrice}>
                    <Text style={styles.bottomPriceLabel}>Giá</Text>
                    <Text style={styles.bottomPriceText}>{product.price.toLocaleString()} ₫</Text>
                </View>
                <View style={styles.bottomActions}>
                    <TouchableOpacity style={styles.bottomIconButton}>
                        <Ionicons name="call-outline" size={20} color="#dc2626" />
                    </TouchableOpacity>
                    <Button
                        mode="contained"
                        style={styles.bottomPrimaryButton}
                        labelStyle={{ fontWeight: 'bold' }}
                        onPress={async () => {
                            try {
                                await api.post('/cart/add', { productId: product.id, quantity: 1 });
                                alert('Đã thêm sản phẩm vào giỏ hàng.');
                                navigation.navigate('MainApp', { screen: 'CartTab' });
                            } catch (e) {
                                console.log('Add to cart error:', e);
                                alert(e.response?.data?.message || 'Không thể thêm vào giỏ hàng');
                            }
                        }}
                    >
                        Thêm vào giỏ
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#ffffff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
    headerTitle: { flex: 1, marginHorizontal: 12, fontSize: 16, fontWeight: '600', color: '#111827' },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    scroll: { flex: 1 },
    imageWrapper: { backgroundColor: '#ffffff', paddingVertical: 16, alignItems: 'center' },
    mainImage: { width: width * 0.8, height: 260 },
    infoCard: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    priceText: { fontSize: 20, fontWeight: 'bold', color: '#dc2626' },
    discountBadge: { backgroundColor: '#fee2e2', color: '#b91c1c' },
    metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#111827' },
    ratingCount: { marginLeft: 4, fontSize: 12, color: '#6b7280' },
    soldText: { fontSize: 12, color: '#6b7280' },
    section: { marginTop: 10, backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12 },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
    promoCard: { backgroundColor: '#eff6ff', borderRadius: 8, padding: 10 },
    promoItem: { fontSize: 13, color: '#1e3a8a', marginBottom: 4 },
    descriptionCard: { borderRadius: 8, backgroundColor: '#f9fafb', padding: 10 },
    descriptionText: { fontSize: 14, color: '#374151', lineHeight: 20 },
    reviewItem: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb' },
    similarCard: { width: 140, marginRight: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#f3f4f6', padding: 8 },
    similarImage: { width: '100%', height: 100, marginBottom: 8 },
    similarName: { fontSize: 13, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
    similarPrice: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
    bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#ffffff', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bottomPrice: { flexDirection: 'column' },
    bottomPriceLabel: { fontSize: 12, color: '#6b7280' },
    bottomPriceText: { fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
    bottomActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    bottomIconButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#fecaca', alignItems: 'center', justifyContent: 'center' },
    bottomPrimaryButton: { backgroundColor: '#dc2626' },
});