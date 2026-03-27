import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { api, ENDPOINTS } from '@/api/config';
import { Colors } from '@/constants/theme';
import { Shield, UserCheck, UserX, Trash2, ArrowLeft, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { clearUserAuth } from '@/api/auth';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.ADMIN_USERS);
      setUsers(response.data);
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
            <Text style={styles.headerTitle}>BoneAI Admin</Text>
        </View>
        <View style={styles.topNav}>
            <TouchableOpacity style={styles.navItem}><Text style={styles.navItemTextActive}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/users')}><Text style={styles.navItemText}>Users</Text></TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={16} color="#FF4D4D" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>ACTIVE USERS</Text>
                <Text style={styles.statVal}>--</Text>
                <Text style={styles.statTrend}>+12% from last wk</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>IMAGES ANALYZED</Text>
                <Text style={styles.statVal}>--</Text>
                <Text style={styles.statTrend}>Historical total</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>MODEL VERSION</Text>
                <Text style={styles.statValGold}>v8s</Text>
                <Text style={styles.statTrendGold}>Optimization in progress</Text>
            </View>
        </View>

        <View style={styles.mainConsole}>
            <View style={styles.consoleHeader}>
                <Shield size={20} color={Colors.dark.primary} />
                <Text style={styles.consoleTitle}>System Capabilities</Text>
            </View>
            <Text style={styles.consoleDesc}>
                As an authorized administrator, you have full oversight over the BoneAI infrastructure. This console allows you to manage clinician access, monitor neural network training sequences, and audit diagnostic outputs.
            </Text>

            <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.consoleAction} onPress={() => router.push('/admin/users')}>
                    <UserCheck size={18} color={Colors.dark.primary} />
                    <Text style={styles.actionText}>Manage Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.consoleAction}>
                    <ActivityIndicator size="small" color={Colors.dark.primary} />
                    <Text style={styles.actionText}>Training Monitor</Text>
                </TouchableOpacity>
            </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0B1421',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogoBox: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginRight: 15,
  },
  navItemText: {
    color: '#9BA1A6',
    fontSize: 12,
  },
  navItemTextActive: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    padding: 20,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statLabel: {
    color: '#9BA1A6',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statVal: {
    color: Colors.dark.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statTrend: {
    color: '#4CCF64',
    fontSize: 8,
    textAlign: 'center',
  },
  statValGold: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statTrendGold: {
    color: '#FFD700',
    fontSize: 8,
    textAlign: 'center',
  },
  mainConsole: {
    backgroundColor: '#151E2D',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  consoleTitle: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  consoleDesc: {
    color: '#9BA1A6',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  consoleAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
