import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SOSButton = ({ onSOSActivate = () => {}, isActive = false }) => {
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleSOSActivation();
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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSOSPress = () => {
    if (isActive) {
      onSOSActivate({ type: 'cancel' });
      return;
    }

    setCountdown(5);
    getCurrentLocation();
  };

  const handleSOSActivation = () => {
    const sosData = {
      type: 'activate',
      timestamp: new Date()?.toISOString(),
      location: location,
      priority: 'critical',
      status: 'emergency'
    };

    onSOSActivate(sosData);
    setCountdown(0);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Location Status */}
      {isGettingLocation && (
        <div className="absolute -top-12 bg-surface border border-border rounded-lg px-3 py-1 emergency-shadow mb-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="MapPin" size={12} className="animate-pulse" />
            <span>Getting location...</span>
          </div>
        </div>
      )}

      {/* Countdown Ring */}
      {countdown > 0 && (
        <div className="absolute inset-0 rounded-full border-4 border-error animate-pulse">
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-error emergency-transition"
            style={{
              transform: `rotate(${(5 - countdown) * 72}deg)`,
              transformOrigin: 'center'
            }}
          />
        </div>
      )}

      {/* SOS Button */}
      <Button
        variant={isActive ? "secondary" : "destructive"}
        size="xl"
        onClick={handleSOSPress}
        disabled={countdown > 0}
        className={`
          w-24 h-24 rounded-full emergency-shadow-lg emergency-transition
          ${isActive ? 'animate-pulse bg-success hover:bg-success' : 'bg-error hover:bg-error'}
          ${countdown > 0 ? 'scale-110 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        {countdown > 0 ? (
          <span className="text-3xl font-bold font-data text-white">{countdown}</span>
        ) : isActive ? (
          <Icon name="Square" size={32} color="white" />
        ) : (
          <Icon name="AlertTriangle" size={32} color="white" />
        )}
      </Button>

      {/* Button Label */}
      <div className="mt-3 text-center">
        <span className={`text-sm font-semibold ${
          isActive ? 'text-success' : 'text-error'
        }`}>
          {countdown > 0 
            ? 'Activating Emergency...' 
            : isActive 
              ? 'Emergency Active - Tap to Cancel' :'Emergency SOS'
          }
        </span>
        <p className="text-xs text-muted-foreground mt-1">
          {isActive ? 'Help is on the way' : 'Hold for 5 seconds to activate'}
        </p>
      </div>
    </div>
  );
};

export default SOSButton;