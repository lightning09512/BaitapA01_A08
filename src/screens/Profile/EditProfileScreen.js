import React, { useEffect, useState } from 'react';
import { 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Alert, 
    StyleSheet, 
    SafeAreaView,
    Platform
} from 'react-native';
import { TextInput, Button, Text, Divider, Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

export default function EditProfileScreen({ navigation }) {
    const [user, setUser] = useState({
        name: '',
        phone: '',
        avatar: '',
        bio: '',
        gender: '',
        birthday: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [genderMenuVisible, setGenderMenuVisible] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                const data = res.data || {};
                setUser({
                    name: data.name || '',
                    phone: data.phone || '',
                    avatar: data.avatar || '',
                    bio: data.bio || '',
                    gender: data.gender || '',
                    birthday: data.birthday || '',
                    email: data.email || ''
                });
            } catch (e) {
                console.log('Load profile error:', e);
                Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ');
            }
        };
        loadProfile();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });
        if (!result.canceled) setUser({ ...user, avatar: `data:image/jpeg;base64,${result.assets[0].base64}` });
    };

    const handleSave = async () => {
        if (!user.name?.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
        
        setLoading(true);
        try {
            const res = await api.put('/profile/update', { 
                avatar: user.avatar,
                name: user.name, 
                phone: user.phone,
                bio: user.bio,
                gender: user.gender,
                birthday: user.birthday
            });
            
            Alert.alert('Thành công', 'Thông tin hồ sơ đã được cập nhật!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || 'Không thể cập nhật hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const renderField = (label, value, isDisabled = false) => (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={[styles.fieldValue, isDisabled && { color: '#9ca3af' }]}>{value || 'Chưa thiết lập'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#dc2626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sửa hồ sơ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                        <Image source={{ uri: user.avatar || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
                        <View style={styles.editIconWrapper}>
                            <Ionicons name="camera-outline" size={20} color="#666" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.editAvatarText}>Chạm để thay đổi</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldsContainer}>
                    <View style={styles.section}>
                        <TextInput
                            label="Họ tên"
                            value={user.name}
                            onChangeText={t => setUser({ ...user, name: t })}
                            mode="flat"
                            style={styles.input}
                            activeUnderlineColor="#dc2626"
                        />
                        <Divider />
                        <TextInput
                            label="Số điện thoại"
                            value={user.phone}
                            onChangeText={t => setUser({ ...user, phone: t })}
                            mode="flat"
                            style={styles.input}
                            keyboardType="phone-pad"
                            activeUnderlineColor="#dc2626"
                        />
                        <Divider />
                        <TextInput
                            label="Tiểu sử"
                            value={user.bio}
                            onChangeText={t => setUser({ ...user, bio: t })}
                            mode="flat"
                            placeholder="Chưa có tiểu sử"
                            style={styles.input}
                            activeUnderlineColor="#dc2626"
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Thông tin thêm</Text>
                    </View>
                    
                    <View style={styles.section}>
                        <View style={styles.menuContainer}>
                            <Menu
                                visible={genderMenuVisible}
                                onDismiss={() => setGenderMenuVisible(false)}
                                anchor={
                                    <TouchableOpacity 
                                        style={styles.dropdownTrigger} 
                                        onPress={() => setGenderMenuVisible(true)}
                                    >
                                        <Text style={styles.dropdownLabel}>Giới tính</Text>
                                        <View style={styles.dropdownValueRow}>
                                            <Text style={styles.dropdownValue}>{user.gender || 'Chọn giới tính'}</Text>
                                            <Ionicons name="chevron-down" size={16} color="#666" />
                                        </View>
                                    </TouchableOpacity>
                                }
                            >
                                <Menu.Item onPress={() => { setUser({...user, gender: 'Nam'}); setGenderMenuVisible(false); }} title="Nam" />
                                <Menu.Item onPress={() => { setUser({...user, gender: 'Nữ'}); setGenderMenuVisible(false); }} title="Nữ" />
                                <Menu.Item onPress={() => { setUser({...user, gender: 'Khác'}); setGenderMenuVisible(false); }} title="Khác" />
                            </Menu>
                        </View>
                        <Divider />
                        <TextInput
                            label="Ngày sinh"
                            value={user.birthday}
                            onChangeText={t => setUser({ ...user, birthday: t })}
                            mode="flat"
                            placeholder="DD/MM/YYYY"
                            style={styles.input}
                            activeUnderlineColor="#dc2626"
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Tài khoản</Text>
                    </View>

                    <View style={styles.section}>
                        {renderField('Email', user.email, true)}
                    </View>

                    <Button 
                        mode="contained" 
                        onPress={handleSave} 
                        style={styles.saveBtn}
                        loading={loading}
                        disabled={loading}
                    >
                        Lưu thông tin
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingTop: Platform.OS === 'android' ? 40 : 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f3f4f6',
    },
    editIconWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 2,
    },
    editAvatarText: {
        color: '#666',
        fontSize: 13,
    },
    fieldsContainer: {
        marginTop: 10,
    },
    section: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    sectionHeaderText: {
        fontSize: 13,
        color: '#999',
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#fff',
        height: 55,
        paddingHorizontal: 0,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
    },
    fieldLabel: {
        fontSize: 15,
        color: '#333',
    },
    fieldValue: {
        fontSize: 15,
        color: '#333',
    },
    menuContainer: {
        width: '100%',
    },
    dropdownTrigger: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownLabel: {
        fontSize: 12,
        color: '#666',
        position: 'absolute',
        top: 8,
    },
    dropdownValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    dropdownValue: {
        fontSize: 16,
        color: '#333',
    },
    saveBtn: {
        margin: 16,
        marginTop: 30,
        backgroundColor: '#dc2626',
        borderRadius: 4,
        paddingVertical: 6,
    }
});
