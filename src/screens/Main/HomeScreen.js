
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TextInput, Text, ActivityIndicator } from 'react-native-paper';
import api from '../../services/api';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get(`/products?search=${search}`).then(res => setProducts(res.data));
    }, [search]);

    return (
        <View style={{flex:1, padding:10, backgroundColor:'#f1f5f9', paddingTop:40}}>
            <TextInput placeholder="Tìm kiếm..." value={search} onChangeText={setSearch} mode="outlined" style={{backgroundColor:'#fff', marginBottom:15}} right={<TextInput.Icon icon="magnify"/>}/>
            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
                        <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.price}>{item.price.toLocaleString()} ₫</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flex: 1, backgroundColor: '#fff', margin: 5, padding: 10, borderRadius: 10 },
    img: { width: '100%', height: 120, marginBottom: 8 },
    name: { fontWeight: 'bold' },
    price: { color: '#dc2626', fontWeight: 'bold', marginTop: 4 }
});