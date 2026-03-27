import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api, ENDPOINTS } from '@/api/config';
import { getUserAuth } from '@/api/auth';
import { Colors } from '@/constants/theme';
import { Clock, ChevronRight, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { id } = await getUserAuth();
      if (id !== null) {
        const response = await api.get(ENDPOINTS.HISTORY(id));
        setHistory(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item: any) => {
    router.push({
      pathname: '/result',
      params: {
        finding: item.finding,
        category: item.category,
        confidence: item.confidence,
        image_url: item.processed_image, // Note: backend uses processed_image field name
      }
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.historyCard} onPress={() => handlePress(item)}>
      <View style={styles.iconBox}>
        <FileText color={Colors.dark.primary} size={20} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.diseaseText}>{item.finding} - {item.category}</Text>
        <Text style={styles.dateText}>{new Date(item.uploaded_at).toLocaleString()}</Text>
      </View>
      <View style={styles.confidenceBox}>
        <Text style={styles.confidenceLabel}>Conf.</Text>
        <Text style={styles.confidenceVal}>{(item.confidence * 100).toFixed(0)}%</Text>
      </View>
      <ChevronRight color="#444" size={20} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnostic History</Text>
        <TouchableOpacity onPress={fetchHistory} disabled={loading}>
          <Clock color={Colors.dark.primary} size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No diagnostic results found.</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  diseaseText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  confidenceBox: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  confidenceLabel: {
    color: '#9BA1A6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidenceVal: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
