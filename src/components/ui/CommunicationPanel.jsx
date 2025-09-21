import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const CommunicationPanel = ({ 
  isOpen = false, 
  onClose = () => {}, 
  requestId = null,
  participants = [],
  userRole = 'victim',
  className = ''
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'System',
      role: 'system',
      message: 'Emergency request has been submitted. Help is on the way.',
      timestamp: new Date(Date.now() - 300000),
      type: 'system'
    },
    {
      id: 2,
      sender: 'John Volunteer',
      role: 'volunteer',
      message: 'I am 5 minutes away from your location. Stay safe.',
      timestamp: new Date(Date.now() - 120000),
      type: 'message'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage?.trim()) return;

    const message = {
      id: Date.now(),
      sender: userRole === 'victim' ? 'You' : `${userRole} User`,
      role: userRole,
      message: newMessage?.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      if (userRole === 'victim') {
        const response = {
          id: Date.now() + 1,
          sender: 'Emergency Coordinator',
          role: 'ngo-admin',
          message: 'Message received. Volunteer has been notified.',
          timestamp: new Date(),
          type: 'message'
        };
        setMessages(prev => [...prev, response]);
      }
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'victim': return 'text-primary';
      case 'volunteer': return 'text-secondary';
      case 'ngo-admin': return 'text-accent';
      case 'system': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'victim': return { icon: 'User', label: 'Victim' };
      case 'volunteer': return { icon: 'Heart', label: 'Volunteer' };
      case 'ngo-admin': return { icon: 'Shield', label: 'Coordinator' };
      case 'system': return { icon: 'Bot', label: 'System' };
      default: return { icon: 'User', label: 'User' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-1000 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 emergency-transition"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-surface border-l border-border emergency-shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="MessageSquare" size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Emergency Chat</h3>
              {requestId && (
                <p className="text-xs text-muted-foreground font-data">
                  Request #{requestId}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={16}
          />
        </div>

        {/* Participants */}
        {participants?.length > 0 && (
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Users" size={14} />
              <span>{participants?.length} participant{participants?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((msg) => {
            const roleBadge = getRoleBadge(msg?.role);
            const isOwnMessage = msg?.sender === 'You' || msg?.role === userRole;
            
            return (
              <div
                key={msg?.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {/* Message bubble */}
                  <div
                    className={`
                      px-3 py-2 rounded-lg emergency-shadow
                      ${isOwnMessage 
                        ? 'bg-primary text-primary-foreground' 
                        : msg?.type === 'system' ?'bg-muted text-muted-foreground' :'bg-card text-card-foreground border border-border'
                      }
                    `}
                  >
                    {/* Sender info */}
                    {!isOwnMessage && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Icon name={roleBadge?.icon} size={12} className={getRoleColor(msg?.role)} />
                        <span className={`text-xs font-medium ${getRoleColor(msg?.role)}`}>
                          {msg?.sender}
                        </span>
                      </div>
                    )}
                    
                    {/* Message content */}
                    <p className="text-sm">{msg?.message}</p>
                    
                    {/* Timestamp */}
                    <p className={`text-xs mt-1 font-data ${
                      isOwnMessage 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTimestamp(msg?.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-3 py-2 rounded-lg emergency-shadow">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e?.target?.value)}
                onKeyPress={handleKeyPress}
                className="resize-none"
              />
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage?.trim()}
              iconName="Send"
              iconSize={16}
              className="min-h-44"
            />
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setNewMessage('I need immediate help!')}
                iconName="AlertTriangle"
                iconSize={14}
                className="text-error"
              >
                Urgent
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setNewMessage('Thank you for your help.')}
                iconName="Heart"
                iconSize={14}
                className="text-success"
              >
                Thanks
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Shield" size={12} />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;