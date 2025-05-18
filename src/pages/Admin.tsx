import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, ContactMessage } from '../context/SupabaseContext';

const Admin: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Fetch messages if authenticated
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated) return;
      
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setMessages(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [supabase, isAuthenticated]);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [supabase]);
  
  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };
  
  // Mark message as read
  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Admin </span>
        <span className="text-blue-600">Dashboard</span>
      </h1>
      
      {!isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <h2 className="text-xl font-bold mb-6">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className={`block mb-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-3 rounded-md outline-none transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className={`block mb-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-3 rounded-md outline-none transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              />
            </div>
            
            {loginError && (
              <div className="p-3 rounded-md bg-red-600/20 text-red-500 text-center">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </button>
          </form>
        </motion.div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Contact Messages</h2>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Logout
            </button>
          </div>
          
          {loading ? (
            <div className={`text-center py-12 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading messages...
            </div>
          ) : error ? (
            <div className="p-4 rounded-md bg-red-600/20 text-red-500 text-center">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className={`text-center py-12 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No messages yet.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-lg shadow-md ${
                    !message.read 
                      ? theme === 'dark' ? 'bg-blue-900/20 border-l-4 border-blue-600' : 'bg-blue-50 border-l-4 border-blue-600'
                      : theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {message.name}
                      </h3>
                      <a 
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {message.message}
                  </p>
                  
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;