// User Types
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'viewer' | 'device_manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  permissions: Permission[];
}

export type Permission = 
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete'
  | 'content:create' | 'content:read' | 'content:moderate' | 'content:delete'
  | 'device:control' | 'device:read' | 'device:reboot'
  | 'settings:read' | 'settings:update'
  | 'analytics:read' | 'analytics:export'
  | 'security:manage' | 'audit:read';

// Content Types
export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'html' | 'template';
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  uploadedBy: string;
  uploadedAt: Date;
  modifiedAt: Date;
  fileSize: number;
  duration?: number; // in seconds, for videos
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

// Device Types
export interface Device {
  id: string;
  name: string;
  type: 'display' | 'player' | 'server';
  status: 'online' | 'offline' | 'error';
  location: string;
  ipAddress: string;
  lastHeartbeat: Date;
  osVersion: string;
  softwareVersion: string;
  assignedContent?: string[];
  uptime: number; // percentage
  errorCount: number;
  temperature?: number;
}

// Analytics Types
export interface Analytics {
  date: Date;
  activeDevices: number;
  totalPlaybacks: number;
  totalViews: number;
  averagePlayDuration: number;
  errorRate: number;
  contentApprovals: number;
  newUsers: number;
}

// Security/Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  timestamp: Date;
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'permission_change' | 'data_access' | 'device_action' | 'config_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

// Settings Types
export interface SystemSettings {
  appName: string;
  appLogo?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  maxUploadSize: number; // in MB
  sessionTimeout: number; // in minutes
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  twoFactorAuth: boolean;
  ipWhitelist: string[];
  contentRetentionDays: number;
  auditLogRetentionDays: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDevices: number;
  onlineDevices: number;
  pendingContent: number;
  approvedContent: number;
  systemHealth: number; // percentage
  securityScore: number; // percentage
}
