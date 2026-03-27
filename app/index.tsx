import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { api, ENDPOINTS } from '../api/config';
import { Colors } from '../constants/theme';
import { LogIn, UserPlus, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react-native';
import { saveUserAuth } from '../api/auth';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

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
      const msg = serverMsg || error.message || 'Login failed. Please check credentials and connection.';
      Alert.alert('Login Failed', `Error: ${msg}\n\nURL: ${api.defaults.baseURL}${isAdmin ? ENDPOINTS.ADMIN_LOGIN : ENDPOINTS.LOGIN}`);
    } finally {
      setLoading(false);
    }
  };

  const renderLanding = () => (
    <View style={styles.landingContent}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>Bone<Text style={styles.accentText}>AI</Text></Text>
        <Text style={styles.subTitle}>Advanced Abnormality Detection</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.landingButton} 
          onPress={() => setScreen('USER_LOGIN')}
        >
          <Text style={styles.landingButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.outlinedButton} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.outlinedButtonText}>REGISTER NEW ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.outlinedButton} 
          onPress={() => setScreen('ADMIN_LOGIN')}
        >
          <Text style={styles.outlinedButtonText}>ADMIN PORTAL CONTROL</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Standard Secure Protocol v4.2.0</Text>
    </View>
  );

  const renderLogin = (isAdmin: boolean) => (
    <View style={styles.loginContent}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('LANDING')}>
        <ArrowLeft size={24} color={Colors.dark.text} />
        <Text style={styles.backButtonText}>{isAdmin ? 'Back' : 'Home'}</Text>
      </TouchableOpacity>

      <View style={styles.loginHeader}>
        <Text style={styles.headerTitle}>{isAdmin ? 'Admin Portal' : 'Welcome Back'}</Text>
        <Text style={styles.headerSub}>{isAdmin ? 'Secure access for administrators' : 'Sign in to continue'}</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>{isAdmin ? 'ADMIN ID' : 'LOGIN ID'}</Text>
        <TextInput
          style={styles.input}
          placeholder={isAdmin ? "Enter admin ID" : "Enter your login ID"}
          placeholderTextColor="#556"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#556"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
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
            <Text style={styles.footerLinkText}>Don't have an account? <Text style={styles.linkAccent}>Register</Text></Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {screen === 'LANDING' && renderLanding()}
        {screen === 'USER_LOGIN' && renderLogin(false)}
        {screen === 'ADMIN_LOGIN' && renderLogin(true)}
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
    padding: isSmallDevice ? 20 : 30,
    justifyContent: 'center',
  },
  // Landing Styles
  landingContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  mainTitle: {
    fontSize: isSmallDevice ? 48 : 56,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
  },
  accentText: {
    color: Colors.dark.primary,
  },
  subTitle: {
    color: '#9BA1A6',
    fontSize: 16,
    marginTop: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  buttonGroup: {
    gap: 16,
    width: '100%',
    paddingHorizontal: 10,
  },
  landingButton: {
    backgroundColor: Colors.dark.primary,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  landingButtonText: {
    color: '#0B1421',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: '#232E42',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  outlinedButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  versionText: {
    textAlign: 'center',
    color: '#334155',
    fontSize: 12,
    marginTop: 40,
  },
  // Login Styles
  loginContent: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  loginHeader: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSub: {
    color: '#9BA1A6',
    fontSize: 16,
  },
  formCard: {
    backgroundColor: Colors.dark.surface,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  label: {
    color: '#9BA1A6',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0B1421',
    borderRadius: 14,
    padding: 18,
    color: '#FFF',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  adminButton: {
    backgroundColor: Colors.dark.admin,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerLinkText: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  linkAccent: {
    color: Colors.dark.primary,
    fontWeight: 'bold',
  },
});
