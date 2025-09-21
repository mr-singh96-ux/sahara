import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyActionButton = ({ 
  userRole = 'victim',
  onEmergencyAction = () => {},
  isEmergencyActive = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Only show for victims
  if (userRole !== 'victim') return null;

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleEmergencyActivation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          accuracy: position?.coords?.accuracy,
          timestamp: new Date()?.toISOString()
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        // Continue with emergency even without location
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleEmergencyPress = () => {
    if (isEmergencyActive) {
      // Cancel emergency
      setCountdown(0);
      setIsPressed(false);
      onEmergencyAction({ type: 'cancel' });
      return;
    }

    // Start countdown
    setIsPressed(true);
    setCountdown(5);
    getCurrentLocation();
  };

  const handleEmergencyActivation = () => {
    const emergencyData = {
      type: 'activate',
      timestamp: new Date()?.toISOString(),
      location: location,
      priority: 'critical',
      status: 'emergency'
    };

    onEmergencyAction(emergencyData);
    setIsPressed(false);
    setCountdown(0);
  };

  const handleQuickHelp = (type) => {
    getCurrentLocation();
    
    const helpData = {
      type: 'quick_help',
      helpType: type,
      timestamp: new Date()?.toISOString(),
      location: location,
      priority: type === 'medical' ? 'critical' : 'high'
    };

    onEmergencyAction(helpData);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-9999 ${className}`}>
      {/* Quick Help Options */}
      {!isEmergencyActive && !isPressed && (
        <div className="mb-4 space-y-2">
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleQuickHelp('medical')}
            iconName="Heart"
            iconPosition="left"
            iconSize={16}
            className="w-full emergency-shadow-lg emergency-transition hover:scale-105"
          >
            Medical Help
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickHelp('shelter')}
            iconName="Home"
            iconPosition="left"
            iconSize={16}
            className="w-full emergency-shadow-lg emergency-transition hover:scale-105"
          >
            Need Shelter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickHelp('supplies')}
            iconName="Package"
            iconPosition="left"
            iconSize={16}
            className="w-full emergency-shadow-lg emergency-transition hover:scale-105"
          >
            Need Supplies
          </Button>
        </div>
      )}
      {/* Main Emergency Button */}
      <div className="relative">
        {/* Countdown Ring */}
        {countdown > 0 && (
          <div className="absolute inset-0 rounded-full border-4 border-error animate-pulse-slow">
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-error emergency-transition"
              style={{
                transform: `rotate(${(5 - countdown) * 72}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>
        )}

        {/* Location Status */}
        {isGettingLocation && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-surface border border-border rounded-lg px-3 py-1 emergency-shadow">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} className="animate-pulse" />
              <span>Getting location...</span>
            </div>
          </div>
        )}

        {/* Emergency Button */}
        <Button
          variant={isEmergencyActive ? "secondary" : "destructive"}
          size="lg"
          onClick={handleEmergencyPress}
          disabled={countdown > 0}
          className={`
            w-16 h-16 rounded-full emergency-shadow-lg emergency-transition
            ${isEmergencyActive ? 'animate-pulse-slow' : ''}
            ${isPressed ? 'scale-110' : 'hover:scale-105'}
            ${countdown > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {countdown > 0 ? (
            <span className="text-2xl font-bold font-data">{countdown}</span>
          ) : isEmergencyActive ? (
            <Icon name="Square" size={24} />
          ) : (
            <Icon name="AlertTriangle" size={24} />
          )}
        </Button>

        {/* Button Label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <span className={`text-xs font-medium ${
            isEmergencyActive ? 'text-success' : 'text-error'
          }`}>
            {countdown > 0 
              ? 'Activating...' 
              : isEmergencyActive 
                ? 'Active' :'SOS'
            }
          </span>
        </div>
      </div>
      {/* Emergency Status Panel */}
      {isEmergencyActive && (
        <div className="absolute bottom-20 right-0 w-64 bg-surface border border-border rounded-lg emergency-shadow-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="AlertTriangle" size={16} className="text-error animate-pulse" />
            <span className="font-semibold text-error">Emergency Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                Activated {new Date()?.toLocaleTimeString()}
              </span>
            </div>
            
            {location && (
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} className="text-success" />
                <span className="text-success text-xs font-data">
                  Location shared
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-primary" />
              <span className="text-primary">Help is on the way</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEmergencyPress}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="w-full mt-3"
          >
            Cancel Emergency
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmergencyActionButton;