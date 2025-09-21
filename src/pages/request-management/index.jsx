import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CommunicationPanel from '../../components/ui/CommunicationPanel';
import EmergencyActionButton from '../../components/ui/EmergencyActionButton';
import RequestHeader from './components/RequestHeader';
import RequestDetails from './components/RequestDetails';
import StatusTimeline from './components/StatusTimeline';
import LocationViewer from './components/LocationViewer';
import ActionPanel from './components/ActionPanel';

const RequestManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams?.get('id') || '12345';
  
  const [userRole, setUserRole] = useState('victim'); // Mock user role
  const [userName, setUserName] = useState('John Doe');
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock request data
  const mockRequest = {
    id: requestId,
    victimName: 'Sarah Johnson',
    contactNumber: '+1 (555) 123-4567',
    category: 'medical',
    priority: 'critical',
    urgency: 'high',
    status: 'assigned',
    description: `I am trapped in my apartment building after the earthquake. The building has partially collapsed and I cannot get out through the main entrance. I have some injuries on my leg and need immediate medical assistance. There are other people trapped as well. Please send help urgently.`,
    additionalInfo: `Update: Water is starting to seep into the building from a broken pipe. The situation is getting worse. I can hear other people calling for help from different floors.`,
    location: {
      address: '1234 Oak Street, Downtown District, Emergency City, EC 12345',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    locationAccuracy: 15,
    locationUpdatedAt: new Date(Date.now() - 600000),
    createdAt: new Date(Date.now() - 1800000),
    assignedAt: new Date(Date.now() - 900000),
    assignedTo: 'vol_002',
    assignedVolunteer: 'Mike Chen - Emergency Responder',
    estimatedTime: '15-20 minutes',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
        uploadedAt: new Date(Date.now() - 1700000)
      },
      {
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        uploadedAt: new Date(Date.now() - 1600000)
      },
      {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        uploadedAt: new Date(Date.now() - 1500000)
      }
    ],
    aiAnalysis: [
      {
        description: `Structural damage detected in building facade. Multiple cracks visible in concrete walls. Debris blocking main entrance. Immediate evacuation and rescue operations recommended.`,
        confidence: 94,
        analysisType: 'structural_assessment'
      },
      {
        description: `Person visible in distress, potential injuries detected. Medical assistance required. Multiple heat signatures detected indicating other trapped individuals.`,
        confidence: 87,
        analysisType: 'person_detection'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading request data
    const timer = setTimeout(() => {
      setRequest(mockRequest);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [requestId]);

  // Determine user role based on URL params or localStorage
  useEffect(() => {
    const roleFromParams = searchParams?.get('role');
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromParams) {
      setUserRole(roleFromParams);
      localStorage.setItem('userRole', roleFromParams);
    } else if (roleFromStorage) {
      setUserRole(roleFromStorage);
    }

    // Set user name based on role
    const userNames = {
      victim: 'Sarah Johnson',
      volunteer: 'Mike Chen',
      'ngo-admin': 'Admin User'
    };
    setUserName(userNames?.[userRole] || 'User');
  }, [searchParams, userRole]);

  const handleBack = () => {
    const dashboardRoutes = {
      victim: '/victim-dashboard',
      volunteer: '/volunteer-dashboard',
      'ngo-admin': '/ngo-admin-dashboard'
    };
    navigate(dashboardRoutes?.[userRole] || '/victim-dashboard');
  };

  const handleCommunication = () => {
    setIsCommunicationOpen(true);
  };

  const handleStatusUpdate = (action) => {
    console.log('Status update:', action);
    
    // Mock status updates
    const updatedRequest = { ...request };
    
    switch (action) {
      case 'claim':
        updatedRequest.status = 'assigned';
        updatedRequest.assignedTo = 'current_user';
        updatedRequest.assignedVolunteer = userName;
        updatedRequest.assignedAt = new Date();
        break;
      case 'start':
        updatedRequest.status = 'in-progress';
        updatedRequest.startedAt = new Date();
        break;
      case 'complete':
        updatedRequest.status = 'completed';
        updatedRequest.completedAt = new Date();
        break;
      case 'accept':
        updatedRequest.status = 'accepted';
        break;
      case 'reject':
        updatedRequest.status = 'rejected';
        updatedRequest.rejectedAt = new Date();
        break;
      default:
        break;
    }
    
    setRequest(updatedRequest);
  };

  const handleAction = (actionData) => {
    console.log('Action performed:', actionData);
    
    switch (actionData?.type) {
      case 'assign':
        setRequest(prev => ({
          ...prev,
          status: 'assigned',
          assignedTo: actionData?.volunteerId,
          assignedVolunteer: actionData?.volunteerName,
          assignedAt: new Date()
        }));
        break;
      case 'reject':
        setRequest(prev => ({
          ...prev,
          status: 'rejected',
          rejectionReason: actionData?.reason,
          rejectedAt: new Date()
        }));
        break;
      case 'update':
        setRequest(prev => ({
          ...prev,
          priority: actionData?.priority || prev?.priority,
          additionalInfo: actionData?.note ? `${prev?.additionalInfo}\n\nUpdate: ${actionData?.note}` : prev?.additionalInfo
        }));
        break;
      case 'escalate':
        setRequest(prev => ({
          ...prev,
          priority: 'critical',
          status: 'emergency'
        }));
        setIsEmergencyActive(true);
        break;
      default:
        handleStatusUpdate(actionData?.type);
        break;
    }
  };

  const handleEmergencyAction = (emergencyData) => {
    console.log('Emergency action:', emergencyData);
    
    if (emergencyData?.type === 'activate') {
      setIsEmergencyActive(true);
      setRequest(prev => ({
        ...prev,
        priority: 'critical',
        status: 'emergency'
      }));
    } else if (emergencyData?.type === 'cancel') {
      setIsEmergencyActive(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} userName={userName} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} userName={userName} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-error mb-4">Request not found</p>
            <button
              onClick={handleBack}
              className="text-primary hover:underline"
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole} 
        userName={userName}
        isEmergencyMode={isEmergencyActive}
      />
      <div className="pt-16">
        <RequestHeader
          request={request}
          userRole={userRole}
          onBack={handleBack}
          onCommunication={handleCommunication}
          onStatusUpdate={handleStatusUpdate}
        />

        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <RequestDetails request={request} userRole={userRole} />
              <StatusTimeline request={request} userRole={userRole} />
              <LocationViewer request={request} userRole={userRole} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ActionPanel
                request={request}
                userRole={userRole}
                onAction={handleAction}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Communication Panel */}
      <CommunicationPanel
        isOpen={isCommunicationOpen}
        onClose={() => setIsCommunicationOpen(false)}
        requestId={request?.id}
        participants={[
          { id: 'victim', name: request?.victimName, role: 'victim' },
          { id: 'volunteer', name: request?.assignedVolunteer, role: 'volunteer' },
          { id: 'admin', name: 'Emergency Coordinator', role: 'ngo-admin' }
        ]}
        userRole={userRole}
      />
      {/* Emergency Action Button (for victims only) */}
      {userRole === 'victim' && (
        <EmergencyActionButton
          userRole={userRole}
          onEmergencyAction={handleEmergencyAction}
          isEmergencyActive={isEmergencyActive}
        />
      )}
    </div>
  );
};

export default RequestManagement;