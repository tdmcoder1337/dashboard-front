import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '../../../../components/Cards'
import './DashboardSection.css'

const statsCards = [
  {
    title: 'Foydalanuvchilar',
    subtitle: 'Jami foydalanuvchilar',
    icon: 'US',
    value: '1,234.00',
    change: '+12%',
    changeLabel: "Bugungi o'zgarish",
    accentColor: '#14b8a6',
    background: '#1f2d3d',
  },
  {
    title: 'Daromadlar',
    subtitle: 'Bu oy',
    icon: '$',
    value: '$ 45,231.00',
    change: '-2.5%',
    changeLabel: 'Oylik pasayish',
    accentColor: '#ef476f',
    background: '#1f2d3d',
  },
  {
    title: 'Buyurtmalar',
    subtitle: 'Faol buyurtmalar',
    icon: 'OR',
    value: '$ 543,23.00',
    change: '+8%',
    changeLabel: "Bugungi o'zgarish",
    accentColor: '#f59e0b',
    background: '#1f2d3d',
  },
  {
    title: 'Konversiya',
    subtitle: "O'z muddatida",
    icon: 'CV',
    value: '3.2%',
    change: '+0.5%',
    changeLabel: 'Samaradorlik oshdi',
    accentColor: '#ffffff',
    background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
    isConversion: true,
    progress: 68,
  },
]

const activityItems = [
  {
    icon: 'HR',
    title: 'Henry Rashford',
    subtitle: 'Premium app',
    amount: '$129.00',
    color: '#22c55e',
  },
  {
    icon: 'JC',
    title: 'Josh Clifford',
    subtitle: 'Premium app',
    amount: '$49.00',
    color: '#f59e0b',
  },
  {
    icon: 'MJ',
    title: 'Marie Jones',
    subtitle: 'Premium app',
    amount: '$69.99',
    color: '#ef4444',
  },
  {
    icon: 'MW',
    title: 'Manuel Wilkes',
    subtitle: 'Basic app',
    amount: '$18.00',
    color: '#38bdf8',
  },
  {
    icon: 'PC',
    title: 'Peter Crouch',
    subtitle: '2 days ago',
    amount: '$256.00',
    color: '#a855f7',
  },
]

const salesAnalytics = [
  { month: 'Jan', marketing: 2, online: 1 },
  { month: 'Feb', marketing: 18, online: 4 },
  { month: 'Mar', marketing: 6, online: 5 },
  { month: 'Apr', marketing: 10, online: 12 },
  { month: 'May', marketing: 12, online: 7 },
  { month: 'Jun', marketing: 16, online: 9 },
  { month: 'Jul', marketing: 13, online: 11 },
  { month: 'Aug', marketing: 8, online: 15 },
  { month: 'Sep', marketing: 10, online: 11 },
  { month: 'Oct', marketing: 12, online: 9 },
  { month: 'Nov', marketing: 13, online: 10 },
  { month: 'Dec', marketing: 13, online: 3 },
]




function DashboardSection() {
  return (
    <section className="dashboard-section">
      <div className="stats-container">
        {statsCards.map((card) => (
          <Card
            key={card.title}
            className={`stats-card ${card.isConversion ? 'conversion-card' : ''}`}
            style={{
              '--card-bg': card.background,
              '--card-accent': card.accentColor,
              '--progress': `${card.progress || 0}%`,
            }}
          >
            <div className="stats-card-content">
              <div className="stats-card-top">
                <span className="stats-icon">{card.icon}</span>
                <span className="stats-change">{card.change}</span>
              </div>

              <p className="stats-title">{card.title}</p>
              <h2 className="stats-value">{card.value}</h2>
              <p className="stats-caption">{card.changeLabel}</p>

              {card.isConversion && (
                <div
                  className="conversion-circle"
                  aria-label={`Konversiya samaradorligi ${card.progress}%`}
                >
                  <div className="conversion-circle-inner">
                    <span>{card.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="detailed-card">
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-header">
              <div className="analytics-title-wrap">
                <h3>Sales Analytics</h3>
                <div className="chart-legend">
                  <span>
                    <i className="legend-dot marketing-dot" />
                    Marketing Sales
                  </span>
                  <span>
                    <i className="legend-dot online-dot" />
                    Online Sales
                  </span>
                </div>
              </div>
              <button className="period-button" type="button">This Year</button>
            </div>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesAnalytics} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'rgba(255, 255, 255, 0.52)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255, 255, 255, 0.52)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1f2d3d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="marketing"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="online"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-sales-card">
            <div className="recent-sales-header">
              <h3>Recent Sales</h3>
              <button className="more-button" type="button">...</button>
            </div>

            <div className="recent-sales-list">
              {activityItems.map((item) => (
                <div className="recent-sale-item" key={item.title}>
                  <span className="sale-avatar" style={{ '--avatar-color': item.color }}>
                    {item.icon}
                  </span>
                  <div className="sale-info">
                    <p>{item.title}</p>
                    <span>{item.subtitle}</span>
                  </div>
                  <strong>{item.amount}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default DashboardSection
