import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Layout } from '@/constants/theme';
import { ArrowLeft, CheckCircle2, AlertCircle, Share2, Download, Zap, Info, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const { finding, category, confidence, image_url } = params;
  const isNormal = finding === 'Normal';
  const confidenceValue = parseFloat(confidence as string) || 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
            <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.backButton} 
                onPress={() => router.back()}
            >
                <ChevronLeft color={Colors.dark.text} size={28} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diagnostic Report</Text>
            <View style={styles.headerActionBox}>
                <TouchableOpacity style={styles.iconAction}><Share2 size={20} color={Colors.dark.textSecondary} /></TouchableOpacity>
            </View>
        </View>

        <View style={styles.imageSection}>
            <View style={styles.imageFrame}>
                {image_url ? (
                  <Image source={{ uri: image_url as string }} style={styles.resultImage} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Zap size={48} color={Colors.dark.border} />
                    <Text style={styles.placeholderText}>Imaging Data Unavailable</Text>
                  </View>
                )}
                
                <LinearGradient
                    colors={['transparent', 'rgba(4, 7, 13, 0.8)']}
                    style={styles.imageOverlay}
                />
                
                <View style={styles.imageBadge}>
                    <Text style={styles.badgeText}>ENHANCED PREVIEW</Text>
                </View>
            </View>
        </View>

        <View style={styles.reportSection}>
            <View style={[styles.resultCard, isNormal ? styles.cardNormal : styles.cardAbnormal]}>
                <View style={styles.statusRow}>
                    <View style={[styles.statusIconBox, { backgroundColor: isNormal ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                        {isNormal ? (
                            <CheckCircle2 color={Colors.dark.success} size={24} />
                        ) : (
                            <AlertCircle color={Colors.dark.error} size={24} />
                        )}
                    </View>
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusLabel}>PRIMARY FINDING</Text>
                        <Text style={[styles.statusValue, { color: isNormal ? Colors.dark.success : Colors.dark.error }]}>
                            {finding?.toString().toUpperCase() || 'ANALYSIS COMPLETE'}
                        </Text>
                    </View>
                </View>

                {!isNormal && (
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>CLASSIFICATION</Text>
                            <Text style={styles.detailValue}>{category || 'Detected'}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.confidenceSection}>
                    <View style={styles.confidenceHeader}>
                        <Text style={styles.detailLabel}>ENGINE CONFIDENCE</Text>
                        <Text style={[styles.confidenceText, { color: isNormal ? Colors.dark.success : Colors.dark.primary }]}>
                            {(confidenceValue * 100).toFixed(1)}%
                        </Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBg]} />
                        <View 
                            style={[
                                styles.progressBar, 
                                { 
                                    width: `${confidenceValue * 100}%`,
                                    backgroundColor: isNormal ? Colors.dark.success : Colors.dark.primary 
                                }
                            ]} 
                        />
                    </View>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Info size={16} color={Colors.dark.textSecondary} />
                <Text style={styles.infoText}>
                    This automated analysis is intended for clinical assistance only. Final diagnostics must be verified by a board-certified radiologist.
                </Text>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={styles.secondaryBtn} 
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={18} color={Colors.dark.text} />
                    <Text style={styles.secondaryBtnText}>New Scan</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    activeOpacity={0.8}
                    style={styles.primaryBtn}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text style={styles.primaryBtnText}>Dashboard</Text>
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
  content: {
    paddingBottom: Layout.spacing.xxl,
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
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark.text,
  },
  headerActionBox: {
    flexDirection: 'row',
  },
  iconAction: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  imageSection: {
    padding: Layout.spacing.lg,
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Layout.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  placeholderText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  reportSection: {
    paddingHorizontal: Layout.spacing.lg,
  },
  resultCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Layout.radius.xl,
    padding: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardNormal: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardAbnormal: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  statusIconBox: {
    width: 60,
    height: 60,
    borderRadius: Layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: Layout.spacing.md,
  },
  statusLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  detailRow: {
    marginBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  detailItem: {},
  detailLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  detailValue: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '800',
  },
  confidenceSection: {
    marginTop: Layout.spacing.sm,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '900',
  },
  progressContainer: {
    height: 8,
    width: '100%',
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
  },
  progressBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  progressBar: {
    height: '100%',
    borderRadius: Layout.radius.full,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    marginTop: Layout.spacing.xl,
    gap: Layout.spacing.sm,
  },
  infoText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xxl,
    gap: Layout.spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  secondaryBtnText: {
    color: Colors.dark.text,
    fontWeight: '800',
    fontSize: 15,
  },
  primaryBtn: {
    flex: 1,
    height: 60,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.dark.background,
    fontWeight: '800',
    fontSize: 15,
  },
});
