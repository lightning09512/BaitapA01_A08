import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomepageScreen({ navigation }) {

  const skills = [
    'React Native',
    'JavaScript/TypeScript',
    'React.js',
    'Node.js',
    'MongoDB',
    'Git/GitHub',
    'UI/UX Design',
    'Mobile Development'
  ];

  const projects = [
    {
      icon: "📱",
      title: "Mobile Portfolio App",
      tech: "React Native",
      description: "Ứng dụng portfolio cá nhân hiển thị thông tin sinh viên và dự án."
    }
  ];

  const achievements = [
    "Hoàn thành nhiều dự án cá nhân về Web và Mobile",
    "Thành thạo React Native cơ bản",
    "Có kinh nghiệm làm việc nhóm trong dự án phần mềm"
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1e40af" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.backgroundPattern}>
            <View style={styles.pattern1} />
            <View style={styles.pattern2} />
          </View>
          
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: "https://spkthcm.com/wp-content/uploads/2025/01/Logo_Truong_Dai_Hoc_Su_Pham_Ky_Thuat_TP_Ho_Chi_Mi1nh.jpg" }}
                  style={styles.logo}
                  contentFit="contain"
                />
                <View style={styles.logoBorder} />
              </View>
            </View>
            
            <Text style={styles.universityName}>Trường Đại học Sư phạm Kỹ thuật</Text>
            <Text style={styles.universitySubName}>Thành phố Hồ Chí Minh</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>NQK</Text>
              </View>
              <View style={styles.avatarBorder} />
            </View>
            
            <Text style={styles.studentName}>Nguyễn Minh Quốc Khánh</Text>
            <Text style={styles.studentId}>MSSV: 23110113</Text>
            <Text style={styles.major}>Công nghệ Phần mềm</Text>
            
            <View style={styles.contactRow}>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL('mailto:ng.minhquockhanh@gmail.com')}
              >
                <Ionicons name="mail" size={20} color="#3b82f6" />
                <Text style={styles.contactText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL('tel:0395990338')}
              >
                <Ionicons name="phone" size={20} color="#3b82f6" />
                <Text style={styles.contactText}>Phone</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL('https://github.com/lightning09512')}
              >
                <Ionicons name="logo-github" size={20} color="#3b82f6" />
                <Text style={styles.contactText}>GitHub</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về Tôi</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Sinh viên năm 3 chuyên ngành Công nghệ Phần mềm tại Đại học Sư phạm Kỹ thuật TPHCM. 
              Đam mê phát triển ứng dụng di động và web, luôn tìm kiếm cơ hội học hỏi và phát triển 
              kỹ năng mới. Có kinh nghiệm thực tế qua nhiều dự án cá nhân và nhóm.
            </Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kỹ Năng</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dự Án Tiêu Biểu</Text>

          {projects.map((project, index) => (
            <View key={index} style={styles.projectCard}>
              
              <View style={styles.projectHeader}>
                <Text style={styles.projectIcon}>{project.icon}</Text>

                <View style={styles.projectInfo}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectTech}>{project.tech}</Text>
                </View>

              </View>

              <Text style={styles.projectDescription}>
                {project.description}
              </Text>

            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành Tích</Text>

          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              
              <View key={index} style={styles.achievementItem}>
                <Ionicons name="trophy" size={16} color="#fbbf24" />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>

            ))}
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Nguyễn Minh Quốc Khánh
          </Text>

          <Text style={styles.footerSubText}>
            Lập trình Di động Nâng cao
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    height: height * 0.4,
    backgroundColor: '#1e40af',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pattern1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -50,
    right: -50,
  },
  pattern2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    left: -30,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoBorder: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  universityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  universitySubName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  profileSection: {
    marginTop: -60,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  avatarBorder: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ffffff',
    top: -5,
    left: -5,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  studentId: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 5,
  },
  major: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  contactButton: {
    alignItems: 'center',
    padding: 10,
  },
  contactText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  aboutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  aboutText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  skillText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  projectTech: {
    fontSize: 14,
    color: '#3b82f6',
  },
  projectDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  achievementsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});