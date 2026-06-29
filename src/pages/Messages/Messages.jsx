import { useMemo, useState } from 'react'
import {
  FaBell,
  FaCalendarAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaEnvelopeOpen,
  FaEye,
  FaInbox,
  FaRegCheckCircle,
  FaRegCommentDots,
  FaRegStar,
  FaRegTrashAlt,
  FaReply,
  FaSearch,
} from 'react-icons/fa'
import AccountAvatar from '../../components/AccountAvatar/AccountAvatar'
import { useAuth } from '../../context/AuthContext'
import './Messages.css'

const messages = [
  {
    id: 1,
    name: 'Ali Valiyev',
    email: 'ali.valiyev@gmail.com',
    subject: 'Help with my order',
    message: 'Hi, I need help with my latest order...',
    status: 'Unread',
    priority: 'Important',
    date: '17 Jun 2025, 11:20 AM',
    rawDate: '2025-06-17',
  },
  {
    id: 2,
    name: 'Malika Saidova',
    email: 'malika.saidova@gmail.com',
    subject: 'Product question',
    message: 'Can you tell me more about this product...',
    status: 'Read',
    priority: 'Normal',
    date: '17 Jun 2025, 10:05 AM',
    rawDate: '2025-06-17',
  },
  {
    id: 3,
    name: 'Bobur Karimov',
    email: 'bobur.karimov@gmail.com',
    subject: 'Refund request',
    message: 'I would like to request a refund...',
    status: 'Read',
    priority: 'Important',
    date: '16 Jun 2025, 04:45 PM',
    rawDate: '2025-06-16',
  },
  {
    id: 4,
    name: 'Sevinch Abdullayeva',
    email: 'sevinch.a@gmail.com',
    subject: 'Partnership inquiry',
    message: 'We are interested in collaborating...',
    status: 'Replied',
    priority: 'Normal',
    date: '16 Jun 2025, 01:30 PM',
    rawDate: '2025-06-16',
  },
  {
    id: 5,
    name: 'Azizbek Yusupov',
    email: 'azizbek.y@gmail.com',
    subject: 'Other',
    message: 'Just wanted to say thank you!',
    status: 'Read',
    priority: 'Normal',
    date: '15 Jun 2025, 09:10 AM',
    rawDate: '2025-06-15',
  },
]

const stats = [
  { icon: <FaRegCommentDots />, tone: 'purple', title: 'Total Messages', value: '523', text: 'All received messages' },
  { icon: <FaEnvelopeOpen />, tone: 'orange', title: 'Unread Messages', value: '24', text: '4.6% of total' },
  { icon: <FaRegStar />, tone: 'red', title: 'Important Messages', value: '8', text: '1.5% of total' },
  { icon: <FaRegCheckCircle />, tone: 'green', title: 'Replied Messages', value: '491', text: '93.9% of total' },
]

function Messages() {
  const { user } = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [priorityFilter, setPriorityFilter] = useState('All Priority')
  const [dateFilter, setDateFilter] = useState('')
  const accountName = user?.name || user?.username || 'Admin'

  const filteredMessages = useMemo(() => {
    const search = searchValue.trim().toLowerCase()

    return messages.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.subject.toLowerCase().includes(search) ||
        item.message.toLowerCase().includes(search)
      const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter
      const matchesPriority = priorityFilter === 'All Priority' || item.priority === priorityFilter
      const matchesDate = !dateFilter || item.rawDate === dateFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesDate
    })
  }, [dateFilter, priorityFilter, searchValue, statusFilter])

  return (
    <div className="messages-page">
      <header className="messages-header">
        <div>
          <h1>Messages</h1>
          <div className="messages-breadcrumb">
            <span>Dashboard</span>
            <span>Messages</span>
          </div>
        </div>

        <div className="messages-header-actions">
          <button type="button" aria-label="Search">
            <FaSearch />
          </button>
          <button type="button" className="messages-notification" aria-label="Notifications">
            <FaBell />
            <span>3</span>
          </button>
          <button type="button" className="messages-admin">
            <AccountAvatar src={user?.avatar} name={accountName} size={34} />
            <strong>{accountName}</strong>
          </button>
        </div>
      </header>

      <section className="messages-stats" aria-label="Message statistics">
        {stats.map((item) => (
          <article className="messages-stat" key={item.title}>
            <span className={`messages-stat-icon stat-${item.tone}`}>{item.icon}</span>
            <div>
              <p>{item.title}</p>
              <strong>{item.value}</strong>
              <small>{item.text}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="messages-panel">
        <div className="messages-toolbar">
          <label className="messages-search">
            <FaSearch />
            <input
              type="search"
              placeholder="Search message..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All Status</option>
            <option>Unread</option>
            <option>Read</option>
            <option>Replied</option>
          </select>

          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option>All Priority</option>
            <option>Important</option>
            <option>Normal</option>
          </select>

          <label className="messages-date">
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
            <FaCalendarAlt />
          </label>

          <button className="messages-export" type="button">
            <FaDownload />
            Export
          </button>
        </div>

        <div className="messages-table-wrap">
          <table className="messages-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" aria-label="Select all messages" />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" aria-label={`Select ${item.subject}`} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.subject}</td>
                  <td className="messages-preview">{item.message}</td>
                  <td>
                    <span className={`messages-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
                  </td>
                  <td>
                    <span className={`messages-badge priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div className="messages-actions">
                      <button type="button" className="action-view" aria-label="View message">
                        <FaEye />
                      </button>
                      <button type="button" className="action-reply" aria-label="Reply message">
                        <FaReply />
                      </button>
                      <button type="button" className="action-done" aria-label="Mark message as done">
                        <FaCheck />
                      </button>
                      <button type="button" className="action-delete" aria-label="Delete message">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMessages.length === 0 ? (
            <div className="messages-empty">
              <FaInbox />
              <strong>Message topilmadi</strong>
            </div>
          ) : null}
        </div>

        <footer className="messages-footer">
          <span>Showing 1 to {filteredMessages.length || 0} of 523 messages</span>

          <div className="messages-pagination">
            <button type="button" disabled aria-label="Previous page">
              <FaChevronLeft />
            </button>
            <button type="button" className="active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">...</button>
            <button type="button">105</button>
            <button type="button" aria-label="Next page">
              <FaChevronRight />
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default Messages
