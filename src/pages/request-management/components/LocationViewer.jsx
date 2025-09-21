import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationViewer = ({ request, userRole }) => {
  const [showFullMap, setShowFullMap] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  const { coordinates, address } = request?.location;

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates?.lat},${coordinates?.lng}`;
  };

  const getMapEmbedUrl = () => {
    return `https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=15&output=embed`;
  };

  const handleLocationToggle = () => {
    setLocationSharing(!locationSharing);
    // In real app, this would update the backend
  };

  const copyCoordinates = () => {
    navigator.clipboard?.writeText(`${coordinates?.lat}, ${coordinates?.lng}`);
    // Show toast notification in real app
  };

  return (
    <div className="bg-surface rounded-lg border border-border emergency-shadow">
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="MapPin" size={20} className="text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Location Information</h3>
              <p className="text-sm text-muted-foreground">
                {userRole === 'victim' ? 'Your location' : 'Victim location'}
              </p>
            </div>
          </div>

          {userRole === 'victim' && (
            <Button
              variant={locationSharing ? "success" : "outline"}
              size="sm"
              onClick={handleLocationToggle}
              iconName={locationSharing ? "Eye" : "EyeOff"}
              iconPosition="left"
              iconSize={14}
            >
              {locationSharing ? 'Sharing' : 'Share Location'}
            </Button>
          )}
        </div>
      </div>
      <div className="p-4 lg:p-6">
        {/* Address Information */}
        <div className="mb-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="Home" size={16} className="text-muted-foreground mt-1 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{address}</p>
              <p className="text-xs text-muted-foreground">Address</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="Navigation" size={16} className="text-muted-foreground mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-data text-foreground">
                  {coordinates?.lat?.toFixed(6)}, {coordinates?.lng?.toFixed(6)}
                </p>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={copyCoordinates}
                  iconName="Copy"
                  iconSize={12}
                  className="opacity-60 hover:opacity-100"
                />
              </div>
              <p className="text-xs text-muted-foreground">Coordinates</p>
            </div>
          </div>

          {request?.locationAccuracy && (
            <div className="flex items-start space-x-3">
              <Icon name="Target" size={16} className="text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">±{request?.locationAccuracy}m</p>
                <p className="text-xs text-muted-foreground">Location Accuracy</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div className="mb-4">
          <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
            {locationSharing ? (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Request Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={getMapEmbedUrl()}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Icon name="EyeOff" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Location sharing disabled</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {locationSharing && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullMap(true)}
              iconName="Maximize"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              View Full Map
            </Button>

            {(userRole === 'volunteer' || userRole === 'ngo-admin') && (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.open(getDirectionsUrl(), '_blank')}
                iconName="Navigation"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                Get Directions
              </Button>
            )}
          </div>
        )}

        {/* Location Status */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                locationSharing ? 'bg-success animate-pulse' : 'bg-muted-foreground'
              }`} />
              <span className="text-muted-foreground">
                {locationSharing ? 'Location active' : 'Location disabled'}
              </span>
            </div>
            
            <span className="text-muted-foreground font-data">
              Updated {new Date(request.locationUpdatedAt || request.createdAt)?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      {/* Full Map Modal */}
      {showFullMap && (
        <div className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Request Location</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullMap(false)}
                iconName="X"
                iconSize={16}
              />
            </div>

            {/* Full Map */}
            <div className="flex-1 p-4">
              <div className="w-full h-full rounded-lg overflow-hidden border border-border">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Full Request Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={getMapEmbedUrl()}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>{address}</p>
                  <p className="font-data">{coordinates?.lat?.toFixed(6)}, {coordinates?.lng?.toFixed(6)}</p>
                </div>
                
                {(userRole === 'volunteer' || userRole === 'ngo-admin') && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.open(getDirectionsUrl(), '_blank')}
                    iconName="Navigation"
                    iconPosition="left"
                    iconSize={14}
                  >
                    Get Directions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationViewer;