'use client';

import { useState } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { loginUser, registerUser, checkUsernameExists } from '@/lib/auth';
import { updateProfilePhoto } from '@/lib/profile';
import { User } from '@/lib/auth';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleUsernameCheck = async (name: string) => {
    if (name.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    const exists = await checkUsernameExists(name);
    setUsernameAvailable(!exists);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (!isLogin) {
      handleUsernameCheck(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!isLogin && usernameAvailable === false) {
      setError('Nome de usuário já existe');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await loginUser(username, password);
      } else {
        // First register the user
        response = await registerUser(username, password, undefined);
        
        // If registration successful and profile photo was uploaded, update it
        if (response.success && response.user && profileImageFile) {
          const photoUrl = await updateProfilePhoto(profileImageFile, response.user.id);
          if (photoUrl) {
            response.user.profile_image_url = photoUrl;
          }
        }
      }

      if (response.success && response.user) {
        onLoginSuccess(response.user);
      } else {
        setError(response.error || 'Erro na autenticação');
      }
    } catch (err) {
      setError('Erro ao processar solicitação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PixelCard className="flex flex-col gap-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-headline-lg uppercase tracking-tighter text-on-surface mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
          {isLogin ? 'Login' : 'Cadastro'}
        </h2>
        <p className="font-body-md text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>
          {isLogin ? 'Entre para continuar' : 'Crie sua conta'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
            Nome de Usuário
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Seu nome único"
            className="w-full h-12 px-4 retro-border bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-mana-blue"
            style={{ borderRadius: '0' }}
            disabled={loading}
          />
          {!isLogin && username.length >= 3 && (
            <div className="flex items-center gap-2">
              {usernameAvailable === null ? (
                <span className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>
                  Verificando disponibilidade...
                </span>
              ) : usernameAvailable ? (
                <span className="font-label-sm text-growth-green" style={{ fontFamily: 'var(--font-pixel)' }}>
                  ✓ Nome disponível
                </span>
              ) : (
                <span className="font-label-sm text-error" style={{ fontFamily: 'var(--font-pixel)' }}>
                  ✗ Nome já existe
                </span>
              )}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full h-12 px-4 retro-border bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-mana-blue"
            style={{ borderRadius: '0' }}
            disabled={loading}
          />
        </div>

        {/* Profile Image (apenas cadastro) */}
        {!isLogin && (
          <div className="flex flex-col gap-2">
            <label className="font-label-sm uppercase tracking-widest text-on-surface" style={{ fontFamily: 'var(--font-pixel)' }}>
              Foto de Perfil (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full h-12 px-4 retro-border bg-surface-container-lowest text-on-surface font-body-md"
              style={{ borderRadius: '0' }}
              disabled={loading}
            />
            {profileImagePreview && (
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={profileImagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover retro-border"
                  style={{ borderRadius: '0' }}
                />
                <span className="font-body-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel-body)' }}>
                  {profileImageFile?.name}
                </span>
              </div>
            )}
            <p className="font-label-sm text-on-surface-variant" style={{ fontFamily: 'var(--font-pixel)' }}>
              Selecione uma foto do seu dispositivo
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-error-container text-on-error-container font-label-sm retro-border px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <PixelButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || (!isLogin && usernameAvailable === false)}
          className="w-full flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">
            {isLogin ? 'login' : 'person_add'}
          </span>
          <span>{loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}</span>
        </PixelButton>
      </form>

      {/* Toggle Login/Register */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setUsernameAvailable(null);
          }}
          className="font-label-sm text-mana-blue hover:underline"
          style={{ fontFamily: 'var(--font-pixel)' }}
          disabled={loading}
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
        </button>
      </div>
    </PixelCard>
  );
}
