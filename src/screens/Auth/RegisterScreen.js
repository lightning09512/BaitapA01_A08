import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import api from '../../services/api';

export default function RegisterScreen({ navigation }) {
    const [form, setForm] = useState({ username:'', password:'', email:'' });

    const handleRegister = async () => {
        try {
            await api.post('/register', form);
            Alert.alert("Thành công", "Đăng ký thành công!");
            navigation.goBack();
        } catch (e) { Alert.alert("Lỗi", "Tài khoản đã tồn tại"); }
    };

    return (
        <View style={{flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff'}}>
            <TextInput label="Tài khoản" onChangeText={t=>setForm({...form, username:t})} mode="outlined" style={{marginBottom:15}}/>
            <TextInput label="Email" onChangeText={t=>setForm({...form, email:t})} mode="outlined" style={{marginBottom:15}}/>
            <TextInput label="Mật khẩu" secureTextEntry onChangeText={t=>setForm({...form, password:t})} mode="outlined" style={{marginBottom:20}}/>
            <Button mode="contained" onPress={handleRegister} style={{backgroundColor:'#2563eb'}}>Tạo Tài Khoản</Button>
        </View>
    );
}