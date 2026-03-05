import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import api from '../../services/api';

export default function ProductDetailScreen({ route }) {
    const [product, setProduct] = useState(null);
    useEffect(() => { api.get(`/products/${route.params.id}`).then(res => setProduct(res.data)); }, []);

    if (!product) return <View/>;
    return (
        <ScrollView style={{flex:1, backgroundColor:'#fff'}}>
            <Image source={{ uri: product.image }} style={{width:'100%', height:300}} resizeMode="contain" />
            <View style={{padding:20}}>
                <Text variant="headlineMedium" style={{fontWeight:'bold'}}>{product.name}</Text>
                <Text variant="titleLarge" style={{color:'#dc2626', marginVertical:10}}>{product.price.toLocaleString()} ₫</Text>
                <Text>{product.description}</Text>
                <Button mode="contained" style={{marginTop:30, backgroundColor:'#2563eb'}}>Thêm Giỏ Hàng</Button>
            </View>
        </ScrollView>
    );
}