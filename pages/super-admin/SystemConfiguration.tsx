import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Smartphone,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Key,
  Lock,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBackend } from '../../contexts/AuthContext';

interface SystemConfig {
  notifications: {
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    email_templates: {
      issue_created: string;
      issue_updated: string;
      issue_resolved: string;
    };
  };
  security: {
    password_policy: {
      min_length: number;
      require_uppercase: boolean;
      require_lowercase: boolean;
      require_numbers: boolean;
      require_symbols: boolean;
    };
    session_timeout: number;
    max_login_attempts: number;
    two_factor_required: boolean;
  };
  system: {
    maintenance_mode: boolean;
    api_rate_limit: number;
    file_upload_size_limit: number;
    backup_frequency: string;
    log_retention_days: number;
  };
  integration: {
    email_provider: string;
    email_api_key: string;
    sms_provider: string;
    sms_api_key: string;
    map_api_key: string;
  };
}

export default function SystemConfiguration() {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const backend = useBackend();

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const loadSystemConfig = async () => {
    try {
      // In a real app, this would fetch from backend.system.getConfig()
      // For now, we'll use mock data
      const mockConfig: SystemConfig = {
        notifications: {
          email_enabled: true,
          sms_enabled: false,
          push_enabled: true,
          email_templates: {
            issue_created: 'New issue #{issue_id} has been created: {title}',
            issue_updated: 'Issue #{issue_id} has been updated: {title}',
            issue_resolved: 'Issue #{issue_id} has been resolved: {title}'
          }
        },
        security: {
          password_policy: {
            min_length: 8,
            require_uppercase: true,
            require_lowercase: true,
            require_numbers: true,
            require_symbols: false
          },
          session_timeout: 24,
          max_login_attempts: 5,
          two_factor_required: false
        },
        system: {
          maintenance_mode: false,
          api_rate_limit: 1000,
          file_upload_size_limit: 10,
          backup_frequency: 'daily',
          log_retention_days: 30
        },
        integration: {
          email_provider: 'sendgrid',
          email_api_key: '••••••••••••••••',
          sms_provider: 'twilio',
          sms_api_key: '••••••••••••••••',
          map_api_key: '••••••••••••••••'
        }
      };
      
      setConfig(mockConfig);
    } catch (error) {
      console.error('Failed to load system configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      // In a real app, this would call backend.system.updateConfig(config)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setUnsavedChanges(false);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    });
    setUnsavedChanges(true);
  };

  const updateNestedConfig = (section: keyof SystemConfig, subsection: string, field: string, value: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [subsection]: {
          ...(config[section] as any)[subsection],
          [field]: value
        }
      }
    });
    setUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
    { id: 'integration', label: 'Integrations', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">System Configuration</h1>
          <p className="text-primary-600">Manage platform settings and integrations</p>
          {unsavedChanges && (
            <div className="mt-2 flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadSystemConfig}
            variant="outline"
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
            disabled={saving}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleSaveConfig}
            className="bg-primary-600 hover:bg-primary-700 text-white"
            disabled={!unsavedChanges || saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Configuration Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notifications Configuration */}
      {activeTab === 'notifications' && config && (
        <div className="space-y-6">
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email_enabled"
                    checked={config.notifications.email_enabled}
                    onChange={(e) => updateConfig('notifications', 'email_enabled', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="email_enabled" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sms_enabled"
                    checked={config.notifications.sms_enabled}
                    onChange={(e) => updateConfig('notifications', 'sms_enabled', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="sms_enabled" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Smartphone className="h-4 w-4" />
                    SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="push_enabled"
                    checked={config.notifications.push_enabled}
                    onChange={(e) => updateConfig('notifications', 'push_enabled', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="push_enabled" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bell className="h-4 w-4" />
                    Push Notifications
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Created Template
                    </label>
                    <Input
                      value={config.notifications.email_templates.issue_created}
                      onChange={(e) => updateNestedConfig('notifications', 'email_templates', 'issue_created', e.target.value)}
                      placeholder="Template for new issue notifications"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Updated Template
                    </label>
                    <Input
                      value={config.notifications.email_templates.issue_updated}
                      onChange={(e) => updateNestedConfig('notifications', 'email_templates', 'issue_updated', e.target.value)}
                      placeholder="Template for issue update notifications"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Resolved Template
                    </label>
                    <Input
                      value={config.notifications.email_templates.issue_resolved}
                      onChange={(e) => updateNestedConfig('notifications', 'email_templates', 'issue_resolved', e.target.value)}
                      placeholder="Template for issue resolution notifications"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Configuration */}
      {activeTab === 'security' && config && (
        <div className="space-y-6">
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <Input
                    type="number"
                    value={config.security.password_policy.min_length}
                    onChange={(e) => updateNestedConfig('security', 'password_policy', 'min_length', parseInt(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password Requirements
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require_uppercase"
                        checked={config.security.password_policy.require_uppercase}
                        onChange={(e) => updateNestedConfig('security', 'password_policy', 'require_uppercase', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="require_uppercase" className="text-sm text-gray-700">
                        Require uppercase letters
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require_lowercase"
                        checked={config.security.password_policy.require_lowercase}
                        onChange={(e) => updateNestedConfig('security', 'password_policy', 'require_lowercase', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="require_lowercase" className="text-sm text-gray-700">
                        Require lowercase letters
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require_numbers"
                        checked={config.security.password_policy.require_numbers}
                        onChange={(e) => updateNestedConfig('security', 'password_policy', 'require_numbers', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="require_numbers" className="text-sm text-gray-700">
                        Require numbers
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="require_symbols"
                        checked={config.security.password_policy.require_symbols}
                        onChange={(e) => updateNestedConfig('security', 'password_policy', 'require_symbols', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="require_symbols" className="text-sm text-gray-700">
                        Require special symbols
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <Input
                    type="number"
                    value={config.security.session_timeout}
                    onChange={(e) => updateConfig('security', 'session_timeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <Input
                    type="number"
                    value={config.security.max_login_attempts}
                    onChange={(e) => updateConfig('security', 'max_login_attempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="two_factor_required"
                    checked={config.security.two_factor_required}
                    onChange={(e) => updateConfig('security', 'two_factor_required', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="two_factor_required" className="text-sm font-medium text-gray-700">
                    Require Two-Factor Authentication
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Configuration */}
      {activeTab === 'system' && config && (
        <div className="space-y-6">
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={config.system.maintenance_mode}
                    onChange={(e) => updateConfig('system', 'maintenance_mode', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="maintenance_mode" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <AlertTriangle className="h-4 w-4" />
                    Maintenance Mode
                  </label>
                  {config.system.maintenance_mode && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Active
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Rate Limit (requests/hour)
                  </label>
                  <Input
                    type="number"
                    value={config.system.api_rate_limit}
                    onChange={(e) => updateConfig('system', 'api_rate_limit', parseInt(e.target.value))}
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Upload Size Limit (MB)
                  </label>
                  <Input
                    type="number"
                    value={config.system.file_upload_size_limit}
                    onChange={(e) => updateConfig('system', 'file_upload_size_limit', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={config.system.backup_frequency}
                    onChange={(e) => updateConfig('system', 'backup_frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Retention (days)
                  </label>
                  <Input
                    type="number"
                    value={config.system.log_retention_days}
                    onChange={(e) => updateConfig('system', 'log_retention_days', parseInt(e.target.value))}
                    min="7"
                    max="365"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Configuration */}
      {activeTab === 'integration' && config && (
        <div className="space-y-6">
          <Card className="border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Provider</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider
                      </label>
                      <select
                        value={config.integration.email_provider}
                        onChange={(e) => updateConfig('integration', 'email_provider', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailgun">Mailgun</option>
                        <option value="amazon_ses">Amazon SES</option>
                        <option value="smtp">Custom SMTP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={config.integration.email_api_key}
                          onChange={(e) => updateConfig('integration', 'email_api_key', e.target.value)}
                          placeholder="Enter API key"
                        />
                        <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Provider</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider
                      </label>
                      <select
                        value={config.integration.sms_provider}
                        onChange={(e) => updateConfig('integration', 'sms_provider', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      >
                        <option value="twilio">Twilio</option>
                        <option value="vonage">Vonage</option>
                        <option value="aws_sns">AWS SNS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={config.integration.sms_api_key}
                          onChange={(e) => updateConfig('integration', 'sms_api_key', e.target.value)}
                          placeholder="Enter API key"
                        />
                        <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Map Service</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps API Key
                    </label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={config.integration.map_api_key}
                        onChange={(e) => updateConfig('integration', 'map_api_key', e.target.value)}
                        placeholder="Enter Google Maps API key"
                      />
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}