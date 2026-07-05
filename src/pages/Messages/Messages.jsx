import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaBell,
  FaCheck,
  FaEnvelopeOpen,
  FaEye,
  FaInbox,
  FaPaperPlane,
  FaRegCheckCircle,
  FaRegCommentDots,
  FaRegTrashAlt,
  FaReply,
  FaSearch,
  FaTimes,
  FaUsers,
} from 'react-icons/fa'
import AccountAvatar from '../../components/AccountAvatar/AccountAvatar'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { messagesApi, usersApi } from '../../services/api'
import './Messages.css'

const emptyCompose = { to: '', subject: '', text: '' }

const formatDate = (value, locale = 'en-GB') => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function Messages() {
  const { user } = useAuth()
  const { t, locale } = useLanguage()
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(() => Boolean(user?.id))
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState('inbox')
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [composeForm, setComposeForm] = useState(emptyCompose)
  const [isSending, setIsSending] = useState(false)
  const [viewedMessage, setViewedMessage] = useState(null)
  const composeRef = useRef(null)

  const accountName = user?.name || user?.username || 'Admin'
  const userId = user?.id

  useEffect(() => {
    if (!userId) return undefined

    let isMounted = true

    const loadMessages = async (isInitial = false) => {
      try {
        const { data } = await messagesApi.getAll(userId)
        if (!isMounted) return
        setInbox(data.inbox)
        setSent(data.sent)
      } catch {
        if (isMounted && isInitial) setError(t('messages.loadError'))
      } finally {
        if (isMounted && isInitial) setIsLoading(false)
      }
    }

    const loadContacts = async () => {
      try {
        const { data } = await usersApi.getAll()
        if (!isMounted) return
        setContacts(data.filter((item) => String(item.id) !== String(userId)))
      } catch {
        if (isMounted) setError(t('messages.contactsError'))
      }
    }

    loadMessages(true)
    loadContacts()
    const intervalId = setInterval(() => loadMessages(), 30 * 1000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [userId, t])

  const unreadCount = inbox.filter((item) => item.status === 'Unread').length

  const activeMessages = activeTab === 'inbox' ? inbox : sent

  const filteredMessages = useMemo(() => {
    const search = searchValue.trim().toLowerCase()

    return activeMessages.filter((item) => {
      const person = activeTab === 'inbox' ? item.from : item.to
      const matchesSearch =
        !search ||
        person.name.toLowerCase().includes(search) ||
        person.username.toLowerCase().includes(search) ||
        item.subject.toLowerCase().includes(search) ||
        item.text.toLowerCase().includes(search)
      const matchesStatus =
        activeTab !== 'inbox' || statusFilter === 'All Status' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [activeMessages, activeTab, searchValue, statusFilter])

  const updateCompose = (event) => {
    const { name, value } = event.target
    setComposeForm((prev) => ({ ...prev, [name]: value }))
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    if (!userId || isSending) return

    setError('')
    setNotice('')
    setIsSending(true)

    try {
      const { data } = await messagesApi.send({ from: userId, ...composeForm })
      setSent((prev) => [data, ...prev])
      setComposeForm(emptyCompose)
      setNotice(t('messages.sentTo', { name: data.to.name }))
    } catch (err) {
      setError(err.response?.data?.message || t('messages.sendError'))
    } finally {
      setIsSending(false)
    }
  }

  const openMessage = async (message) => {
    setViewedMessage(message)

    if (activeTab === 'inbox' && message.status === 'Unread') {
      try {
        const { data } = await messagesApi.markRead(message.id)
        setInbox((prev) => prev.map((item) => (item.id === data.id ? data : item)))
        setViewedMessage(data)
      } catch {
        /* status keyingi yangilanishda to'g'rilanadi */
      }
    }
  }

  const markRead = async (message) => {
    if (message.status === 'Read') return

    try {
      const { data } = await messagesApi.markRead(message.id)
      setInbox((prev) => prev.map((item) => (item.id === data.id ? data : item)))
    } catch {
      setError(t('messages.readError'))
    }
  }

  const deleteMessage = async (message) => {
    if (!window.confirm(t('messages.confirmDelete'))) return

    try {
      await messagesApi.remove(message.id)
      setInbox((prev) => prev.filter((item) => item.id !== message.id))
      setSent((prev) => prev.filter((item) => item.id !== message.id))
    } catch {
      setError(t('messages.deleteError'))
    }
  }

  const replyTo = (message) => {
    const recipient = message.from
    if (!recipient.id) return

    setActiveTab('inbox')
    setComposeForm({
      to: String(recipient.id),
      subject: message.subject ? `Re: ${message.subject.replace(/^Re:\s*/i, '')}` : '',
      text: '',
    })
    composeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stats = [
    { icon: <FaRegCommentDots />, tone: 'purple', title: t('messages.inbox'), value: inbox.length, text: t('messages.inboxText') },
    { icon: <FaEnvelopeOpen />, tone: 'orange', title: t('messages.unread'), value: unreadCount, text: t('messages.unreadText') },
    { icon: <FaRegCheckCircle />, tone: 'green', title: t('messages.sent'), value: sent.length, text: t('messages.sentText') },
    { icon: <FaUsers />, tone: 'red', title: t('messages.contacts'), value: contacts.length, text: t('messages.contactsText') },
  ]

  if (!userId) {
    return (
      <div className="messages-page">
        <header className="messages-header">
          <div>
            <h1>{t('messages.title')}</h1>
            <div className="messages-breadcrumb">
              <span>{t('nav.dashboard')}</span>
              <span>{t('messages.title')}</span>
            </div>
          </div>
          <div className="messages-header-actions">
            <LanguageSwitcher />
          </div>
        </header>
        <div className="messages-empty messages-panel">
          <FaInbox />
          <strong>{t('messages.loginPrompt')}</strong>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-page">
      <header className="messages-header">
        <div>
          <h1>{t('messages.title')}</h1>
          <div className="messages-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            <span>{t('messages.title')}</span>
          </div>
        </div>

        <div className="messages-header-actions">
          <LanguageSwitcher />
          <button type="button" aria-label="Search">
            <FaSearch />
          </button>
          <button type="button" className="messages-notification" aria-label="Notifications">
            <FaBell />
            {unreadCount ? <span>{unreadCount}</span> : null}
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
              <strong>{item.value.toLocaleString('en-US')}</strong>
              <small>{item.text}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="messages-panel messages-compose" ref={composeRef}>
        <h2>
          <FaPaperPlane />
          {t('messages.composeTitle')}
        </h2>

        {error ? <p className="messages-error">{error}</p> : null}
        {notice ? <p className="messages-notice">{notice}</p> : null}

        <form onSubmit={sendMessage}>
          <div className="messages-compose-grid">
            <label>
              {t('messages.to')}
              <select name="to" value={composeForm.to} onChange={updateCompose} required>
                <option value="">{t('messages.selectUser')}</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name || contact.username} ({contact.username})
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('messages.subject')}
              <input
                name="subject"
                value={composeForm.subject}
                onChange={updateCompose}
                placeholder={t('messages.subjectPlaceholder')}
                maxLength={120}
              />
            </label>
          </div>
          <label>
            {t('messages.text')}
            <textarea
              name="text"
              value={composeForm.text}
              onChange={updateCompose}
              placeholder={t('messages.textPlaceholder')}
              rows={4}
              required
            />
          </label>
          <button className="messages-send" type="submit" disabled={isSending}>
            <FaPaperPlane />
            {isSending ? t('messages.sending') : t('messages.send')}
          </button>
        </form>
      </section>

      <section className="messages-panel">
        <div className="messages-toolbar">
          <div className="messages-tabs">
            <button
              type="button"
              className={activeTab === 'inbox' ? 'active' : ''}
              onClick={() => setActiveTab('inbox')}
            >
              <FaInbox />
              {t('messages.inboxTab')}
              {unreadCount ? <b>{unreadCount}</b> : null}
            </button>
            <button
              type="button"
              className={activeTab === 'sent' ? 'active' : ''}
              onClick={() => setActiveTab('sent')}
            >
              <FaPaperPlane />
              {t('messages.sentTab')}
            </button>
          </div>

          <label className="messages-search">
            <FaSearch />
            <input
              type="search"
              placeholder={t('messages.searchPlaceholder')}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          {activeTab === 'inbox' ? (
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All Status">{t('users.allStatus')}</option>
              <option value="Unread">{t('msgStatus.Unread')}</option>
              <option value="Read">{t('msgStatus.Read')}</option>
            </select>
          ) : null}
        </div>

        <div className="messages-table-wrap">
          <table className="messages-table">
            <thead>
              <tr>
                <th>{activeTab === 'inbox' ? t('messages.thFrom') : t('messages.thTo')}</th>
                <th>{t('messages.thSubject')}</th>
                <th>{t('messages.thMessage')}</th>
                {activeTab === 'inbox' ? <th>{t('messages.thStatus')}</th> : null}
                <th>{t('messages.thDate')}</th>
                <th>{t('messages.thActions')}</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                filteredMessages.map((item) => {
                  const person = activeTab === 'inbox' ? item.from : item.to

                  return (
                    <tr key={item.id} className={item.status === 'Unread' && activeTab === 'inbox' ? 'row-unread' : ''}>
                      <td>
                        <div className="messages-profile">
                          <AccountAvatar src={person.avatar} name={person.name} size={34} />
                          <span>
                            <strong>{person.name}</strong>
                            <small>{person.username}</small>
                          </span>
                        </div>
                      </td>
                      <td>{item.subject || '-'}</td>
                      <td className="messages-preview">{item.text}</td>
                      {activeTab === 'inbox' ? (
                        <td>
                          <span className={`messages-badge status-${item.status.toLowerCase()}`}>{t(`msgStatus.${item.status}`)}</span>
                        </td>
                      ) : null}
                      <td>{formatDate(item.createdAt, locale)}</td>
                      <td>
                        <div className="messages-actions">
                          <button type="button" className="action-view" aria-label="View message" onClick={() => openMessage(item)}>
                            <FaEye />
                          </button>
                          {activeTab === 'inbox' ? (
                            <>
                              <button type="button" className="action-reply" aria-label="Reply message" onClick={() => replyTo(item)}>
                                <FaReply />
                              </button>
                              <button type="button" className="action-done" aria-label="Mark message as read" onClick={() => markRead(item)}>
                                <FaCheck />
                              </button>
                            </>
                          ) : null}
                          <button type="button" className="action-delete" aria-label="Delete message" onClick={() => deleteMessage(item)}>
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>

          {isLoading ? (
            <div className="messages-empty">
              <strong>{t('messages.loading')}</strong>
            </div>
          ) : null}
          {!isLoading && filteredMessages.length === 0 ? (
            <div className="messages-empty">
              <FaInbox />
              <strong>{activeTab === 'inbox' ? t('messages.noInbox') : t('messages.noSent')}</strong>
            </div>
          ) : null}
        </div>

        <footer className="messages-footer">
          <span>{t('messages.showing', { shown: filteredMessages.length, total: activeMessages.length })}</span>
        </footer>
      </section>

      {viewedMessage ? (
        <div className="messages-modal-backdrop" role="presentation" onMouseDown={() => setViewedMessage(null)}>
          <div className="messages-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button
              className="messages-modal-close"
              type="button"
              onClick={() => setViewedMessage(null)}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="messages-modal-head">
              <AccountAvatar
                src={(activeTab === 'inbox' ? viewedMessage.from : viewedMessage.to).avatar}
                name={(activeTab === 'inbox' ? viewedMessage.from : viewedMessage.to).name}
                size={48}
              />
              <div>
                <strong>{(activeTab === 'inbox' ? viewedMessage.from : viewedMessage.to).name}</strong>
                <small>{(activeTab === 'inbox' ? viewedMessage.from : viewedMessage.to).username}</small>
              </div>
            </div>

            <h3>{viewedMessage.subject || t('messages.noSubject')}</h3>
            <p className="messages-modal-date">{formatDate(viewedMessage.createdAt, locale)}</p>
            <p className="messages-modal-text">{viewedMessage.text}</p>

            {activeTab === 'inbox' && viewedMessage.from.id ? (
              <button
                className="messages-send"
                type="button"
                onClick={() => {
                  replyTo(viewedMessage)
                  setViewedMessage(null)
                }}
              >
                <FaReply />
                {t('messages.reply')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Messages
