import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import { volunteerService } from '../../services/volunteerService';
import { communicationService } from '../../services/communicationService';
import Header from '../../components/ui/Header';
import QuickStatsCard from './components/QuickStatsCard';
import TaskManagementPanel from './components/TaskManagementPanel';
import InteractiveMap from './components/InteractiveMap';
import SOSAlertsPanel from './components/SOSAlertsPanel';


import Icon from '../../components/AppIcon';


const VolunteerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load available requests (pending requests)
  const loadAvailableRequests = async () => {
    try {
      const { data, error } = await requestService?.getUserRequests(user?.id, 'volunteer');
      
      if (error) {
        console.error('Error loading requests:', error?.message);
        return;
      }

      // Filter only pending requests for available requests
      const pending = (data || [])?.filter(req => req?.status === 'pending');
      const assigned = (data || [])?.filter(req => req?.assigned_volunteer_id === user?.id);
      
      setAvailableRequests(pending);
      setMyAssignments(assigned);
    } catch (error) {
      console.error('Network error loading requests:', error);
    }
  };

  // Load nearby requests
  const loadNearbyRequests = async () => {
    try {
      const { data, error } = await volunteerService?.getNearbyRequests(user?.id, 50); // 50km radius
      
      if (error) {
        console.error('Error loading nearby requests:', error?.message);
        return;
      }

      setNearbyRequests(data || []);
    } catch (error) {
      console.error('Network error loading nearby requests:', error);
    }
  };

  // Load all dashboard data
  const loadDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      await Promise.all([
        loadAvailableRequests(),
        loadNearbyRequests()
      ]);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user?.id && userProfile?.role === 'volunteer') {
      loadDashboardData();
    }
  }, [user?.id, userProfile?.role]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const requestChannel = requestService?.subscribeToRequests((payload) => {
      loadDashboardData(); // Refresh all data when requests change
    });

    const assignmentChannel = volunteerService?.subscribeToAssignments((payload) => {
      loadDashboardData(); // Refresh assignments when changes occur
    }, user?.id);

    const commChannel = communicationService?.subscribeToCommunications((payload) => {
      console.log('New message received:', payload);
    }, user?.id);

    return () => {
      requestService?.unsubscribeFromRequests(requestChannel);
      volunteerService?.unsubscribeFromAssignments(assignmentChannel);
      communicationService?.unsubscribeFromCommunications(commChannel);
    };
  }, [user?.id]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const { data, error } = await volunteerService?.assignVolunteerToRequest(user?.id, requestId);
      
      if (error) {
        alert(`Error accepting request: ${error?.message}`);
        return;
      }

      // Refresh data to show updated assignments
      loadDashboardData();
      alert('Request accepted successfully!');
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  const handleCompleteTask = async (assignmentId) => {
    const completionNotes = prompt('Please add any completion notes:');
    if (completionNotes === null) return; // User cancelled

    try {
      const { data, error } = await volunteerService?.completeAssignment(assignmentId, completionNotes);
      
      if (error) {
        alert(`Error completing task: ${error?.message}`);
        return;
      }

      // Refresh data
      loadDashboardData();
      alert('Task completed successfully!');
    } catch (error) {
      alert('Failed to complete task');
    }
  };

  const handleSendMessage = async (requestId, recipientId, message) => {
    try {
      const messageData = {
        request_id: requestId,
        sender_id: user?.id,
        recipient_id: recipientId,
        message,
        communication_type: 'sms'
      };

      const { data, error } = await communicationService?.sendMessage(messageData);
      
      if (error) {
        alert(`Error sending message: ${error?.message}`);
        return;
      }

      alert('Message sent successfully!');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Volunteer Dashboard"
          showProfile={true}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading volunteer dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Volunteer Dashboard"
        showProfile={true}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <main className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
            { id: 'tasks', label: 'My Tasks', icon: 'CheckSquare' },
            { id: 'available', label: 'Available Requests', icon: 'Search' },
            { id: 'map', label: 'Map View', icon: 'MapPin' },
            { id: 'alerts', label: 'SOS Alerts', icon: 'AlertTriangle' }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <QuickStatsCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Requests Preview */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Available Requests</h2>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {availableRequests?.slice(0, 3)?.map((request) => (
                    <div key={request?.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{request?.title}</p>
                          <p className="text-sm text-gray-500">{request?.request_type} • {request?.priority}</p>
                        </div>
                        <button
                          onClick={() => handleAcceptRequest(request?.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {availableRequests?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No available requests</p>
                  )}
                </div>
              </div>

              {/* My Current Tasks */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">My Current Tasks</h2>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {myAssignments?.slice(0, 3)?.map((request) => (
                    <div key={request?.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{request?.title}</p>
                          <p className="text-sm text-gray-500">{request?.status} • {request?.priority}</p>
                        </div>
                        {request?.status === 'in-progress' && (
                          <button
                            onClick={() => handleCompleteTask(request?.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {myAssignments?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No current tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <TaskManagementPanel 
            assignments={myAssignments}
            onCompleteTask={handleCompleteTask}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'available' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableRequests?.length > 0 ? (
                availableRequests?.map((request) => (
                  <div key={request?.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request?.title}</h3>
                        <p className="text-sm text-gray-500">
                          {request?.request_type} • {request?.priority} priority
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
                        'critical': 'bg-red-100 text-red-800',
                        'high': 'bg-orange-100 text-orange-800',
                        'medium': 'bg-yellow-100 text-yellow-800',
                        'low': 'bg-green-100 text-green-800'
                      }?.[request?.priority] || 'bg-gray-100 text-gray-800'}`}>
                        {request?.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{request?.description}</p>
                    
                    {request?.location_address && (
                      <p className="text-sm text-gray-500 mb-4 flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1" />
                        {request?.location_address}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request?.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => alert(`Contact ${request?.requester?.full_name}: ${request?.requester?.email}`)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Icon name="MessageCircle" size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
                  <Icon name="Search" size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No available requests at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveMap requests={nearbyRequests} onAcceptRequest={handleAcceptRequest} />
        )}

        {activeTab === 'alerts' && (
          <SOSAlertsPanel />
        )}
      </main>
    </div>
  );
};

export default VolunteerDashboard;