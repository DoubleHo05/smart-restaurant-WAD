import { useState, useEffect } from "react";
import "./Dashboard.css";

// SVG Icon Components
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChefHatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const RestaurantIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  iconBg: string;
  iconColor: string;
}

interface TopItem {
  rank: number;
  icon: React.ReactNode;
  name: string;
  orders: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  table: string;
  items: number;
  total: number;
  status: "preparing" | "ready" | "completed" | "pending";
  time: string;
}

export default function Dashboard() {
  const [stats] = useState<StatCard[]>([
    {
      icon: <DollarIcon />,
      value: "$2,458",
      label: "Today's Revenue",
      change: "↑ 12% from yesterday",
      changeType: "positive",
      iconBg: "#e8f8f5",
      iconColor: "#27ae60",
    },
    {
      icon: <ShoppingBagIcon />,
      value: "48",
      label: "Orders Today",
      change: "↑ 8% from yesterday",
      changeType: "positive",
      iconBg: "#ebf5fb",
      iconColor: "#3498db",
    },
    {
      icon: <UsersIcon />,
      value: "12/20",
      label: "Tables Occupied",
      change: "60% occupancy",
      changeType: "neutral",
      iconBg: "#fef9e7",
      iconColor: "#f39c12",
    },
    {
      icon: <ClockIcon />,
      value: "18 min",
      label: "Avg. Prep Time",
      change: "↑ 2 min from target",
      changeType: "negative",
      iconBg: "#fdedec",
      iconColor: "#e74c3c",
    },
  ]);

  const [topItems] = useState<TopItem[]>([
    { rank: 1, icon: <ChefHatIcon />, name: "Grilled Salmon", orders: 124, revenue: 2232 },
    { rank: 2, icon: <RestaurantIcon />, name: "Pasta Carbonara", orders: 98, revenue: 1470 },
    { rank: 3, icon: <ChefHatIcon />, name: "Beef Steak", orders: 76, revenue: 1900 },
    { rank: 4, icon: <RestaurantIcon />, name: "Caesar Salad", orders: 65, revenue: 780 },
  ]);

  const [recentOrders] = useState<RecentOrder[]>([
    {
      id: "#ORD-0048",
      table: "Table 5",
      items: 3,
      total: 67.5,
      status: "preparing",
      time: "2 min ago",
    },
    {
      id: "#ORD-0047",
      table: "Table 12",
      items: 5,
      total: 124.0,
      status: "preparing",
      time: "8 min ago",
    },
    {
      id: "#ORD-0046",
      table: "Table 3",
      items: 2,
      total: 45.0,
      status: "ready",
      time: "15 min ago",
    },
    {
      id: "#ORD-0045",
      table: "Table 8",
      items: 4,
      total: 89.0,
      status: "completed",
      time: "25 min ago",
    },
  ]);

  const [chartFilter, setChartFilter] = useState("This Week");
  const weekData = [
    { day: "Mon", height: 60 },
    { day: "Tue", height: 75 },
    { day: "Wed", height: 45 },
    { day: "Thu", height: 90 },
    { day: "Fri", height: 85 },
    { day: "Sat", height: 100 },
    { day: "Sun", height: 70 },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">📺 Open KDS</button>
          <button className="btn-primary">+ New Order</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div
              className="stat-icon"
              style={{ background: stat.iconBg, color: stat.iconColor }}
            >
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue This Week</h3>
            <select
              className="chart-filter"
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
            >
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {weekData.map((data, index) => (
                <div
                  key={index}
                  className={`bar ${data.day === "Sat" ? "active" : ""}`}
                  style={{ height: `${data.height}%` }}
                >
                  <span>{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Selling Items</h3>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="top-items">
            {topItems.map((item) => (
              <div key={item.rank} className="top-item">
                <span className="top-rank">{item.rank}</span>
                <span className="top-icon">{item.icon}</span>
                <div className="top-info">
                  <div className="top-name">{item.name}</div>
                  <div className="top-stats">
                    {item.orders} orders | ${item.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="table-card">
        <div className="table-header">
          <h3>Recent Orders</h3>
          <a href="/orders" className="view-all">
            View All Orders →
          </a>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.table}</td>
                <td>{order.items} items</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td>{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
