import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const USER_ID_KEY = 'boneai_user_id';
const USER_ROLE_KEY = 'boneai_user_role';

// Helper to handle storage cross-platform
const setItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const saveUserAuth = async (id: number, role: 'user' | 'admin') => {
  await setItem(USER_ID_KEY, id.toString());
  await setItem(USER_ROLE_KEY, role);
};

export const getUserAuth = async () => {
  const id = await getItem(USER_ID_KEY);
  const role = await getItem(USER_ROLE_KEY);
  return { 
    id: id ? parseInt(id) : null, 
    role: role as 'user' | 'admin' | null 
  };
};

export const clearUserAuth = async () => {
  await deleteItem(USER_ID_KEY);
  await deleteItem(USER_ROLE_KEY);
};
