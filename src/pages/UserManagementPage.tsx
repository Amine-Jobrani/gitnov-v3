// src/pages/UserManagementPage.tsx
import React, { useState } from 'react';
import { useRoles, useRoleManagement } from '../hooks/useRoles';
import { UserRole } from '../services/roleService';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Shield, 
  Edit, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Crown,
  Building,
  User as UserIcon
} from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserRole | null>(null);
  const [newRole, setNewRole] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState(false);

  const { 
    users, 
    totalCount, 
    totalPages, 
    loading, 
    error, 
    fetchUsers, 
    updateUserRole 
  } = useRoles({
    page: currentPage,
    limit: 10,
    role: selectedRole,
    autoFetch: true
  });

  const { 
    loading: updating, 
    error: updateError,
    getRoleName,
    isAdmin: checkIsAdmin 
  } = useRoleManagement();

  // Check if current user is admin
  const isCurrentUserAdmin = user && checkIsAdmin(user.role === 'admin' ? 3 : 0);

  const handleRoleFilter = (role: number | undefined) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRole = (userToEdit: UserRole) => {
    setEditingUser(userToEdit);
    setNewRole(userToEdit.role);
    setShowEditModal(true);
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    try {
      await updateUserRole(editingUser.id, newRole);
      setShowEditModal(false);
      setEditingUser(null);
      // Show success message
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const getRoleIcon = (role: number) => {
    switch (role) {
      case 3: return <Crown className="w-4 h-4 text-purple-500" />;
      case 2: return <Building className="w-4 h-4 text-blue-500" />;
      case 1: return <UserCheck className="w-4 h-4 text-green-500" />;
      default: return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: number) => {
    switch (role) {
      case 3: return 'bg-purple-100 text-purple-800 border-purple-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isCurrentUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage user roles and permissions</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Users: {totalCount}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedRole ?? ''}
                onChange={(e) => handleRoleFilter(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="0">Clients</option>
                <option value="1">Organizers</option>
                <option value="2">Partners</option>
                <option value="3">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error: {error}</p>
              <button 
                onClick={() => fetchUsers()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                              {getRoleName(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            disabled={updating}
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit Role</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit User Role
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                User: <span className="font-medium">{editingUser.fullName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Email: <span className="font-medium">{editingUser.email}</span>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Client</option>
                <option value={1}>Organizer</option>
                <option value={2}>Partner</option>
                <option value={3}>Admin</option>
              </select>
            </div>

            {updateError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {updateError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {updating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>Update Role</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
