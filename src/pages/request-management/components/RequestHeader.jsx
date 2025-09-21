import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RequestStatusIndicator from '../../../components/ui/RequestStatusIndicator';

const RequestHeader = ({ 
  request, 
  userRole, 
  onBack, 
  onCommunication,
  onStatusUpdate 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

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

  return (
    <div className="bg-surface border-b border-border p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Back Button & Title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            iconName="ArrowLeft"
            iconSize={16}
            className="shrink-0"
          >
            Back
          </Button>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Icon 
                name={getCategoryIcon(request?.category)} 
                size={20} 
                className="text-primary shrink-0" 
              />
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground truncate">
                Request #{request?.id}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <RequestStatusIndicator
                status={request?.status}
                priority={request?.priority}
                timestamp={request?.createdAt}
                size="sm"
              />
              
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {request?.location?.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onCommunication}
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
          >
            Chat
          </Button>

          {userRole === 'volunteer' && request?.status === 'pending' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStatusUpdate('claim')}
              iconName="UserCheck"
              iconPosition="left"
              iconSize={16}
            >
              Claim Task
            </Button>
          )}

          {userRole === 'volunteer' && request?.status === 'assigned' && request?.assignedTo === 'current_user' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate('complete')}
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={16}
            >
              Mark Complete
            </Button>
          )}

          {userRole === 'ngo-admin' && request?.status === 'pending' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onStatusUpdate('accept')}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onStatusUpdate('reject')}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Reject
              </Button>
            </>
          )}

          {request?.priority === 'critical' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-error/10 rounded-md">
              <Icon name="AlertTriangle" size={14} className="text-error animate-pulse" />
              <span className="text-xs font-medium text-error">URGENT</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;