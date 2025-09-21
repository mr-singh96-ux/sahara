import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requestService';
import { communicationService } from '../../services/communicationService';
import Header from '../../components/ui/Header';
import QuickRequestForm from './components/QuickRequestForm';
import ActiveRequestCard from './components/ActiveRequestCard';
import RequestHistoryCard from './components/RequestHistoryCard';
import SOSButton from './components/SOSButton';
import EmergencyContactsPanel from './components/EmergencyContactsPanel';
import LocationSharingPanel from './components/LocationSharingPanel';
import Icon from '../../components/AppIcon';


const VictimDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load user requests
  const loadRequests = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const { data, error } = await requestService?.getUserRequests(user?.id, userProfile?.role);
      
      if (error) {
        console.error('Error loading requests:', error?.message);
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Network error loading requests:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Load dashboard statistics
  const loadStats = async () => {
    try {
      const { data, error } = await requestService?.getDashboardStats(user?.id, userProfile?.role);
      
      if (error) {
        console.error('Error loading stats:', error?.message);
        return;
      }

      setStats(data || stats);
    } catch (error) {
      console.error('Network error loading stats:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user?.id && userProfile?.role) {
      loadRequests();
      loadStats();
    }
  }, [user?.id, userProfile?.role]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const requestChannel = requestService?.subscribeToRequests((payload) => {
      // Refresh requests when changes occur
      loadRequests();
      loadStats();
    });

    const commChannel = communicationService?.subscribeToCommunications((payload) => {
      // Handle new messages
      console.log('New message received:', payload);
    }, user?.id);

    return () => {
      requestService?.unsubscribeFromRequests(requestChannel);
      communicationService?.unsubscribeFromCommunications(commChannel);
    };
  }, [user?.id]);

  const handleRequestCreated = (newRequest) => {
    setRequests(prev => [newRequest, ...prev]);
    loadStats(); // Refresh stats
    setActiveTab('requests'); // Switch to requests tab to show the new request
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const { data, error } = await requestService?.updateRequestStatus(requestId, status);
      
      if (error) {
        alert(`Error updating request: ${error?.message}`);
        return;
      }

      // Update local state
      setRequests(prev => 
        prev?.map(req => req?.id === requestId ? { ...req, ...data } : req)
      );
      
      loadStats(); // Refresh stats
    } catch (error) {
      alert('Failed to update request status');
    }
  };

  const handleViewDetails = (request) => {
    // TODO: Navigate to request details page or open modal
    console.log('View request details:', request);
    alert(`Request Details: ${request?.title}\nStatus: ${request?.status}\nDescription: ${request?.description}`);
  };

  const handleEmergencyCall = () => {
    // TODO: Implement actual emergency calling
    alert('Emergency services would be contacted. In a real app, this would dial emergency numbers or send alerts.');
  };

  const handleRefresh = () => {
    loadRequests(true);
    loadStats();
  };

  const getActiveRequests = () => requests?.filter(req => req?.status !== 'completed' && req?.status !== 'cancelled') || [];
  const getRecentRequests = () => requests?.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Victim Dashboard"
          showProfile={true}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Victim Dashboard"
        showProfile={true}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <main className="container mx-auto px-4 py-6">
        {/* Emergency SOS Section */}
        <div className="mb-6">
          <SOSButton onClick={handleEmergencyCall} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <Icon name="FileText" size={20} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalRequests}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100">
                <Icon name="Activity" size={20} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.inProgressRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.completedRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
            { id: 'new-request', label: 'New Request', icon: 'Plus' },
            { id: 'requests', label: 'My Requests', icon: 'FileText' },
            { id: 'contacts', label: 'Emergency Contacts', icon: 'Phone' },
            { id: 'location', label: 'Location', icon: 'MapPin' }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Requests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Requests</h2>
              <div className="space-y-4">
                {getActiveRequests()?.length > 0 ? (
                  getActiveRequests()?.map((request) => (
                    <ActiveRequestCard
                      key={request?.id}
                      request={request}
                      onUpdateStatus={handleUpdateStatus}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Icon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active requests</p>
                    <button
                      onClick={() => setActiveTab('new-request')}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Create your first request
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {getRecentRequests()?.length > 0 ? (
                  getRecentRequests()?.map((request) => (
                    <RequestHistoryCard
                      key={request?.id}
                      request={request}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Icon name="Clock" size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'new-request' && (
          <QuickRequestForm onRequestCreated={handleRequestCreated} />
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All My Requests</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests?.length > 0 ? (
                requests?.map((request) => (
                  <ActiveRequestCard
                    key={request?.id}
                    request={request}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
                  <Icon name="FileText" size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No requests yet</p>
                  <button
                    onClick={() => setActiveTab('new-request')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Create Your First Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <EmergencyContactsPanel />
        )}

        {activeTab === 'location' && (
          <LocationSharingPanel />
        )}
      </main>
    </div>
  );
};

export default VictimDashboard;