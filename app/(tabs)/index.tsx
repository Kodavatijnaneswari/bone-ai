import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors, Layout } from '@/constants/theme';
import { Activity, History, User, ChevronRight, Zap, Database } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>Analyst Portal</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.profileBtn}>
          <User color={Colors.dark.primary} size={24} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={[Colors.dark.surfaceElevated, Colors.dark.surface]}
        style={styles.banner}
      >
        <View style={styles.bannerHeader}>
            <View style={styles.tagBadge}>
                <Zap size={12} color={Colors.dark.primary} fill={Colors.dark.primary} />
                <Text style={styles.bannerTag}>BONEAI PRO</Text>
            </View>
            <Database size={20} color={Colors.dark.textSecondary} opacity={0.5} />
        </View>
        
        <Text style={styles.bannerTitle}>Precision Neural Diagnostic</Text>
        <Text style={styles.bannerDesc}>
            Automated radiograph analysis utilizing <Text style={styles.boldText}>YOLOv8 Deep Learning</Text> for rapid abnormality identification.
        </Text>
        
        <View style={styles.statsCardsRow}>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>98%</Text>
                <Text style={styles.mStatLabel}>Sensitivity</Text>
            </View>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>0.1s</Text>
                <Text style={styles.mStatLabel}>Latency</Text>
            </View>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>v8.2</Text>
                <Text style={styles.mStatLabel}>Engine</Text>
            </View>
        </View>

        <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.launchBtn}
            onPress={() => router.push('/(tabs)/predict')}
        >
          <LinearGradient
            colors={[Colors.dark.primary, '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.launchBtnGradient}
          >
            <Text style={styles.launchBtnText}>New Detection Sequence</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>System Access</Text>
      </View>

      <TouchableOpacity 
        activeOpacity={0.7}
        style={styles.actionCard}
        onPress={() => router.push('/(tabs)/history')}
      >
        <View style={styles.actionIcon}>
          <History color={Colors.dark.primary} size={24} />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Diagnostic History</Text>
          <Text style={styles.actionSub}>Review archival automated reports</Text>
        </View>
        <ChevronRight color={Colors.dark.textSecondary} opacity={0.3} size={20} />
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.7}
        style={[styles.actionCard, { marginTop: Layout.spacing.md }]}
        onPress={() => router.push('/(tabs)/predict')}
      >
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(129, 140, 248, 0.1)' }]}>
          <Activity color={Colors.dark.accent} size={24} />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Active Instance</Text>
          <Text style={styles.actionSub}>Initialize new inference session</Text>
        </View>
        <ChevronRight color={Colors.dark.textSecondary} opacity={0.3} size={20} />
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
    padding: Layout.spacing.lg,
    paddingTop: 60,
    paddingBottom: Layout.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  greeting: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  username: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  profileBtn: {
    width: 52,
    height: 52,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  banner: {
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    gap: 6,
  },
  bannerTag: {
    color: Colors.dark.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  bannerTitle: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: Layout.spacing.sm,
    letterSpacing: -0.5,
  },
  bannerDesc: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Layout.spacing.xl,
  },
  boldText: {
    color: Colors.dark.text,
    fontWeight: '800',
  },
  statsCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  mStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  mStatVal: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '800',
  },
  mStatLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 9,
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1,
  },
  launchBtn: {
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  launchBtnGradient: {
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  launchBtnText: {
    color: Colors.dark.background,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: Layout.radius.md,
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  actionSub: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
