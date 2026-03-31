import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api, ENDPOINTS } from '@/api/config';
import { Colors } from '@/constants/theme';
import { Upload, Camera, RefreshCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getUserAuth } from '@/api/auth';
import { Platform } from 'react-native';

export default function PredictScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const auth = await getUserAuth();
      const formData = new FormData();
      
      const rawFilename = image.split('/').pop() || 'image';
      const match = /\.(\w+)$/.exec(rawFilename);
      // Always ensure a proper extension — blob URLs have no extension
      const ext = match ? match[1] : 'jpg';
      const filename = match ? rawFilename : `${rawFilename}.jpg`;
      const type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      if (Platform.OS === 'web') {
        const response = await fetch(image);
        const blob = await response.blob();
        // Force correct MIME type so backend saves with correct extension
        const typedBlob = new Blob([blob], { type: 'image/jpeg' });
        formData.append('image', typedBlob, filename);
      } else {
        // @ts-ignore
        formData.append('image', { uri: image, name: filename, type });
      }

      if (auth.id !== null) {
        formData.append('userid', auth.id.toString());
      }

      const response = await api.post(ENDPOINTS.DETECT, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 90000, 
      });

      router.push({
        pathname: '/result',
        params: {
          finding: response.data.finding,
          category: response.data.category,
          confidence: response.data.confidence,
          image_url: response.data.image_url,
          prediction: response.data.prediction, 
        }
      });
      setImage(null);
    } catch (error: any) {
      console.error('Detection Error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Detection failed.';
      Alert.alert('Analysis Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI Diagnostic Analysis</Text>
      <Text style={styles.subtitle}>Upload X-Ray images for automated fracture detection and analysis.</Text>

      <View style={styles.uploadBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Upload color="#556" size={48} />
            <Text style={styles.placeholderText}>Select Bone X-Ray Image</Text>
          </View>
        )}
      </View>

      {!loading && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
            <Upload size={20} color={Colors.dark.accent} />
            <Text style={styles.actionBtnText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
            <Camera size={20} color={Colors.dark.accent} />
            <Text style={styles.actionBtnText}>Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {image && !loading && (
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpload}>
          <Text style={styles.buttonText}>START ANALYSIS</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
          <Text style={styles.loadingText}>Processing Image...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 32,
    lineHeight: 20,
  },
  uploadBox: {
    aspectRatio: 1,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1E293B',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#334155',
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '48%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#232E42',
  },
  actionBtnText: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#0B1421',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: Colors.dark.primary,
    marginTop: 12,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 24,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#232E42',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailLabel: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  resetBtnText: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
