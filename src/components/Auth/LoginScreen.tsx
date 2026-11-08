import React, { useState } from 'react';
import { UserProfile, ThemeMode } from '../../types/telegram';
import {
  validateUsername,
  validatePassword,
  validateDisplayName,
  validateEmail,
  formatUsernameHandle,
} from '../../utils/authLogic';
import {
  LogIn,
  UserPlus,
  QrCode,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ShieldCheck,
  Mail,
  User,
  AtSign,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  defaultUser: UserProfile;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  theme,
  onToggleTheme,
  defaultUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'qr'>('login');

  // Sign In state - only Email and Password
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Sign Up / Register state - Name, Email, Username, Password (no avatar selector)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const isDarkMode = theme === 'dark' || theme === 'night-blue';

  const defaultAvatar = '/assets/aistudio/pigeon-192_861273e6.png';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = validateEmail(loginEmail);
    if (!emailValidation.valid) {
      setLoginError(emailValidation.error || 'Invalid email address');
      return;
    }
    const passValidation = validatePassword(loginPassword);
    if (!passValidation.valid) {
      setLoginError(passValidation.error || 'Invalid password');
      return;
    }

    setLoginError('');
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Check if user exists in saved registered users
    let registeredUsers: Record<string, { profile: UserProfile; pass: string }> = {};
    try {
      const saved = localStorage.getItem('pigeon_registered_users_v2');
      if (saved) registeredUsers = JSON.parse(saved);
    } catch {}

    const existing = registeredUsers[cleanEmail];
    if (existing) {
      if (existing.pass !== loginPassword) {
        setLoginError('Incorrect password for this account');
        return;
      }
      onLogin(existing.profile);
      return;
    }

    // Direct email login (create profile from email)
    const emailPrefix = cleanEmail.split('@')[0] || 'user';
    const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9_]/g, '') || 'user';
    const displayName =
      emailPrefix
        .split(/[._-]/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Pigeon User';

    const user: UserProfile = {
      id: `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: displayName,
      username: cleanUsername,
      email: cleanEmail,
      phone: `@${cleanUsername}`,
      bio: 'Pigeon user · Encrypted & private',
      avatar: defaultAvatar,
    };

    // Save user profile
    registeredUsers[cleanEmail] = { profile: user, pass: loginPassword };
    registeredUsers[cleanUsername] = { profile: user, pass: loginPassword };
    localStorage.setItem('pigeon_registered_users_v2', JSON.stringify(registeredUsers));

    onLogin(user);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValidation = validateDisplayName(regName);
    if (!nameValidation.valid) {
      setRegError(nameValidation.error || 'Invalid display name');
      return;
    }
    const emailValidation = validateEmail(regEmail);
    if (!emailValidation.valid) {
      setRegError(emailValidation.error || 'Invalid email address');
      return;
    }
    const userValidation = validateUsername(regUsername);
    if (!userValidation.valid) {
      setRegError(userValidation.error || 'Invalid username');
      return;
    }
    const passValidation = validatePassword(regPassword);
    if (!passValidation.valid) {
      setRegError(passValidation.error || 'Invalid password');
      return;
    }

    setRegError('');
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanUsername = regUsername.replace(/^@/, '').trim().toLowerCase();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: regName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: `@${cleanUsername}`,
      bio: 'Pigeon user · Ready to chat 🚀',
      avatar: defaultAvatar,
    };

    // Save to registered accounts
    try {
      let registeredUsers: Record<string, { profile: UserProfile; pass: string }> = {};
      const saved = localStorage.getItem('pigeon_registered_users_v2');
      if (saved) registeredUsers = JSON.parse(saved);
      registeredUsers[cleanEmail] = { profile: newUser, pass: regPassword };
      registeredUsers[cleanUsername] = { profile: newUser, pass: regPassword };
      localStorage.setItem('pigeon_registered_users_v2', JSON.stringify(registeredUsers));
    } catch {}

    onLogin(newUser);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4 relative bg-[#0e1621] text-white overflow-y-auto">
      {/* Background patterned wallpaper overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('/src/assets/images/chat_wallpaper_pattern_1794121258085.jpg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 backdrop-blur-md transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
        </button>
      </div>

      {/* Central Login & Registration Card */}
      <div className="relative z-10 w-full max-w-md my-auto flex flex-col items-center">
        {/* Pigeon brand logo emblem */}
        <div className="w-24 h-24 rounded-3xl bg-white p-2.5 flex items-center justify-center shadow-2xl shadow-[#3390ec]/30 mb-4 group transition-transform hover:scale-105">
          <img
            src="/assets/aistudio/pigeon-192_861273e6.png"
            alt="Pigeon Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Tab Switcher: Log In / Create Account / QR Code */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/80 mb-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'login'
                ? 'bg-[#3390ec] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'register'
                ? 'bg-[#3390ec] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'qr'
                ? 'bg-[#3390ec] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* ===================== TAB 1: SIGN IN ===================== */}
        {activeTab === 'login' && (
          <form
            onSubmit={handleLoginSubmit}
            className="w-full rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl animate-pop-in"
          >
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-white mb-1">
                Welcome to Pigeon
              </h1>
              <p className="text-xs text-slate-400">
                Sign in with your email and password.
              </p>
            </div>

            <div className="space-y-4 mb-5">
              {/* Email Address Input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-rose-400">{loginError}</p>
              )}

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-[#3390ec] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs text-slate-300">Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3390ec]/25 transition-all active:scale-98 mb-4"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Pigeon</span>
            </button>

            <div className="text-center text-xs text-slate-400">
              New to Pigeon?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-[#3390ec] font-semibold hover:underline"
              >
                Create an account
              </button>
            </div>
          </form>
        )}

        {/* ===================== TAB 2: CREATE ACCOUNT ===================== */}
        {activeTab === 'register' && (
          <form
            onSubmit={handleRegisterSubmit}
            className="w-full rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl animate-pop-in"
          >
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-white mb-1">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-400">
                Enter your name, email, username, and password to start messaging.
              </p>
            </div>

            <div className="space-y-3.5 mb-5">
              {/* 1. Name */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Hunter"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 2. Email */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 3. Username */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="alex_hunter"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 4. Password */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#3390ec] focus:ring-2 focus:ring-[#3390ec]/30 transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {regError && (
                <p className="text-xs text-rose-400">{regError}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#3390ec] hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#3390ec]/25 transition-all active:scale-98 mb-3"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account &amp; Start Messaging</span>
            </button>

            <div className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#3390ec] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ===================== TAB 3: QR CODE ===================== */}
        {activeTab === 'qr' && (
          <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 flex flex-col items-center text-center shadow-2xl backdrop-blur-xl animate-pop-in">
            <h1 className="text-xl font-bold text-white mb-1">
              Scan with Pigeon App
            </h1>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              Instant login via camera or Pigeon desktop scanner
            </p>

            {/* Stylized QR Code with Pigeon center badge */}
            <div className="relative p-4 rounded-3xl bg-white shadow-2xl mb-5">
              <div className="w-48 h-48 relative flex items-center justify-center">
                <svg
                  className="w-full h-full text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="12" height="12" rx="2" />
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="76" y="12" width="12" height="12" rx="2" />
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="76" width="12" height="12" rx="2" />
                  <rect x="36" y="8" width="6" height="6" rx="1" />
                  <rect x="46" y="8" width="6" height="6" rx="1" />
                  <rect x="56" y="8" width="6" height="6" rx="1" />
                  <rect x="36" y="18" width="6" height="6" rx="1" />
                  <rect x="46" y="24" width="6" height="6" rx="1" />
                  <rect x="56" y="18" width="6" height="6" rx="1" />
                  <rect x="8" y="36" width="6" height="6" rx="1" />
                  <rect x="18" y="44" width="6" height="6" rx="1" />
                  <rect x="24" y="54" width="6" height="6" rx="1" />
                  <rect x="68" y="36" width="6" height="6" rx="1" />
                  <rect x="78" y="44" width="6" height="6" rx="1" />
                  <rect x="88" y="36" width="6" height="6" rx="1" />
                  <rect x="68" y="54" width="6" height="6" rx="1" />
                  <rect x="78" y="62" width="6" height="6" rx="1" />
                  <rect x="88" y="54" width="6" height="6" rx="1" />
                  <rect x="36" y="68" width="6" height="6" rx="1" />
                  <rect x="46" y="76" width="6" height="6" rx="1" />
                  <rect x="56" y="68" width="6" height="6" rx="1" />
                  <rect x="36" y="86" width="6" height="6" rx="1" />
                  <rect x="46" y="86" width="6" height="6" rx="1" />
                  <rect x="56" y="86" width="6" height="6" rx="1" />
                  <rect x="68" y="86" width="6" height="6" rx="1" />
                  <rect x="82" y="82" width="8" height="8" rx="1" />
                </svg>

                {/* Center Pigeon Logo */}
                <div className="absolute w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center border-2 border-slate-200 shadow-md">
                  <img
                    src="/assets/aistudio/pigeon-192_861273e6.png"
                    alt="Pigeon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="w-full p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left text-xs text-slate-300 space-y-1.5 mb-4">
              <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#3390ec]" /> Quick link instructions:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Open Pigeon on your mobile phone</li>
                <li>Go to <span className="text-white font-medium">Settings &gt; Devices &gt; Link Desktop</span></li>
                <li>Point your camera at this screen to log in</li>
              </ol>
            </div>

            <div className="text-center text-xs text-slate-400">
              Prefer username and password?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#3390ec] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 text-center text-xs text-slate-500">
        Pigeon Web · Fast, Free &amp; Private Messaging without Phone Numbers
      </div>
    </div>
  );
};
