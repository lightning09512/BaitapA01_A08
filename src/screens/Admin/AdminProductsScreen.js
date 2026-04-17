import React, { useEffect, useState, useCallback } from 'react';
import {
    View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, TextInput as RNTextInput,
} from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import api from '../../services/api';

const CATEGORIES = ['Điện thoại', 'Laptop', 'Tablet', 'Tai nghe', 'Đồng hồ', 'Phụ kiện', 'Khác'];

const defaultForm = { name: '', price: '', category: 'Điện thoại', description: '', image: '', discountPercent: '0' };

export default function AdminProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false); // false = create, true = edit
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    const loadProducts = useCallback(async (pageToLoad = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        try {
            const res = await api.get(`/admin/products?page=${pageToLoad}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ''}`);
            const data = res.data;
            setProducts(prev => append ? [...prev, ...(data.items || [])] : (data.items || []));
            setHasMore(data.hasMore || false);
            setPage(pageToLoad);
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search]);

    useEffect(() => { loadProducts(1); }, [search]);

    const openCreate = () => {
        setForm(defaultForm);
        setEditMode(false);
        setEditId(null);
        setModalVisible(true);
    };

    const openEdit = (product) => {
        setForm({
            name: product.name || '',
            price: String(product.price || ''),
            category: product.category || 'Khác',
            description: product.description || '',
            image: product.image || '',
            discountPercent: String(product.discountPercent || '0'),
        });
        setEditMode(true);
        setEditId(product.id);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.price) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm.');
            return;
        }
        setSaving(true);
        try {
            if (editMode) {
                await api.put(`/admin/products/${editId}`, form);
                Alert.alert('Thành công', 'Đã cập nhật sản phẩm!');
            } else {
                await api.post('/admin/products', form);
                Alert.alert('Thành công', 'Đã thêm sản phẩm mới!');
            }
            setModalVisible(false);
            loadProducts(1);
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể lưu sản phẩm');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (product) => {
        Alert.alert(
            'Xác nhận xoá',
            `Bạn có chắc muốn xoá "${product.name}"?`,
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xoá', style: 'destructive', onPress: async () => {
                        try {
                            await api.delete(`/admin/products/${product.id}`);
                            setProducts(prev => prev.filter(p => p.id !== product.id));
                        } catch (e) {
                            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể xoá');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImg} contentFit="contain" />
            <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productMeta}>{item.category} • Đã bán: {item.soldQuantity}</Text>
                <Text style={styles.productPrice}>{Number(item.price).toLocaleString()} ₫
                    {item.discountPercent > 0 && <Text style={{ color: '#ef4444' }}> (-{item.discountPercent}%)</Text>}
                </Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEdit(item)} style={styles.editBtn}>
                    <Ionicons name="pencil-outline" size={18} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Sản phẩm</Text>
                <TouchableOpacity onPress={openCreate} style={styles.addBtn}>
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
                <Ionicons name="search-outline" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                <RNTextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#9ca3af"
                />
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating color="#dc2626" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
                    onEndReached={() => hasMore && !loadingMore && loadProducts(page + 1, true)}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator animating color="#dc2626" /> : null}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>Không có sản phẩm nào.</Text>}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Modal Thêm/Sửa */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={22} color="#111827" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput label="Tên sản phẩm *" value={form.name} onChangeText={v => setForm({ ...form, name: v })} mode="outlined" style={styles.formInput} />
                            <TextInput label="Giá (VND) *" value={form.price} onChangeText={v => setForm({ ...form, price: v })} mode="outlined" keyboardType="numeric" style={styles.formInput} />
                            <TextInput label="% Giảm giá" value={form.discountPercent} onChangeText={v => setForm({ ...form, discountPercent: v })} mode="outlined" keyboardType="numeric" style={styles.formInput} />
                            <TextInput label="URL Hình ảnh" value={form.image} onChangeText={v => setForm({ ...form, image: v })} mode="outlined" style={styles.formInput} />

                            <Text style={styles.formLabel}>Danh mục:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                                {CATEGORIES.map(cat => (
                                    <TouchableOpacity key={cat} onPress={() => setForm({ ...form, category: cat })}
                                        style={[styles.catChip, form.category === cat && styles.catChipActive]}>
                                        <Text style={[styles.catChipText, form.category === cat && { color: '#fff' }]}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TextInput label="Mô tả sản phẩm" value={form.description} onChangeText={v => setForm({ ...form, description: v })} mode="outlined" multiline numberOfLines={3} style={styles.formInput} />

                            <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={{ backgroundColor: '#dc2626', marginTop: 8 }}>
                                {editMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                            </Button>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: {
        paddingTop: 48, paddingBottom: 14, paddingHorizontal: 16,
        backgroundColor: '#991b1b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#fff', flex: 1, marginLeft: 12 },
    addBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
    searchRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', margin: 12, paddingHorizontal: 12,
        borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb',
    },
    searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 10 },
    productCard: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10,
        padding: 10, marginBottom: 8, alignItems: 'center', elevation: 1, gap: 10,
    },
    productImg: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f9fafb' },
    productName: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 2 },
    productMeta: { fontSize: 11, color: '#9ca3af', marginBottom: 3 },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
    cardActions: { gap: 8 },
    editBtn: { padding: 8, backgroundColor: '#dbeafe', borderRadius: 8 },
    deleteBtn: { padding: 8, backgroundColor: '#fee2e2', borderRadius: 8 },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalCard: {
        backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: 20, maxHeight: '90%',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
    formInput: { marginBottom: 12, backgroundColor: '#fff' },
    formLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    catChip: {
        paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
        backgroundColor: '#f3f4f6', marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb',
    },
    catChipActive: { backgroundColor: '#dc2626', borderColor: '#b91c1c' },
    catChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
});
