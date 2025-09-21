import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ 
  onMarkerClick = () => {}, 
  selectedRequest = null,
  className = '' 
}) => {
  const [mapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // New York City
  const [zoomLevel] = useState(12);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock victim requests and SOS alerts with locations
  const mapRequests = [
    {
      id: 'REQ001',
      type: 'medical',
      priority: 'critical',
      status: 'pending',
      location: { lat: 40.7589, lng: -73.9851 },
      victim: 'Sarah Johnson',
      description: 'Severe injury from building collapse, needs immediate medical attention',
      timestamp: new Date(Date.now() - 300000),
      estimatedTime: '15 mins',
      isSOS: true
    },
    {
      id: 'REQ002',
      type: 'shelter',
      priority: 'high',
      status: 'assigned',
      location: { lat: 40.7505, lng: -73.9934 },
      victim: 'Michael Rodriguez',
      description: 'Family of 4 needs temporary shelter after flood damage',
      timestamp: new Date(Date.now() - 900000),
      estimatedTime: '30 mins',
      assignedTo: 'John Volunteer',
      isSOS: false
    },
    {
      id: 'REQ003',
      type: 'supplies',
      priority: 'medium',
      status: 'in-progress',
      location: { lat: 40.7282, lng: -74.0776 },
      victim: 'Emma Chen',
      description: 'Need food and water supplies for elderly residents',
      timestamp: new Date(Date.now() - 1800000),
      estimatedTime: '45 mins',
      assignedTo: 'Current User',
      isSOS: false
    },
    {
      id: 'REQ004',
      type: 'rescue',
      priority: 'critical',
      status: 'pending',
      location: { lat: 40.7614, lng: -73.9776 },
      victim: 'David Park',
      description: 'Trapped in basement due to flooding, water level rising',
      timestamp: new Date(Date.now() - 600000),
      estimatedTime: '10 mins',
      isSOS: true
    },
    {
      id: 'REQ005',
      type: 'medical',
      priority: 'high',
      status: 'completed',
      location: { lat: 40.7411, lng: -74.0018 },
      victim: 'Lisa Thompson',
      description: 'Diabetic patient needs insulin supply',
      timestamp: new Date(Date.now() - 3600000),
      estimatedTime: 'Completed',
      completedBy: 'Jane Volunteer',
      isSOS: false
    }
  ];

  const getMarkerColor = (request) => {
    if (request?.isSOS) return '#F44336'; // Red for SOS
    switch (request?.status) {
      case 'pending': return '#FF9800'; // Orange
      case 'assigned': return '#1565C0'; // Blue
      case 'in-progress': return '#FF7043'; // Coral
      case 'completed': return '#4CAF50'; // Green
      default: return '#757575'; // Gray
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'shelter': return 'Home';
      case 'supplies': return 'Package';
      case 'rescue': return 'Shield';
      default: return 'MapPin';
    }
  };

  const filteredRequests = mapRequests?.filter(request => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'sos') return request?.isSOS;
    if (activeFilter === 'pending') return request?.status === 'pending';
    if (activeFilter === 'assigned') return request?.status === 'assigned';
    return request?.type === activeFilter;
  });

  const handleMarkerClick = (request) => {
    onMarkerClick(request);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg emergency-shadow h-full flex flex-col ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Live Response Map</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Users" size={16} />
            <span>{filteredRequests?.length} requests</span>
          </div>
        </div>

        {/* Map Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', icon: 'Map' },
            { key: 'sos', label: 'SOS', icon: 'AlertTriangle' },
            { key: 'pending', label: 'Pending', icon: 'Clock' },
            { key: 'assigned', label: 'Assigned', icon: 'UserCheck' },
            { key: 'medical', label: 'Medical', icon: 'Heart' },
            { key: 'shelter', label: 'Shelter', icon: 'Home' }
          ]?.map(filter => (
            <Button
              key={filter?.key}
              variant={activeFilter === filter?.key ? "default" : "outline"}
              size="xs"
              onClick={() => setActiveFilter(filter?.key)}
              iconName={filter?.icon}
              iconPosition="left"
              iconSize={14}
              className="emergency-transition"
            >
              {filter?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Map Container */}
      <div className="flex-1 relative bg-muted/30">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Volunteer Response Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="rounded-b-lg"
        />

        {/* Map Overlay with Request Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredRequests?.map((request, index) => (
            <div
              key={request?.id}
              className="absolute pointer-events-auto cursor-pointer emergency-transition hover:scale-110"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${20 + (index * 12) % 50}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleMarkerClick(request)}
            >
              {/* Marker */}
              <div 
                className={`w-8 h-8 rounded-full border-2 border-white emergency-shadow-lg flex items-center justify-center ${
                  request?.isSOS ? 'animate-pulse-slow' : ''
                } ${selectedRequest?.id === request?.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                style={{ backgroundColor: getMarkerColor(request) }}
              >
                <Icon 
                  name={getTypeIcon(request?.type)} 
                  size={16} 
                  color="white" 
                />
              </div>

              {/* Priority Indicator */}
              {request?.priority === 'critical' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border border-white animate-pulse" />
              )}

              {/* Request Info Tooltip */}
              {selectedRequest?.id === request?.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-surface border border-border rounded-lg emergency-shadow-lg p-3 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">{request?.victim}</span>
                    <div className="flex items-center space-x-1">
                      {request?.isSOS && (
                        <Icon name="AlertTriangle" size={14} className="text-error animate-pulse" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request?.priority === 'critical' ? 'bg-error/10 text-error' :
                        request?.priority === 'high'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                      }`}>
                        {request?.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{request?.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{request?.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span className="font-data">
                        {request?.location?.lat?.toFixed(4)}, {request?.location?.lng?.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {request?.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('Claiming task:', request?.id);
                      }}
                      iconName="UserPlus"
                      iconPosition="left"
                      iconSize={12}
                      className="w-full mt-2"
                    >
                      Claim Task
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-surface border border-border rounded-lg emergency-shadow p-3">
          <h4 className="font-medium text-foreground mb-2 text-sm">Legend</h4>
          <div className="space-y-1">
            {[
              { color: '#F44336', label: 'SOS Alert', icon: 'AlertTriangle' },
              { color: '#FF9800', label: 'Pending', icon: 'Clock' },
              { color: '#1565C0', label: 'Assigned', icon: 'UserCheck' },
              { color: '#FF7043', label: 'In Progress', icon: 'Activity' },
              { color: '#4CAF50', label: 'Completed', icon: 'CheckCircle' }
            ]?.map(item => (
              <div key={item?.label} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: item?.color }}
                />
                <Icon name={item?.icon} size={12} className="text-muted-foreground" />
                <span className="text-muted-foreground">{item?.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconSize={16}
            className="bg-surface emergency-shadow"
            onClick={() => console.log('Refresh map')}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Maximize"
            iconSize={16}
            className="bg-surface emergency-shadow"
            onClick={() => console.log('Fullscreen map')}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;