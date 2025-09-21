import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoginForm = ({ onSubmit, isLoading = false }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: 'victim', label: 'Victim - Need Help' },
    { value: 'volunteer', label: 'Volunteer - Provide Help' },
    { value: 'ngo-admin', label: 'NGO Admin - Coordinate Relief' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData?.email, formData?.password, formData?.role);
      
      if (error) {
        setErrors({ general: error?.message });
        return;
      }

      // Call parent onSubmit if provided
      onSubmit?.(formData);
      
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement actual forgot password functionality
    alert('Password reset functionality will redirect to reset page.');
  };

  const handleCreateAccount = () => {
    // TODO: Implement actual registration navigation
    alert('Registration functionality will redirect to sign-up page.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Demo Credentials Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
        <div className="space-y-1 text-xs text-blue-700">
          <div><strong>Admin:</strong> admin@disasterconnect.org / admin123</div>
          <div><strong>Volunteer:</strong> volunteer@disasterconnect.org / volunteer123</div>
          <div><strong>Victim:</strong> victim@disasterconnect.org / victim123</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors?.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-500" />
              <span className="text-sm text-red-700">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          disabled={loading || isLoading}
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
          disabled={loading || isLoading}
        />

        {/* Role Selection */}
        <Select
          label="Select Your Role"
          placeholder="Choose your role"
          options={roleOptions}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          required
          disabled={loading || isLoading}
        />

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={loading || isLoading}
          iconName="LogIn"
          iconPosition="left"
          iconSize={16}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Sign In
        </Button>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleForgotPassword}
            iconName="HelpCircle"
            iconPosition="left"
            iconSize={14}
            disabled={loading || isLoading}
          >
            Forgot Password?
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleCreateAccount}
              disabled={loading || isLoading}
              className="p-0 h-auto text-primary hover:text-primary/80"
            >
              Create Account
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;