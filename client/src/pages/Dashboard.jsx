import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { FiUsers, FiUserPlus, FiPhone, FiCheckCircle, FiAward, FiXCircle } from 'react-icons/fi'

const StatCard = ({ title, count, color, icon }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{count}</h3>
      </div>
      <div className="text-4xl text-gray-300 dark:text-gray-600">
        {icon}
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, new: 0, qualified: 0, won: 0, lost: 0, contacted: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/leads')
        const leads = res.data
        setStats({
          total: leads.length,
          new: leads.filter(l => l.status === 'New').length,
          contacted: leads.filter(l => l.status === 'Contacted').length,
          qualified: leads.filter(l => l.status === 'Qualified').length,
          won: leads.filter(l => l.status === 'Won').length,
          lost: leads.filter(l => l.status === 'Lost').length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your CRM data</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Leads"  count={stats.total}     color="border-indigo-500" icon={<FiUsers />} />
            <StatCard title="New Leads"    count={stats.new}       color="border-blue-500"   icon={<FiUserPlus />} />
            <StatCard title="Contacted"    count={stats.contacted} color="border-yellow-500" icon={<FiPhone />} />
            <StatCard title="Qualified"    count={stats.qualified} color="border-green-500"  icon={<FiCheckCircle />} />
            <StatCard title="Won"          count={stats.won}       color="border-emerald-500"icon={<FiAward />} />
            <StatCard title="Lost"         count={stats.lost}      color="border-red-500"    icon={<FiXCircle />} />
          </div>
        )}
      </div>
    </div>
  )
}