import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { volunteerService } from '../../../services/volunteerService';
import { requestService } from '../../../services/requestService';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalAssignments: 0,
    completedAssignments: 0,
    activeAssignments: 0,
    availableRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id || userProfile?.role !== 'volunteer') return;

      try {
        // Load volunteer specific stats
        const { data: volunteerStats, error: volunteerError } = await volunteerService?.getVolunteerStats(user?.id);
        
        if (!volunteerError && volunteerStats) {
          setStats(prev => ({ ...prev, ...volunteerStats }));
        }

        // Load available requests count
        const { data: dashboardStats, error: dashboardError } = await requestService?.getDashboardStats(user?.id, userProfile?.role);
        
        if (!dashboardError && dashboardStats) {
          setStats(prev => ({ 
            ...prev, 
            availableRequests: dashboardStats?.pendingRequests || 0 
          }));
        }

      } catch (error) {
        console.error('Error loading volunteer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id, userProfile?.role]);

  const statCards = [
    {
      title: 'Total Assignments',
      value: stats?.totalAssignments,
      icon: 'FileText',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    },
    {
      title: 'Active Tasks',
      value: stats?.activeAssignments,
      icon: 'Activity',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-800'
    },
    {
      title: 'Completed',
      value: stats?.completedAssignments,
      icon: 'CheckCircle',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    {
      title: 'Available Requests',
      value: stats?.availableRequests,
      icon: 'Users',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-800'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4]?.map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-full w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat?.bgColor} mb-3`}>
              <Icon 
                name={stat?.icon} 
                size={24} 
                className={stat?.iconColor} 
              />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stat?.value ?? 0}
            </p>
            <p className="text-sm text-gray-600">
              {stat?.title}
            </p>
          </div>
        ))}
      </div>

      {/* Completion Rate */}
      {stats?.totalAssignments > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Completion Rate</span>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round((stats?.completedAssignments / stats?.totalAssignments) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((stats?.completedAssignments / stats?.totalAssignments) * 100)}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <Icon name="Search" size={16} />
            <span>Find Requests</span>
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <Icon name="MapPin" size={16} />
            <span>View Map</span>
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Online</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;