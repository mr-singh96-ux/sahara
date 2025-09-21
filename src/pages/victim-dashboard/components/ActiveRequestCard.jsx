import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveRequestCard = ({ request, onUpdateStatus, onViewDetails }) => {
  const { userProfile } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return 'AlertCircle';
      case 'food': return 'Utensils';
      case 'water': return 'Droplets';
      case 'shelter': return 'Home';
      case 'medical': return 'Heart';
      case 'transportation': return 'Car';
      case 'clothing': return 'Shirt';
      default: return 'HelpCircle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString)?.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100">
              <Icon 
                name={getRequestTypeIcon(request?.request_type)} 
                size={20} 
                className="text-blue-600" 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {request?.title || 'Untitled Request'}
              </h3>
              <p className="text-sm text-gray-500">
                Created {formatDate(request?.created_at)}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request?.status)}`}>
            {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2">
          {request?.description || 'No description available'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Priority</p>
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getPriorityColor(request?.priority)}`}>
              {request?.priority?.charAt(0)?.toUpperCase() + request?.priority?.slice(1)}
            </span>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">People Affected</p>
            <p className="text-sm font-semibold text-gray-900">
              {request?.people_affected || 0}
            </p>
          </div>
        </div>

        {/* Location */}
        {request?.location_address && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
            <p className="text-sm text-gray-700 flex items-center">
              <Icon name="MapPin" size={14} className="text-gray-400 mr-1" />
              {request?.location_address}
            </p>
          </div>
        )}

        {/* Assigned Volunteer */}
        {request?.assigned_volunteer && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Assigned Volunteer</p>
            <p className="text-sm text-gray-700 flex items-center">
              <Icon name="User" size={14} className="text-gray-400 mr-1" />
              {request?.assigned_volunteer?.full_name || 'Unknown Volunteer'}
            </p>
          </div>
        )}

        {/* Progress Status */}
        {request?.status === 'in-progress' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 flex items-center">
              <Icon name="Clock" size={14} className="text-blue-500 mr-2" />
              Help is on the way! Your volunteer is working on this request.
            </p>
          </div>
        )}

        {/* Completion Status */}
        {request?.status === 'completed' && request?.completed_at && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 flex items-center">
              <Icon name="CheckCircle" size={14} className="text-green-500 mr-2" />
              Request completed on {formatDate(request?.completed_at)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(request)}
            iconName="Eye"
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            View Details
          </Button>
          
          {request?.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus?.(request?.id, 'cancelled')}
              iconName="X"
              iconPosition="left"
              iconSize={14}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveRequestCard;