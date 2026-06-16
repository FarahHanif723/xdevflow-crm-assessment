import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiUser, FiUsers, FiMail, FiPhone, FiBriefcase, FiX
} from 'react-icons/fi'
 import { useAuth } from '../hooks/useAuth'



const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost', 'Won']

const statusColors = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  Won: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
}

const emptyForm = { fullName: '', email: '', phone: '', company: '', status: 'New' }

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editLead, setEditLead] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [submitting, setSubmitting] = useState(false)
   const { canEdit } = useAuth()
  const fetchLeads = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/leads', { params })
      setLeads(res.data)
    } catch (err) {
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [search, statusFilter])

  const openAddModal = () => {
    setEditLead(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEditModal = (lead) => {
    setEditLead(lead)
    setForm({
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editLead) {
        await api.put(`/leads/${editLead._id}`, form)
        toast.success('Lead updated!')
      } else {
        await api.post('/leads', form)
        toast.success('Lead added!')
      }
      setShowModal(false)
      fetchLeads()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return
    try {
      await api.delete(`/leads/${id}`)
      toast.success('Lead deleted!')
      fetchLeads()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Leads</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your CRM leads</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            <FiPlus className="text-lg" />
            Add Lead
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers className="text-gray-300 dark:text-gray-600 text-7xl mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No leads found</p>
            <button
              onClick={openAddModal}
              className="mt-4 flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              <FiPlus /> Add First Lead
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Company', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <FiUser className="text-indigo-600 dark:text-indigo-400 text-sm" />
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white">{lead.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <FiMail className="text-gray-400 text-sm" />
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <FiPhone className="text-gray-400 text-sm" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <FiBriefcase className="text-gray-400 text-sm" />
                          {lead.company}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                     <td className="px-6 py-4">
  {canEdit ? (
    <div className="flex gap-2">
      <button
        onClick={() => openEditModal(lead)}
        className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm transition"
      >
        <FiEdit2 /> Edit
      </button>

      <button
        onClick={() => handleDelete(lead._id)}
        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg text-sm transition"
      >
        <FiTrash2 /> Delete
      </button>
    </div>
  ) : (
    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
      View only
    </span>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {editLead ? <><FiEdit2 /> Edit Lead</> : <><FiPlus /> Add New Lead</>}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Doe', icon: <FiUser /> },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'john@example.com', icon: <FiMail /> },
                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+92 300 1234567', icon: <FiPhone /> },
                { label: 'Company', key: 'company', type: 'text', placeholder: 'ABC Corp', icon: <FiBriefcase /> },
              ].map(({ label, key, type, placeholder, icon }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                    <input
                      type={type}
                      required
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg transition"
                >
                  <FiX /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : editLead ? <><FiEdit2 /> Update</> : <><FiPlus /> Add Lead</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}