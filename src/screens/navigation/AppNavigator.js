import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen'; // Import thêm
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Main/HomeScreen';
import ProductDetailScreen from '../screens/Main/ProductDetailScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName = route.name === 'HomeTab' ? 'home' : 'person';
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
        })}>
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Cửa Hàng' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Hồ Sơ' }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Khôi Phục Mật Khẩu' }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng Ký' }} />
                <Stack.Screen name="MainApp" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi Tiết' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}