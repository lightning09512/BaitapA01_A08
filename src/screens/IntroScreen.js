import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window'); // Lấy kích thước màn hình

export default function IntroScreen({ navigation }) {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Text animation (starts after logo)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, 800);

      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: width * 0.8,
        duration: 10000,
        useNativeDriver: false,
      }).start();
    };

    startAnimations();

    // Auto navigate after 10 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1e40af" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo container with animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: 'https://brasol.vn/wp-content/uploads/2022/09/logo-dai-hoc-su-pham-ky-thuat-tp-hcm.jpg' }}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.logoBorder} />
          </View>
        </Animated.View>

        {/* Text content with animation */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.universityName}>
            Trường Đại học Sư phạm Kỹ thuật
          </Text>
          <Text style={styles.universitySubName}>
            Thành phố Hồ Chí Minh
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.groupName}>Nhóm 10</Text>
          <Text style={styles.studentName}>Nguyễn Minh Quốc Khánh</Text>
          <Text style={styles.studentName}>Phạm Minh Khánh</Text>
          <Text style={styles.major}>Chuyên ngành: Công nghệ Phần mềm</Text>
        </Animated.View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Đang tải...</Text>
        </View>

        {/* Footer text */} 
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bài tập Lập trình Di động Nâng cao</Text>
        </View>
      </View>

      {/* Decorative elements */} 
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    backgroundColor: '#1e40af',
    opacity: 0.8,
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  logoBorder: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#60a5fa',
    opacity: 0.5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  universityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  universitySubName: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#3b82f6',
    marginVertical: 20,
    borderRadius: 2,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  studentId: {
    fontSize: 16,
    color: '#60a5fa',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  major: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    width: '100%',
  },
  progressBackground: {
    width: width * 0.8,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  decorativeCircles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: '#3b82f6',
    top: height * 0.2,
    left: -30,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#60a5fa',
    top: height * 0.6,
    right: -50,
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: '#93c5fd',
    bottom: height * 0.3,
    left: 50,
  },
});
