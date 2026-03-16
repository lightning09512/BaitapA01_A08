import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Image } from 'expo-image';
import api from '../../services/api';

export default function ViewedProductsScreen({ navigation }) {
    const [viewed, setViewed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get('/users/viewed');
                setViewed(res.data || []);
            } catch (e) {
                console.log('Load viewed products error:', e);
            } finally {
                setLoading(false);
            }
        };
        const unsubscribe = navigation.addListener('focus', load);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
            <Image source={{ uri: item.image }} style={styles.image} contentFit="contain" />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString()} ₫</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator animating color="#3b82f6" /></View>;

    if (viewed.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Bạn chưa xem sản phẩm nào.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={viewed}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#6b7280', fontSize: 16 },
    card: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 },
    image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
    info: { flex: 1, justifyContent: 'center' },
    name: { fontSize: 15, fontWeight: '500', color: '#111827', marginBottom: 6 },
    price: { fontSize: 15, fontWeight: 'bold', color: '#dc2626' }
});
