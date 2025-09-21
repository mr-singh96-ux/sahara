import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RequestStatusIndicator from '../../../components/ui/RequestStatusIndicator';

const TaskManagementPanel = ({ 
  onTaskSelect = () => {}, 
  selectedTask = null,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [sortBy, setSortBy] = useState('priority');

  // Mock task data
  const allTasks = [
    {
      id: 'TASK001',
      requestId: 'REQ001',
      victim: 'Sarah Johnson',
      type: 'medical',
      priority: 'critical',
      status: 'assigned',
      description: 'Severe injury from building collapse, needs immediate medical attention',
      location: 'Manhattan, NY',
      estimatedTime: '15 mins',
      assignedAt: new Date(Date.now() - 300000),
      dueBy: new Date(Date.now() + 900000),
      distance: '0.8 miles',
      contact: '+1 (555) 123-4567',
      isSOS: true
    },
    {
      id: 'TASK002',
      requestId: 'REQ003',
      victim: 'Emma Chen',
      type: 'supplies',
      priority: 'medium',
      status: 'in-progress',
      description: 'Need food and water supplies for elderly residents',
      location: 'Brooklyn, NY',
      estimatedTime: '45 mins',
      assignedAt: new Date(Date.now() - 1800000),
      dueBy: new Date(Date.now() + 2700000),
      distance: '2.3 miles',
      contact: '+1 (555) 987-6543',
      isSOS: false,
      progress: 60
    },
    {
      id: 'TASK003',
      requestId: 'REQ005',
      victim: 'Lisa Thompson',
      type: 'medical',
      priority: 'high',
      status: 'completed',
      description: 'Diabetic patient needs insulin supply',
      location: 'Queens, NY',
      estimatedTime: 'Completed',
      assignedAt: new Date(Date.now() - 7200000),
      completedAt: new Date(Date.now() - 3600000),
      distance: '1.5 miles',
      contact: '+1 (555) 456-7890',
      isSOS: false
    }
  ];

  const getTasksByStatus = (status) => {
    return allTasks?.filter(task => {
      if (status === 'assigned') return task?.status === 'assigned';
      if (status === 'in-progress') return task?.status === 'in-progress';
      if (status === 'completed') return task?.status === 'completed';
      return true;
    });
  };

  const sortTasks = (tasks) => {
    return [...tasks]?.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
        case 'distance':
          return parseFloat(a?.distance) - parseFloat(b?.distance);
        case 'time':
          return new Date(a.assignedAt) - new Date(b.assignedAt);
        default:
          return 0;
      }
    });
  };

  const currentTasks = sortTasks(getTasksByStatus(activeTab));

  const getTypeIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'shelter': return 'Home';
      case 'supplies': return 'Package';
      case 'rescue': return 'Shield';
      default: return 'HelpCircle';
    }
  };

  const handleTaskAction = (task, action) => {
    console.log(`${action} task:`, task?.id);
    // Handle task actions like start, complete, contact
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`bg-surface border border-border rounded-lg emergency-shadow h-full flex flex-col ${className}`}>
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Task Management</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded px-2 py-1 bg-surface text-foreground"
            >
              <option value="priority">Sort by Priority</option>
              <option value="distance">Sort by Distance</option>
              <option value="time">Sort by Time</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {[
            { key: 'assigned', label: 'Assigned', count: getTasksByStatus('assigned')?.length },
            { key: 'in-progress', label: 'Active', count: getTasksByStatus('in-progress')?.length },
            { key: 'completed', label: 'Completed', count: getTasksByStatus('completed')?.length }
          ]?.map(tab => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md emergency-transition ${
                activeTab === tab?.key
                  ? 'bg-surface text-foreground emergency-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab?.label}
              {tab?.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab?.key ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                }`}>
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentTasks?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No {activeTab} tasks</h4>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'assigned' ? 'New tasks will appear here when assigned' :
               activeTab === 'in-progress'? 'Start working on assigned tasks' : 'Completed tasks will be shown here'}
            </p>
          </div>
        ) : (
          currentTasks?.map(task => (
            <div
              key={task?.id}
              className={`border border-border rounded-lg p-4 emergency-shadow emergency-transition hover:emergency-shadow-lg cursor-pointer ${
                selectedTask?.id === task?.id ? 'ring-2 ring-primary' : ''
              } ${task?.isSOS ? 'border-error/50 bg-error/5' : ''}`}
              onClick={() => onTaskSelect(task)}
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task?.priority === 'critical' ? 'bg-error/10' :
                    task?.priority === 'high'? 'bg-warning/10' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getTypeIcon(task?.type)} 
                      size={20} 
                      className={
                        task?.priority === 'critical' ? 'text-error' :
                        task?.priority === 'high'? 'text-warning' : 'text-muted-foreground'
                      }
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{task?.victim}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <RequestStatusIndicator 
                        status={task?.status} 
                        priority={task?.priority}
                        size="sm"
                        showText={false}
                      />
                      <span className="text-xs text-muted-foreground font-data">
                        {task?.id}
                      </span>
                    </div>
                  </div>
                </div>

                {task?.isSOS && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-error/10 rounded-full">
                    <Icon name="AlertTriangle" size={12} className="text-error animate-pulse" />
                    <span className="text-xs font-medium text-error">SOS</span>
                  </div>
                )}
              </div>

              {/* Task Description */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {task?.description}
              </p>

              {/* Task Details */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{task?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Navigation" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{task?.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{task?.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{formatTimeAgo(task?.assignedAt)}</span>
                </div>
              </div>

              {/* Progress Bar (for in-progress tasks) */}
              {task?.status === 'in-progress' && task?.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium text-foreground">{task?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 emergency-transition"
                      style={{ width: `${task?.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Task Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {task?.status === 'assigned' && (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleTaskAction(task, 'start');
                      }}
                      iconName="Play"
                      iconPosition="left"
                      iconSize={12}
                    >
                      Start Task
                    </Button>
                  )}
                  
                  {task?.status === 'in-progress' && (
                    <Button
                      variant="success"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleTaskAction(task, 'complete');
                      }}
                      iconName="CheckCircle"
                      iconPosition="left"
                      iconSize={12}
                    >
                      Complete
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleTaskAction(task, 'contact');
                    }}
                    iconName="Phone"
                    iconSize={12}
                  />
                </div>

                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>You</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManagementPanel;