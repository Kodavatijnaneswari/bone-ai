import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { api, ENDPOINTS } from '../api/config';
import { Colors, Layout } from '../constants/theme';
import { LogIn, UserPlus, ShieldCheck, ArrowLeft, ChevronRight, Activity } from 'lucide-react-native';
import { saveUserAuth } from '../api/auth';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ScreenState = 'LANDING' | 'USER_LOGIN' | 'ADMIN_LOGIN';

export default function LoginScreen() {
  const [screen, setScreen] = useState<ScreenState>('LANDING');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (isAdmin: boolean) => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter credentials');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isAdmin ? ENDPOINTS.ADMIN_LOGIN : ENDPOINTS.LOGIN;
      const response = await api.post(endpoint, { username, password });
      
      if (response.data) {
        if (isAdmin) {
          await saveUserAuth(0, 'admin');
          router.replace('/admin'); 
        } else {
          await saveUserAuth(response.data.id, 'user');
          router.replace('/(tabs)');
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      const serverMsg = error.response?.data?.error || error.response?.data?.message;
      const msg = serverMsg || error.message || 'Login failed. Please check credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderLanding = () => (
    <View style={styles.landingContent}>
      <View style={styles.heroSection}>
        <View style={styles.iconBadge}>
          <Activity color={Colors.dark.primary} size={32} />
        </View>
        <Text style={styles.mainTitle}>Bone<Text style={styles.accentText}>AI</Text></Text>
        <Text style={styles.subTitle}>Advanced Abnormality Detection</Text>
        <View style={styles.titleUnderline} />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.landingButton} 
          onPress={() => setScreen('USER_LOGIN')}
        >
          <LinearGradient
            colors={[Colors.dark.primary, '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.landingButtonText}>SIGN IN</Text>
            <ChevronRight size={20} color={Colors.dark.background} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.outlinedButton} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.outlinedButtonText}>REGISTER NEW ACCOUNT</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>SECURE ACCESS</Text>
            <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.adminLinkButton} 
          onPress={() => setScreen('ADMIN_LOGIN')}
        >
          <ShieldCheck size={18} color={Colors.dark.textSecondary} />
          <Text style={styles.adminLinkText}>ADMIN PORTAL CONTROL</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Standard Secure Protocol v4.2.0</Text>
    </View>
  );

  const renderLogin = (isAdmin: boolean) => (
    <View style={styles.loginContent}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setScreen('LANDING')}
      >
        <ArrowLeft size={24} color={Colors.dark.text} />
        <Text style={styles.backButtonText}>Return</Text>
      </TouchableOpacity>

      <View style={styles.loginHeader}>
        <Text style={styles.headerTitle}>{isAdmin ? 'Admin Portal' : 'Welcome Back'}</Text>
        <Text style={styles.headerSub}>{isAdmin ? 'Secure access for administrators' : 'Sign in to continue analysis'}</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{isAdmin ? 'ADMIN ID' : 'LOGIN ID'}</Text>
            <TextInput
              style={styles.input}
              placeholder={isAdmin ? "Enter admin ID" : "Enter your login ID"}
              placeholderTextColor={Colors.dark.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              selectionColor={Colors.dark.primary}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={Colors.dark.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              selectionColor={Colors.dark.primary}
            />
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          style={[styles.primaryButton, isAdmin && styles.adminButton]}
          onPress={() => handleLogin(isAdmin)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'AUTHENTICATING...' : (isAdmin ? 'AUTHORIZE ACCESS' : 'SIGN IN')}
          </Text>
        </TouchableOpacity>

        {!isAdmin && (
          <TouchableOpacity 
            style={styles.footerLink}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.footerLinkText}>New analyst? <Text style={styles.linkAccent}>Request Access</Text></Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {screen === 'LANDING' && renderLanding()}
        {(screen === 'USER_LOGIN' || screen === 'ADMIN_LOGIN') && renderLogin(screen === 'ADMIN_LOGIN')}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
  },
  // Landing Styles
  landingContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: Layout.radius.lg,
    backgroundColor: 'rgba(70, 255, 210, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(70, 255, 210, 0.1)',
  },
  mainTitle: {
    fontSize: Layout.isSmallDevice ? 48 : 56,
    fontWeight: '900',
    color: Colors.dark.text,
    letterSpacing: -1.5,
  },
  accentText: {
    color: Colors.dark.primary,
  },
  subTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    marginTop: Layout.spacing.xs,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: Colors.dark.primary,
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.radius.full,
  },
  buttonGroup: {
    gap: Layout.spacing.md,
    width: '100%',
  },
  landingButton: {
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    padding: Layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
  },
  landingButtonText: {
    color: Colors.dark.background,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  outlinedButtonText: {
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginVertical: Layout.spacing.md,
    opacity: 0.3,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.textSecondary,
  },
  dividerText: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  adminLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
  },
  adminLinkText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.dark.textSecondary,
    fontSize: 11,
    marginTop: Layout.spacing.xxl,
    opacity: 0.5,
  },
  // Login Styles
  loginContent: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  backButtonText: {
    color: Colors.dark.textSecondary,
    marginLeft: Layout.spacing.sm,
    fontSize: 16,
    fontWeight: '500',
  },
  loginHeader: {
    marginBottom: Layout.spacing.xxl,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  headerSub: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: Colors.dark.surface,
    padding: Layout.spacing.xl,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: Layout.spacing.sm,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginTop: Layout.spacing.md,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  adminButton: {
    backgroundColor: Colors.dark.admin,
    shadowColor: Colors.dark.admin,
  },
  buttonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerLink: {
    marginTop: Layout.spacing.xl,
    alignItems: 'center',
  },
  footerLinkText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  linkAccent: {
    color: Colors.dark.primary,
    fontWeight: '800',
  },
});
