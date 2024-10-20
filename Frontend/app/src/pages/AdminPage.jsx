import React, { useState } from "react";
import "../css/AdminPage.css";

const Dashboard = () => {
  const [period, setPeriod] = useState("");

  const lastOrders = [
    { id: 1, customer: "John Doe", total: "$100", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "$250", status: "Pending" },
    { id: 3, customer: "Sam Wilson", total: "$175", status: "Shipped" },
    { id: 4, customer: "Anna Lee", total: "$80", status: "Completed" },
    { id: 5, customer: "Mike Johnson", total: "$120", status: "Cancelled" },
  ];

  const lastSearchTerms = [
    { id: 1, term: "laptop", results: 25 },
    { id: 2, term: "phone", results: 40 },
    { id: 3, term: "headphones", results: 10 },
    { id: 4, term: "camera", results: 5 },
    { id: 5, term: "tablet", results: 15 },
  ];

  const topSearchTerms = [
    { id: 1, term: "phone", searches: 150 },
    { id: 2, term: "laptop", searches: 120 },
    { id: 3, term: "camera", searches: 95 },
    { id: 4, term: "tablet", searches: 80 },
    { id: 5, term: "headphones", searches: 50 },
  ];

  const totals = {
    totalRevenue: "$12,500",
    totalOrders: 45,
    totalCustomers: 30,
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h3>Admin Dashboard</h3>
      </div>

      <div>
        <label htmlFor="period">Select Period:</label>
        <select id="period" onChange={handlePeriodChange}>
          <option value="1">Last Week</option>
          <option value="2">Last Month</option>
          <option value="3">Last Year</option>
        </select>
      </div>

      <div className="dashboard-sections">
        {/* Last 5 Orders */}
        <div className="entry-edit">
          <h4>Last 5 Orders</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lastOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Last 5 Search Terms */}
        <div className="entry-edit">
          <h4>Last 5 Search Terms</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Search Term</th>
                <th>Results</th>
              </tr>
            </thead>
            <tbody>
              {lastSearchTerms.map((term) => (
                <tr key={term.id}>
                  <td>{term.id}</td>
                  <td>{term.term}</td>
                  <td>{term.results}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top 5 Search Terms */}
        <div className="entry-edit">
          <h4>Top 5 Search Terms</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Search Term</th>
                <th>Searches</th>
              </tr>
            </thead>
            <tbody>
              {topSearchTerms.map((term) => (
                <tr key={term.id}>
                  <td>{term.id}</td>
                  <td>{term.term}</td>
                  <td>{term.searches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="entry-edit">
          <h4>Totals</h4>
          <p>
            <strong>Total Revenue:</strong> {totals.totalRevenue}
          </p>
          <p>
            <strong>Total Orders:</strong> {totals.totalOrders}
          </p>
          <p>
            <strong>Total Customers:</strong> {totals.totalCustomers}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
