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

// Verificar se há um usuário logado
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      return JSON.parse(sessionData) as User;
    }
  } catch (error) {
    console.error('Error reading session:', error);
  }
  return null;
}

// Salvar sessão do usuário
export function saveSession(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

// Remover sessão (logout)
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_KEY);
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
