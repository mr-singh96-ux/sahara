import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RequestStatusIndicator from '../../../components/ui/RequestStatusIndicator';

const RequestHistoryCard = ({ 
  request = {},
  onViewDetails = () => {},
  onResubmit = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id = 'REQ002',
    title = 'Food and Water Supply',
    description = 'Need emergency food supplies for family of 4 after flood damage',
    status = 'completed',
    priority = 'medium',
    category = 'food',
    createdAt = new Date(Date.now() - 86400000 * 2),
    completedAt = new Date(Date.now() - 86400000),
    assignedVolunteer = {
      name: 'Mike Rodriguez',
      organization: 'Red Cross Volunteer',
      rating: 4.8
    },
    timeline = [
      {
        status: 'submitted',
        timestamp: new Date(Date.now() - 86400000 * 2),
        description: 'Request submitted successfully'
      },
      {
        status: 'assigned',
        timestamp: new Date(Date.now() - 86400000 * 2 + 1800000),
        description: 'Volunteer assigned to your request'
      },
      {
        status: 'in-progress',
        timestamp: new Date(Date.now() - 86400000 * 2 + 3600000),
        description: 'Volunteer is preparing supplies'
      },
      {
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000),
        description: 'Food supplies delivered successfully'
      }
    ],
    feedback = {
      rating: 5,
      comment: 'Excellent service! Mike was very helpful and delivered everything we needed quickly.'
    }
  } = request;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medical': return 'Heart';
      case 'shelter': return 'Home';
      case 'food': return 'Utensils';
      case 'rescue': return 'Shield';
      case 'supplies': return 'Package';
      default: return 'HelpCircle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'cancelled': return 'text-muted-foreground';
      case 'rejected': return 'text-error';
      default: return 'text-primary';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canResubmit = status === 'cancelled' || status === 'rejected';

  return (
    <div className="bg-card border border-border rounded-lg emergency-shadow hover:emergency-shadow-lg emergency-transition">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 emergency-transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start space-x-3 flex-1">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${status === 'completed' ? 'bg-success/10' : 
              status === 'cancelled' || status === 'rejected' ? 'bg-error/10' : 'bg-muted'}
          `}>
            <Icon 
              name={getCategoryIcon(category)} 
              size={20} 
              className={status === 'completed' ? 'text-success' : 
                        status === 'cancelled' || status === 'rejected' ? 'text-error' : 'text-muted-foreground'}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-card-foreground truncate">{title}</h3>
              <RequestStatusIndicator 
                status={status} 
                priority={priority} 
                timestamp={createdAt}
                size="sm"
                showText={false}
              />
            </div>
            <p className="text-sm text-muted-foreground font-data">#{id}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground ml-2"
        />
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {/* Assigned Volunteer */}
          {assignedVolunteer && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Assigned Volunteer</h4>
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{assignedVolunteer?.name}</p>
                  <p className="text-xs text-muted-foreground">{assignedVolunteer?.organization}</p>
                </div>
                {assignedVolunteer?.rating && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-xs font-medium text-foreground">{assignedVolunteer?.rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Request Timeline</h4>
            <div className="space-y-3">
              {timeline?.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`
                    w-2 h-2 rounded-full mt-2 flex-shrink-0
                    ${item?.status === 'completed' ? 'bg-success' :
                      item?.status === 'in-progress' ? 'bg-primary' :
                      item?.status === 'assigned' ? 'bg-warning' : 'bg-muted-foreground'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item?.description}</p>
                    <p className="text-xs text-muted-foreground font-data">
                      {formatDate(item?.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && status === 'completed' && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Your Feedback</h4>
              <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={`${
                          i < feedback?.rating 
                            ? 'text-warning fill-current' :'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-success">{feedback?.rating}/5</span>
                </div>
                <p className="text-sm text-muted-foreground italic">"{feedback?.comment}"</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request)}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              View Full Details
            </Button>
            {canResubmit && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onResubmit(request)}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                Resubmit Request
              </Button>
            )}
            {status === 'completed' && !feedback && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewDetails(request)}
                iconName="Star"
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                Leave Feedback
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestHistoryCard;