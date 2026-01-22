import React, { useState, useEffect } from 'react';
import { X, ArrowRight, User, Bell, Clock, ShoppingBag } from 'lucide-react';

export interface UserData {
  name: string;
  email: string;
}

interface Notification {
  id: number;
  type: 'signup' | 'signin' | 'order';
  message: string;
  timestamp: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserData) => void;
  onLogout: () => void;
  currentUser: UserData | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onLogout, currentUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications when modal opens if user is admin
  useEffect(() => {
    if (isOpen && currentUser?.email === 'admin@shalabia.com') {
      try {
        const stored = localStorage.getItem('shalabia_notifications');
        if (stored) {
          setNotifications(JSON.parse(stored).reverse()); // Show newest first
        }
      } catch (e) {
        console.error("Failed to load notifications");
      }
    }
  }, [isOpen, currentUser]);

  const logNotification = (type: 'signup' | 'signin', name: string, email: string) => {
    // Don't log admin activity
    if (email === 'admin@shalabia.com') return;

    try {
      const stored = localStorage.getItem('shalabia_notifications');
      const currentNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const newNotification: Notification = {
        id: Date.now(),
        type,
        message: type === 'signup' 
          ? `New Member: ${name} (${email}) joined the sisterhood.` 
          : `User Login: ${name} (${email}) signed in.`,
        timestamp: new Date().toLocaleString()
      };

      const updated = [...currentNotifications, newNotification];
      // Limit to last 50 notifications to prevent storage overflow
      if (updated.length > 50) updated.shift();
      
      localStorage.setItem('shalabia_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to log notification", e);
    }
  };

  const clearNotifications = () => {
    localStorage.removeItem('shalabia_notifications');
    setNotifications([]);
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
        case 'signup': return 'bg-green-500';
        case 'order': return 'bg-orange-500';
        default: return 'bg-blue-500';
    }
  };

  if (!isOpen) return null;

  // If user is already logged in, show Profile View
  if (currentUser) {
    const isAdmin = currentUser.email === 'admin@shalabia.com';

    return (
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
        <div className={`bg-white w-full ${isAdmin ? 'max-w-2xl' : 'max-w-md'} shadow-2xl relative p-8 text-center animate-slide-up max-h-[90vh] overflow-y-auto`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900">
                <X size={24} />
            </button>
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={40} className="text-stone-400" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Welcome Back, {currentUser.name}</h2>
            <p className="text-stone-500 mb-8">{currentUser.email}</p>
            
            <button 
                onClick={() => { onLogout(); onClose(); }}
                className="w-full border border-stone-200 text-stone-900 py-3 font-medium uppercase tracking-widest hover:bg-stone-50 transition-colors mb-6"
            >
                Sign Out
            </button>

            {/* ADMIN NOTIFICATION PANEL */}
            {isAdmin && (
                <div className="border-t border-stone-100 pt-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-stone-900 font-serif text-xl">
                            <Bell size={20} />
                            <h3>Recent Activity</h3>
                        </div>
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearNotifications}
                                className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                                Clear History
                            </button>
                        )}
                    </div>

                    <div className="bg-stone-50 rounded-lg border border-stone-100 max-h-60 overflow-y-auto p-4">
                        {notifications.length === 0 ? (
                            <div className="text-center text-stone-400 py-4 text-sm">
                                No recent activity recorded.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="bg-white p-3 rounded shadow-sm border border-stone-100 flex gap-3 items-start">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${getNotificationColor(notif.type)}`} />
                                        <div className="flex-1">
                                            <p className="text-sm text-stone-800 font-medium">{notif.message}</p>
                                            <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                                                <Clock size={10} />
                                                <span>{notif.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-stone-400 mt-2 text-center">
                        * Real-time notifications for orders, logins, and signups.
                    </p>
                </div>
            )}
        </div>
       </div>
    );
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getStoredUsers = () => {
    try {
        const users = localStorage.getItem('shalabia_users');
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
    }

    // Email Format Validation
    if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // Sign Up Specific Validation
    if (mode === 'signup') {
        if (!formData.name) {
            setError('Please enter your full name.');
            return;
        }
        if (formData.name.trim().length < 3) {
            setError('Name must be at least 3 characters long.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
    }

    // Database Simulation using localStorage
    const storedUsers = getStoredUsers();

    if (mode === 'signup') {
        // Check if user already exists
        const existingUser = storedUsers.find((u: any) => u.email === formData.email);
        
        if (existingUser) {
            setError('An account with this email already exists.');
            return;
        }

        // Create new user
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password 
        };

        // Save to storage
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('shalabia_users', JSON.stringify(updatedUsers));

        // Log Notification
        logNotification('signup', newUser.name, newUser.email);

        // Auto login after signup
        onLogin({ name: newUser.name, email: newUser.email });
        onClose();

    } else {
        // Sign In Logic
        const user = storedUsers.find((u: any) => u.email === formData.email);

        if (!user) {
            setError('No account found with this email. Please sign up first.');
            return;
        }

        if (user.password !== formData.password) {
            setError('Incorrect password. Please try again.');
            return;
        }

        // Log Notification
        logNotification('signin', user.name, user.email);

        // Successful Login
        onLogin({ name: user.name, email: user.email });
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh] animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-stone-400 hover:text-stone-900">
            <X size={24} />
        </button>

        <div className="p-8 text-center border-b border-stone-100">
            <h2 className="font-serif text-3xl text-stone-900 mb-2">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-stone-500 text-sm">
                {mode === 'signin' ? 'Welcome back to Shalabia.' : 'Join the sisterhood today.'}
            </p>
        </div>

        <div className="p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                )}
                <div>
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-stone-900 text-white py-4 font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setError('');
                        setFormData({ name: '', email: '', password: '' });
                    }}
                    className="text-stone-500 text-sm underline underline-offset-4 hover:text-stone-900"
                >
                    {mode === 'signin' ? "Don't have an account? Join us." : "Already have an account? Sign In."}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;