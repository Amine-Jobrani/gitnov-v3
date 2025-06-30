// src/hooks/useRoles.ts
import { useState, useEffect } from 'react';
import { RoleService, UserRole, RoleInfo } from '../services/roleService';

export interface UseRolesParams {
  page?: number;
  limit?: number;
  role?: number;
  autoFetch?: boolean;
}

export const useRoles = (params: UseRolesParams = {}) => {
  const { page = 1, limit = 10, role, autoFetch = true } = params;
  
  const [users, setUsers] = useState<UserRole[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (fetchParams?: {
    page?: number;
    limit?: number;
    role?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await RoleService.getAllUsers({
        page: fetchParams?.page || page,
        limit: fetchParams?.limit || limit,
        role: fetchParams?.role || role,
      });
      
      setUsers(response.users);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await RoleService.updateUserRole(userId, newRole);
      // Refresh the users list after update
      await fetchUsers();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      console.error('Error updating user role:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [page, limit, role, autoFetch]);

  return {
    users,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    refresh: () => fetchUsers(),
  };
};

export const useUserRole = (userId?: string) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = async (id?: string) => {
    const targetUserId = id || userId;
    if (!targetUserId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await RoleService.getUserRole(targetUserId);
      setUserRole(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user role';
      setError(errorMessage);
      console.error('Error fetching user role:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserRole(userId);
    }
  }, [userId]);

  return {
    userRole,
    loading,
    error,
    fetchUserRole,
    refresh: () => fetchUserRole(),
  };
};

export const useRoleInfo = () => {
  const [roles, setRoles] = useState<RoleInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await RoleService.getRoles();
      setRoles(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    refresh: fetchRoles,
  };
};

export const useRoleManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserRole = async (userId: string, role: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await RoleService.updateUserRole(userId, role);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testRoleRoutes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await RoleService.testRoles();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test role routes';
      setError(errorMessage);
      console.error('Error testing role routes:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateUserRole,
    testRoleRoutes,
    // Helper methods
    getRoleName: RoleService.getRoleName,
    getRoleNumber: RoleService.getRoleNumber,
    hasPermission: RoleService.hasPermission,
    isAdmin: RoleService.isAdmin,
    isPartner: RoleService.isPartner,
    isOrganizer: RoleService.isOrganizer,
    isClient: RoleService.isClient,
  };
};
