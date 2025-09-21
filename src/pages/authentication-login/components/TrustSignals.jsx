import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is encrypted and protected'
    },
    {
      id: 2,
      icon: 'Award',
      title: 'Emergency Certified',
      description: 'Certified disaster response platform'
    },
    {
      id: 3,
      icon: 'Users',
      title: 'Trusted by NGOs',
      description: 'Used by relief organizations worldwide'
    }
  ];

  const partnerships = [
    'Red Cross Partnership',
    'UN Disaster Response',
    'Emergency Services Alliance',
    'Global Relief Network'
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4">
        {trustBadges?.map((badge) => (
          <div
            key={badge?.id}
            className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg emergency-shadow"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={badge?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-card-foreground">
                {badge?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {badge?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Partnership Information */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Handshake" size={16} className="text-secondary" />
          <span className="text-sm font-medium text-foreground">
            Trusted Partnerships
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {partnerships?.map((partner, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground p-2 bg-surface rounded border border-border text-center"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lock" size={16} className="text-success mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-success">
              <strong>Secure Emergency Access:</strong> Your login credentials are encrypted and your emergency data is protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </div>
      {/* Emergency Contact Info */}
      <div className="text-center p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <Icon name="Phone" size={14} className="text-warning" />
          <span className="text-xs font-medium text-warning">
            Emergency Hotline: 911
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          For immediate life-threatening emergencies, call emergency services directly
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;