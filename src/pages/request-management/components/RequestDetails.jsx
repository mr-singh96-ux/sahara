import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RequestDetails = ({ request, userRole }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryDetails = (category) => {
    const categories = {
      medical: { icon: 'Heart', color: 'text-error', bg: 'bg-error/10' },
      shelter: { icon: 'Home', color: 'text-primary', bg: 'bg-primary/10' },
      food: { icon: 'Utensils', color: 'text-warning', bg: 'bg-warning/10' },
      rescue: { icon: 'Shield', color: 'text-accent', bg: 'bg-accent/10' },
      supplies: { icon: 'Package', color: 'text-secondary', bg: 'bg-secondary/10' }
    };
    return categories?.[category] || { icon: 'HelpCircle', color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const categoryDetails = getCategoryDetails(request?.category);

  return (
    <div className="bg-surface rounded-lg border border-border emergency-shadow">
      {/* Request Overview */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Request Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Icon name="User" size={16} className="text-muted-foreground mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{request?.victimName}</p>
                    <p className="text-xs text-muted-foreground">Victim</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Phone" size={16} className="text-muted-foreground mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{request?.contactNumber}</p>
                    <p className="text-xs text-muted-foreground">Contact Number</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Clock" size={16} className="text-muted-foreground mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatDate(request?.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Request Submitted</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name={categoryDetails?.icon} size={16} className={`${categoryDetails?.color} mt-1 shrink-0`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground capitalize">{request?.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryDetails?.color} ${categoryDetails?.bg}`}>
                        {request?.urgency} Priority
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Category & Priority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Assignment Details</h3>
            
            <div className="space-y-3">
              {request?.assignedTo && (
                <div className="flex items-start space-x-3">
                  <Icon name="UserCheck" size={16} className="text-success mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{request?.assignedVolunteer}</p>
                    <p className="text-xs text-muted-foreground">Assigned Volunteer</p>
                  </div>
                </div>
              )}

              {request?.estimatedTime && (
                <div className="flex items-start space-x-3">
                  <Icon name="Timer" size={16} className="text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{request?.estimatedTime}</p>
                    <p className="text-xs text-muted-foreground">Estimated Response Time</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Icon name="MapPin" size={16} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{request?.location?.address}</p>
                  <p className="text-xs text-muted-foreground font-data">
                    {request?.location?.coordinates?.lat}, {request?.location?.coordinates?.lng}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-foreground leading-relaxed">{request?.description}</p>
        </div>
      </div>
      {/* Media & AI Analysis */}
      {request?.media && request?.media?.length > 0 && (
        <div className="p-4 lg:p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Media & AI Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Gallery */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Uploaded Media</h4>
              <div className="grid grid-cols-2 gap-3">
                {request?.media?.map((item, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 emergency-transition"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {item?.type === 'image' ? (
                      <Image
                        src={item?.url}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Icon name="Play" size={24} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/50 rounded-full p-1">
                        <Icon 
                          name={item?.type === 'image' ? 'Image' : 'Video'} 
                          size={12} 
                          className="text-white" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis Results */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">AI Analysis Results</h4>
              <div className="space-y-3">
                {request?.aiAnalysis && request?.aiAnalysis?.map((analysis, index) => (
                  <div key={index} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2 mb-2">
                      <Icon name="Brain" size={14} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-xs font-medium text-primary">AI Analysis</span>
                    </div>
                    <p className="text-sm text-foreground">{analysis?.description}</p>
                    {analysis?.confidence && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full emergency-transition"
                            style={{ width: `${analysis?.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-data text-muted-foreground">
                          {analysis?.confidence}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {(!request?.aiAnalysis || request?.aiAnalysis?.length === 0) && (
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <Icon name="Brain" size={24} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI analysis in progress...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Additional Information */}
      {request?.additionalInfo && (
        <div className="p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Additional Information</h3>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-foreground leading-relaxed">{request?.additionalInfo}</p>
          </div>
        </div>
      )}
      {/* Media Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMedia(null)}
              iconName="X"
              iconSize={20}
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
            />
            
            {selectedMedia?.type === 'image' ? (
              <Image
                src={selectedMedia?.url}
                alt="Full size media"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia?.url}
                controls
                className="max-w-full max-h-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;