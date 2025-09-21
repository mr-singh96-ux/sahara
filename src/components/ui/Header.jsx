import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'victim', userName = 'User', isEmergencyMode = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: `/${userRole}-dashboard`, 
      icon: 'LayoutDashboard',
      roles: ['victim', 'volunteer', 'ngo-admin']
    },
    { 
      label: 'Request Help', 
      path: '/victim-dashboard', 
      icon: 'AlertTriangle',
      roles: ['victim']
    },
    { 
      label: 'Respond', 
      path: '/volunteer-dashboard', 
      icon: 'Users',
      roles: ['volunteer']
    },
    { 
      label: 'Coordinate', 
      path: '/ngo-admin-dashboard', 
      icon: 'Command',
      roles: ['ngo-admin']
    },
    { 
      label: 'Requests', 
      path: '/request-management', 
      icon: 'FileText',
      roles: ['victim', 'volunteer', 'ngo-admin']
    }
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Profile', path: '/profile', icon: 'User' }
  ];

  const visibleItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  )?.slice(0, 4);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/authentication-login');
  };

  const handleEmergencyAction = () => {
    if (userRole === 'victim') {
      // Trigger SOS functionality
      console.log('Emergency SOS activated');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border emergency-shadow ${isEmergencyMode ? 'bg-error' : ''}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">DisasterConnect</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {visibleItems?.map((item, index) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Button
                key={`${item?.path}-${index}`} // unique key by appending index
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="emergency-transition"
              >
                {item?.label}
              </Button>
            );
          })}


          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconName="MoreHorizontal"
              iconSize={16}
              className="emergency-transition"
            >
              More
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg emergency-shadow-lg z-1000">
                <div className="py-2">
                  {secondaryItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted emergency-transition flex items-center space-x-2"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted emergency-transition flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Info & Emergency Action */}
        <div className="flex items-center space-x-3">
          {userRole === 'victim' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEmergencyAction}
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={16}
              className="hidden sm:flex animate-pulse-slow"
            >
              SOS
            </Button>
          )}

          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </div>
            <span className="text-sm font-medium text-foreground">{userName}</span>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            iconName={isMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="lg:hidden"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border emergency-shadow">
          <div className="px-4 py-3 space-y-1">
            {/* Emergency SOS for mobile */}
            {userRole === 'victim' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEmergencyAction}
                iconName="AlertTriangle"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="mb-3 animate-pulse-slow"
              >
                Emergency SOS
              </Button>
            )}

            {/* Primary Navigation */}
            {visibleItems?.map((item, index) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={`${item?.path}-${index}`} // unique key by appending index
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full px-3 py-2 text-left text-sm rounded-md emergency-transition flex items-center space-x-3 ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              );
            })}

            <hr className="my-3 border-border" />

            {/* Secondary Navigation */}
            {secondaryItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted emergency-transition flex items-center space-x-3 rounded-md"
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted emergency-transition flex items-center space-x-3 rounded-md"
            >
              <Icon name="LogOut" size={16} />
              <span>Logout</span>
            </button>

            {/* User Info for mobile */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                </div>
                <span className="text-sm font-medium text-foreground">{userName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;