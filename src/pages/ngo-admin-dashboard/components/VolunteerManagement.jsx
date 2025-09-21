import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VolunteerManagement = ({ 
  onVolunteerAdd = () => {},
  onVolunteerRemove = () => {},
  onTaskAssign = () => {},
  className = ''
}) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock volunteer data
  const mockVolunteers = [
    {
      id: 'VOL001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      status: 'available',
      skills: ['Medical Aid', 'Search & Rescue'],
      location: 'Manhattan, NY',
      activeTask: null,
      completedTasks: 15,
      rating: 4.8,
      joinedDate: '2024-01-15',
      lastActive: new Date(Date.now() - 300000)
    },
    {
      id: 'VOL002',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0124',
      status: 'busy',
      skills: ['Shelter Management', 'Supply Distribution'],
      location: 'Brooklyn, NY',
      activeTask: 'REQ002',
      completedTasks: 23,
      rating: 4.9,
      joinedDate: '2023-11-20',
      lastActive: new Date(Date.now() - 120000)
    },
    {
      id: 'VOL003',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      phone: '+1-555-0125',
      status: 'offline',
      skills: ['Transportation', 'Communication'],
      location: 'Queens, NY',
      activeTask: null,
      completedTasks: 8,
      rating: 4.6,
      joinedDate: '2024-03-10',
      lastActive: new Date(Date.now() - 3600000)
    }
  ];

  const filteredVolunteers = mockVolunteers?.filter(volunteer => {
    const matchesSearch = volunteer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         volunteer?.skills?.some(skill => skill?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || volunteer?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10';
      case 'busy': return 'text-warning bg-warning/10';
      case 'offline': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle';
      case 'busy': return 'Clock';
      case 'offline': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatLastActive = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const handleAddVolunteer = () => {
    setShowAddForm(true);
  };

  const handleAssignTask = (volunteerId, taskId) => {
    onTaskAssign(volunteerId, taskId);
  };

  return (
    <div className={`bg-card border border-border rounded-lg emergency-shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Volunteer Management</h3>
          </div>
          <Button
            variant="default"
            size="sm"
            iconName="UserPlus"
            iconPosition="left"
            iconSize={16}
            onClick={handleAddVolunteer}
          >
            Add Volunteer
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search volunteers by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'available', 'busy', 'offline']?.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium emergency-transition capitalize
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
        </div>
      </div>
      {/* Volunteer List */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredVolunteers?.map((volunteer) => (
            <div
              key={volunteer?.id}
              className={`
                p-4 border border-border rounded-lg emergency-transition cursor-pointer
                ${selectedVolunteer?.id === volunteer?.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
              `}
              onClick={() => setSelectedVolunteer(volunteer)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-muted-foreground" />
                  </div>

                  {/* Volunteer Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-card-foreground">{volunteer?.name}</h4>
                      <div className={`
                        inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                        ${getStatusColor(volunteer?.status)}
                      `}>
                        <Icon name={getStatusIcon(volunteer?.status)} size={12} />
                        <span className="capitalize">{volunteer?.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={14} />
                        <span>{volunteer?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={14} />
                        <span>{volunteer?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="MapPin" size={14} />
                        <span>{volunteer?.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} />
                        <span>Last active: {formatLastActive(volunteer?.lastActive)}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {volunteer?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Active Task */}
                    {volunteer?.activeTask && (
                      <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-md">
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Activity" size={14} className="text-warning" />
                          <span className="text-warning font-medium">
                            Currently assigned to: {volunteer?.activeTask}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <div className="text-right text-sm">
                    <div className="flex items-center space-x-1 text-warning">
                      <Icon name="Star" size={14} />
                      <span>{volunteer?.rating}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {volunteer?.completedTasks} tasks
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {volunteer?.status === 'available' && (
                      <Button
                        variant="outline"
                        size="xs"
                        iconName="UserCheck"
                        iconSize={14}
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleAssignTask(volunteer?.id, 'new-task');
                        }}
                      >
                        Assign
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MessageSquare"
                      iconSize={14}
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle message
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MoreVertical"
                      iconSize={14}
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle more options
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVolunteers?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-muted-foreground mb-2">No volunteers found</h4>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Add volunteers to get started'}
            </p>
          </div>
        )}
      </div>
      {/* Statistics Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-success">
              {mockVolunteers?.filter(v => v?.status === 'available')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div>
            <div className="text-xl font-bold text-warning">
              {mockVolunteers?.filter(v => v?.status === 'busy')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Busy</div>
          </div>
          <div>
            <div className="text-xl font-bold text-primary">
              {mockVolunteers?.reduce((sum, v) => sum + v?.completedTasks, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagement;