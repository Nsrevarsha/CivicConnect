import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Calendar, Award } from 'lucide-react';

export default function PersonalAnalytics() {
  const personalStats = {
    tasksCompleted: 45,
    averageCompletionTime: 2.3,
    slaCompliance: 87,
    departmentAverage: 82,
    thisMonthTasks: 18,
    lastMonthTasks: 15
  };

  const weeklyPerformance = [
    { day: 'Mon', completed: 3, assigned: 4 },
    { day: 'Tue', completed: 5, assigned: 5 },
    { day: 'Wed', completed: 2, assigned: 3 },
    { day: 'Thu', completed: 4, assigned: 4 },
    { day: 'Fri', completed: 3, assigned: 4 },
    { day: 'Sat', completed: 1, assigned: 2 },
    { day: 'Sun', completed: 0, assigned: 1 }
  ];

  const achievements = [
    {
      title: 'Speed Demon',
      description: 'Completed 5 tasks in one day',
      earned: true,
      icon: '⚡'
    },
    {
      title: 'Perfect Week',
      description: '100% SLA compliance for a week',
      earned: true,
      icon: '✨'
    },
    {
      title: 'Team Player',
      description: 'Helped with 10 emergency responses',
      earned: false,
      icon: '🤝'
    },
    {
      title: 'Quality Focus',
      description: 'Zero rework requests this month',
      earned: false,
      icon: '🎯'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Analytics</h1>
        <p className="text-gray-600">Track your performance and compare with department averages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              SLA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {personalStats.slaCompliance}%
            </div>
            <p className="text-sm text-muted-foreground">
              vs {personalStats.departmentAverage}% dept avg
            </p>
            <div className="text-xs text-green-600 mt-1">
              +{personalStats.slaCompliance - personalStats.departmentAverage}% above average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Avg Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {personalStats.averageCompletionTime} days
            </div>
            <p className="text-sm text-muted-foreground">
              Per task completion time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {personalStats.thisMonthTasks}
            </div>
            <p className="text-sm text-muted-foreground">
              Tasks completed
            </p>
            <div className="text-xs text-green-600 mt-1">
              +{personalStats.thisMonthTasks - personalStats.lastMonthTasks} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {personalStats.tasksCompleted}
            </div>
            <p className="text-sm text-muted-foreground">
              All time tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyPerformance.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">
                      {day.completed}/{day.assigned} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${day.assigned > 0 ? (day.completed / day.assigned) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.earned && (
                        <Badge variant="default" className="text-xs">Earned</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>SLA Compliance</span>
                <span>You: {personalStats.slaCompliance}% | Dept Avg: {personalStats.departmentAverage}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${personalStats.slaCompliance}%` }}
                  ></div>
                </div>
                <div 
                  className="absolute top-0 h-3 w-1 bg-red-500 rounded"
                  style={{ left: `${personalStats.departmentAverage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
