import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ArrowLeft, CheckCircle2, AlertCircle, Share2, Download } from 'lucide-react-native';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Parse params
  const { finding, category, confidence, image_url } = params;
  const isNormal = finding === 'Normal';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.miniLogo} />
            <Text style={styles.headerTitle}>BoneAI Pro</Text>
        </View>
        <View style={styles.navIcons}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}><Text style={styles.navText}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/history')}><Text style={styles.navText}>History</Text></TouchableOpacity>
            <TouchableOpacity style={styles.newBtn}><Text style={styles.newBtnText}>New Detection</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Advanced Bone Abnormality Detection</Text>
          <Text style={styles.heroSubtitle}>
              Leveraging state-of-the-art <Text style={styles.boldText}>YOLOv8 deep learning</Text>, our system provides real-time, automated 
              analysis of bone radiographs. Whether detecting subtle fractures or anatomical dislocations, BoneAI Pro 
              utilizes high-precision neural networks to assist clinicians in making faster, data-driven diagnostic decisions.
          </Text>

          <View style={styles.statsCards}>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>98%</Text>
                <Text style={styles.mStatLabel}>Detection Sensitivity</Text>
            </View>
            <View style={styles.mStatCard}>
                <Text style={styles.mStatVal}>0.1s</Text>
                <Text style={styles.mStatLabel}>Inference Speed</Text>
            </View>
          </View>

          <View style={styles.actionRowSub}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                <Text style={styles.secondaryBtnText}>← Analyze Another</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
      </View>

      <View style={styles.imageContainer}>
        {image_url ? (
          <Image source={{ uri: image_url as string }} style={styles.resultImage} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Image Preview Unavailable</Text>
          </View>
        )}
      </View>

      <View style={styles.resultCard}>
        <View style={styles.statusRow}>
          {isNormal ? (
            <CheckCircle2 color="#46FFD2" size={32} />
          ) : (
            <AlertCircle color="#FF4D4D" size={32} />
          )}
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>DIAGNOSTIC FINDING</Text>
            <Text style={[styles.statusValue, { color: isNormal ? '#46FFD2' : '#FF4D4D' }]}>
              {finding || 'Analysis Result'}
            </Text>
          </View>
        </View>

        {!isNormal && (
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>FRACTURE TYPE</Text>
            <Text style={styles.detailValue}>{category || 'Detected'}</Text>
          </View>
        )}

        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>ANALYSIS CONFIDENCE</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(parseFloat(confidence as string) || 0) * 100}%` }]} />
            <Text style={styles.progressText}>
              {((parseFloat(confidence as string) || 0) * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#46FFD2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    color: '#9BA1A6',
    fontSize: 12,
    marginRight: 15,
  },
  newBtn: {
    backgroundColor: '#46FFD2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newBtnText: {
    color: '#0B1421',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroSection: {
    padding: 30,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    color: '#9BA1A6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  boldText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  statsCards: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  mStatCard: {
    backgroundColor: 'rgba(70, 255, 210, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(70, 255, 210, 0.2)',
    padding: 15,
    borderRadius: 12,
    width: 140,
    alignItems: 'center',
  },
  mStatVal: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mStatLabel: {
    color: '#9BA1A6',
    fontSize: 10,
    marginTop: 4,
  },
  actionRowSub: {
    flexDirection: 'row',
    gap: 15,
  },
  secondaryBtn: {
    backgroundColor: '#232E42',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  secondaryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  primaryBtn: {
    backgroundColor: '#46FFD2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  primaryBtnText: {
    color: '#0B1421',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#000',
    marginVertical: 20,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultCard: {
    margin: 20,
    padding: 24,
    backgroundColor: Colors.dark.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusInfo: {
    marginLeft: 16,
  },
  statusLabel: {
    color: '#9BA1A6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailBox: {
    marginTop: 20,
  },
  detailLabel: {
    color: '#9BA1A6',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#46FFD2',
  },
  progressText: {
    color: '#46FFD2',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  imagePlaceholder: {
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#444',
  },
});
