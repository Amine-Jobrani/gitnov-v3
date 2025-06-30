// src/services/roleService.ts
import axios from 'axios';

// Create a separate axios instance for role service to avoid conflicts
const roleApi = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if needed
roleApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('firebaseIdToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export interface RoleInfo {
  [key: string]: string;
}

export interface UserRole {
  id: string;
  fullName: string;
  email: string;
  role: number;
  roleName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  users: UserRole[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface UpdateRoleRequest {
  userId: string;
  role: number;
}

// Role mappings
export const ROLE_MAPPINGS = {
  0: 'client',
  1: 'organizer', 
  2: 'partner',
  3: 'admin'
} as const;

export const ROLE_NAMES = {
  client: 0,
  organizer: 1,
  partner: 2,
  admin: 3
} as const;

export class RoleService {
  /**
   * Test if role routes are working
   */
  static async testRoles(): Promise<{ message: string; roles: RoleInfo }> {
    try {
      const response = await roleApi.get('/test-roles');
      return response.data;
    } catch (error) {
      console.error('Test roles error:', error);
      throw error;
    }
  }

  /**
   * Get all available roles and their descriptions
   */
  static async getRoles(): Promise<RoleInfo> {
    try {
      const response = await roleApi.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Get roles error:', error);
      throw error;
    }
  }

  /**
   * Get the role of a specific user
   */
  static async getUserRole(userId: string): Promise<UserRole> {
    try {
      const response = await roleApi.get(`/users/${userId}/role`);
      return response.data;
    } catch (error) {
      console.error('Get user role error:', error);
      throw error;
    }
  }

  /**
   * Update any user's role
   */
  static async updateUserRole(userId: string, role: number): Promise<{ message: string; user: UserRole }> {
    try {
      const response = await roleApi.put('/users/role', {
        userId,
        role
      });
      return response.data;
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  }

  /**
   * Get list of all users with their roles
   */
  static async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: number;
  }): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.role !== undefined) queryParams.append('role', params.role.toString());

      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await roleApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Helper method to get role name from role number
   */
  static getRoleName(roleNumber: number): string {
    return ROLE_MAPPINGS[roleNumber as keyof typeof ROLE_MAPPINGS] || 'unknown';
  }

  /**
   * Helper method to get role number from role name
   */
  static getRoleNumber(roleName: string): number {
    return ROLE_NAMES[roleName as keyof typeof ROLE_NAMES] ?? 0;
  }

  /**
   * Check if user has permission for a specific role
   */
  static hasPermission(userRole: number, requiredRole: number): boolean {
    // Higher role numbers have more permissions
    return userRole >= requiredRole;
  }

  /**
   * Check if user is admin
   */
  static isAdmin(userRole: number): boolean {
    return userRole === 3;
  }

  /**
   * Check if user is partner
   */
  static isPartner(userRole: number): boolean {
    return userRole === 2;
  }

  /**
   * Check if user is organizer
   */
  static isOrganizer(userRole: number): boolean {
    return userRole === 1;
  }

  /**
   * Check if user is client
   */
  static isClient(userRole: number): boolean {
    return userRole === 0;
  }
}

export default RoleService;
