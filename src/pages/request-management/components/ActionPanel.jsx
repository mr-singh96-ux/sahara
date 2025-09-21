import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActionPanel = ({ request, userRole, onAction }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [priority, setPriority] = useState(request?.priority);

  // Mock volunteer data
  const availableVolunteers = [
    { value: 'vol_001', label: 'John Smith - Medical Specialist' },
    { value: 'vol_002', label: 'Sarah Johnson - Rescue Team' },
    { value: 'vol_003', label: 'Mike Chen - Supply Coordinator' },
    { value: 'vol_004', label: 'Lisa Brown - Shelter Manager' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical Priority' }
  ];

  const handleAssignVolunteer = () => {
    if (!selectedVolunteer) return;
    
    onAction({
      type: 'assign',
      volunteerId: selectedVolunteer,
      volunteerName: availableVolunteers?.find(v => v?.value === selectedVolunteer)?.label
    });
    setShowAssignModal(false);
    setSelectedVolunteer('');
  };

  const handleRejectRequest = () => {
    if (!rejectionReason?.trim()) return;
    
    onAction({
      type: 'reject',
      reason: rejectionReason
    });
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const handleUpdateRequest = () => {
    onAction({
      type: 'update',
      priority: priority,
      note: updateNote
    });
    setShowUpdateModal(false);
    setUpdateNote('');
  };

  const getActionButtons = () => {
    switch (userRole) {
      case 'victim':
        return (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpdateModal(true)}
              iconName="Edit"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Add Information
            </Button>
            {request?.status === 'pending' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onAction({ type: 'cancel' })}
                iconName="X"
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                Cancel Request
              </Button>
            )}
          </div>
        );

      case 'volunteer':
        return (
          <div className="space-y-2">
            {request?.status === 'pending' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onAction({ type: 'claim' })}
                iconName="UserCheck"
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                Claim This Task
              </Button>
            )}
            {request?.status === 'assigned' && request?.assignedTo === 'current_user' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onAction({ type: 'start' })}
                  iconName="Play"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Start Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction({ type: 'unclaim' })}
                  iconName="UserX"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Release Task
                </Button>
              </>
            )}
            {request?.status === 'in-progress' && request?.assignedTo === 'current_user' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onAction({ type: 'complete' })}
                iconName="CheckCircle"
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                Mark Complete
              </Button>
            )}
          </div>
        );

      case 'ngo-admin':
        return (
          <div className="space-y-2">
            {request?.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onAction({ type: 'accept' })}
                  iconName="Check"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Accept Request
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Assign Volunteer
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  iconName="X"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Reject Request
                </Button>
              </>
            )}
            {['accepted', 'assigned', 'in-progress']?.includes(request?.status) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                  iconName="UserCheck"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Reassign Volunteer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpdateModal(true)}
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Update Priority
                </Button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border emergency-shadow">
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {userRole === 'victim' && 'Manage your request'}
          {userRole === 'volunteer' && 'Task management options'}
          {userRole === 'ngo-admin' && 'Administrative controls'}
        </p>
      </div>
      <div className="p-4 lg:p-6">
        {getActionButtons()}

        {/* Emergency Actions */}
        {request?.priority === 'critical' && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="AlertTriangle" size={16} className="text-error animate-pulse" />
              <span className="text-sm font-medium text-error">Emergency Actions</span>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onAction({ type: 'escalate' })}
                iconName="Siren"
                iconPosition="left"
                iconSize={14}
                fullWidth
              >
                Escalate to Emergency Services
              </Button>
              
              {userRole !== 'victim' && (
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onAction({ type: 'broadcast' })}
                  iconName="Radio"
                  iconPosition="left"
                  iconSize={14}
                  fullWidth
                >
                  Broadcast to All Volunteers
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Assign Volunteer Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-border emergency-shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Assign Volunteer</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <Select
                label="Select Volunteer"
                options={availableVolunteers}
                value={selectedVolunteer}
                onChange={setSelectedVolunteer}
                placeholder="Choose a volunteer..."
                searchable
              />
            </div>
            
            <div className="p-4 border-t border-border flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAssignVolunteer}
                disabled={!selectedVolunteer}
                fullWidth
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Reject Request Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-border emergency-shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Reject Request</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <Input
                label="Rejection Reason"
                type="text"
                placeholder="Explain why this request cannot be fulfilled..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e?.target?.value)}
                required
              />
            </div>
            
            <div className="p-4 border-t border-border flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRejectRequest}
                disabled={!rejectionReason?.trim()}
                fullWidth
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Update Request Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg border border-border emergency-shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {userRole === 'victim' ? 'Add Information' : 'Update Request'}
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {userRole === 'ngo-admin' && (
                <Select
                  label="Priority Level"
                  options={priorityOptions}
                  value={priority}
                  onChange={setPriority}
                />
              )}
              
              <Input
                label={userRole === 'victim' ? 'Additional Information' : 'Update Note'}
                type="text"
                placeholder={userRole === 'victim' ?'Provide any additional details...' :'Add a note about this update...'
                }
                value={updateNote}
                onChange={(e) => setUpdateNote(e?.target?.value)}
              />
            </div>
            
            <div className="p-4 border-t border-border flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpdateModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdateRequest}
                fullWidth
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;