import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SOSAlertsPanel = ({ 
  onAlertSelect = () => {}, 
  onAlertAction = () => {},
  className = '' 
}) => {
  const [alerts, setAlerts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock SOS alerts data
  const mockAlerts = [
    {
      id: 'SOS001',
      victim: 'Sarah Johnson',
      location: 'Manhattan, NY',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      description: 'Severe injury from building collapse, needs immediate medical attention',
      timestamp: new Date(Date.now() - 300000),
      priority: 'critical',
      type: 'medical',
      distance: '0.8 miles',
      status: 'active',
      responders: 2,
      estimatedArrival: '5 mins'
    },
    {
      id: 'SOS002',
      victim: 'David Park',
      location: 'Central Park, NY',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      description: 'Trapped in basement due to flooding, water level rising',
      timestamp: new Date(Date.now() - 600000),
      priority: 'critical',
      type: 'rescue',
      distance: '1.2 miles',
      status: 'active',
      responders: 1,
      estimatedArrival: '8 mins'
    },
    {
      id: 'SOS003',
      victim: 'Maria Garcia',
      location: 'Brooklyn Bridge, NY',
      coordinates: { lat: 40.7061, lng: -73.9969 },
      description: 'Heart attack symptoms, needs immediate medical assistance',
      timestamp: new Date(Date.now() - 900000),
      priority: 'critical',
      type: 'medical',
      distance: '2.1 miles',
      status: 'responding',
      responders: 3,
      estimatedArrival: '12 mins'
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAlerts(prev => prev?.map(alert => ({
        ...alert,
        timestamp: alert?.timestamp // Keep original timestamp
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'rescue': return 'Shield';
      case 'fire': return 'Flame';
      case 'accident': return 'AlertTriangle';
      default: return 'AlertCircle';
    }
  };

  const handleRespond = (alert) => {
    onAlertAction({ type: 'respond', alert });
    console.log('Responding to SOS:', alert?.id);
  };

  const handleViewLocation = (alert) => {
    onAlertSelect(alert);
    console.log('Viewing location for:', alert?.id);
  };

  const activeAlerts = alerts?.filter(alert => alert?.status === 'active');
  const displayAlerts = isExpanded ? alerts : alerts?.slice(0, 3);

  return (
    <div className={`bg-surface border border-border rounded-lg emergency-shadow ${className}`}>
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-error animate-pulse" />
            <h3 className="font-semibold text-foreground">SOS Alerts</h3>
            {activeAlerts?.length > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full animate-pulse">
                {activeAlerts?.length} Active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconSize={14}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              iconName="RotateCcw"
              iconSize={14}
              onClick={() => console.log('Refresh alerts')}
            />
          </div>
        </div>
      </div>
      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {displayAlerts?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No Active SOS Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Emergency alerts will appear here when victims need immediate help
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {displayAlerts?.map((alert, index) => (
              <div
                key={alert?.id}
                className={`border rounded-lg p-4 emergency-transition hover:emergency-shadow-lg ${
                  alert?.status === 'active' ?'border-error/50 bg-error/5 animate-pulse-slow' :'border-border bg-surface'
                }`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                      <Icon 
                        name={getTypeIcon(alert?.type)} 
                        size={20} 
                        className="text-error" 
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{alert?.victim}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.location}</span>
                        <span>•</span>
                        <span>{alert?.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                      <Icon name="Clock" size={12} />
                      <span>{getTimeAgo(alert?.timestamp)}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      alert?.status === 'active' ?'bg-error text-error-foreground' :'bg-warning text-warning-foreground'
                    }`}>
                      {alert?.status}
                    </span>
                  </div>
                </div>

                {/* Alert Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {alert?.description}
                </p>

                {/* Alert Stats */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={12} className="text-primary" />
                      <span className="text-primary font-medium">{alert?.responders} responding</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Navigation" size={12} className="text-muted-foreground" />
                      <span className="text-muted-foreground">ETA: {alert?.estimatedArrival}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-error">
                    <Icon name="AlertCircle" size={12} />
                    <span className="font-medium">{alert?.priority?.toUpperCase()}</span>
                  </div>
                </div>

                {/* Alert Actions */}
                <div className="flex items-center space-x-2">
                  {alert?.status === 'active' && (
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => handleRespond(alert)}
                      iconName="UserPlus"
                      iconPosition="left"
                      iconSize={12}
                      className="flex-1"
                    >
                      Respond Now
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleViewLocation(alert)}
                    iconName="MapPin"
                    iconPosition="left"
                    iconSize={12}
                    className={alert?.status === 'active' ? '' : 'flex-1'}
                  >
                    View Location
                  </Button>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => console.log('Contact victim:', alert?.id)}
                    iconName="Phone"
                    iconSize={12}
                  />
                </div>

                {/* Priority Indicator */}
                {alert?.priority === 'critical' && (
                  <div className="mt-2 pt-2 border-t border-error/20">
                    <div className="flex items-center space-x-2 text-xs text-error">
                      <Icon name="Zap" size={12} className="animate-pulse" />
                      <span className="font-medium">CRITICAL: Immediate response required</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Quick Stats Footer */}
      {alerts?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                <span className="text-muted-foreground">{activeAlerts?.length} Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-muted-foreground">
                  {alerts?.filter(a => a?.status === 'responding')?.length} Responding
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Shield" size={12} />
              <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSAlertsPanel;