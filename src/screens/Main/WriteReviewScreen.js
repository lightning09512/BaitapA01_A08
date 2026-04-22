import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import api from '../../services/api';

export default function WriteReviewScreen({ route, navigation }) {
    const { orderId, product } = route.params;
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!comment.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập cảm nhận của bạn về sản phẩm.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(`/products/${product.productId}/reviews`, {
                rating,
                comment,
                orderId
            });
            Alert.alert('Thành công', res.data.message || 'Cảm ơn bạn đã đánh giá sản phẩm!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.log('Submit review error:', error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#dc2626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Viết đánh giá</Text>
                <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                    <Text style={[styles.submitText, loading && { opacity: 0.5 }]}>GỬI</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Product Info */}
                    <View style={styles.productSection}>
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            contentFit="contain"
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                            <Text style={styles.orderId}>Mã đơn hàng: {orderId}</Text>
                        </View>
                    </View>

                    <Divider />

                    {/* Rating Section */}
                    <View style={styles.ratingSection}>
                        <Text style={styles.sectionLabel}>Chất lượng sản phẩm</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starBtn}
                                >
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={40}
                                        color="#facc15"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.ratingText}>
                            {rating === 1 && 'Rất tệ'}
                            {rating === 2 && 'Tệ'}
                            {rating === 3 && 'Bình thường'}
                            {rating === 4 && 'Tốt'}
                            {rating === 5 && 'Tuyệt vời'}
                        </Text>
                    </View>

                    {/* Comment Section */}
                    <View style={styles.commentSection}>
                        <TextInput
                            mode="flat"
                            placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..."
                            multiline
                            numberOfLines={6}
                            value={comment}
                            onChangeText={setComment}
                            style={styles.input}
                            activeUnderlineColor="#dc2626"
                        />
                        <Text style={styles.charCount}>{comment.length}/500</Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading}
                        style={styles.submitBtn}
                        contentStyle={{ height: 50 }}
                    >
                        Gửi đánh giá
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 12,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    submitText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    productSection: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        backgroundColor: '#f9fafb',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 12,
        color: '#999',
    },
    ratingSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    sectionLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    starsRow: {
        flexDirection: 'row',
    },
    starBtn: {
        marginHorizontal: 4,
    },
    ratingText: {
        marginTop: 15,
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '500',
    },
    commentSection: {
        padding: 16,
    },
    input: {
        backgroundColor: '#f9fafb',
        fontSize: 15,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    submitBtn: {
        margin: 16,
        backgroundColor: '#dc2626',
        borderRadius: 8,
        marginTop: 10,
    }
});
