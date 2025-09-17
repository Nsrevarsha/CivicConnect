import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();

  if (user) {
    const redirectPath = user.role === 'super_admin' 
      ? '/super-admin'
      : user.role === 'department_admin'
      ? '/department-admin' 
      : '/supervisor';
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, mfaCode);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 bg-white text-primary rounded-t-lg p-6 border-b">
          <CardTitle className="text-3xl font-bold text-center">City Portal</CardTitle>
          <CardDescription className="text-center text-primary/80 text-lg">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 bg-primary/5 p-4 rounded-md">
              <Label htmlFor="email" className="text-primary text-lg font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@city.gov"
                required
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2 bg-primary/5 p-4 rounded-md">
              <Label htmlFor="password" className="text-primary text-lg font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-lg border-2 border-primary/20 focus:border-primary focus:ring-primary"
              />
            </div>
            
            {showMFA && (
              <div className="space-y-2 bg-primary/5 p-4 rounded-md">
                <Label htmlFor="mfa" className="text-primary text-lg font-medium">MFA Code</Label>
                <Input
                  id="mfa"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="h-12 text-lg border-2 border-primary/20 focus:border-primary focus:ring-primary"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 text-white" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <Alert className="mt-8 bg-primary/5 border border-primary/20 p-4 rounded-md">
            <AlertDescription className="text-primary">
              <p className="font-bold mb-2 text-lg">Demo Credentials:</p>
              <div className="grid gap-2 text-primary">
                <p><span className="font-semibold">Super Admin:</span> admin@civic.gov / admin123</p>
                <p><span className="font-semibold">Public Works Admin:</span> public.works@civic.gov / works123</p>
                <p><span className="font-semibold">Supervisor:</span> supervisor@civic.gov / super123</p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
