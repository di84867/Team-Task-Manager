import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, Clock, Layout, Users, LogOut, Briefcase, UserPlus, Menu, X, AlertCircle, Sun, Moon } from 'lucide-react';
import API from '../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    
    const [newTask, setNewTask] = useState({ title: '', description: '', project: '', assignedTo: '', dueDate: '' });
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Member' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
        // Apply theme to html tag
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [activeTab, theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const fetchData = async () => {
        try {
            const [projRes, taskRes, userRes] = await Promise.all([
                API.get('/projects'),
                API.get('/tasks'),
                API.get('/auth/users')
            ]);
            setProjects(projRes.data);
            setTasks(taskRes.data);
            setUsers(userRes.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await API.post('/projects', newProject);
            setShowProjectModal(false);
            fetchData();
        } catch (err) { alert(err.response?.data?.message); }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tasks', newTask);
            setShowTaskModal(false);
            fetchData();
        } catch (err) { alert(err.response?.data?.message); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/admin/create-user', newUser);
            setShowUserModal(false);
            fetchData();
            alert('User Created Successfully');
        } catch (err) { alert(err.response?.data?.message); }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            await API.put(`/tasks/${id}/status`, { status });
            fetchData();
        } catch (err) { alert(err.response?.data?.message); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isOverdue = (task) => {
        if (task.status === 'Completed') return false;
        return new Date(task.dueDate) < new Date();
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 flex overflow-hidden transition-colors duration-300">
            {isSidebarOpen && (
                <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
                        <Layout className="w-8 h-8" /> TASKLY
                    </h1>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button 
                        onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === 'overview' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                    >
                        <Layout className="w-5 h-5" /> Dashboard
                    </button>
                    {user?.role === 'Admin' && (
                        <button 
                            onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${activeTab === 'team' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                        >
                            <Users className="w-5 h-5" /> Team Members
                        </button>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-semibold transition">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Topbar */}
                <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 md:p-6 flex justify-between items-center z-30 transition-colors">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="md:hidden text-gray-500">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wide">{activeTab}</h2>
                            <p className="hidden md:block text-gray-500 dark:text-slate-400 text-sm font-medium">Account: <span className="text-blue-600 font-bold">{user?.name}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        {user?.role === 'Admin' && (
                            <div className="flex gap-2">
                                {activeTab === 'team' ? (
                                    <button onClick={() => setShowUserModal(true)} className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 dark:shadow-none">
                                        Add Member
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => setShowProjectModal(true)} className="hidden sm:block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                                            + Project
                                        </button>
                                        <button onClick={() => setShowTaskModal(true)} className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition">
                                            + Task
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {activeTab === 'overview' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-10">
                                <StatCard title="Projects" val={projects.length} icon={<Briefcase className="text-blue-500" />} />
                                <StatCard title="Pending" val={tasks.filter(t => t.status === 'Pending').length} icon={<Clock className="text-amber-500" />} />
                                <StatCard title="In Progress" val={tasks.filter(t => t.status === 'In Progress').length} icon={<Layout className="text-purple-500" />} />
                                <StatCard title="Completed" val={tasks.filter(t => t.status === 'Completed').length} icon={<CheckCircle className="text-green-500" />} />
                                <StatCard title="Overdue" val={tasks.filter(t => isOverdue(t)).length} icon={<AlertCircle className="text-red-500" />} highlight={tasks.filter(t => isOverdue(t)).length > 0} />
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
                                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-800">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-slate-100">Task Overview</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Task</th>
                                                <th className="px-6 py-4">Project</th>
                                                <th className="px-6 py-4">Assignee</th>
                                                <th className="px-6 py-4">Due Date</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                            {tasks.map(task => (
                                                <tr key={task._id} className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 transition ${isOverdue(task) ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                                                    <td className="px-6 py-4 font-bold text-gray-700 dark:text-slate-300">
                                                        <div className="flex flex-col">
                                                            {task.title}
                                                            {isOverdue(task) && <span className="text-[10px] text-red-500 font-black uppercase flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> Overdue</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 text-sm font-medium">{task.project?.title || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-slate-400">{task.assignedTo?.name || 'Unassigned'}</td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400">
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            task.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700' :
                                                            task.status === 'In Progress' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700'
                                                        }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select 
                                                            value={task.status}
                                                            onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                            className="bg-transparent text-blue-600 font-black text-xs outline-none cursor-pointer"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="In Progress">Start</option>
                                                            <option value="Completed">Done</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden overflow-x-auto transition-colors">
                            <table className="w-full text-left min-w-[500px]">
                                <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {users.map(u => (
                                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-slate-100">{u.name}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'Admin' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* Modals with Dark Support */}
            {showProjectModal && (
                <Modal title="Create New Project" close={() => setShowProjectModal(false)}>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <input type="text" placeholder="Project Title" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
                        <textarea placeholder="Description" className="modal-input h-32 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
                        <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none transition hover:scale-[1.02]">Create Project</button>
                    </form>
                </Modal>
            )}

            {showTaskModal && (
                <Modal title="Assign New Task" close={() => setShowTaskModal(false)}>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                        <input type="text" placeholder="Task Title" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                        <select required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewTask({...newTask, project: e.target.value})}>
                            <option value="">Select Project</option>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                        <select required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}>
                            <option value="">Assign To Member</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                        </select>
                        <input type="date" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                        <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none transition hover:scale-[1.02]">Assign Task</button>
                    </form>
                </Modal>
            )}

            {showUserModal && (
                <Modal title="Add Team Member" close={() => setShowUserModal(false)}>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <input type="text" placeholder="Name" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                        <input type="email" placeholder="Email" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                        <input type="password" placeholder="Password" required className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                        <select className="modal-input dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-100 dark:shadow-none transition hover:scale-[1.02]">Create User</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const StatCard = ({ title, val, icon, highlight }) => (
    <div className={`p-3 md:p-6 rounded-2xl shadow-sm border transition duration-300 cursor-default ${
        highlight 
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50' 
            : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:shadow-md'
    }`}>
        <div className={`p-2 md:p-3 rounded-xl ${highlight ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-slate-800'}`}>{icon}</div>
        <div>
            <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-red-500' : 'text-gray-400 dark:text-slate-500'}`}>{title}</p>
            <p className={`text-lg md:text-2xl font-black ${highlight ? 'text-red-600' : 'text-gray-800 dark:text-slate-100'}`}>{val}</p>
        </div>
    </div>
);

const Modal = ({ title, children, close }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{title}</h3>
                <button onClick={close} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 text-2xl font-light transition">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

export default Dashboard;
