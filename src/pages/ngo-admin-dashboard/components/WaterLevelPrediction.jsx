import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const WaterLevelPrediction = ({ className = '' }) => {
  const [selectedLocation, setSelectedLocation] = useState('manhattan');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [predictionRange, setPredictionRange] = useState('24h');

  // Mock water level prediction data
  const waterLevelData = {
    manhattan: [
      { time: '00:00', current: 2.1, predicted: 2.3, critical: 4.0, warning: 3.0 },
      { time: '03:00', current: 2.3, predicted: 2.8, critical: 4.0, warning: 3.0 },
      { time: '06:00', current: 2.8, predicted: 3.2, critical: 4.0, warning: 3.0 },
      { time: '09:00', current: 3.2, predicted: 3.8, critical: 4.0, warning: 3.0 },
      { time: '12:00', current: 3.8, predicted: 4.2, critical: 4.0, warning: 3.0 },
      { time: '15:00', current: 4.2, predicted: 4.5, critical: 4.0, warning: 3.0 },
      { time: '18:00', current: 4.5, predicted: 4.1, critical: 4.0, warning: 3.0 },
      { time: '21:00', current: 4.1, predicted: 3.6, critical: 4.0, warning: 3.0 }
    ],
    brooklyn: [
      { time: '00:00', current: 1.8, predicted: 2.0, critical: 3.5, warning: 2.8 },
      { time: '03:00', current: 2.0, predicted: 2.4, critical: 3.5, warning: 2.8 },
      { time: '06:00', current: 2.4, predicted: 2.9, critical: 3.5, warning: 2.8 },
      { time: '09:00', current: 2.9, predicted: 3.3, critical: 3.5, warning: 2.8 },
      { time: '12:00', current: 3.3, predicted: 3.6, critical: 3.5, warning: 2.8 },
      { time: '15:00', current: 3.6, predicted: 3.4, critical: 3.5, warning: 2.8 },
      { time: '18:00', current: 3.4, predicted: 3.0, critical: 3.5, warning: 2.8 },
      { time: '21:00', current: 3.0, predicted: 2.6, critical: 3.5, warning: 2.8 }
    ]
  };

  const locations = [
    { value: 'manhattan', label: 'Manhattan', status: 'critical' },
    { value: 'brooklyn', label: 'Brooklyn', status: 'warning' },
    { value: 'queens', label: 'Queens', status: 'normal' },
    { value: 'bronx', label: 'Bronx', status: 'normal' }
  ];

  const alerts = [
    {
      id: 1,
      location: 'Manhattan - East River',
      level: 'critical',
      message: 'Water level expected to exceed critical threshold in 3 hours',
      timestamp: new Date(Date.now() - 300000),
      recipients: 156,
      status: 'sent'
    },
    {
      id: 2,
      location: 'Brooklyn - Gowanus Canal',
      level: 'warning',
      message: 'Rising water levels detected, monitor closely',
      timestamp: new Date(Date.now() - 900000),
      recipients: 89,
      status: 'sent'
    },
    {
      id: 3,
      location: 'Queens - Flushing Bay',
      level: 'info',
      message: 'Water levels stable, no immediate concern',
      timestamp: new Date(Date.now() - 1800000),
      recipients: 45,
      status: 'scheduled'
    }
  ];

  const currentData = waterLevelData?.[selectedLocation] || waterLevelData?.manhattan;
  const currentLevel = currentData?.[currentData?.length - 1]?.current || 0;
  const predictedPeak = Math.max(...currentData?.map(d => d?.predicted));
  const criticalThreshold = currentData?.[0]?.critical || 4.0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-error bg-error/10 border-error/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'normal': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 emergency-shadow">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}m
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleSendAlert = (location, level) => {
    console.log(`Sending ${level} alert for ${location}`);
    // Simulate SMS alert sending
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Waves" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Water Level Prediction</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">SMS Alerts</span>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full emergency-transition
                ${alertsEnabled ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white emergency-transition
                  ${alertsEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Location Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {locations?.map((location) => (
          <div
            key={location?.value}
            onClick={() => setSelectedLocation(location?.value)}
            className={`
              p-4 border rounded-lg cursor-pointer emergency-transition
              ${selectedLocation === location?.value 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{location?.label}</h4>
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium border
                ${getStatusColor(location?.status)}
              `}>
                {location?.status}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Level</span>
                <span className="font-medium">
                  {location?.value === selectedLocation ? `${currentLevel}m` : '2.1m'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Predicted Peak</span>
                <span className="font-medium text-warning">
                  {location?.value === selectedLocation ? `${predictedPeak?.toFixed(1)}m` : '4.2m'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Main Prediction Chart */}
      <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-card-foreground">
            Water Level Prediction - {locations?.find(l => l?.value === selectedLocation)?.label}
          </h4>
          
          <div className="flex space-x-2">
            {['12h', '24h', '48h', '7d']?.map((range) => (
              <button
                key={range}
                onClick={() => setPredictionRange(range)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium emergency-transition
                  ${predictionRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7043" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF7043" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Critical and Warning Lines */}
              <Line 
                type="monotone" 
                dataKey="critical" 
                stroke="#F44336" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Critical Level"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="warning" 
                stroke="#FF9800" 
                strokeWidth={2}
                strokeDasharray="3 3"
                name="Warning Level"
                dot={false}
              />
              
              {/* Current and Predicted Areas */}
              <Area
                type="monotone"
                dataKey="current"
                stroke="#1565C0"
                strokeWidth={3}
                fill="url(#currentGradient)"
                name="Current Level"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#FF7043"
                strokeWidth={3}
                fill="url(#predictedGradient)"
                name="Predicted Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Current Level</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">AI Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-warning"></div>
            <span className="text-sm text-muted-foreground">Warning Threshold</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-error"></div>
            <span className="text-sm text-muted-foreground">Critical Threshold</span>
          </div>
        </div>
      </div>
      {/* Alert Management */}
      <div className="bg-card border border-border rounded-lg p-6 emergency-shadow">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-card-foreground">SMS Alert Management</h4>
          <Button
            variant="default"
            size="sm"
            iconName="Send"
            iconPosition="left"
            iconSize={16}
            onClick={() => handleSendAlert(selectedLocation, 'warning')}
          >
            Send Alert
          </Button>
        </div>

        <div className="space-y-4">
          {alerts?.map((alert) => (
            <div
              key={alert?.id}
              className="flex items-start space-x-4 p-4 border border-border rounded-lg"
            >
              <div className={`
                p-2 rounded-full
                ${alert?.level === 'critical' ? 'bg-error/10' : 
                  alert?.level === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}
              `}>
                <Icon 
                  name={getAlertIcon(alert?.level)} 
                  size={16} 
                  className={
                    alert?.level === 'critical' ? 'text-error' : 
                    alert?.level === 'warning' ? 'text-warning' : 'text-primary'
                  }
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-foreground">{alert?.location}</h5>
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${alert?.status === 'sent' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                    `}>
                      {alert?.status}
                    </span>
                    <span className="text-xs text-muted-foreground font-data">
                      {formatTimestamp(alert?.timestamp)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Users" size={14} />
                    <span>{alert?.recipients} recipients</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      iconSize={14}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Copy"
                      iconSize={14}
                    >
                      Duplicate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterLevelPrediction;