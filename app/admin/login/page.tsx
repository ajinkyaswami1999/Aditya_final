// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Lock, User, Eye, EyeOff } from 'lucide-react';
// import { adminUsersApi } from '@/lib/supabase';

// export default function AdminLogin() {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const user = await adminUsersApi.authenticate(credentials.username, credentials.password);
      
//       if (user) {
//         // Store user session
//         localStorage.setItem('admin_user', JSON.stringify({
//           id: user.id,
//           username: user.username,
//           role: user.role,
//           permissions: user.permissions
//         }));
        
//         router.push('/admin');
//       } else {
//         setError('Invalid username or password');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('Login failed. Please check your credentials and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
//           {/* Top Border Glow */}
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Lock className="w-8 h-8 text-black" />
//             </div>
//             <h1 className="text-3xl font-light text-yellow-400 mb-2">Admin Login</h1>
//             <p className="text-gray-300">Access the admin panel</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={credentials.username}
//                   onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
//                   placeholder="Enter username"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={credentials.password}
//                   onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                   className="w-full pl-10 pr-12 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
//                   placeholder="Enter password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-red-400 text-sm">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-400">
//             <p>Demo Credentials:</p>
//             <p>Super Admin: superadmin / super123</p>
//             <p>Admin: admin / admin123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { adminUsersApi } from '@/lib/supabase';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Login attempt for username:', credentials.username);

    try {
      const user = await adminUsersApi.authenticate(credentials.username, credentials.password);
      
      console.log('Authentication result:', user);
      
      if (user) {
        console.log('Login successful, storing session');
        // Store user session
        localStorage.setItem('admin_user', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions
        }));
        
        console.log('Redirecting to admin panel');
        router.push('/admin');
      } else {
        console.log('Authentication failed - no user returned');
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
          {/* Top Border Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-light text-yellow-400 mb-2">Admin Login</h1>
            <p className="text-gray-300">Access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Demo Credentials:</p>
            <p>Super Admin: superadmin / super123</p>
            <p>Admin: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}