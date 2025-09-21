import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RequestStatusIndicator from '../../../components/ui/RequestStatusIndicator';

const RequestManagement = ({ 
  onRequestAccept = () => {},
  onRequestReject = () => {},
  onRequestAssign = () => {},
  className = ''
}) => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // Mock request data
  const mockRequests = [
    {
      id: 'REQ001',
      victim: {
        name: 'Sarah Johnson',
        phone: '+1-555-0123',
        location: 'Manhattan, NY'
      },
      type: 'medical',
      priority: 'critical',
      status: 'pending',
      description: 'Severe injury from building collapse, need immediate medical assistance. Patient is conscious but bleeding.',
      timestamp: new Date(Date.now() - 300000),
      images: ['https://images.unsplash.com/photo-1584515933487-779824d29309?w=400'],
      assignedVolunteer: null,
      estimatedResponse: '5-10 minutes'
    },
    {
      id: 'REQ002',
      victim: {
        name: 'Michael Chen',
        phone: '+1-555-0124',
        location: 'Brooklyn, NY'
      },
      type: 'shelter',
      priority: 'high',
      status: 'assigned',
      description: 'Family of 4 including 2 children needs temporary shelter after apartment flooding.',
      timestamp: new Date(Date.now() - 600000),
      images: [],
      assignedVolunteer: 'Emily Davis',
      estimatedResponse: '15-20 minutes'
    },
    {
      id: 'REQ003',
      victim: {
        name: 'Maria Rodriguez',
        phone: '+1-555-0125',
        location: 'Queens, NY'
      },
      type: 'supplies',
      priority: 'medium',
      status: 'in-progress',
      description: 'Need food and water supplies for elderly couple. Running low on medications.',
      timestamp: new Date(Date.now() - 900000),
      images: [],
      assignedVolunteer: 'John Smith',
      estimatedResponse: 'In progress'
    },
    {
      id: 'REQ004',
      victim: {
        name: 'David Wilson',
        phone: '+1-555-0126',
        location: 'Bronx, NY'
      },
      type: 'rescue',
      priority: 'critical',
      status: 'pending',
      description: 'Trapped in basement due to flooding. Water level rising. Need immediate rescue.',
      timestamp: new Date(Date.now() - 180000),
      images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'],
      assignedVolunteer: null,
      estimatedResponse: 'Urgent'
    }
  ];

  const filteredRequests = mockRequests?.filter(request => filterStatus === 'all' || request?.status === filterStatus)?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
        case 'timestamp':
          return b?.timestamp - a?.timestamp;
        case 'status':
          return a?.status?.localeCompare(b?.status);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'shelter': return 'Home';
      case 'supplies': return 'Package';
      case 'rescue': return 'Shield';
      default: return 'HelpCircle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'medical': return 'text-error bg-error/10';
      case 'shelter': return 'text-primary bg-primary/10';
      case 'supplies': return 'text-secondary bg-secondary/10';
      case 'rescue': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleBulkAction = (action) => {
    selectedRequests?.forEach(requestId => {
      switch (action) {
        case 'accept':
          onRequestAccept(requestId);
          break;
        case 'reject':
          onRequestReject(requestId);
          break;
        case 'assign':
          onRequestAssign(requestId);
          break;
      }
    });
    setSelectedRequests([]);
  };

  const toggleRequestSelection = (requestId) => {
    setSelectedRequests(prev => 
      prev?.includes(requestId) 
        ? prev?.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg emergency-shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Request Management</h3>
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {filteredRequests?.length}
            </span>
          </div>
          
          {selectedRequests?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedRequests?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Check"
                iconSize={16}
                onClick={() => handleBulkAction('accept')}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="UserCheck"
                iconSize={16}
                onClick={() => handleBulkAction('assign')}
              >
                Assign
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={() => handleBulkAction('reject')}
              >
                Reject
              </Button>
            </div>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex space-x-2">
            {['all', 'pending', 'assigned', 'in-progress', 'completed']?.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium emergency-transition capitalize
                  ${filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1.5 border border-border rounded-md text-sm bg-background"
            >
              <option value="timestamp">Latest First</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>
      {/* Request List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredRequests?.map((request) => (
          <div
            key={request?.id}
            className={`
              p-4 border-b border-border last:border-b-0 emergency-transition
              ${selectedRequests?.includes(request?.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}
            `}
          >
            <div className="flex items-start space-x-4">
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedRequests?.includes(request?.id)}
                onChange={() => toggleRequestSelection(request?.id)}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />

              {/* Request Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                      ${getTypeColor(request?.type)}
                    `}>
                      <Icon name={getTypeIcon(request?.type)} size={12} />
                      <span className="capitalize">{request?.type}</span>
                    </div>
                    
                    <RequestStatusIndicator
                      status={request?.status}
                      priority={request?.priority}
                      timestamp={request?.timestamp}
                      size="sm"
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-card-foreground">
                      {request?.id}
                    </div>
                    <div className="text-xs text-muted-foreground font-data">
                      {formatTimestamp(request?.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Victim Info */}
                <div className="mb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} className="text-muted-foreground" />
                      <span className="font-medium">{request?.victim?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} className="text-muted-foreground" />
                      <span>{request?.victim?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={14} className="text-muted-foreground" />
                      <span>{request?.victim?.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {request?.description}
                </p>

                {/* Images */}
                {request?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {request?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Request evidence ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border border-border"
                      />
                    ))}
                  </div>
                )}

                {/* Assignment Info */}
                {request?.assignedVolunteer && (
                  <div className="flex items-center space-x-2 mb-3 p-2 bg-success/10 border border-success/20 rounded-md">
                    <Icon name="UserCheck" size={14} className="text-success" />
                    <span className="text-sm text-success">
                      Assigned to: {request?.assignedVolunteer}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {request?.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="xs"
                          iconName="Check"
                          iconSize={14}
                          onClick={() => onRequestAccept(request?.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          iconName="UserCheck"
                          iconSize={14}
                          onClick={() => onRequestAssign(request?.id)}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="destructive"
                          size="xs"
                          iconName="X"
                          iconSize={14}
                          onClick={() => onRequestReject(request?.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MessageSquare"
                      iconSize={14}
                    >
                      Chat
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      iconSize={14}
                    >
                      View
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    ETA: {request?.estimatedResponse}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredRequests?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-muted-foreground mb-2">No requests found</h4>
          <p className="text-muted-foreground">
            {filterStatus === 'all' ? 'No requests available' : `No ${filterStatus} requests`}
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestManagement;