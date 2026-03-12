import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../Auth/ForgotPasswordScreen';
import LoginScreen from '../Auth/LoginScreen';
import RegisterScreen from '../Auth/RegisterScreen';
import VerifyAccountScreen from '../Auth/VerifyAccountScreen';
import HomepageScreen from '../HomepageScreen';
import IntroScreen from '../IntroScreen';
import HomeScreen from '../Main/HomeScreen';
import ProductDetailScreen from '../Main/ProductDetailScreen';
import CartScreen from '../Main/CartScreen';
import OrdersScreen from '../Main/OrdersScreen';
import ProfileScreen from '../Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName = 'home';
                if (route.name === 'HomeTab') iconName = 'home';
                else if (route.name === 'CartTab') iconName = 'cart';
                else if (route.name === 'ProfileTab') iconName = 'person';
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
        })}>
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Cửa Hàng' }} />
            <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Giỏ Hàng' }} />
            <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Hồ Sơ' }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Intro" component={IntroScreen} />
                <Stack.Screen name="Homepage" component={HomepageScreen} />
                <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} options={{ title: 'Xác Minh Tài Khoản' }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Khôi Phục Mật Khẩu' }} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng Ký' }} />
                <Stack.Screen name="MainApp" component={MainTabs} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi Tiết' }} />
                <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Đơn Hàng' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}