import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Activity, History, User, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Active Users', value: '--', trend: '+12% from last wk' },
    { label: 'Images Analyzed', value: '--', trend: 'Historical total' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>Analyst Portal</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <User color={Colors.dark.primary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTag}>BONEAI PRO ANALYZER</Text>
        <Text style={styles.bannerTitle}>Advanced Bone Abnormality Detection</Text>
        <Text style={styles.bannerDesc}>
            Leveraging state-of-the-art <Text style={styles.boldText}>YOLOv8 deep learning</Text>, our system provides real-time, automated 
            analysis of bone radiographs.
        </Text>
        
        <View style={styles.statsCardsRow}>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>98%</Text>
                <Text style={styles.mStatLabel}>Sensitivity</Text>
            </View>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>0.1s</Text>
                <Text style={styles.mStatLabel}>Inference</Text>
            </View>
        </View>

        <TouchableOpacity 
            style={styles.launchBtn}
            onPress={() => router.push('/(tabs)/predict')}
        >
          <Text style={styles.launchBtnText}>New Detection</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => router.push('/(tabs)/history')}
      >
        <View style={styles.actionIcon}>
          <History color={Colors.dark.primary} size={24} />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>View Diagnostic History</Text>
          <Text style={styles.actionSub}>Access your previous automated reports</Text>
        </View>
        <ChevronRight color="#444" size={24} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  username: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232E42',
  },
  banner: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  bannerTag: {
    color: Colors.dark.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 12,
  },
  bannerDesc: {
    color: '#9BA1A6',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  boldText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  statsCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  mStatCard: {
    backgroundColor: 'rgba(70, 255, 210, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(70, 255, 210, 0.1)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  mStatVal: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mStatLabel: {
    color: '#9BA1A6',
    fontSize: 8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  launchBtn: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  launchBtnText: {
    color: '#0B1421',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    borderWidth: 1,
    borderColor: '#232E42',
    alignItems: 'center',
  },
  statLabel: {
    color: '#9BA1A6',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTrend: {
    color: Colors.dark.primary,
    fontSize: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSub: {
    color: '#666',
    fontSize: 12,
  },
});
