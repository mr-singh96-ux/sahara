import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialLogin = ({ isLoading = false }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Mail',
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'Apple',
      color: 'bg-gray-900 hover:bg-black',
      textColor: 'text-white'
    }
  ];

  const handleSocialLogin = (provider) => {
    // Mock social login functionality
    console.log(`Initiating ${provider} login...`);
    alert(`${provider} login would be handled by Clerk authentication`);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            type="button"
            variant="outline"
            size="default"
            fullWidth
            onClick={() => handleSocialLogin(provider?.name)}
            disabled={isLoading}
            iconName={provider?.icon}
            iconPosition="left"
            iconSize={16}
            className="emergency-transition hover:scale-[1.02]"
          >
            Continue with {provider?.name}
          </Button>
        ))}
      </div>
      {/* Emergency Access Note */}
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-primary">
              <strong>Quick Access:</strong> Social login provides faster authentication during emergency situations when every second counts.
            </p>
          </div>
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;