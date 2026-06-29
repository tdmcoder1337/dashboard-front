import { useState } from 'react'
import './AccountAvatar.css'

const getInitial = (name) => {
  const fallback = 'Admin'
  const value = String(name || fallback).trim()
  return (value[0] || fallback[0]).toUpperCase()
}

function AccountAvatar({ src, name, className = '', size = 38 }) {
  const [failedSrc, setFailedSrc] = useState('')
  const avatarName = name || 'Admin'
  const style = { '--avatar-size': `${size}px` }
  const shouldShowImage = src && failedSrc !== src

  if (shouldShowImage) {
    return (
      <img
        className={`account-avatar ${className}`.trim()}
        src={src}
        alt={avatarName}
        style={style}
        onError={() => setFailedSrc(src)}
      />
    )
  }

  return (
    <span className={`account-avatar account-avatar-initial ${className}`.trim()} style={style} aria-label={avatarName}>
      {getInitial(avatarName)}
    </span>
  )
}

export default AccountAvatar
