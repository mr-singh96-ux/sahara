import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import CommunicationPanel from '../../../components/ui/CommunicationPanel';

const LiveHelpSection = ({ className = '' }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCommunicationPanel, setShowCommunicationPanel] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock live help conversations
  const conversations = [
    {
      id: 'CONV001',
      participants: [
        { id: 'victim1', name: 'Sarah Johnson', role: 'victim' },
        { id: 'vol1', name: 'John Smith', role: 'volunteer' }
      ],
      status: 'active',
      priority: 'critical',
      lastMessage: {
        sender: 'Sarah Johnson',
        content: 'I need immediate medical assistance, my leg is injured',
        timestamp: new Date(Date.now() - 120000)
      },
      requestId: 'REQ001',
      location: 'Manhattan, NY',
      unreadCount: 3
    },
    {
      id: 'CONV002',
      participants: [
        { id: 'victim2', name: 'Michael Chen', role: 'victim' },
        { id: 'vol2', name: 'Emily Davis', role: 'volunteer' },
        { id: 'admin1', name: 'Admin', role: 'ngo-admin' }
      ],
      status: 'active',
      priority: 'high',
      lastMessage: {
        sender: 'Emily Davis',
        content: 'I am on my way to your location, ETA 10 minutes',
        timestamp: new Date(Date.now() - 300000)
      },
      requestId: 'REQ002',
      location: 'Brooklyn, NY',
      unreadCount: 1
    },
    {
      id: 'CONV003',
      participants: [
        { id: 'vol3', name: 'Michael Rodriguez', role: 'volunteer' },
        { id: 'admin2', name: 'Coordinator', role: 'ngo-admin' }
      ],
      status: 'waiting',
      priority: 'medium',
      lastMessage: {
        sender: 'Michael Rodriguez',
        content: 'Task completed, awaiting next assignment',
        timestamp: new Date(Date.now() - 600000)
      },
      requestId: null,
      location: 'Queens, NY',
      unreadCount: 0
    },
    {
      id: 'CONV004',
      participants: [
        { id: 'victim3', name: 'Maria Rodriguez', role: 'victim' }
      ],
      status: 'pending',
      priority: 'medium',
      lastMessage: {
        sender: 'Maria Rodriguez',
        content: 'Hello, I need help with food supplies for my family',
        timestamp: new Date(Date.now() - 900000)
      },
      requestId: 'REQ003',
      location: 'Bronx, NY',
      unreadCount: 1
    }
  ];

  const filteredConversations = conversations?.filter(conv => {
    const roleMatch = filterRole === 'all' || 
      conv?.participants?.some(p => p?.role === filterRole);
    const statusMatch = filterStatus === 'all' || conv?.status === filterStatus;
    return roleMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'waiting': return 'text-warning bg-warning/10';
      case 'pending': return 'text-accent bg-accent/10';
      case 'resolved': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'victim': return 'User';
      case 'volunteer': return 'Heart';
      case 'ngo-admin': return 'Shield';
      default: return 'User';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setShowCommunicationPanel(true);
  };

  const handleJoinConversation = (conversationId) => {
    console.log(`Joining conversation: ${conversationId}`);
  };

  const handleAssignVolunteer = (conversationId) => {
    console.log(`Assigning volunteer to conversation: ${conversationId}`);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status', count: conversations?.length },
    { value: 'active', label: 'Active', count: conversations?.filter(c => c?.status === 'active')?.length },
    { value: 'waiting', label: 'Waiting', count: conversations?.filter(c => c?.status === 'waiting')?.length },
    { value: 'pending', label: 'Pending', count: conversations?.filter(c => c?.status === 'pending')?.length }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'victim', label: 'Victims' },
    { value: 'volunteer', label: 'Volunteers' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg emergency-shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="MessageCircle" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Live Help Center</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Users"
              iconSize={16}
            >
              Manage Operators
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconSize={16}
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex space-x-2">
            {statusOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setFilterStatus(option?.value)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium emergency-transition
                  ${filterStatus === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {option?.label}
                {option?.count !== undefined && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/10 text-xs">
                    {option?.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {roleOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setFilterRole(option?.value)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium emergency-transition
                  ${filterRole === option?.value
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {option?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Conversations List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredConversations?.map((conversation) => (
          <div
            key={conversation?.id}
            className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 emergency-transition cursor-pointer"
            onClick={() => handleConversationSelect(conversation)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Participants Avatars */}
                <div className="flex -space-x-2">
                  {conversation?.participants?.slice(0, 3)?.map((participant, index) => (
                    <div
                      key={participant?.id}
                      className="w-8 h-8 bg-muted border-2 border-surface rounded-full flex items-center justify-center"
                      style={{ zIndex: 10 - index }}
                    >
                      <Icon 
                        name={getRoleIcon(participant?.role)} 
                        size={14} 
                        className="text-muted-foreground" 
                      />
                    </div>
                  ))}
                  {conversation?.participants?.length > 3 && (
                    <div className="w-8 h-8 bg-primary border-2 border-surface rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                      +{conversation?.participants?.length - 3}
                    </div>
                  )}
                </div>

                {/* Conversation Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-card-foreground">
                      {conversation?.participants?.map(p => p?.name)?.join(', ')}
                    </h4>
                    {conversation?.requestId && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-data">
                        {conversation?.requestId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={12} />
                    <span>{conversation?.location}</span>
                  </div>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-2">
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${getStatusColor(conversation?.status)}
                  `}>
                    {conversation?.status}
                  </div>
                  <Icon 
                    name="AlertCircle" 
                    size={14} 
                    className={getPriorityColor(conversation?.priority)}
                  />
                </div>
                {conversation?.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-error text-error-foreground rounded-full flex items-center justify-center text-xs font-medium">
                    {conversation?.unreadCount}
                  </div>
                )}
              </div>
            </div>

            {/* Last Message */}
            <div className="mb-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                <span className="font-medium">{conversation?.lastMessage?.sender}:</span>{' '}
                {conversation?.lastMessage?.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-data">
                {formatTimestamp(conversation?.lastMessage?.timestamp)}
              </div>

              <div className="flex space-x-2">
                {conversation?.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="UserPlus"
                    iconSize={12}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleAssignVolunteer(conversation?.id);
                    }}
                  >
                    Assign
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="MessageSquare"
                  iconSize={12}
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleJoinConversation(conversation?.id);
                  }}
                >
                  Join
                </Button>
                
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="MoreVertical"
                  iconSize={12}
                  onClick={(e) => {
                    e?.stopPropagation();
                    // Handle more options
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredConversations?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-muted-foreground mb-2">No conversations found</h4>
          <p className="text-muted-foreground">
            {filterStatus === 'all' ? 'No active conversations' : `No ${filterStatus} conversations`}
          </p>
        </div>
      )}
      {/* Statistics Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">
              {conversations?.filter(c => c?.status === 'active')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">
              {conversations?.filter(c => c?.status === 'waiting')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Waiting</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent">
              {conversations?.filter(c => c?.status === 'pending')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {conversations?.reduce((sum, c) => sum + c?.unreadCount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Unread</div>
          </div>
        </div>
      </div>
      {/* Communication Panel */}
      <CommunicationPanel
        isOpen={showCommunicationPanel}
        onClose={() => setShowCommunicationPanel(false)}
        requestId={selectedConversation?.requestId}
        participants={selectedConversation?.participants || []}
        userRole="ngo-admin"
      />
    </div>
  );
};

export default LiveHelpSection;