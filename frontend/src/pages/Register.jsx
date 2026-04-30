import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Sun, Moon } from 'lucide-react';
import API from '../api/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { name, email, password });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 transition"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border dark:border-slate-800 p-8 md:p-10 transition-colors">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600 rounded-2xl mb-4">
                        <Layout className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight text-center">Create Account</h2>
                    <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mt-1">Join the Taskly team today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 ml-1">Full Name</label>
                        <input 
                            type="text" placeholder="John Doe" 
                            className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-slate-200"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 ml-1">Email Address</label>
                        <input 
                            type="email" placeholder="name@company.com" 
                            className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-slate-200"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1 ml-1">Password</label>
                        <input 
                            type="password" placeholder="••••••••" 
                            className="w-full p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-slate-200"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.01] active:scale-[0.98] mt-2">
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 dark:text-slate-400 font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
