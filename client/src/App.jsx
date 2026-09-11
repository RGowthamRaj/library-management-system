import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  BookPlus,
  RotateCcw,
  Library,
  Menu,
  X,
} from 'lucide-react';
import DashboardPage from './pages/DashboardPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import IssuePage from './pages/IssuePage.jsx';
import ReturnPage from './pages/ReturnPage.jsx';
import ChatBot from './components/ChatBot.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/issue', label: 'Issue Book', icon: BookPlus },
  { to: '/return', label: 'Return Book', icon: RotateCcw },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-800">
          <Library className="w-8 h-8 text-indigo-300" />
          <div>
            <h1 className="text-lg font-bold">LibraryMS</h1>
            <p className="text-xs text-indigo-300">Management System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-indigo-800">
          <p className="text-xs text-indigo-400">Library Management System v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Library Book Issue & Return Management
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/return" element={<ReturnPage />} />
          </Routes>
        </main>
      </div>

      {/* Floating Chatbot */}
      <ChatBot />
    </div>
  );
}
