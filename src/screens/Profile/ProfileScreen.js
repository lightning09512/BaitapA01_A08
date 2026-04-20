import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});
    const [originalUser, setOriginalUser] = useState(null);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: chỉnh sửa, 2: nhập OTP
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data || {});
                setOriginalUser(res.data || {});
            } catch (e) {
                console.log('Load profile error:', e);
                Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Không thể tải hồ sơ');
            }
        };
        loadProfile();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
        if (!result.canceled) setUser({ ...user, avatar: `data:image/jpeg;base64,${result.assets[0].base64}` });
    };

    // Bước 1: Gửi OTP khi có thay đổi tên hoặc SĐT
    const handleSendOtpForProfile = async () => {
        if (!originalUser) return;

        const hasNameChanged = user.name !== originalUser.name;
        const hasPhoneChanged = user.phone !== originalUser.phone;

        if (!hasNameChanged && !hasPhoneChanged) {
            // Không thay đổi tên/SĐT => chỉ lưu avatar
            return handleUpdateAvatarOnly();
        }

        if (!user.name || !user.name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
            return;
        }

        if (!user.phone || !user.phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(
                '/profile/request-phone',
                { newPhone: user.phone, newName: user.name },
            );

            Alert.alert(
                'Đã gửi OTP',
                (res.data && res.data.message) ||
                    'Vui lòng kiểm tra OTP trong terminal server và nhập vào để xác nhận thay đổi.'
            );
            setStep(2);
        } catch (e) {
            console.log('Request OTP profile error:', e);
            Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Không thể gửi OTP');
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác nhận OTP, server sẽ cập nhật tên/SĐT
    const handleVerifyOtpProfile = async () => {
        if (!otp.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post(
                '/profile/verify-phone',
                { otp },
            );

            const updatedUser = (res.data && res.data.user) || user;
            setUser(updatedUser);
            setOriginalUser(updatedUser);
            setOtp('');
            setStep(1);

            // Sau khi xác nhận tên/SĐT xong, nếu avatar thay đổi thì lưu luôn
            await handleUpdateAvatarOnly(false);

            Alert.alert('Thành công', res.data?.message || 'Cập nhật thông tin thành công');
        } catch (e) {
            console.log('Verify OTP profile error:', e);
            Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Mã OTP không đúng');
        } finally {
            setLoading(false);
        }
    };

    // Hàm chỉ lưu avatar (không OTP)
    const handleUpdateAvatarOnly = async (showAlert = true) => {
        try {
            const res = await api.put(
                '/profile/update',
                { avatar: user.avatar },
            );
            setUser(res.data?.user || user);
            setOriginalUser(res.data?.user || user);
            if (showAlert) {
                Alert.alert('Thành công', res.data?.message || 'Đã lưu avatar!');
            }
        } catch (e) {
            console.log('Update avatar error:', e);
            if (showAlert) {
                Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Không thể cập nhật avatar');
            }
        }
    };

    const logout = async () => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 }}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={{ uri: user.avatar }}
                        style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' }}
                    />
                    <IconButton
                        icon="camera"
                        style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2563eb' }}
                        iconColor="#fff"
                    />
                </TouchableOpacity>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', marginTop: 10 }}>
                    {user.name}
                </Text>
            </View>

            {step === 1 ? (
                <>
                    <TextInput
                        label="Họ tên"
                        value={user.name}
                        onChangeText={t => setUser({ ...user, name: t })}
                        mode="outlined"
                        style={{ marginBottom: 15 }}
                    />
                    <TextInput
                        label="SĐT"
                        value={user.phone}
                        onChangeText={t => setUser({ ...user, phone: t })}
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        keyboardType="phone-pad"
                    />

                    <Button
                        mode="contained"
                        onPress={handleSendOtpForProfile}
                        style={{ backgroundColor: '#2563eb', marginBottom: 15 }}
                        loading={loading}
                        disabled={loading}
                    >
                        Lưu Thay Đổi (Gửi OTP)
                    </Button>
                </>
            ) : (
                <>
                    <Text style={{ marginBottom: 10, textAlign: 'center', color: '#555' }}>
                        Mã OTP đã được in trong terminal server. Vui lòng nhập để xác nhận thay đổi họ tên/SĐT.
                    </Text>
                    <TextInput
                        label="Mã OTP"
                        value={otp}
                        onChangeText={setOtp}
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                    <Button
                        mode="contained"
                        onPress={handleVerifyOtpProfile}
                        style={{ backgroundColor: '#2563eb', marginBottom: 10 }}
                        loading={loading}
                        disabled={loading}
                    >
                        Xác Nhận OTP
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => {
                            setStep(1);
                            setOtp('');
                        }}
                        disabled={loading}
                    >
                        Hủy và quay lại
                    </Button>
                </>
            )}

            <View style={{ width: '100%', marginBottom: 20, marginTop: 10 }}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
                    <Ionicons name="receipt-outline" size={24} color="#2563eb" style={{ marginRight: 15 }} />
                    <Text style={styles.menuText}>Đơn hàng của tôi</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>
                    <Ionicons name="heart-outline" size={24} color="#ef4444" style={{ marginRight: 15 }} />
                    <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ViewedProducts')}>
                    <Ionicons name="time-outline" size={24} color="#3b82f6" style={{ marginRight: 15 }} />
                    <Text style={styles.menuText}>Sản phẩm đã xem</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Wallet')}>
                    <Ionicons name="wallet-outline" size={24} color="#f59e0b" style={{ marginRight: 15 }} />
                    <Text style={styles.menuText}>Kho điểm & Khuyến mãi</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrderStats')}>
                    <Ionicons name="analytics-outline" size={24} color="#10b981" style={{ marginRight: 15 }} />
                    <Text style={styles.menuText}>Thống kê dòng tiền</Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            <Button mode="contained" buttonColor="#ef4444" onPress={logout} style={{ marginBottom: 40 }}>
                Đăng Xuất
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        fontWeight: '500'
    }
});