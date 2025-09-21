import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import TrustSignals from './components/TrustSignals';

const AuthenticationLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTrustSignals, setShowTrustSignals] = useState(true);

  useEffect(() => {
    // Check if user is on mobile to optimize layout
    const checkMobile = () => {
      setShowTrustSignals(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate authentication process
      console.log('Authenticating user:', formData);
      
      // Mock authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user session (mock)
      localStorage.setItem('userRole', formData?.role);
      localStorage.setItem('userEmail', formData?.email);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTimestamp', new Date()?.toISOString());
      
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In - DisasterConnect | Emergency Response Platform</title>
        <meta 
          name="description" 
          content="Secure login to DisasterConnect emergency response platform. Access victim assistance, volunteer coordination, and NGO admin dashboards." 
        />
        <meta name="keywords" content="disaster response, emergency login, victim assistance, volunteer platform" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Main Container */}
        <div className="flex min-h-screen">
          {/* Left Panel - Login Form */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Welcome Header */}
              <WelcomeHeader />

              {/* Login Form */}
              <div className="bg-card border border-border rounded-xl p-6 emergency-shadow-lg">
                <LoginForm 
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                />
              </div>

              {/* Social Login */}
              <div className="bg-card border border-border rounded-xl p-6 emergency-shadow">
                <SocialLogin isLoading={isLoading} />
              </div>

              {/* Mobile Trust Signals */}
              {!showTrustSignals && (
                <div className="bg-card border border-border rounded-xl p-4 emergency-shadow">
                  <TrustSignals />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Trust Signals (Desktop) */}
          {showTrustSignals && (
            <div className="hidden lg:flex lg:w-96 bg-muted/30 border-l border-border">
              <div className="flex items-center justify-center p-8 w-full">
                <TrustSignals />
              </div>
            </div>
          )}
        </div>

        {/* Emergency Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-error text-error-foreground p-2 text-center text-xs font-medium emergency-shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-error-foreground rounded-full animate-pulse"></div>
            <span>For life-threatening emergencies, call 911 immediately</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
            <div className="bg-card border border-border rounded-lg p-6 emergency-shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-card-foreground font-medium">
                  Authenticating...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthenticationLogin;