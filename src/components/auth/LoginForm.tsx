import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { DEMO_PASSWORDS } from '../../constants/users';
import { DemoCredentials } from './DemoCredentials';

export function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validPassword = DEMO_PASSWORDS[credentials.email];
    if (validPassword && credentials.password === validPassword) {
      const success = login(credentials);

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-16 h-[1px] bg-white animate-shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              right: '0',
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}

        {/* Animated Clouds */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full filter blur-xl animate-float" />
            <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-white/20 rounded-full filter blur-xl animate-float animate-delay-1" />
            <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-white/20 rounded-full filter blur-xl animate-float animate-delay-2" />
            
            {/* Waves */}
            <div className="absolute bottom-0 left-0 right-0 h-32">
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 rounded-full filter blur-xl animate-wave" />
              <div className="absolute bottom-4 left-0 right-0 h-16 bg-white/10 rounded-full filter blur-xl animate-wave animate-delay-1" />
              <div className="absolute bottom-8 left-0 right-0 h-16 bg-white/10 rounded-full filter blur-xl animate-wave animate-delay-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full md:w-[480px] bg-white p-8 rounded-lg shadow-xl relative z-10">
        <div>
          <div className="text-center mb-8">
            <img 
              src="https://www.aas.sn/wp-content/uploads/2023/12/cropped-LOGO-A.A.S-1-1.png" 
              alt="AAS Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Association des Assureurs du Sénégal
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Plateforme de l'Association des Assureurs du Sénégal
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-10"
                  placeholder="vous@exemple.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
        </div>

        <DemoCredentials />
      </div>
    </div>
  );
}