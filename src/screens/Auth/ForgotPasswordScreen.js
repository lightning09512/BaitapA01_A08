import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import api from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleSendOTP = async () => {
        try {
            await api.post('/forgot-password', { email });
            Alert.alert("Thành công", "Đã gửi mã OTP, vui lòng xem console Server");
            setStep(2);
        } catch (e) { Alert.alert("Lỗi", e.response?.data?.message || "Lỗi gửi OTP"); }
    };

    const handleResetPassword = async () => {
        try {
            await api.post('/reset-password', { email, otp, newPassword });
            Alert.alert("Thành công", "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigation.goBack();
        } catch (e) { Alert.alert("Lỗi", e.response?.data?.message || "Sai mã OTP"); }
    };

    return (
        <View style={{flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff'}}>
            <Text variant="headlineMedium" style={{fontWeight:'bold', marginBottom:20, textAlign:'center'}}>Quên Mật Khẩu</Text>

            {step === 1 ? (
                <>
                    <TextInput label="Nhập Email của bạn" value={email} onChangeText={setEmail} mode="outlined" style={{marginBottom:15}} autoCapitalize="none"/>
                    <Button mode="contained" onPress={handleSendOTP} style={{backgroundColor:'#2563eb'}}>Gửi Mã OTP</Button>
                </>
            ) : (
                <>
                    <Text style={{textAlign:'center', marginBottom:15}}>OTP đã được gửi tới {email}</Text>
                    <TextInput label="Mã OTP" value={otp} onChangeText={setOtp} mode="outlined" style={{marginBottom:15}}/>
                    <TextInput label="Mật khẩu mới" value={newPassword} onChangeText={setNewPassword} secureTextEntry mode="outlined" style={{marginBottom:20}}/>
                    <Button mode="contained" onPress={handleResetPassword} style={{backgroundColor:'#2563eb'}}>Đặt Lại Mật Khẩu</Button>
                </>
            )}
            <Button mode="text" onPress={() => navigation.goBack()} style={{marginTop:15}}>Quay lại Đăng nhập</Button>
        </View>
    );
}