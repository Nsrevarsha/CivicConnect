import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { Issue } from '@/lib/mockData';

interface IssueMapProps {
  issues: Issue[];
  height?: string;
  showControls?: boolean;
  onIssueSelect?: (issue: Issue) => void;
}

// Custom marker icons based on priority
const createPriorityIcon = (priority: string) => {
  const colors = {
    low: '#22C55E',      // Green
    medium: '#F59E0B',   // Amber  
    high: '#EF4444',     // Red
    urgent: '#7C2D12'    // Dark red
  };

  return new Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: `priority-${priority}-marker`
  });
};

function MapController({ issues }: { issues: Issue[] }) {
  const map = useMap();

  useEffect(() => {
    if (issues.length > 0) {
      const bounds = new LatLngBounds(
        issues.map(issue => [issue.latitude, issue.longitude])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [issues, map]);

  return null;
}

export default function IssueMap({ 
  issues, 
  height = "400px", 
  showControls = true,
  onIssueSelect 
}: IssueMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Default center (can be adjusted based on your city)
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // NYC coordinates

  const filteredIssues = issues.filter(issue => {
    const priorityMatch = filterPriority === 'all' || issue.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    return priorityMatch && statusMatch;
  });

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    if (onIssueSelect) {
      onIssueSelect(issue);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {showControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Issue Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex space-x-2">
                <Button
                  variant={filterPriority === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('all')}
                >
                  All Priorities
                </Button>
                <Button
                  variant={filterPriority === 'urgent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('urgent')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Urgent
                </Button>
                <Button
                  variant={filterPriority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('high')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  High
                </Button>
                <Button
                  variant={filterPriority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('medium')}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Medium
                </Button>
                <Button
                  variant={filterPriority === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPriority('low')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Low
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All Status
                </Button>
                <Button
                  variant={filterStatus === 'open' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('open')}
                >
                  Open
                </Button>
                <Button
                  variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('in_progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={filterStatus === 'resolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('resolved')}
                >
                  Resolved
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-primary-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {filteredIssues.length}
                </div>
                <div className="text-sm text-primary-700">Total Issues</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {filteredIssues.filter(i => i.priority === 'urgent').length}
                </div>
                <div className="text-sm text-red-700">Urgent</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredIssues.filter(i => i.status === 'in_progress').length}
                </div>
                <div className="text-sm text-blue-700">In Progress</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {filteredIssues.filter(i => i.status === 'resolved').length}
                </div>
                <div className="text-sm text-green-700">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div style={{ height }}>
                <MapContainer
                  center={defaultCenter}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapController issues={filteredIssues} />
                  {filteredIssues.map((issue) => (
                    <Marker
                      key={issue.id}
                      position={[issue.latitude, issue.longitude]}
                      icon={createPriorityIcon(issue.priority)}
                      eventHandlers={{
                        click: () => handleIssueClick(issue)
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-64">
                          <h3 className="font-semibold mb-2">{issue.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          
                          <div className="flex space-x-2 mb-2">
                            <Badge className={`${getPriorityColor(issue.priority)} text-white`}>
                              {issue.priority}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {issue.address}
                            </div>
                            {issue.assignedTo && (
                              <div>Assigned to: {issue.assignedTo}</div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleIssueClick(issue)}
                            className="w-full"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIssue ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedIssue.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedIssue.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Priority</span>
                      <Badge className={`${getPriorityColor(selectedIssue.priority)} text-white block mt-1`}>
                        {selectedIssue.priority}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Status</span>
                      <Badge className={`${getStatusColor(selectedIssue.status)} block mt-1`}>
                        {selectedIssue.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500">Location</span>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="text-sm">{selectedIssue.address}</span>
                    </div>
                  </div>
                  
                  {selectedIssue.assignedTo && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Assigned To</span>
                      <div className="text-sm mt-1">{selectedIssue.assignedTo}</div>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500">Reported At</span>
                    <div className="text-sm mt-1">
                      {new Date(selectedIssue.reportedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View Full Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Click on a map marker to view issue details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}