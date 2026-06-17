import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiShield, FiUsers, FiEdit2 } from 'react-icons/fi'
import { MdAdminPanelSettings, MdManageAccounts, MdPerson } from 'react-icons/md'

const ROLES = ['admin', 'manager', 'user']

const roleColors = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  user: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

const roleIcons = {
  admin: <MdAdminPanelSettings className="text-red-500 text-xl" />,
  manager: <MdManageAccounts className="text-blue-500 text-xl" />,
  user: <MdPerson className="text-green-500 text-xl" />,
}

const roleBadgeIcons = {
  admin: <MdAdminPanelSettings className="inline mr-1" />,
  manager: <MdManageAccounts className="inline mr-1" />,
  user: <MdPerson className="inline mr-1" />,
}

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser.id) {
      toast.error("Apni role khud nahi badal sakte!")
      return
    }
    setUpdatingId(userId)
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole })
      toast.success('Role updated!')
      fetchUsers()
    } catch (err) {
      toast.error('Failed to update role')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
              <FiShield className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage user roles and permissions</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {ROLES.map(role => (
            <div key={role} className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4 text-center">
              <div className="flex justify-center mb-1">
                {roleIcons[role]}
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {users.filter(u => u.role === role).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}s</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <FiUsers className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-gray-800 dark:text-white">All Users ({users.length})</h2>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden">
              {users.map(u => (
                <div key={u._id} className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                      <FiUser className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                      {u._id === currentUser.id && (
                        <p className="text-xs text-indigo-500">(You)</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleColors[u.role]}`}>
                      {roleBadgeIcons[u.role]} {u.role}
                    </span>
                    {u._id === currentUser.id ? (
                      <span className="text-xs text-gray-400">Cannot change own role</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          disabled={updatingId === u._id}
                          className="text-sm px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {updatingId === u._id && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['User', 'Email', 'Current Role', 'Change Role'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiUser className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{u.name}</p>
                            {u._id === currentUser.id && (
                              <p className="text-xs text-indigo-500">(You)</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${roleColors[u.role]}`}>
                          {roleBadgeIcons[u.role]} {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u._id === currentUser.id ? (
                          <span className="text-xs text-gray-400">Cannot change own role</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FiEdit2 className="text-gray-400 text-sm" />
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u._id, e.target.value)}
                              disabled={updatingId === u._id}
                              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                            >
                              {ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            {updatingId === u._id && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}