import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../hooks/useAuth'
import { FiSun, FiMoon, FiLogOut, FiUsers, FiGrid, FiShield } from 'react-icons/fi'

export default function Navbar() {
  const { darkMode, setDarkMode } = useDarkMode()
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">XDevFlow</span>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full hidden sm:block">CRM</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`flex items-center gap-1 text-sm font-medium transition ${
              location.pathname === '/'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <FiGrid className="text-base" />
            <span className="hidden sm:block">Dashboard</span>
          </Link>

          <Link
            to="/leads"
            className={`flex items-center gap-1 text-sm font-medium transition ${
              location.pathname === '/leads'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <FiUsers className="text-base" />
            <span className="hidden sm:block">Leads</span>
          </Link>

          {/* Admin Only Link */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 text-sm font-medium transition ${
                location.pathname === '/admin'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-600'
              }`}
            >
              <FiShield className="text-base" />
              <span className="hidden sm:block">Admin</span>
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:scale-110 transition"
          >
            {darkMode ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
          </button>

          {/* Role Badge */}
          {user?.role && (
            <span className={`text-xs px-2 py-1 rounded-full font-semibold hidden sm:block ${
              user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
              user.role === 'manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
              'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}>
              {user.role === 'admin' ? '👑' : user.role === 'manager' ? '🎯' : '👤'} {user.role}
            </span>
          )}

          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium hidden md:block">
            {user?.name}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg transition"
          >
            <FiLogOut className="text-sm" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}