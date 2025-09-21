import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmergencyContactsPanel = ({ 
  contacts = [],
  onAddContact = () => {},
  onEditContact = () => {},
  onDeleteContact = () => {},
  onCallContact = () => {}
}) => {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });

  // Mock emergency contacts
  const defaultContacts = [
    {
      id: 1,
      name: 'Emergency Services',
      phone: '911',
      relationship: 'Emergency',
      isPrimary: true,
      isSystem: true,
      icon: 'Phone'
    },
    {
      id: 2,
      name: 'Local Police',
      phone: '(555) 123-4567',
      relationship: 'Police',
      isPrimary: false,
      isSystem: true,
      icon: 'Shield'
    },
    {
      id: 3,
      name: 'Fire Department',
      phone: '(555) 234-5678',
      relationship: 'Fire',
      isPrimary: false,
      isSystem: true,
      icon: 'Flame'
    },
    {
      id: 4,
      name: 'John Smith',
      phone: '(555) 345-6789',
      relationship: 'Spouse',
      isPrimary: true,
      isSystem: false,
      icon: 'User'
    },
    {
      id: 5,
      name: 'Mary Johnson',
      phone: '(555) 456-7890',
      relationship: 'Sister',
      isPrimary: false,
      isSystem: false,
      icon: 'User'
    }
  ];

  const allContacts = contacts?.length > 0 ? contacts : defaultContacts;

  const handleAddContact = () => {
    if (newContact?.name && newContact?.phone) {
      const contact = {
        id: Date.now(),
        ...newContact,
        isSystem: false,
        icon: 'User'
      };
      onAddContact(contact);
      setNewContact({ name: '', phone: '', relationship: '', isPrimary: false });
      setIsAddingContact(false);
    }
  };

  const handleCall = (contact) => {
    // In a real app, this would initiate a call
    onCallContact(contact);
    console.log(`Calling ${contact?.name} at ${contact?.phone}`);
  };

  const getContactIcon = (contact) => {
    if (contact?.icon) return contact?.icon;
    switch (contact?.relationship?.toLowerCase()) {
      case 'emergency': return 'Phone';
      case 'police': return 'Shield';
      case 'fire': return 'Flame';
      case 'medical': return 'Heart';
      case 'spouse': return 'Heart';
      case 'parent': return 'Users';
      case 'child': return 'Baby';
      default: return 'User';
    }
  };

  const getContactColor = (contact) => {
    if (contact?.isSystem) {
      switch (contact?.relationship?.toLowerCase()) {
        case 'emergency': return 'text-error';
        case 'police': return 'text-primary';
        case 'fire': return 'text-warning';
        case 'medical': return 'text-success';
        default: return 'text-muted-foreground';
      }
    }
    return contact?.isPrimary ? 'text-primary' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg emergency-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Phone" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Emergency Contacts</h3>
            <p className="text-sm text-muted-foreground">Quick access to important numbers</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingContact(!isAddingContact)}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Add Contact
        </Button>
      </div>
      {/* Add Contact Form */}
      {isAddingContact && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Name"
                type="text"
                placeholder="Contact name"
                value={newContact?.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e?.target?.value }))}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={newContact?.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e?.target?.value }))}
              />
            </div>
            <Input
              label="Relationship"
              type="text"
              placeholder="e.g., Spouse, Parent, Friend"
              value={newContact?.relationship}
              onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e?.target?.value }))}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={newContact?.isPrimary}
                onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e?.target?.checked }))}
                className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
              />
              <label htmlFor="isPrimary" className="text-sm text-foreground">
                Mark as primary contact
              </label>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddContact}
                disabled={!newContact?.name || !newContact?.phone}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
              >
                Add Contact
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingContact(false);
                  setNewContact({ name: '', phone: '', relationship: '', isPrimary: false });
                }}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Contacts List */}
      <div className="p-4">
        <div className="space-y-3">
          {allContacts?.map((contact) => (
            <div
              key={contact?.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border emergency-transition
                ${contact?.isSystem 
                  ? 'bg-error/5 border-error/20' 
                  : contact?.isPrimary 
                    ? 'bg-primary/5 border-primary/20' :'bg-muted/30 border-border'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${contact?.isSystem 
                    ? 'bg-error/10' 
                    : contact?.isPrimary 
                      ? 'bg-primary/10' :'bg-muted'
                  }
                `}>
                  <Icon 
                    name={getContactIcon(contact)} 
                    size={18} 
                    className={getContactColor(contact)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-card-foreground">{contact?.name}</h4>
                    {contact?.isPrimary && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-data">{contact?.phone}</p>
                  <p className="text-xs text-muted-foreground">{contact?.relationship}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleCall(contact)}
                  iconName="Phone"
                  iconSize={16}
                  className={`
                    ${contact?.isSystem 
                      ? 'bg-error hover:bg-error/90' :'bg-primary hover:bg-primary/90'
                    }
                  `}
                />
                {!contact?.isSystem && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditContact(contact)}
                      iconName="Edit"
                      iconSize={16}
                      className="text-muted-foreground hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteContact(contact)}
                      iconName="Trash2"
                      iconSize={16}
                      className="text-error hover:text-error hover:bg-error/10"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCall(allContacts?.find(c => c?.phone === '911'))}
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Call 911
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCall(allContacts?.find(c => c?.isPrimary && !c?.isSystem))}
              iconName="Heart"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Call Primary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsPanel;