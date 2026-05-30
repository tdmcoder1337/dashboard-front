import React from 'react'
import DashboardHeader from './components/DashboardHeader/DashboardHeader'
import DashboardSection from './components/DashboardSection/DashboardSection'
import './Dashboard.css'
import DashboardFooter from './components/DashboardFooter/DashboardFooter'
import Products from './components/DashboardSection/ProductsTable/products-table'


function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <DashboardHeader />
        <DashboardSection />
        <Products />
        

        {/* <DashboardFooter /> */}
      </div>
    </div>
  )
}

export default Dashboard
