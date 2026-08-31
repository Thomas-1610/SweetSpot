import { supabase } from './supabase';

export interface User {
  id: string;
  username: string;
  profile_image_url: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Chave para armazenar a sessão no localStorage
const SESSION_KEY = 'sweetspot_session';
const SESSION_EVENT = 'sweetspot-session-change';

let cachedSessionRaw: string | null = null;
let cachedUser: User | null = null;
let hasReadCache = false;

function readSession(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (hasReadCache && sessionData === cachedSessionRaw) {
      return cachedUser;
    }

    hasReadCache = true;
    cachedSessionRaw = sessionData;
    cachedUser = sessionData ? (JSON.parse(sessionData) as User) : null;
    return cachedUser;
  } catch (error) {
    console.error('Error reading session:', error);
    hasReadCache = true;
    cachedSessionRaw = null;
    cachedUser = null;
    return null;
  }
}

function emitSessionChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeToSession(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(SESSION_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(SESSION_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

export function getCurrentUser(): User | null {
  return readSession();
}

export function saveSession(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    const raw = JSON.stringify(user);
    localStorage.setItem(SESSION_KEY, raw);
    hasReadCache = true;
    cachedSessionRaw = raw;
    cachedUser = user;
    emitSessionChange();
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_KEY);
    hasReadCache = true;
    cachedSessionRaw = null;
    cachedUser = null;
    emitSessionChange();
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

// Registrar novo usuário
export async function registerUser(
  username: string, 
  password: string, 
  profileImageUrl?: string
): Promise<AuthResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' };
  }

  // Verificar se o username já existe
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existingUser) {
    return { success: false, error: 'Nome de usuário já existe' };
  }

  // Criar novo usuário
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username,
        password, // Em produção, usar hash (bcrypt, etc.)
        profile_image_url: profileImageUrl || null
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Erro ao criar usuário' };
  }

  const user = data as User;
  saveSession(user);
  return { success: true, user };
}

// Login de usuário
export async function loginUser(
  username: string, 
  password: string
): Promise<AuthResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' };
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password) // Em produção, comparar hash
    .single();

  if (error || !data) {
    return { success: false, error: 'Nome de usuário ou senha incorretos' };
  }

  const user = data as User;
  saveSession(user);
  return { success: true, user };
}

// Logout
export function logoutUser(): void {
  clearSession();
}

// Verificar se username já existe
export async function checkUsernameExists(username: string): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  return !!data;
}
