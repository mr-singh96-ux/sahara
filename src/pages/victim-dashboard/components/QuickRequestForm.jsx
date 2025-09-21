import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { requestService } from '../../../services/requestService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickRequestForm = ({ onRequestCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    request_type: '',
    priority: 'medium',
    location_address: '',
    people_affected: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const requestTypeOptions = [
    { value: 'emergency', label: '🚨 Emergency' },
    { value: 'food', label: '🍽️ Food' },
    { value: 'water', label: '💧 Water' },
    { value: 'shelter', label: '🏠 Shelter' },
    { value: 'medical', label: '🏥 Medical' },
    { value: 'transportation', label: '🚗 Transportation' },
    { value: 'clothing', label: '👕 Clothing' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical Priority' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData?.request_type) {
      newErrors.request_type = 'Request type is required';
    }

    if (!formData?.location_address?.trim()) {
      newErrors.location_address = 'Location address is required';
    }

    if (!formData?.people_affected || formData?.people_affected < 1) {
      newErrors.people_affected = 'People affected must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const requestData = {
        ...formData,
        requester_id: user?.id,
        people_affected: parseInt(formData?.people_affected) || 1
      };

      const { data, error } = await requestService?.createRequest(requestData);

      if (error) {
        setErrors({ general: error?.message });
        return;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        request_type: '',
        priority: 'medium',
        location_address: '',
        people_affected: 1
      });
      
      // Notify parent component
      onRequestCreated?.(data);

    } catch (error) {
      setErrors({ general: 'Failed to create request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors?.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors?.general}
          </div>
        )}

        {/* Title */}
        <Input
          label="Request Title"
          placeholder="Brief description of what you need"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          disabled={loading}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Detailed description of your situation and needs"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            disabled={loading}
            required
          />
          {errors?.description && (
            <p className="mt-1 text-sm text-red-600">{errors?.description}</p>
          )}
        </div>

        {/* Request Type */}
        <Select
          label="Request Type"
          placeholder="Select type of help needed"
          options={requestTypeOptions}
          value={formData?.request_type}
          onChange={(value) => handleInputChange('request_type', value)}
          error={errors?.request_type}
          disabled={loading}
          required
        />

        {/* Priority */}
        <Select
          label="Priority Level"
          options={priorityOptions}
          value={formData?.priority}
          onChange={(value) => handleInputChange('priority', value)}
          disabled={loading}
          required
        />

        {/* Location */}
        <Input
          label="Location Address"
          placeholder="Where help is needed"
          value={formData?.location_address}
          onChange={(e) => handleInputChange('location_address', e?.target?.value)}
          error={errors?.location_address}
          disabled={loading}
          required
        />

        {/* People Affected */}
        <Input
          label="Number of People Affected"
          type="number"
          min="1"
          value={formData?.people_affected}
          onChange={(e) => handleInputChange('people_affected', e?.target?.value)}
          error={errors?.people_affected}
          disabled={loading}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={loading}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Create Request
        </Button>
      </form>
    </div>
  );
};

export default QuickRequestForm;