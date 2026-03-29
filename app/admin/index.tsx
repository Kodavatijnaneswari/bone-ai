import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { api, ENDPOINTS } from '@/api/config';
import { Colors, Layout } from '@/constants/theme';
import { Shield, UserCheck, UserX, Trash2, ArrowLeft, LogOut, Activity, BarChart3, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { clearUserAuth } from '@/api/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ active_users: 0, images_analyzed: 0, model_version: 'v8s' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get(ENDPOINTS.ADMIN_USERS),
        api.get(ENDPOINTS.ADMIN_STATS)
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearUserAuth();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
            <View style={styles.miniLogoBox}>
                <Shield color={Colors.dark.primary} size={16} />
            </View>
            <Text style={styles.headerTitle}>Admin Console</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color={Colors.dark.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtnActive}>
                <BarChart3 size={18} color={Colors.dark.background} />
                <Text style={styles.navBtnTextActive}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/admin/users')}>
                <UserCheck size={18} color={Colors.dark.textSecondary} />
                <Text style={styles.navBtnText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn}>
                <Settings size={18} color={Colors.dark.textSecondary} />
                <Text style={styles.navBtnText}>Engine</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
            <LinearGradient colors={[Colors.dark.surfaceElevated, Colors.dark.surface]} style={styles.statCard}>
                <Text style={styles.statLabel}>CLINICIANS</Text>
                <Text style={styles.statVal}>{stats.active_users}</Text>
                <Text style={styles.statTrend}>Authorized Users</Text>
            </LinearGradient>
            
            <LinearGradient colors={[Colors.dark.surfaceElevated, Colors.dark.surface]} style={styles.statCard}>
                <Text style={styles.statLabel}>SEQUENCES</Text>
                <Text style={styles.statVal}>{stats.images_analyzed}</Text>
                <Text style={styles.statTrend}>Inferences Run</Text>
            </LinearGradient>
        </View>

        <View style={styles.mainConsole}>
            <LinearGradient
                colors={['rgba(70, 255, 210, 0.1)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.consoleGlow}
            />
            
            <View style={styles.consoleHeader}>
                <Activity size={20} color={Colors.dark.primary} />
                <Text style={styles.consoleTitle}>Core Engine Status</Text>
            </View>
            
            <Text style={styles.consoleDesc}>
                Model: <Text style={styles.boldText}>YOLOv8-Small</Text> optimized for skeletal radiographs. 
                Average inference latency: <Text style={styles.boldText}>84ms</Text>.
            </Text>

            <View style={styles.actionsGrid}>
                <TouchableOpacity activeOpacity={0.8} style={styles.consoleAction} onPress={() => router.push('/admin/users')}>
                    <UserCheck size={20} color={Colors.dark.primary} />
                    <Text style={styles.actionText}>User Management</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.infosection}>
            <Text style={styles.infoLabel}>SYSTEM PROTOCOL V4.2</Text>
            <Text style={styles.infoText}>
                All administrative actions are logged and encrypted using AES-256 standards. 
                Access tokens expire after 24 hours of inactivity.
            </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogoBox: {
    width: 32,
    height: 32,
    marginRight: 10,
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    borderRadius: Layout.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(70, 255, 210, 0.2)',
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  scrollContent: {
    padding: Layout.spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  navBtnActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.primary,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.lg,
  },
  navBtnTextActive: {
    color: Colors.dark.background,
    fontSize: 13,
    fontWeight: '800',
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.surface,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  navBtnText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statVal: {
    color: Colors.dark.primary,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  statTrend: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  mainConsole: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
  },
  consoleGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  consoleTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
  },
  consoleDesc: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Layout.spacing.xl,
  },
  boldText: {
    color: Colors.dark.text,
    fontWeight: '800',
  },
  actionsGrid: {
    flexDirection: 'row',
  },
  consoleAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 12,
  },
  actionText: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: '800',
  },
  infosection: {
    marginTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.sm,
  },
  infoLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.5,
  },
  infoText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.7,
  },
});
