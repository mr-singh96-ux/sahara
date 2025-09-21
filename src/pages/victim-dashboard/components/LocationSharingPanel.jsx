import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationSharingPanel = ({ 
  onLocationUpdate = () => {},
  onPrivacyChange = () => {}
}) => {
  const [location, setLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError(null);

    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          accuracy: position?.coords?.accuracy,
          timestamp: new Date()?.toISOString()
        };
        
        setLocation(newLocation);
        setAccuracy(position?.coords?.accuracy);
        setLastUpdated(new Date());
        setIsGettingLocation(false);
        onLocationUpdate(newLocation);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error?.code) {
          case error?.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error?.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error?.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    if (isSharing) {
      getCurrentLocation();
      // Update location every 30 seconds when sharing is enabled
      const interval = setInterval(getCurrentLocation, 30000);
      return () => clearInterval(interval);
    }
  }, [isSharing]);

  const toggleLocationSharing = () => {
    const newSharingState = !isSharing;
    setIsSharing(newSharingState);
    onPrivacyChange(newSharingState);
    
    if (!newSharingState) {
      setLocation(null);
      setLastUpdated(null);
      setError(null);
    } else {
      getCurrentLocation();
    }
  };

  const formatCoordinates = (lat, lng) => {
    return `${lat?.toFixed(6)}, ${lng?.toFixed(6)}`;
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return timestamp?.toLocaleTimeString();
  };

  const getAccuracyStatus = (accuracy) => {
    if (!accuracy) return { text: 'Unknown', color: 'text-muted-foreground' };
    if (accuracy <= 10) return { text: 'Excellent', color: 'text-success' };
    if (accuracy <= 50) return { text: 'Good', color: 'text-primary' };
    if (accuracy <= 100) return { text: 'Fair', color: 'text-warning' };
    return { text: 'Poor', color: 'text-error' };
  };

  const accuracyStatus = getAccuracyStatus(accuracy);

  return (
    <div className="bg-card border border-border rounded-lg emergency-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${isSharing ? 'bg-success/10' : 'bg-muted'}
          `}>
            <Icon 
              name="MapPin" 
              size={20} 
              className={isSharing ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Location Sharing</h3>
            <p className="text-sm text-muted-foreground">
              {isSharing ? 'Your location is being shared' : 'Location sharing is disabled'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isSharing ? "destructive" : "default"}
            size="sm"
            onClick={toggleLocationSharing}
            iconName={isSharing ? "EyeOff" : "Eye"}
            iconPosition="left"
            iconSize={16}
          >
            {isSharing ? 'Stop Sharing' : 'Start Sharing'}
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`
              w-3 h-3 rounded-full
              ${isSharing 
                ? isGettingLocation 
                  ? 'bg-warning animate-pulse' 
                  : location 
                    ? 'bg-success' 
                    : 'bg-error' 
                : 'bg-muted-foreground'
              }
            `} />
            <span className="text-sm font-medium text-foreground">
              {isSharing 
                ? isGettingLocation 
                  ? 'Getting location...' 
                  : location 
                    ? 'Location active' 
                    : 'Location unavailable' 
                : 'Location sharing disabled'
              }
            </span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground font-data">
              Updated {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        {/* Location Details */}
        {isSharing && location && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Current Coordinates
              </label>
              <div className="flex items-center space-x-2 p-2 bg-input border border-border rounded-md">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-sm font-data text-foreground">
                  {formatCoordinates(location?.latitude, location?.longitude)}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => navigator.clipboard?.writeText(formatCoordinates(location?.latitude, location?.longitude))}
                  iconName="Copy"
                  iconSize={12}
                  className="ml-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Accuracy
                </label>
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} className={accuracyStatus?.color} />
                  <span className={`text-sm font-medium ${accuracyStatus?.color}`}>
                    {accuracyStatus?.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (±{accuracy?.toFixed(0)}m)
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Last Update
                </label>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-data">
                    {formatLastUpdated(lastUpdated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="h-32 bg-muted/30 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Current Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${location?.latitude},${location?.longitude}&z=15&output=embed`}
                  className="border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-error/5 border border-error/20 rounded-lg">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error">Location Error</p>
              <p className="text-xs text-error/80">{error}</p>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="flex items-start space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Privacy & Security</p>
            <p className="text-xs text-muted-foreground">
              Your location is only shared with emergency responders and assigned volunteers. 
              You can stop sharing at any time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={!isSharing || isGettingLocation}
            loading={isGettingLocation}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Refresh Location
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://maps.google.com?q=${location?.latitude},${location?.longitude}`, '_blank')}
            disabled={!location}
            iconName="ExternalLink"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            View in Maps
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationSharingPanel;