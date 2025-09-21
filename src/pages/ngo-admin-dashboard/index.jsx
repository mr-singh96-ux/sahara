import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import { volunteerService } from '../../services/volunteerService';
import { communicationService } from '../../services/communicationService';
import Header from '../../components/ui/Header';
import AdminMap from './components/AdminMap';
import VolunteerManagement from './components/VolunteerManagement';
import RequestManagement from './components/RequestManagement';
import AdminAnalytics from './components/AdminAnalytics';
import WaterLevelPrediction from './components/WaterLevelPrediction';
import LiveHelpSection from './components/LiveHelpSection';


import Icon from '../../components/AppIcon';


const NGOAdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allRequests, setAllRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    totalVolunteers: 0,
    activeVolunteers: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load all requests (admin can see everything)
  const loadAllRequests = async () => {
    try {
      const { data, error } = await requestService?.getUserRequests(user?.id, 'ngo-admin');
      
      if (error) {
        console.error('Error loading requests:', error?.message);
        return;
      }

      setAllRequests(data || []);
    } catch (error) {
      console.error('Network error loading requests:', error);
    }
  };

  // Load all volunteers
  const loadVolunteers = async () => {
    try {
      const { data, error } = await volunteerService?.getVolunteers();
      
      if (error) {
        console.error('Error loading volunteers:', error?.message);
        return;
      }

      setVolunteers(data || []);
    } catch (error) {
      console.error('Network error loading volunteers:', error);
    }
  };

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    try {
      const { data: requestStats, error: requestError } = await requestService?.getDashboardStats(user?.id, 'ngo-admin');
      
      if (!requestError && requestStats) {
        setDashboardStats(prev => ({ ...prev, ...requestStats }));
      }

      // Calculate volunteer stats from loaded volunteers
      const totalVolunteers = volunteers?.length || 0;
      const activeVolunteers = volunteers?.filter(v => v?.is_active)?.length || 0;

      setDashboardStats(prev => ({
        ...prev,
        totalVolunteers,
        activeVolunteers
      }));

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Load all dashboard data
  const loadDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      await Promise.all([
        loadAllRequests(),
        loadVolunteers()
      ]);
      
      await loadDashboardStats();
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user?.id && userProfile?.role === 'ngo-admin') {
      loadDashboardData();
    }
  }, [user?.id, userProfile?.role]);

  // Update stats when volunteers change
  useEffect(() => {
    loadDashboardStats();
  }, [volunteers]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const requestChannel = requestService?.subscribeToRequests((payload) => {
      loadDashboardData(); // Refresh all data when requests change
    });

    const commChannel = communicationService?.subscribeToCommunications((payload) => {
      console.log('New admin message received:', payload);
    }, user?.id);

    return () => {
      requestService?.unsubscribeFromRequests(requestChannel);
      communicationService?.unsubscribeFromCommunications(commChannel);
    };
  }, [user?.id]);

  const handleAssignVolunteer = async (requestId, volunteerId) => {
    try {
      const { data, error } = await volunteerService?.assignVolunteerToRequest(volunteerId, requestId);
      
      if (error) {
        alert(`Error assigning volunteer: ${error?.message}`);
        return;
      }

      // Refresh requests to show updated assignment
      loadAllRequests();
      alert('Volunteer assigned successfully!');
    } catch (error) {
      alert('Failed to assign volunteer');
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      const { data, error } = await requestService?.updateRequestStatus(requestId, status);
      
      if (error) {
        alert(`Error updating request: ${error?.message}`);
        return;
      }

      // Update local state
      setAllRequests(prev => 
        prev?.map(req => req?.id === requestId ? { ...req, ...data } : req)
      );
      
      loadDashboardStats(); // Refresh stats
      alert('Request status updated successfully!');
    } catch (error) {
      alert('Failed to update request status');
    }
  };

  const handleSendAlert = async (recipients, message) => {
    try {
      const alertData = {
        sender_id: user?.id,
        recipients,
        message,
        communication_type: 'sms'
      };

      const { data, error } = await communicationService?.sendEmergencyAlert(alertData);
      
      if (error) {
        alert(`Error sending alert: ${error?.message}`);
        return;
      }

      alert(`Alert sent to ${recipients?.length} recipients successfully!`);
    } catch (error) {
      alert('Failed to send alert');
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const getUrgentRequests = () => allRequests?.filter(req => 
    req?.priority === 'critical' || (req?.priority === 'high' && req?.status === 'pending')
  )?.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="NGO Admin Dashboard"
          showProfile={true}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="NGO Admin Dashboard"
        showProfile={true}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <main className="container mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <Icon name="FileText" size={20} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats?.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-orange-100">
                <Icon name="Clock" size={20} className="text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats?.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100">
                <Icon name="Users" size={20} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Volunteers</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats?.totalVolunteers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100">
                <Icon name="Activity" size={20} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Active Volunteers</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats?.activeVolunteers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'dashboard', label: 'Overview', icon: 'Home' },
            { id: 'requests', label: 'Request Management', icon: 'FileText' },
            { id: 'volunteers', label: 'Volunteers', icon: 'Users' },
            { id: 'map', label: 'Command Center', icon: 'MapPin' },
            { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
            { id: 'predictions', label: 'Predictions', icon: 'TrendingUp' }
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
            {/* Urgent Requests */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Urgent Requests</h2>
              
              <div className="space-y-3">
                {getUrgentRequests()?.length > 0 ? (
                  getUrgentRequests()?.map((request) => (
                    <div key={request?.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request?.title}</h3>
                          <p className="text-sm text-gray-600">{request?.request_type} • {request?.priority} priority</p>
                          <p className="text-sm text-gray-500">
                            Requested by: {request?.requester?.full_name}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!request?.assigned_volunteer_id && (
                            <button
                              onClick={() => {
                                const volunteerId = prompt('Enter volunteer ID to assign:');
                                if (volunteerId) handleAssignVolunteer(request?.id, volunteerId);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Assign Volunteer
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Request Details:\n${request?.description}\n\nLocation: ${request?.location_address}`)}
                            className="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No urgent requests at the moment</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const message = prompt('Enter emergency alert message:');
                      if (message) {
                        const recipients = volunteers?.filter(v => v?.is_active)?.map(v => ({ id: v?.id }));
                        handleSendAlert(recipients, message);
                      }
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium"
                  >
                    Send Emergency Alert
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
                  >
                    Manage Requests
                  </button>
                  <button
                    onClick={() => setActiveTab('volunteers')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium"
                  >
                    Manage Volunteers
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communications</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time Updates</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      Live
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">5 new requests in last hour</p>
                  <p className="text-gray-600">3 volunteers came online</p>
                  <p className="text-gray-600">12 messages sent today</p>
                  <p className="text-gray-600">8 requests completed today</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <RequestManagement 
            requests={allRequests}
            volunteers={volunteers}
            onAssignVolunteer={handleAssignVolunteer}
            onUpdateStatus={handleUpdateRequestStatus}
          />
        )}

        {activeTab === 'volunteers' && (
          <VolunteerManagement 
            volunteers={volunteers}
            onSendAlert={handleSendAlert}
          />
        )}

        {activeTab === 'map' && (
          <AdminMap 
            requests={allRequests}
            volunteers={volunteers}
            onAssignVolunteer={handleAssignVolunteer}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalytics 
            requests={allRequests}
            volunteers={volunteers}
            stats={dashboardStats}
          />
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <WaterLevelPrediction />
            <LiveHelpSection />
          </div>
        )}
      </main>
    </div>
  );
};

export default NGOAdminDashboard;