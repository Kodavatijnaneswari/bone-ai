import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { AlertCircle, Zap, ChevronLeft, CheckCircle2, RefreshCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BACKEND_URL = 'https://bone-ai-detection.onrender.com';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const { finding, category, confidence, image_url, prediction } = params;
  const isNormal = finding?.toString().toLowerCase() === 'normal' || prediction?.toString().toLowerCase() === 'normal' || category?.toString().toLowerCase() === 'normal';
  const confidenceValue = parseFloat(confidence as string) || 0;

  // Fix image URL
  const fullImageUrl = image_url
    ? (String(image_url).startsWith('http') ? String(image_url) : `${BACKEND_URL}${image_url}`)
    : null;

  // Prioritize the detailed finding/category for the "Type" display
  const resultText = finding || category || prediction || (isNormal ? 'No Abnormality Detected' : 'Fracture Abnormality Detected');
  const catText = category || finding || 'Fracture Abnormality Detected';

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Image Card */}
        <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Zap size={16} color={Colors.dark.textSecondary} style={{marginRight: 8}}/>
              <Text style={styles.imageCardTitle}>AI PROCESSED RADIOGRAPH</Text>
            </View>
            <View style={styles.imageFrame}>
                {fullImageUrl ? (
                  <Image source={{ uri: fullImageUrl }} style={styles.resultImage} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Zap size={48} color={Colors.dark.border} />
                    <Text style={styles.placeholderText}>Imaging Data Unavailable</Text>
                  </View>
                )}
            </View>
        </View>

        {/* Professional Clinical Report Section */}
        <View style={styles.detailsContainer}>
            
            {/* High-Impact Status Banner */}
            <LinearGradient
                colors={isNormal ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)'] : ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']}
                style={styles.statusBanner}
            >
                {isNormal ? (
                    <CheckCircle2 color={Colors.dark.success} size={24} />
                ) : (
                    <AlertCircle color={Colors.dark.error} size={24} />
                )}
                <Text style={[styles.statusBannerText, { color: isNormal ? Colors.dark.success : Colors.dark.error }]}>
                    {isNormal ? 'CLINICAL STATUS: NORMAL' : 'CLINICAL STATUS: ABNORMALITY DETECTED'}
                </Text>
            </LinearGradient>

            {/* Premium Clinical Diagnosis Card */}
            <View style={styles.diagnosisCard}>
                <View style={styles.diagnosisHeader}>
                    <Text style={styles.diagnosisHeaderLabel}>OFFICIAL RADIOLOGY FINDING</Text>
                </View>
                <View style={styles.diagnosisBody}>
                    <Text style={styles.diagnosisValue}>{resultText}</Text>
                    <Text style={styles.diagnosisCategory}>{catText}</Text>
                </View>
                <View style={styles.diagnosisFooter}>
                    <Zap size={14} color={Colors.dark.primary} />
                    <Text style={styles.diagnosisFooterText}>AI ENHANCED DIAGNOSTIC ACCURACY</Text>
                </View>
            </View>

            {/* AI Confidence Metric */}
            <View style={styles.infoCard}>
                <Text style={styles.cardSectionTitle}>DIAGNOSTIC CONFIDENCE SCORE</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBg} />
                    <LinearGradient
                        colors={[isNormal ? Colors.dark.success : Colors.dark.primary, isNormal ? '#059669' : '#0D9488']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.progressBar, { width: `${Math.min(confidenceValue * 100, 100)}%` }]} 
                    />
                </View>
                <Text style={styles.confidenceDesc}>
                    {confidenceValue > 0.8 ? 'HIGH FIDELITY CLINICAL DETECTION' : 'MODERATE CONFIDENCE - MANUAL OVERRIDE RECOMMENDED'}
                </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.primaryActionBtn} 
                onPress={() => router.back()}
            >
                <RefreshCcw size={20} color="#FFF" />
                <Text style={styles.primaryActionBtnText}>NEW RADIOGRAPH ANALYSIS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.7}
                style={styles.secondaryActionBtn}
                onPress={() => router.replace('/(tabs)')}
            >
                <ChevronLeft size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.secondaryActionBtnText}>RETURN TO DASHBOARD</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1626', // Matching the dark blue web app background
  },
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  imageCard: {
    backgroundColor: '#1E293B', // Slightly lighter for cards
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  imageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  imageCardTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 14,
  },
  detailsContainer: {
    gap: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  bannerAbnormal: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  bannerNormal: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardSectionTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inferenceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  classificationText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  diagnosisCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 0,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  diagnosisHeader: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)',
  },
  diagnosisHeaderLabel: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  diagnosisBody: {
    padding: 24,
    alignItems: 'center',
  },
  diagnosisValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  diagnosisCategory: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  diagnosisFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    gap: 8,
  },
  diagnosisFooterText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  confidenceDesc: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginTop: 8,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  primaryActionBtnText: {
    color: '#0F1626',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  secondaryActionBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
});
