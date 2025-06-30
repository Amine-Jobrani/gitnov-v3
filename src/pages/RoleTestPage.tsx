// src/pages/RoleTestPage.tsx
import React, { useState } from 'react';
import { useRoleManagement, useRoles, useRoleInfo } from '../hooks/useRoles';
import { useAuth } from '../context/AuthContext';

const RoleTestPage: React.FC = () => {
  const { user } = useAuth();
  const { testRoleRoutes, updateUserRole, loading, error } = useRoleManagement();
  const { roles, loading: rolesLoading } = useRoleInfo();
  const { users, loading: usersLoading, fetchUsers } = useRoles({ autoFetch: false });
  
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState(0);

  const handleTestRoutes = async () => {
    try {
      const result = await testRoleRoutes();
      setTestResults(result);
      console.log('Test results:', result);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  const handleFetchUsers = async () => {
    await fetchUsers();
  };

  const handleUpdateRole = async () => {
    if (!selectedUserId) return;
    
    try {
      await updateUserRole(selectedUserId, selectedRole);
      alert('Role updated successfully!');
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Role Management Test Page</h1>
        
        {/* Current User Info */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current User</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleTestRoutes}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Role Routes'}
            </button>

            <button
              onClick={handleFetchUsers}
              disabled={usersLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {usersLoading ? 'Loading...' : 'Fetch All Users'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Available Roles */}
        {!rolesLoading && Object.keys(roles).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Available Roles</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(roles, null, 2)}
            </pre>
          </div>
        )}

        {/* Users List */}
        {users.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Role Name</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-2 text-sm font-mono">{user.id}</td>
                      <td className="px-4 py-2">{user.fullName}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.roleName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Update Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Update User Role</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="Enter user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Client (0)</option>
                <option value={1}>Organizer (1)</option>
                <option value={2}>Partner (2)</option>
                <option value={3}>Admin (3)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleUpdateRole}
                disabled={loading || !selectedUserId}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTestPage;
