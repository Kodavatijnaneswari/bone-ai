import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { api, ENDPOINTS } from '@/api/config';
import { Colors, Layout } from '@/constants/theme';
import { UserCheck, UserX, Trash2, ArrowLeft, Shield, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AdminUserManagement() {
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

  const handleAction = async (userId: number, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        await api.delete(ENDPOINTS.ADMIN_USER_ACTION(userId, action));
      } else {
        await api.post(ENDPOINTS.ADMIN_USER_ACTION(userId, action));
      }
      Alert.alert('Success', `User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} user`);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
            </View>
            <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userId}>ID: {item.username}</Text>
            </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
            <Text style={[styles.statusText, { color: item.is_active ? Colors.dark.success : Colors.dark.error }]}>
                {item.is_active ? 'Active' : 'Pending'}
            </Text>
        </View>
      </View>

      <View style={styles.userDetails}>
        <Text style={styles.userDetailText}>Email: {item.email}</Text>
        <Text style={styles.userDetailText}>Mobile: {item.mobile}</Text>
      </View>

      <View style={styles.cardActions}>
        {!item.is_active ? (
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.actionBtn, styles.activateBtn]} 
            onPress={() => handleAction(item.id, 'activate')}
          >
            <UserCheck size={16} color={Colors.dark.background} />
            <Text style={styles.activateBtnText}>Authorize</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.actionBtn, styles.deactivateBtn]} 
            onPress={() => handleAction(item.id, 'deactivate')}
          >
            <UserX size={16} color={Colors.dark.text} />
            <Text style={styles.deactivateBtnText}>Suspend</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          activeOpacity={0.7}
          style={[styles.actionBtn, styles.deleteBtn]} 
          onPress={() => {
            Alert.alert(
              "Delete User",
              "Are you sure you want to remove this analyst from the system?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => handleAction(item.id, 'delete') }
              ]
            );
          }}
        >
          <Trash2 size={16} color={Colors.dark.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Access</Text>
        <View style={styles.headerRight}>
            <TouchableOpacity style={styles.searchBtn}>
                <Search size={20} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <Text style={styles.loadingText}>Syncing Directory...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
                <Shield size={48} color={Colors.dark.border} />
                <Text style={styles.emptyText}>No registration requests found</Text>
            </View>
          }
        />
      )}
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 44,
  },
  searchBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Layout.spacing.lg,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.dark.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatarText: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  userName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  userId: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  userDetails: {
    padding: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.lg,
  },
  userDetailText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginVertical: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    gap: 8,
  },
  activateBtn: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
  },
  activateBtnText: {
    color: Colors.dark.background,
    fontWeight: '800',
    fontSize: 13,
  },
  deactivateBtn: {
    flex: 1,
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  deactivateBtnText: {
    color: Colors.dark.text,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    width: 52,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  emptyBox: {
    marginTop: 100,
    alignItems: 'center',
    gap: Layout.spacing.lg,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
