import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminAnalytics = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('requests');

  // Mock analytics data
  const requestsData = [
    { name: 'Mon', total: 45, solved: 38, pending: 7, inProgress: 12, rejected: 3 },
    { name: 'Tue', total: 52, solved: 41, pending: 11, inProgress: 15, rejected: 2 },
    { name: 'Wed', total: 38, solved: 32, pending: 6, inProgress: 8, rejected: 4 },
    { name: 'Thu', total: 61, solved: 48, pending: 13, inProgress: 18, rejected: 5 },
    { name: 'Fri', total: 43, solved: 35, pending: 8, inProgress: 11, rejected: 3 },
    { name: 'Sat', total: 29, solved: 24, pending: 5, inProgress: 7, rejected: 2 },
    { name: 'Sun', total: 35, solved: 28, pending: 7, inProgress: 9, rejected: 1 }
  ];

  const statusDistribution = [
    { name: 'Completed', value: 246, color: '#4CAF50' },
    { name: 'In Progress', value: 80, color: '#FF7043' },
    { name: 'Pending', value: 57, color: '#FF9800' },
    { name: 'Rejected', value: 20, color: '#757575' }
  ];

  const volunteerPerformance = [
    { name: 'John Smith', completed: 15, rating: 4.8, responseTime: 8 },
    { name: 'Emily Davis', completed: 23, rating: 4.9, responseTime: 6 },
    { name: 'Michael Rodriguez', completed: 8, rating: 4.6, responseTime: 12 },
    { name: 'Sarah Wilson', completed: 19, rating: 4.7, responseTime: 9 },
    { name: 'David Chen', completed: 12, rating: 4.5, responseTime: 11 }
  ];

  const responseTimeData = [
    { time: '00:00', avgTime: 12, critical: 5, normal: 15 },
    { time: '04:00', avgTime: 8, critical: 3, normal: 10 },
    { time: '08:00', avgTime: 15, critical: 8, normal: 18 },
    { time: '12:00', avgTime: 18, critical: 12, normal: 22 },
    { time: '16:00', avgTime: 14, critical: 7, normal: 17 },
    { time: '20:00', avgTime: 11, critical: 4, normal: 14 }
  ];

  const summaryStats = {
    totalRequests: 403,
    solvedRequests: 246,
    activeVolunteers: 28,
    avgResponseTime: '12 min',
    criticalRequests: 15,
    satisfactionRate: 4.7
  };

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const metricOptions = [
    { value: 'requests', label: 'Requests', icon: 'FileText' },
    { value: 'volunteers', label: 'Volunteers', icon: 'Users' },
    { value: 'response', label: 'Response Time', icon: 'Clock' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 emergency-shadow">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            {timeRangeOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Requests</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{summaryStats?.totalRequests}</div>
          <div className="text-xs text-success">+12% from last week</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Solved</span>
          </div>
          <div className="text-2xl font-bold text-success">{summaryStats?.solvedRequests}</div>
          <div className="text-xs text-success">+8% from last week</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Active Volunteers</span>
          </div>
          <div className="text-2xl font-bold text-secondary">{summaryStats?.activeVolunteers}</div>
          <div className="text-xs text-success">+3 new this week</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Avg Response</span>
          </div>
          <div className="text-2xl font-bold text-accent">{summaryStats?.avgResponseTime}</div>
          <div className="text-xs text-success">-2min improvement</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="text-2xl font-bold text-error">{summaryStats?.criticalRequests}</div>
          <div className="text-xs text-warning">5 pending</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 emergency-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="text-sm text-muted-foreground">Satisfaction</span>
          </div>
          <div className="text-2xl font-bold text-warning">{summaryStats?.satisfactionRate}</div>
          <div className="text-xs text-success">+0.2 from last month</div>
        </div>
      </div>
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Overview */}
        <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-card-foreground">Requests Overview</h4>
            <div className="flex space-x-2">
              {metricOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => setSelectedMetric(option?.value)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium emergency-transition
                    ${selectedMetric === option?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  <Icon name={option?.icon} size={14} className="inline mr-1" />
                  {option?.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" fill="#4CAF50" name="Solved" />
                <Bar dataKey="inProgress" fill="#FF7043" name="In Progress" />
                <Bar dataKey="pending" fill="#FF9800" name="Pending" />
                <Bar dataKey="rejected" fill="#757575" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
          <h4 className="text-lg font-semibold text-card-foreground mb-4">Status Distribution</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusDistribution?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
                <span className="text-sm font-medium text-foreground">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Response Time Analysis */}
      <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
        <h4 className="text-lg font-semibold text-card-foreground mb-4">Response Time Analysis</h4>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#1565C0" 
                strokeWidth={2}
                name="Average Time (min)"
              />
              <Line 
                type="monotone" 
                dataKey="critical" 
                stroke="#F44336" 
                strokeWidth={2}
                name="Critical Requests (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Volunteer Performance */}
      <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-card-foreground">Top Volunteer Performance</h4>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconSize={16}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {volunteerPerformance?.map((volunteer, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{volunteer?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {volunteer?.completed} tasks completed
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-warning">
                  <Icon name="Star" size={14} />
                  <span className="text-sm font-medium">{volunteer?.rating}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {volunteer?.responseTime}min avg
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;