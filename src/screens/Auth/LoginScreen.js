import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/login', { username, password });
            await AsyncStorage.setItem('TOKEN', res.data.token);
            navigation.replace('MainApp'); // Chuyển vào luồng Bottom Tabs
        } catch (e) { Alert.alert("Lỗi", "Sai tài khoản"); }
    };

    return (
        <View style={{flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff'}}>
            <Text variant="displaySmall" style={{textAlign:'center', fontWeight:'bold', color:'#2563eb', marginBottom:30}}>E-Commerce</Text>
            <TextInput label="Tài khoản" value={username} onChangeText={setUsername} mode="outlined" style={{marginBottom:15}} autoCapitalize="none"/>
            <TextInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={{marginBottom:20}}/>
            <Button mode="contained" onPress={handleLogin} style={{backgroundColor:'#2563eb'}}>Đăng Nhập</Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')} style={{marginTop:10}}>Chưa có tài khoản? Đăng ký</Button>
        </View>
    );
}