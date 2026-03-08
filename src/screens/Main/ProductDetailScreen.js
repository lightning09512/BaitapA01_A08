import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Button, Text, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/products/${route.params.id}`);
                setProduct(res.data);
            } catch (e) {
                console.log('Product detail error:', e);
            }
        };
        load();
    }, [route.params.id]);

    if (!product) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
    }

    const discount = product.discountPercent || 0;
    const sold = product.soldQuantity || 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={22}
                    color="#111827"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Thông tin sản phẩm
                </Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="share-outline" size={22} color="#111827" />
                    <Ionicons
                        name="heart-outline"
                        size={22}
                        color="#ef4444"
                        style={{ marginLeft: 12 }}
                    />
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 90 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hình sản phẩm chính */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.mainImage}
                        contentFit="contain"
                    />
                </View>

                {/* Thông tin cơ bản */}
                <View style={styles.infoCard}>
                    <Text style={styles.productName}>{product.name}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>
                            {product.price.toLocaleString()} ₫
                        </Text>
                        {discount > 0 && (
                            <Badge style={styles.discountBadge}>Giảm {discount}%</Badge>
                        )}
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#facc15" />
                            <Text style={styles.ratingText}>5.0</Text>
                            <Text style={styles.ratingCount}>(Đánh giá giả lập)</Text>
                        </View>
                        {sold > 0 && (
                            <Text style={styles.soldText}>Đã bán {sold.toLocaleString()}</Text>
                        )}
                    </View>
                </View>

                {/* Khuyến mãi hấp dẫn (fake giống CellphoneS) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Khuyến mãi hấp dẫn</Text>
                    </View>
                    <View style={styles.promoCard}>
                        <Text style={styles.promoItem}>
                            1. Trả góp 0% lãi suất, kỳ hạn tới 12 tháng (qua thẻ tín dụng).
                        </Text>
                        <Text style={styles.promoItem}>
                            2. Giảm thêm 5% khi mua kèm phụ kiện (tai nghe, ốp lưng, sạc nhanh...).
                        </Text>
                        <Text style={styles.promoItem}>
                            3. Miễn phí giao hàng nội thành cho đơn từ 2.000.000đ.
                        </Text>
                    </View>
                </View>

                {/* Mô tả sản phẩm */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                    </View>
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>{product.description}</Text>
                    </View>
                </View>

                {/* Thông số kỹ thuật (đơn giản) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Thông số cơ bản</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Danh mục</Text>
                        <Text style={styles.specValue}>{product.category}</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Mã sản phẩm</Text>
                        <Text style={styles.specValue}>#{product.id}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Thanh hành động dưới cùng */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomPrice}>
                    <Text style={styles.bottomPriceLabel}>Giá</Text>
                    <Text style={styles.bottomPriceText}>
                        {product.price.toLocaleString()} ₫
                    </Text>
                </View>
                <View style={styles.bottomActions}>
                    <TouchableOpacity style={styles.bottomIconButton}>
                        <Ionicons name="call-outline" size={20} color="#dc2626" />
                    </TouchableOpacity>
                    <Button
                        mode="outlined"
                        textColor="#dc2626"
                        style={styles.bottomOutlineButton}
                    >
                        Trả góp 0%
                    </Button>
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
                                alert(e.response?.data?.message || e.message || 'Không thể thêm vào giỏ hàng');
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
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: '#ffffff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        flex: 1,
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scroll: {
        flex: 1,
    },
    imageWrapper: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        alignItems: 'center',
    },
    mainImage: {
        width: width * 0.8,
        height: 260,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    discountBadge: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    ratingCount: {
        marginLeft: 4,
        fontSize: 12,
        color: '#6b7280',
    },
    soldText: {
        fontSize: 12,
        color: '#6b7280',
    },
    section: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    promoCard: {
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        padding: 10,
    },
    promoItem: {
        fontSize: 13,
        color: '#1e3a8a',
        marginBottom: 4,
    },
    descriptionCard: {
        borderRadius: 8,
        backgroundColor: '#f9fafb',
        padding: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e7eb',
    },
    specLabel: {
        fontSize: 13,
        color: '#6b7280',
    },
    specValue: {
        fontSize: 13,
        color: '#111827',
        fontWeight: '500',
    },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomPrice: {
        flexDirection: 'column',
    },
    bottomPriceLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    bottomPriceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    bottomActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bottomIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fecaca',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomOutlineButton: {
        borderColor: '#fecaca',
        backgroundColor: '#fff7ed',
    },
    bottomPrimaryButton: {
        backgroundColor: '#dc2626',
    },
});