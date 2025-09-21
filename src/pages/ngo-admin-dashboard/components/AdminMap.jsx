import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminMap = ({ 
  requests = [], 
  volunteers = [], 
  onRequestSelect = () => {},
  onVolunteerSelect = () => {},
  className = ''
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoomLevel, setZoomLevel] = useState(10);

  // Mock data for demonstration
  const mockRequests = [
    {
      id: 'REQ001',
      type: 'medical',
      priority: 'critical',
      status: 'pending',
      location: { lat: 40.7580, lng: -73.9855 },
      victim: 'Sarah Johnson',
      description: 'Severe injury, need immediate medical assistance',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 'REQ002',
      type: 'shelter',
      priority: 'high',
      status: 'assigned',
      location: { lat: 40.7505, lng: -73.9934 },
      victim: 'Michael Chen',
      description: 'Family of 4 needs temporary shelter',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 'REQ003',
      type: 'supplies',
      priority: 'medium',
      status: 'in-progress',
      location: { lat: 40.7614, lng: -73.9776 },
      victim: 'Maria Rodriguez',
      description: 'Need food and water supplies',
      timestamp: new Date(Date.now() - 900000)
    }
  ];

  const mockVolunteers = [
    {
      id: 'VOL001',
      name: 'John Smith',
      status: 'available',
      location: { lat: 40.7589, lng: -73.9851 },
      skills: ['medical', 'rescue'],
      activeTask: null
    },
    {
      id: 'VOL002',
      name: 'Emily Davis',
      status: 'busy',
      location: { lat: 40.7505, lng: -73.9934 },
      skills: ['shelter', 'supplies'],
      activeTask: 'REQ002'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'assigned': return 'bg-primary';
      case 'in-progress': return 'bg-accent';
      case 'completed': return 'bg-success';
      case 'emergency': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'Minus';
      default: return 'Circle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'shelter': return 'Home';
      case 'supplies': return 'Package';
      case 'rescue': return 'Shield';
      default: return 'HelpCircle';
    }
  };

  const filteredRequests = selectedFilter === 'all' 
    ? mockRequests 
    : mockRequests?.filter(req => req?.status === selectedFilter);

  const filterOptions = [
    { value: 'all', label: 'All Requests', count: mockRequests?.length },
    { value: 'pending', label: 'Pending', count: mockRequests?.filter(r => r?.status === 'pending')?.length },
    { value: 'assigned', label: 'Assigned', count: mockRequests?.filter(r => r?.status === 'assigned')?.length },
    { value: 'in-progress', label: 'In Progress', count: mockRequests?.filter(r => r?.status === 'in-progress')?.length },
    { value: 'emergency', label: 'Emergency', count: mockRequests?.filter(r => r?.priority === 'critical')?.length }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg emergency-shadow ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Live Operations Map</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconSize={16}
              onClick={() => setMapCenter({ lat: 40.7128, lng: -74.0060 })}
            >
              Reset View
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize"
              iconSize={16}
            >
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedFilter(option?.value)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium emergency-transition
                ${selectedFilter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {option?.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/10 text-xs">
                {option?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Disaster Response Operations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoomLevel}&output=embed`}
          className="rounded-b-lg"
        />

        {/* Map Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Request Markers */}
          {filteredRequests?.map((request, index) => (
            <div
              key={request?.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => onRequestSelect(request)}
            >
              <div className={`
                w-8 h-8 rounded-full ${getStatusColor(request?.status)} 
                flex items-center justify-center emergency-shadow-lg
                border-2 border-white animate-pulse-slow
              `}>
                <Icon 
                  name={getPriorityIcon(request?.priority)} 
                  size={16} 
                  color="white" 
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-surface border border-border rounded px-2 py-1 text-xs whitespace-nowrap emergency-shadow">
                {request?.id}
              </div>
            </div>
          ))}

          {/* Volunteer Markers */}
          {mockVolunteers?.map((volunteer, index) => (
            <div
              key={volunteer?.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${60 + index * 10}%`,
                top: `${50 + index * 15}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => onVolunteerSelect(volunteer)}
            >
              <div className={`
                w-6 h-6 rounded-full 
                ${volunteer?.status === 'available' ? 'bg-success' : 'bg-warning'}
                flex items-center justify-center emergency-shadow
                border-2 border-white
              `}>
                <Icon name="User" size={12} color="white" />
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconSize={16}
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
            className="bg-surface/90 backdrop-blur-sm"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Minus"
            iconSize={16}
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
            className="bg-surface/90 backdrop-blur-sm"
          />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-3 emergency-shadow">
          <h4 className="text-sm font-semibold text-foreground mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span>Critical/Emergency</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Pending Request</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Assigned</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Available Volunteer</span>
            </div>
          </div>
        </div>
      </div>
      {/* Map Statistics */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{mockRequests?.filter(r => r?.priority === 'critical')?.length}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{mockRequests?.filter(r => r?.status === 'pending')?.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{mockRequests?.filter(r => r?.status === 'assigned')?.length}</div>
            <div className="text-xs text-muted-foreground">Assigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{mockVolunteers?.filter(v => v?.status === 'available')?.length}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;