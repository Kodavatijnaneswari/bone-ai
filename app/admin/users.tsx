import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { api, ENDPOINTS } from '@/api/config';
import { Colors } from '@/constants/theme';
import { UserCheck, UserX, Trash2, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function UserManagement() {
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

  const handleAction = async (userId: number, action: string) => {
    try {
      setLoading(true);
      const url = ENDPOINTS.ADMIN_USER_ACTION(userId, action);
      await api.post(url);
      Alert.alert('Success', `User ${action}d successfully`);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || `Failed to ${action} user`;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username?.[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={[styles.statusBadge, item.status === 'Activated' ? styles.statusActive : styles.statusWaiting]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        {item.status !== 'Activated' ? (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.activateBtn]} 
            onPress={() => handleAction(item.id, 'activate')}
          >
            <UserCheck size={16} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.blockBtn]} 
            onPress={() => handleAction(item.id, 'block')}
          >
            <UserX size={16} color="#FFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]} 
          onPress={() => {
            Alert.alert(
              "Delete User",
              `Are you sure you want to delete ${item.username}?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => handleAction(item.id, 'delete') }
              ]
            );
          }}
        >
          <Trash2 size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshBtn}>
          <RefreshCw color={Colors.dark.primary} size={20} />
        </TouchableOpacity>
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshBtn: {
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151E2D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(70, 255, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#9BA1A6',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  statusActive: {
    backgroundColor: 'rgba(76, 207, 100, 0.2)',
  },
  statusWaiting: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activateBtn: {
    backgroundColor: '#4CCF64',
  },
  blockBtn: {
    backgroundColor: '#FFD700',
  },
  deleteBtn: {
    backgroundColor: '#FF4D4D',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9BA1A6',
    fontSize: 16,
  },
});
