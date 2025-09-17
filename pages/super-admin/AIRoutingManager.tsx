import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';

export default function AIRoutingManager() {
  const [rules] = useState([
    {
      id: '1',
      name: 'Emergency Priority Routing',
      description: 'Routes urgent issues to senior supervisors',
      status: 'active',
      version: '2.1',
      lastModified: '2 hours ago'
    },
    {
      id: '2', 
      name: 'Department Load Balancing',
      description: 'Distributes workload evenly across departments',
      status: 'active',
      version: '1.8',
      lastModified: '1 day ago'
    },
    {
      id: '3',
      name: 'Geographic Proximity',
      description: 'Assigns based on supervisor location',
      status: 'inactive',
      version: '1.5',
      lastModified: '3 days ago'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Routing Manager</h1>
          <p className="text-gray-600">Manage and configure AI-driven routing rules</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Create New Rule
        </Button>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                    {rule.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">v{rule.version}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{rule.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last modified {rule.lastModified}
                </span>
                <div className="flex space-x-2">
                  {rule.status === 'active' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rollback
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Routing Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-muted-foreground">SLA Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
