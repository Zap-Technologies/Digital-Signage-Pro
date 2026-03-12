'use client';

import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { mockSystemSettings } from '@/lib/mockData';
import { SystemSettings as SystemSettingsType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsType>(mockSystemSettings);
  const [newIP, setNewIP] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddIP = () => {
    if (newIP && !settings.ipWhitelist.includes(newIP)) {
      setSettings({
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIP],
      });
      setNewIP('');
    }
  };

  const handleRemoveIP = (ip: string) => {
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter((item) => item !== ip),
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
      console.log('[v0] Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          General Settings
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Application Name
            </label>
            <Input
              value={settings.appName}
              onChange={(e) =>
                setSettings({ ...settings, appName: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-sm text-slate-600">
                Temporarily disable the system for maintenance
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {settings.maintenanceMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Maintenance Message
              </label>
              <Textarea
                value={settings.maintenanceMessage || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMessage: e.target.value,
                  })
                }
                placeholder="Enter message to display during maintenance..."
                className="min-h-24"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Upload & Retention Settings */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Upload & Retention Policy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Upload Size (MB)
            </label>
            <Input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxUploadSize: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content Retention (days)
            </label>
            <Input
              type="number"
              value={settings.contentRetentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contentRetentionDays: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Audit Log Retention (days)
            </label>
            <Input
              type="number"
              value={settings.auditLogRetentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  auditLogRetentionDays: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
      </Card>

      {/* Password Policy */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Password Policy
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Minimum Length
            </label>
            <Input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    minLength: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'requireUppercase',
                label: 'Require Uppercase Letters',
              },
              {
                key: 'requireNumbers',
                label: 'Require Numbers',
              },
              {
                key: 'requireSpecialChars',
                label: 'Require Special Characters',
              },
            ].map((policy) => (
              <div
                key={policy.key}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <p className="font-medium text-slate-900">{policy.label}</p>
                <input
                  type="checkbox"
                  checked={
                    settings.passwordPolicy[
                      policy.key as keyof typeof settings.passwordPolicy
                    ] as boolean
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        [policy.key]: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 border-0 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Security Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="font-medium text-slate-900">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-slate-600">
                Require 2FA for all admin accounts
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  twoFactorAuth: e.target.checked,
                })
              }
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* IP Whitelist */}
          <div>
            <h4 className="font-medium text-slate-900 mb-4">IP Whitelist</h4>
            <div className="space-y-3">
              {settings.ipWhitelist.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200"
                >
                  <span className="font-mono text-sm text-slate-900">{ip}</span>
                  <button
                    onClick={() => handleRemoveIP(ip)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Enter IP address or CIDR (e.g., 192.168.1.0/24)"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
              />
              <Button
                onClick={handleAddIP}
                variant="outline"
                className="gap-2"
              >
                <Plus size={18} />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
