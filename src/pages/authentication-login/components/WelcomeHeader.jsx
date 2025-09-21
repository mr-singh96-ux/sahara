import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center emergency-shadow">
          <Icon name="Shield" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">DisasterConnect</h1>
          <p className="text-sm text-muted-foreground">Emergency Response Platform</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Welcome Back
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Sign in to access your emergency response dashboard and connect with help when you need it most.
        </p>
      </div>

      {/* Current Status Indicator */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span className="text-xs text-success font-medium">
          System Operational
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">24/7</div>
          <div className="text-xs text-muted-foreground">Available</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-lg font-bold text-secondary">1,247</div>
          <div className="text-xs text-muted-foreground">Helped</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">&lt;5min</div>
          <div className="text-xs text-muted-foreground">Response</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;