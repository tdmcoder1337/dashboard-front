import React, { useEffect } from 'react'
import './CardDetails.css'

export default function CardDetails({ open, data, onClose }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !data) return null

  return (
    <div className="cd-overlay" onClick={onClose}>
      <div className="cd-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cd-close" onClick={onClose} aria-label="Close">×</button>
        {data.image ? <img className="cd-image" src={data.image} alt={data.title} /> : null}
        <h2 className="cd-title">{data.title}</h2>
        <p className="cd-desc">{data.subtitle || data.description || data.preview}</p>
        {data.price ? (
          <p className="cd-value">Narxi: {data.price}</p>
        ) : null}
        {data.oldPrice ? (
          <p className="cd-oldprice">Oldingi narx: {data.oldPrice}</p>
        ) : null}
        {data.rating ? (
          <p className="cd-meta">Reyting: {data.rating} • Sotilgan: {data.sold}</p>
        ) : null}
      </div>
    </div>
  )
}
