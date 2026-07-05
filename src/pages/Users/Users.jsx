import { useEffect, useMemo, useState } from 'react'
import {
  FaBan,
  FaBell,
  FaCalendarAlt,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaEye,
  FaRegTrashAlt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaUserPlus,
  FaUsers,
} from 'react-icons/fa'
import AccountAvatar from '../../components/AccountAvatar/AccountAvatar'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { usersApi } from '../../services/api'
import './Users.css'

const roles = ['Admin', 'Moderator', 'User']
const pageSize = 5

const emptyForm = {
  name: '',
  username: '',
  email: '',
  role: 'User',
  status: 'Active',
  registeredAt: new Date().toISOString().slice(0, 10),
}

const getDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value, locale = 'en-GB') => {
  const date = getDate(value)
  if (!date) return '-'

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatLastLogin = (value, locale = 'en-GB') => {
  const date = getDate(value)
  if (!date) return '-'

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatLastSeen = (value, t, locale) => {
  const date = getDate(value)
  if (!date) return t('time.never')

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMinutes < 1) return t('time.justNow')
  if (diffMinutes < 60) return t('time.minutesAgo', { n: diffMinutes })

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return t('time.hoursAgo', { n: diffHours })

  return formatLastLogin(date, locale)
}

const normalizeUser = (user) => {
  const username = user.username?.startsWith('@') ? user.username : `@${user.username || 'user'}`
  const cleanUsername = username.replace(/^@/, '')

  return {
    id: user.id || user._id,
    name: user.name || cleanUsername,
    username,
    email: user.email || '-',
    role: user.role || 'User',
    status: user.status || 'Active',
    lastLogin: user.lastLogin,
    lastSeen: user.lastSeen,
    isOnline: Boolean(user.isOnline),
    registeredAt: user.registeredAt || user.createdAt,
    avatar: user.avatar || '',
  }
}

function Users() {
  const { user: authUser } = useAuth()
  const { t, locale } = useLanguage()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalMode, setModalMode] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    let isMounted = true

    const loadUsers = async (isInitial = false) => {
      try {
        const { data } = await usersApi.getAll()
        if (!isMounted) return
        setUsers(data.map(normalizeUser))
        setError('')
      } catch {
        if (isMounted && isInitial) {
          setError(t('users.loadError'))
        }
      } finally {
        if (isMounted && isInitial) setIsLoading(false)
      }
    }

    loadUsers(true)
    const intervalId = setInterval(() => loadUsers(), 30 * 1000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [t])

  const filteredUsers = useMemo(() => {
    const search = searchValue.trim().toLowerCase()

    return users.filter((user) => {
      const registeredDate = user.registeredAt ? user.registeredAt.slice(0, 10) : ''
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search)
      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Online' && user.isOnline) ||
        (statusFilter === 'Offline' && !user.isOnline) ||
        user.status === statusFilter
      const matchesDate = !dateFilter || registeredDate === dateFilter

      return matchesSearch && matchesRole && matchesStatus && matchesDate
    })
  }, [dateFilter, roleFilter, searchValue, statusFilter, users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageUsers = filteredUsers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize)
  const totalUsers = users.length
  const onlineUsers = users.filter((user) => user.isOnline).length
  const blockedUsers = users.filter((user) => user.status === 'Blocked').length
  const currentMonth = new Date().toISOString().slice(0, 7)
  const newThisMonth = users.filter((user) => user.registeredAt?.startsWith(currentMonth)).length
  const accountName = authUser?.name || authUser?.username || 'Admin'

  const openModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)
    setFormData(
      user
        ? {
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            registeredAt: user.registeredAt?.slice(0, 10) || emptyForm.registeredAt,
          }
        : emptyForm,
    )
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedUser(null)
    setFormData(emptyForm)
  }

  const updateForm = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (modalMode === 'edit') {
        const { data } = await usersApi.update(selectedUser.id, formData)
        const updatedUser = normalizeUser(data)
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      } else {
        const { data } = await usersApi.create(formData)
        setUsers((prev) => [normalizeUser(data), ...prev])
        setCurrentPage(1)
      }

      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || t('users.saveError'))
    }
  }

  const toggleBlocked = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Blocked' : 'Active'
    setError('')

    try {
      const { data } = await usersApi.update(user.id, { status: nextStatus })
      const updatedUser = normalizeUser(data)
      setUsers((prev) => prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)))
    } catch {
      setError(t('users.statusError'))
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm(t('users.confirmDelete'))) return

    setError('')

    try {
      await usersApi.remove(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch {
      setError(t('users.deleteError'))
    }
  }

  const clearFilters = () => {
    setSearchValue('')
    setRoleFilter('All Roles')
    setStatusFilter('All Status')
    setDateFilter('')
    setCurrentPage(1)
  }

  return (
    <div className="users-page">
      <header className="users-header">
        <div>
          <h1>{t('users.title')}</h1>
          <div className="users-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            <span>{t('users.title')}</span>
          </div>
        </div>

        <div className="users-header-actions">
          <LanguageSwitcher />
          <button type="button" aria-label="Search">
            <FaSearch />
          </button>
          <button type="button" className="users-notification" aria-label="Notifications">
            <FaBell />
            <span>3</span>
          </button>
          <button type="button" className="users-admin">
            <AccountAvatar src={authUser?.avatar} name={accountName} size={34} />
            <strong>{accountName}</strong>
          </button>
        </div>
      </header>

      <section className="users-stats" aria-label="User statistics">
        <StatCard icon={<FaUsers />} tone="purple" title={t('users.totalUsers')} value={totalUsers.toLocaleString('en-US')} text={t('users.totalUsersText')} />
        <StatCard icon={<FaUserPlus />} tone="green" title={t('users.onlineNow')} value={onlineUsers.toLocaleString('en-US')} text={t('users.onlineNowText', { percent: totalUsers ? Math.round((onlineUsers / totalUsers) * 100) : 0 })} />
        <StatCard icon={<FaShieldAlt />} tone="red" title={t('users.blockedUsers')} value={blockedUsers.toLocaleString('en-US')} text={t('users.ofTotal', { percent: totalUsers ? Math.round((blockedUsers / totalUsers) * 100) : 0 })} />
        <StatCard icon={<FaChartBar />} tone="blue" title={t('users.newThisMonth')} value={newThisMonth.toLocaleString('en-US')} text={t('users.newThisMonthText')} />
      </section>

      <section className="users-panel">
        <div className="users-toolbar">
          <label className="users-search">
            <FaSearch />
            <input
              type="search"
              placeholder={t('users.searchPlaceholder')}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                setCurrentPage(1)
              }}
            />
          </label>

          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All Roles">{t('users.allRoles')}</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {t(`role.${role}`)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="All Status">{t('users.allStatus')}</option>
            <option value="Online">{t('online.online')}</option>
            <option value="Offline">{t('online.offline')}</option>
            <option value="Active">{t('status.Active')}</option>
            <option value="Blocked">{t('status.Blocked')}</option>
          </select>

          <label className="users-date">
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value)
                setCurrentPage(1)
              }}
            />
            <FaCalendarAlt />
          </label>

          <button className="users-add" type="button" onClick={() => openModal('add')}>
            <FaUserPlus />
            {t('users.addNewUser')}
          </button>
        </div>

        {error ? <p className="users-error">{error}</p> : null}

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>{t('users.thUser')}</th>
                <th>{t('users.thEmail')}</th>
                <th>{t('users.thRole')}</th>
                <th>{t('users.thStatus')}</th>
                <th>{t('users.thOnline')}</th>
                <th>{t('users.thLastLogin')}</th>
                <th>{t('users.thRegistered')}</th>
                <th>{t('users.thActions')}</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                pageUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="users-profile">
                        <AccountAvatar src={user.avatar} name={user.name} size={38} />
                        <span>
                          <strong>{user.name}</strong>
                          <small>{user.username}</small>
                        </span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`users-badge role-${user.role.toLowerCase()}`}>{t(`role.${user.role}`)}</span>
                    </td>
                    <td>
                      <span className={`users-status status-${user.status.toLowerCase()}`}>
                        <i />
                        {t(`status.${user.status}`)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`users-status ${user.isOnline ? 'status-online' : 'status-offline'}`}
                        title={user.isOnline ? t('time.onlineNow') : formatLastSeen(user.lastSeen, t, locale)}
                      >
                        <i />
                        {user.isOnline ? t('online.online') : t('online.offline')}
                      </span>
                    </td>
                    <td>{formatLastLogin(user.lastLogin, locale)}</td>
                    <td>{formatDate(user.registeredAt, locale)}</td>
                    <td>
                      <div className="users-actions">
                        <button type="button" className="action-view" aria-label="View user" onClick={() => openModal('view', user)}>
                          <FaEye />
                        </button>
                        <button type="button" className="action-edit" aria-label="Edit user" onClick={() => openModal('edit', user)}>
                          <FaEdit />
                        </button>
                        <button type="button" className="action-block" aria-label="Block user" onClick={() => toggleBlocked(user)}>
                          <FaBan />
                        </button>
                        <button type="button" className="action-delete" aria-label="Delete user" onClick={() => deleteUser(user.id)}>
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {isLoading ? <div className="users-empty"><strong>{t('users.loading')}</strong></div> : null}
          {!isLoading && pageUsers.length === 0 ? (
            <div className="users-empty">
              <strong>{t('users.notFound')}</strong>
              <button type="button" onClick={clearFilters}>
                {t('users.clearFilters')}
              </button>
            </div>
          ) : null}
        </div>

        <footer className="users-footer">
          <span>
            {t('users.showing', {
              from: filteredUsers.length ? (safeCurrentPage - 1) * pageSize + 1 : 0,
              to: Math.min(safeCurrentPage * pageSize, filteredUsers.length),
              total: filteredUsers.length.toLocaleString('en-US'),
            })}
          </span>

          <div className="users-pagination">
            <button type="button" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(safeCurrentPage - 1)} aria-label="Previous page">
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={page === safeCurrentPage ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button type="button" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(safeCurrentPage + 1)} aria-label="Next page">
              <FaChevronRight />
            </button>
          </div>
        </footer>
      </section>

      {modalMode ? (
        <div className="users-modal-backdrop" role="presentation" onMouseDown={closeModal}>
          <div className="users-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button className="users-modal-close" type="button" onClick={closeModal} aria-label="Close modal">
              <FaTimes />
            </button>

            {modalMode === 'view' ? (
              <UserDetails user={selectedUser} />
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>{modalMode === 'edit' ? t('users.editUser') : t('users.addNewUser')}</h2>
                <label>
                  {t('users.name')}
                  <input name="name" value={formData.name} onChange={updateForm} required />
                </label>
                <label>
                  {t('users.username')}
                  <input name="username" value={formData.username} onChange={updateForm} required />
                </label>
                <label>
                  {t('users.thEmail')}
                  <input type="email" name="email" value={formData.email} onChange={updateForm} required />
                </label>
                <div className="users-form-grid">
                  <label>
                    {t('users.thRole')}
                    <select name="role" value={formData.role} onChange={updateForm}>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {t(`role.${role}`)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t('users.thStatus')}
                    <select name="status" value={formData.status} onChange={updateForm}>
                      <option value="Active">{t('status.Active')}</option>
                      <option value="Blocked">{t('status.Blocked')}</option>
                    </select>
                  </label>
                </div>
                <button className="users-save" type="submit">
                  {t('users.saveUser')}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatCard({ icon, tone, title, value, text }) {
  return (
    <article className="users-stat">
      <span className={`users-stat-icon stat-${tone}`}>{icon}</span>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </article>
  )
}

function UserDetails({ user }) {
  const { t, locale } = useLanguage()

  return (
    <div className="users-details">
      <AccountAvatar src={user.avatar} name={user.name} size={82} />
      <h2>{user.name}</h2>
      <p>{user.username}</p>
      <dl>
        <div>
          <dt>{t('users.thEmail')}</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>{t('users.thRole')}</dt>
          <dd>{t(`role.${user.role}`)}</dd>
        </div>
        <div>
          <dt>{t('users.thStatus')}</dt>
          <dd>{t(`status.${user.status}`)}</dd>
        </div>
        <div>
          <dt>{t('users.thOnline')}</dt>
          <dd>{user.isOnline ? t('time.onlineNow') : formatLastSeen(user.lastSeen, t, locale)}</dd>
        </div>
        <div>
          <dt>{t('users.registered')}</dt>
          <dd>{formatDate(user.registeredAt, locale)}</dd>
        </div>
        <div>
          <dt>{t('users.thLastLogin')}</dt>
          <dd>{formatLastLogin(user.lastLogin, locale)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default Users
