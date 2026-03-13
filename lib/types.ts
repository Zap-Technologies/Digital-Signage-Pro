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
  type: 'image' | 'video' | 'html' | 'banner' | 'menu' | 'news_ticker';
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  uploadedBy: string;
  uploadedAt: Date;
  modifiedAt: Date;
  fileSize: number;
  duration?: number; // in seconds, for videos
  width?: number;
  height?: number;
  tags: string[];
  category?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

// Playlist / Template Types
export interface PlaylistItem {
  id: string;
  contentId: string;
  order: number;
  duration: number; // seconds to display
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  items: PlaylistItem[];
  loop: boolean;
  totalDuration: number; // seconds
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignedDevices: string[];
}

// Device Pairing
export interface DevicePairingRequest {
  id: string;
  pairingCode: string;
  deviceName: string;
  deviceType: 'android_tv' | 'tablet' | 'display' | 'player';
  macAddress: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

// Schedule Types
export type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ScheduleTimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface Schedule {
  id: string;
  name: string;
  playlistId: string;
  deviceIds: string[];
  days: ScheduleDay[];
  timeSlot: ScheduleTimeSlot;
  startDate?: string; // ISO date string YYYY-MM-DD
  endDate?: string;
  isActive: boolean;
  priority: number; // higher = takes precedence
  createdAt: Date;
  updatedAt: Date;
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

export interface DeviceActivityEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  eventType: 'online' | 'offline' | 'heartbeat' | 'error' | 'reboot' | 'content_sync';
  message: string;
  timestamp: Date;
}

export interface PlaybackRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  playlistId: string;
  playlistName: string;
  startedAt: Date;
  durationSeconds: number;
  completed: boolean;
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
