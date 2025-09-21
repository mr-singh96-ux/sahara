import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusTimeline = ({ request, userRole }) => {
  const timelineEvents = [
    {
      id: 1,
      status: 'submitted',
      title: 'Request Submitted',
      description: `${request?.victimName} submitted a ${request?.category} assistance request`,
      timestamp: request?.createdAt,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary',
      completed: true
    },
    {
      id: 2,
      status: 'reviewed',
      title: 'Under Review',
      description: 'Request is being reviewed by emergency coordinators',
      timestamp: new Date(new Date(request.createdAt).getTime() + 300000),
      icon: 'Eye',
      color: 'text-warning',
      bgColor: 'bg-warning',
      completed: ['reviewed', 'assigned', 'in-progress', 'completed']?.includes(request?.status)
    },
    {
      id: 3,
      status: 'assigned',
      title: 'Volunteer Assigned',
      description: request?.assignedVolunteer ? `Assigned to ${request?.assignedVolunteer}` : 'Waiting for volunteer assignment',
      timestamp: request?.assignedAt || null,
      icon: 'UserCheck',
      color: 'text-accent',
      bgColor: 'bg-accent',
      completed: ['assigned', 'in-progress', 'completed']?.includes(request?.status)
    },
    {
      id: 4,
      status: 'in-progress',
      title: 'Help in Progress',
      description: 'Volunteer is actively providing assistance',
      timestamp: request?.startedAt || null,
      icon: 'Activity',
      color: 'text-secondary',
      bgColor: 'bg-secondary',
      completed: ['in-progress', 'completed']?.includes(request?.status)
    },
    {
      id: 5,
      status: 'completed',
      title: 'Request Completed',
      description: 'Assistance has been successfully provided',
      timestamp: request?.completedAt || null,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success',
      completed: request?.status === 'completed'
    }
  ];

  // Filter out events that shouldn't show for rejected requests
  const filteredEvents = request?.status === 'rejected' 
    ? timelineEvents?.slice(0, 2)?.concat([{
        id: 'rejected',
        status: 'rejected',
        title: 'Request Rejected',
        description: request?.rejectionReason || 'Request could not be fulfilled at this time',
        timestamp: request?.rejectedAt || new Date(),
        icon: 'XCircle',
        color: 'text-error',
        bgColor: 'bg-error',
        completed: true
      }])
    : timelineEvents;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border emergency-shadow">
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Request Timeline</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Track the progress of this assistance request
        </p>
      </div>
      <div className="p-4 lg:p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {filteredEvents?.map((event, index) => (
              <div key={event?.id} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 emergency-transition
                  ${event?.completed 
                    ? `${event?.bgColor} border-transparent` 
                    : 'bg-surface border-border'
                  }
                `}>
                  <Icon 
                    name={event?.icon} 
                    size={16} 
                    className={event?.completed ? 'text-white' : 'text-muted-foreground'} 
                  />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className={`font-medium ${
                      event?.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {event?.title}
                    </h4>
                    
                    {event?.timestamp && (
                      <span className={`text-xs font-data mt-1 sm:mt-0 ${
                        event?.completed ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {formatTimestamp(event?.timestamp)}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm ${
                    event?.completed ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  }`}>
                    {event?.description}
                  </p>

                  {/* Additional Information */}
                  {event?.status === 'assigned' && request?.estimatedTime && event?.completed && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Icon name="Clock" size={14} className="text-primary" />
                      <span className="text-xs text-primary">
                        ETA: {request?.estimatedTime}
                      </span>
                    </div>
                  )}

                  {event?.status === 'in-progress' && event?.completed && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Icon name="MapPin" size={14} className="text-secondary" />
                      <span className="text-xs text-secondary">
                        Volunteer en route to location
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Status Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                request?.status === 'completed' ? 'bg-success' :
                request?.status === 'rejected' ? 'bg-error' :
                request?.status === 'in-progress'? 'bg-secondary animate-pulse' : 'bg-warning'
              }`} />
              <span className="text-sm font-medium text-foreground">
                Current Status: <span className="capitalize">{request?.status?.replace('-', ' ')}</span>
              </span>
            </div>

            {request?.status === 'in-progress' && (
              <div className="flex items-center space-x-2 text-xs text-secondary">
                <Icon name="Activity" size={12} className="animate-pulse" />
                <span>Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;