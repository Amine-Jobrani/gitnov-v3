// src/pages/RoleSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleSelectionModal from '../components/RoleSelectionModal';
import RoleService, { UserRole } from '../services/roleService';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Edit,
  Info,
  Crown,
  Building,
  UserCheck,
  Loader
} from 'lucide-react';

const RoleSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user role from backend
  useEffect(() => {
    const fetchCurrentRole = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const roleData = await RoleService.getUserRole(user.id);
        setCurrentUserRole(roleData);
        console.log('✅ Current user role fetched:', roleData);
      } catch (err) {
        console.error('❌ Failed to fetch current role:', err);
        setError('Failed to load current role');
        // Fallback to user role from auth context
        if (user?.role) {
          setCurrentUserRole({
            id: user.id,
            fullName: user.fullName || 'Unknown User',
            email: user.email || '',
            role: RoleService.getRoleNumber(user.role),
            roleName: user.role
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRole();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You must be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (roleNumber: number) => {
    const roleName = RoleService.getRoleName(roleNumber);
    switch (roleName) {
      case 'admin': return <Crown className="w-6 h-6 text-purple-500" />;
      case 'partner': return <Building className="w-6 h-6 text-blue-500" />;
      case 'organizer': return <UserCheck className="w-6 h-6 text-green-500" />;
      default: return <UserIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRoleDescription = (roleNumber: number) => {
    const roleName = RoleService.getRoleName(roleNumber);
    switch (roleName) {
      case 'admin':
        return 'Full access to all system features including user management and system administration.';
      case 'partner':
        return 'Create and manage events, access partner dashboard and analytics.';
      case 'organizer':
        return 'Manage restaurants, create dining experiences and handle reservations.';
      case 'client':
      default:
        return 'Browse and discover restaurants and events, make reservations and add favorites.';
    }
  };

  const getRoleBadgeColor = (roleNumber: number) => {
    const roleName = RoleService.getRoleName(roleNumber);
    switch (roleName) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'partner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organizer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRoleChanged = async () => {
    // Refresh the role data from backend
    if (user?.id) {
      try {
        const roleData = await RoleService.getUserRole(user.id);
        setCurrentUserRole(roleData);
        console.log('✅ Role refreshed after change:', roleData);
      } catch (err) {
        console.error('❌ Failed to refresh role after change:', err);
        // Optionally show an error message
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Settings</h1>
              <p className="text-gray-600">Manage your account role and permissions</p>
            </div>
          </div>
        </div>

        {/* Current Role Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading current role...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <Shield className="w-6 h-6 text-red-500 mr-2" />
              <span className="text-red-600">{error}</span>
            </div>
          ) : currentUserRole ? (
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getRoleIcon(currentUserRole.role)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">Current Role</h2>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleBadgeColor(currentUserRole.role)}`}>
                      {currentUserRole.roleName || RoleService.getRoleName(currentUserRole.role)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {getRoleDescription(currentUserRole.role)}
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Role Permissions:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {currentUserRole.role === 3 && (
                        <>
                          <li>• Manage all users and their roles</li>
                          <li>• Access system administration features</li>
                          <li>• View analytics and reports</li>
                          <li>• Create and manage events and restaurants</li>
                          <li>• Full platform access</li>
                        </>
                      )}
                      {currentUserRole.role === 2 && (
                        <>
                          <li>• Create and manage events</li>
                          <li>• Access partner dashboard</li>
                          <li>• View event analytics</li>
                          <li>• Manage event reservations</li>
                        </>
                      )}
                      {currentUserRole.role === 1 && (
                        <>
                          <li>• Create and manage restaurants</li>
                          <li>• Access organizer dashboard</li>
                          <li>• View restaurant analytics</li>
                          <li>• Manage restaurant reservations</li>
                        </>
                      )}
                      {currentUserRole.role === 0 && (
                        <>
                          <li>• Browse restaurants and events</li>
                          <li>• Make reservations</li>
                          <li>• Add items to favorites</li>
                          <li>• Manage personal profile</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Change Role</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Role Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Available Roles</h2>
          </div>
          
          <div className="grid gap-4">
            {[
              {
                roleNumber: 0,
                role: 'client',
                name: 'Client',
                description: 'Perfect for users who want to discover and enjoy restaurants and events.',
                icon: <UserIcon className="w-5 h-5 text-gray-500" />,
                color: 'text-gray-600'
              },
              {
                roleNumber: 1,
                role: 'organizer',
                name: 'Organizer',
                description: 'Ideal for restaurant owners and managers who want to showcase their venues.',
                icon: <UserCheck className="w-5 h-5 text-green-500" />,
                color: 'text-green-600'
              },
              {
                roleNumber: 2,
                role: 'partner',
                name: 'Partner',
                description: 'Great for event organizers and companies hosting special events.',
                icon: <Building className="w-5 h-5 text-blue-500" />,
                color: 'text-blue-600'
              },
              {
                roleNumber: 3,
                role: 'admin',
                name: 'Admin',
                description: 'Complete system access for platform administrators.',
                icon: <Crown className="w-5 h-5 text-purple-500" />,
                color: 'text-purple-600'
              }
            ].map((roleInfo) => (
              <div
                key={roleInfo.role}
                className={`p-4 border rounded-lg ${
                  currentUserRole?.role === roleInfo.roleNumber 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {roleInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${roleInfo.color}`}>
                        {roleInfo.name}
                      </h3>
                      {currentUserRole?.role === roleInfo.roleNumber && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {roleInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleChanged={handleRoleChanged}
      />
    </div>
  );
};

export { RoleSettingsPage };
export default RoleSettingsPage;
