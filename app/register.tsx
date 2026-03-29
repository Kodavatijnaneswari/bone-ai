import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { api, ENDPOINTS } from '../api/config';
import { Colors, Layout } from '../constants/theme';
import { ArrowLeft, User, Shield, Phone, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    mobile: '',
    email: '',
    address: 'N/A', 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email || !form.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(ENDPOINTS.REGISTER, form);
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Registration successful! Please wait for admin activation.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      let errorMsg = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          // Flatten nested error objects from Django/DRF
          const messages = Object.keys(data).map(key => {
            const val = data[key];
            return `${key}: ${Array.isArray(val) ? val.join(', ') : val}`;
          });
          errorMsg = messages.join('\n');
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      Alert.alert('Registration Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.dark.text} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join the BoneAI analyst network</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>REQUIRED INFORMATION</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Dr. John Doe"
                placeholderTextColor={Colors.dark.textSecondary}
                value={form.name}
                onChangeText={(v) => updateForm('name', v)}
                selectionColor={Colors.dark.primary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LOGIN ID</Text>
            <View style={styles.inputWrapper}>
              <Shield size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Choose a unique ID"
                placeholderTextColor={Colors.dark.textSecondary}
                value={form.username}
                onChangeText={(v) => updateForm('username', v)}
                autoCapitalize="none"
                selectionColor={Colors.dark.primary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Shield size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter secure password"
                placeholderTextColor={Colors.dark.textSecondary}
                value={form.password}
                onChangeText={(v) => updateForm('password', v)}
                secureTextEntry
                selectionColor={Colors.dark.primary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MOBILE</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 234 567 890"
                placeholderTextColor={Colors.dark.textSecondary}
                value={form.mobile}
                onChangeText={(v) => updateForm('mobile', v)}
                keyboardType="phone-pad"
                selectionColor={Colors.dark.primary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={Colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.dark.textSecondary}
                value={form.email}
                onChangeText={(v) => updateForm('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={Colors.dark.primary}
              />
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.dark.primary, '#2DD4BF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>{loading ? 'CREATING...' : 'REGISTER ACCOUNT'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerLink}
            onPress={() => router.back()}
          >
            <Text style={styles.footerLinkText}>Already authorized? <Text style={styles.linkAccent}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
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
  header: {
    marginBottom: Layout.spacing.xxl,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.dark.text,
    letterSpacing: -1,
  },
  headerSub: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    marginTop: Layout.spacing.xs,
  },
  formCard: {
    backgroundColor: Colors.dark.surface,
    padding: Layout.spacing.xl,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Layout.spacing.xxl,
  },
  sectionLabel: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: Layout.spacing.xl,
    letterSpacing: 2,
    opacity: 0.8,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: Layout.spacing.xs,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: Layout.spacing.md,
  },
  inputIcon: {
    marginRight: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    color: Colors.dark.text,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
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
