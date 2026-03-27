import * as SecureStore from 'expo-secure-store';

const USER_ID_KEY = 'boneai_user_id';
const USER_ROLE_KEY = 'boneai_user_role';

export const saveUserAuth = async (id: number, role: 'user' | 'admin') => {
  await SecureStore.setItemAsync(USER_ID_KEY, id.toString());
  await SecureStore.setItemAsync(USER_ROLE_KEY, role);
};

export const getUserAuth = async () => {
  const id = await SecureStore.getItemAsync(USER_ID_KEY);
  const role = await SecureStore.getItemAsync(USER_ROLE_KEY);
  return { 
    id: id ? parseInt(id) : null, 
    role: role as 'user' | 'admin' | null 
  };
};

export const clearUserAuth = async () => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
  await SecureStore.deleteItemAsync(USER_ROLE_KEY);
};
