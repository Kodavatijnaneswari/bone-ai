import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { api, ENDPOINTS } from '../api/config';
import { Colors } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    mobile: '',
    email: '',
    address: 'N/A', // Defaulting address as it's not in the target UI but needed by API
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
      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful! Please wait for admin activation.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      const msg = error.response?.data ? JSON.stringify(error.response.data) : 'Registration failed.';
      Alert.alert('Error', msg);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join the bone health network</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.requiredText}>REQUIRED INFORMATION</Text>

          <Text style={styles.label}>FULL NAME *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            placeholderTextColor="#556"
            value={form.name}
            onChangeText={(v) => updateForm('name', v)}
          />

          <Text style={styles.label}>LOGIN ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Login ID"
            placeholderTextColor="#556"
            value={form.username}
            onChangeText={(v) => updateForm('username', v)}
            autoCapitalize="none"
          />

          <Text style={styles.label}>PASSWORD *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#556"
            value={form.password}
            onChangeText={(v) => updateForm('password', v)}
            secureTextEntry
          />

          <Text style={styles.label}>MOBILE *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile"
            placeholderTextColor="#556"
            value={form.mobile}
            onChangeText={(v) => updateForm('mobile', v)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>EMAIL *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#556"
            value={form.email}
            onChangeText={(v) => updateForm('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'CREATING...' : 'REGISTER ACCOUNT'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerLink}
            onPress={() => router.back()}
          >
            <Text style={styles.footerLinkText}>Already have an account? <Text style={styles.linkAccent}>Login</Text></Text>
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
    padding: isSmallDevice ? 20 : 30,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  header: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: '#9BA1A6',
    fontSize: 16,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: Colors.dark.surface,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#232E42',
    marginBottom: 40,
  },
  requiredText: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  label: {
    color: '#9BA1A6',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0B1421',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#232E42',
  },
  primaryButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#0B1421',
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
