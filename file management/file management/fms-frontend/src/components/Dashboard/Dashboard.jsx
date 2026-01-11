import React from 'react'
import StatsCard from './StatsCard'
import RecentActivity from './RecentActivity'

export default function Dashboard() {
  return (
    <section>
      <h2>Dashboard</h2>
      <StatsCard />
      <RecentActivity />
    </section>
  )
}
