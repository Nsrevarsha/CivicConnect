import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User } from 'lucide-react';

export default function Communication() {
  const conversations = [
    {
      id: '1',
      issueId: '#123',
      title: 'Pothole Repair - Main Street',
      lastMessage: 'Please provide status update',
      lastMessageTime: '2 hours ago',
      unread: true,
      messages: [
        {
          id: '1',
          sender: 'Department Admin',
          message: 'Task has been assigned to you. Please confirm receipt.',
          timestamp: '2024-01-15 09:00',
          isAdmin: true
        },
        {
          id: '2', 
          sender: 'You',
          message: 'Confirmed. Heading to location now.',
          timestamp: '2024-01-15 09:15',
          isAdmin: false
        },
        {
          id: '3',
          sender: 'Department Admin', 
          message: 'Please provide status update',
          timestamp: '2024-01-15 11:30',
          isAdmin: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
        <p className="text-gray-600">Collaborate with your department admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 border-primary bg-primary/5"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.issueId}
                      </p>
                    </div>
                    {conversation.unread && (
                      <Badge variant="destructive" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.lastMessageTime}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Pothole Repair - Main Street
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {conversations[0].messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isAdmin 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-3 w-3" />
                      <span className="text-xs font-medium">{message.sender}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Textarea 
                placeholder="Type your message..."
                className="flex-1"
                rows={2}
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
