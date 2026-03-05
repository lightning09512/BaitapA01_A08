import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});

    useEffect(() => { api.get('/profile').then(res => setUser(res.data)); }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
        if (!result.canceled) setUser({ ...user, avatar: `data:image/jpeg;base64,${result.assets[0].base64}` });
    };

    const handleUpdate = async () => {
        await api.put('/profile/update', { name: user.name, phone: user.phone, avatar: user.avatar });
        Alert.alert("Thành công", "Đã lưu!");
    };

    const logout = async () => {
        await AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    return (
        <ScrollView style={{flex:1, padding:20, backgroundColor:'#fff', paddingTop:50}}>
            <View style={{alignItems:'center', marginBottom:30}}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: user.avatar }} style={{width:120, height:120, borderRadius:60, backgroundColor:'#eee'}} />
                    <IconButton icon="camera" style={{position:'absolute', bottom:0, right:0, backgroundColor:'#2563eb'}} iconColor="#fff"/>
                </TouchableOpacity>
                <Text variant="titleLarge" style={{fontWeight:'bold', marginTop:10}}>{user.name}</Text>
            </View>

            <TextInput label="Họ tên" value={user.name} onChangeText={t=>setUser({...user, name:t})} mode="outlined" style={{marginBottom:15}}/>
            <TextInput label="SĐT" value={user.phone} onChangeText={t=>setUser({...user, phone:t})} mode="outlined" style={{marginBottom:20}}/>

            <Button mode="contained" onPress={handleUpdate} style={{backgroundColor:'#2563eb', marginBottom:15}}>Lưu Thay Đổi</Button>
            <Button mode="contained" buttonColor="#ef4444" onPress={logout}>Đăng Xuất</Button>
        </ScrollView>
    );
}