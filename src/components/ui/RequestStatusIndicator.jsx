import React from 'react';
import Icon from '../AppIcon';

const RequestStatusIndicator = ({ 
  status = 'pending', 
  priority = 'medium', 
  timestamp = null,
  showText = true,
  size = 'default',
  className = ''
}) => {
  const statusConfig = {
    pending: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'Clock',
      label: 'Pending',
      description: 'Request submitted, awaiting response'
    },
    assigned: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: 'UserCheck',
      label: 'Assigned',
      description: 'Volunteer assigned to request'
    },
    'in-progress': {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      icon: 'Activity',
      label: 'In Progress',
      description: 'Help is on the way'
    },
    completed: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'CheckCircle',
      label: 'Completed',
      description: 'Request successfully fulfilled'
    },
    cancelled: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      icon: 'XCircle',
      label: 'Cancelled',
      description: 'Request was cancelled'
    },
    emergency: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'AlertTriangle',
      label: 'Emergency',
      description: 'Critical emergency request'
    }
  };

  const priorityConfig = {
    low: {
      color: 'text-success',
      label: 'Low Priority'
    },
    medium: {
      color: 'text-warning',
      label: 'Medium Priority'
    },
    high: {
      color: 'text-error',
      label: 'High Priority'
    },
    critical: {
      color: 'text-error',
      label: 'Critical',
      pulse: true
    }
  };

  const sizeConfig = {
    sm: {
      iconSize: 14,
      textSize: 'text-xs',
      padding: 'px-2 py-1',
      spacing: 'space-x-1'
    },
    default: {
      iconSize: 16,
      textSize: 'text-sm',
      padding: 'px-3 py-2',
      spacing: 'space-x-2'
    },
    lg: {
      iconSize: 20,
      textSize: 'text-base',
      padding: 'px-4 py-3',
      spacing: 'space-x-3'
    }
  };

  const currentStatus = statusConfig?.[status] || statusConfig?.pending;
  const currentPriority = priorityConfig?.[priority] || priorityConfig?.medium;
  const currentSize = sizeConfig?.[size] || sizeConfig?.default;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`inline-flex items-center ${currentSize?.spacing} ${className}`}>
      {/* Status Indicator */}
      <div className={`
        inline-flex items-center ${currentSize?.spacing} ${currentSize?.padding} 
        rounded-full ${currentStatus?.bgColor} emergency-transition
        ${priority === 'critical' && status === 'emergency' ? 'animate-pulse-slow' : ''}
      `}>
        <Icon 
          name={currentStatus?.icon} 
          size={currentSize?.iconSize} 
          className={currentStatus?.color}
        />
        {showText && (
          <span className={`font-medium ${currentStatus?.color} ${currentSize?.textSize}`}>
            {currentStatus?.label}
          </span>
        )}
      </div>
      {/* Priority Indicator */}
      {priority === 'critical' && (
        <div className={`
          inline-flex items-center ${currentSize?.spacing} ${currentSize?.padding}
          rounded-full bg-error/10 emergency-transition
          ${currentPriority?.pulse ? 'animate-pulse-slow' : ''}
        `}>
          <Icon 
            name="AlertCircle" 
            size={currentSize?.iconSize} 
            className={currentPriority?.color}
          />
          {showText && (
            <span className={`font-medium ${currentPriority?.color} ${currentSize?.textSize}`}>
              {currentPriority?.label}
            </span>
          )}
        </div>
      )}
      {/* Timestamp */}
      {timestamp && showText && (
        <span className={`${currentSize?.textSize} text-muted-foreground font-data`}>
          {formatTimestamp(timestamp)}
        </span>
      )}
    </div>
  );
};

export default RequestStatusIndicator;