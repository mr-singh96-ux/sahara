import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AIAnalysisViewer = ({ 
  selectedRequest = null, 
  onClose = () => {},
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock AI analysis data
  const mockAnalysis = {
    requestId: 'REQ001',
    victim: 'Sarah Johnson',
    mediaFiles: [
      {
        id: 'media_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
        filename: 'damage_assessment.jpg',
        uploadedAt: new Date(Date.now() - 300000),
        analysis: {
          confidence: 0.94,
          detectedObjects: ['debris', 'structural_damage', 'person'],
          severity: 'high',
          recommendations: [
            'Immediate evacuation required',
            'Heavy machinery needed for debris removal',
            'Medical assessment recommended'
          ],
          riskFactors: ['unstable_structure', 'falling_debris', 'blocked_exits'],
          estimatedCasualties: '1-2 people',
          accessibilityScore: 0.3
        }
      },
      {
        id: 'media_2',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400',
        filename: 'situation_video.mp4',
        uploadedAt: new Date(Date.now() - 180000),
        duration: '00:02:15',
        analysis: {
          confidence: 0.89,
          keyFrames: 12,
          detectedActivities: ['person_trapped', 'water_rising', 'debris_movement'],
          audioAnalysis: {
            distressCalls: true,
            backgroundNoise: 'water_flow',
            urgencyLevel: 'critical'
          },
          timeline: [
            { time: '00:00:15', event: 'Person visible in frame' },
            { time: '00:01:30', event: 'Water level rising detected' },
            { time: '00:02:00', event: 'Distress call identified' }
          ]
        }
      }
    ],
    overallAssessment: {
      urgencyScore: 0.92,
      riskLevel: 'critical',
      recommendedResponse: 'immediate_rescue',
      estimatedResponseTime: '10-15 minutes',
      requiredResources: ['rescue_team', 'medical_support', 'heavy_equipment'],
      safetyPrecautions: [
        'Structural integrity assessment required',
        'Water level monitoring essential',
        'Multiple exit routes needed'
      ]
    },
    processedAt: new Date(Date.now() - 120000),
    processingTime: '45 seconds',
    modelVersion: 'DisasterAI-v2.1'
  };

  const handleReprocessMedia = (mediaId) => {
    setIsProcessing(true);
    console.log('Reprocessing media:', mediaId);
    
    setTimeout(() => {
      setIsProcessing(false);
      console.log('Media reprocessed successfully');
    }, 3000);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.7) return 'text-warning';
    return 'text-error';
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  if (!selectedRequest) {
    return (
      <div className={`bg-surface border border-border rounded-lg emergency-shadow p-6 text-center ${className}`}>
        <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">AI Analysis Viewer</h3>
        <p className="text-sm text-muted-foreground">
          Select a request with media files to view AI-powered analysis and insights
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg emergency-shadow h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">AI Analysis</h3>
            <span className="text-xs text-muted-foreground font-data">
              {mockAnalysis?.requestId}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={16}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {[
            { key: 'analysis', label: 'Analysis', icon: 'BarChart3' },
            { key: 'media', label: 'Media', icon: 'Image' },
            { key: 'insights', label: 'Insights', icon: 'Lightbulb' }
          ]?.map(tab => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`flex items-center space-x-2 flex-1 px-3 py-2 text-sm font-medium rounded-md emergency-transition ${
                activeTab === tab?.key
                  ? 'bg-surface text-foreground emergency-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Overall Assessment */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} />
                <span>Overall Assessment</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-error mb-1">
                    {Math.round(mockAnalysis?.overallAssessment?.urgencyScore * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Urgency Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${getRiskLevelColor(mockAnalysis?.overallAssessment?.riskLevel)}`}>
                    {mockAnalysis?.overallAssessment?.riskLevel?.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-foreground">Recommended Response:</span>
                  <span className="ml-2 text-sm text-primary">
                    {mockAnalysis?.overallAssessment?.recommendedResponse?.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Estimated Response Time:</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {mockAnalysis?.overallAssessment?.estimatedResponseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Resources */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Package" size={16} />
                <span>Required Resources</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockAnalysis?.overallAssessment?.requiredResources?.map(resource => (
                  <span
                    key={resource}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {resource?.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety Precautions */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Shield" size={16} />
                <span>Safety Precautions</span>
              </h4>
              <ul className="space-y-2">
                {mockAnalysis?.overallAssessment?.safetyPrecautions?.map((precaution, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <Icon name="AlertCircle" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            {mockAnalysis?.mediaFiles?.map(media => (
              <div key={media?.id} className="border border-border rounded-lg p-4">
                {/* Media Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon 
                        name={media?.type === 'image' ? 'Image' : 'Video'} 
                        size={20} 
                        className="text-muted-foreground" 
                      />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{media?.filename}</h5>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Uploaded {new Date(media.uploadedAt)?.toLocaleTimeString()}</span>
                        {media?.duration && <span>• {media?.duration}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`text-sm font-medium ${getConfidenceColor(media?.analysis?.confidence)}`}>
                      {Math.round(media?.analysis?.confidence * 100)}% confidence
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleReprocessMedia(media?.id)}
                      loading={isProcessing}
                      iconName="RotateCcw"
                      iconSize={12}
                    />
                  </div>
                </div>

                {/* Media Preview */}
                <div className="mb-4">
                  <Image
                    src={media?.url}
                    alt={media?.filename}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Analysis Results */}
                <div className="space-y-3">
                  {media?.analysis?.detectedObjects && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Detected Objects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {media?.analysis?.detectedObjects?.map(obj => (
                          <span
                            key={obj}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                          >
                            {obj?.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {media?.analysis?.recommendations && (
                    <div>
                      <span className="text-sm font-medium text-foreground">AI Recommendations:</span>
                      <ul className="mt-1 space-y-1">
                        {media?.analysis?.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <Icon name="ArrowRight" size={12} className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {media?.analysis?.timeline && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Video Timeline:</span>
                      <div className="mt-2 space-y-2">
                        {media?.analysis?.timeline?.map((event, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <span className="font-data text-primary w-16">{event?.time}</span>
                            <span className="text-muted-foreground">{event?.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Processing Info */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Cpu" size={16} />
                <span>Processing Information</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model Version:</span>
                  <div className="font-data text-foreground">{mockAnalysis?.modelVersion}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Time:</span>
                  <div className="font-data text-foreground">{mockAnalysis?.processingTime}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Processed At:</span>
                  <div className="font-data text-foreground">
                    {mockAnalysis?.processedAt?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Files Analyzed:</span>
                  <div className="font-data text-foreground">{mockAnalysis?.mediaFiles?.length}</div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Lightbulb" size={16} />
                <span>Key Insights</span>
              </h4>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-error" />
                    <span className="font-medium text-foreground">Severity Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The AI analysis indicates a critical situation with high structural damage and immediate risk to human life. 
                    Water level monitoring shows rising conditions that require urgent evacuation protocols.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Resource Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on the analysis, deploying a rescue team with heavy equipment will be most effective. 
                    Medical support should be on standby for potential casualties.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="font-medium text-foreground">Time Sensitivity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The situation is deteriorating rapidly. AI models predict a 15-minute window for safe rescue operations 
                    before conditions become too dangerous for responders.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Recommendations */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="CheckSquare" size={16} />
                <span>Recommended Actions</span>
              </h4>
              
              <div className="space-y-2">
                {[
                  'Deploy rescue team immediately with water rescue equipment',
                  'Establish communication with victim using emergency protocols',
                  'Set up medical triage area at safe distance from incident',
                  'Monitor structural integrity continuously during operation',
                  'Prepare evacuation routes for surrounding area if needed'
                ]?.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} />
            <span>AI-powered analysis for emergency response</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Last updated: {mockAnalysis?.processedAt?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisViewer;