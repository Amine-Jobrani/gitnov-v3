// src/components/RoleSelectionModal.tsx
import React, { useState } from 'react';
import { useRoleManagement } from '../hooks/useRoles';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User as UserIcon, 
  UserCheck, 
  Building, 
  Crown,
  AlertTriangle 
} from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleChanged?: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onRoleChanged
}) => {
  const { user } = useAuth();
  const { updateUserRole, loading, error, getRoleName } = useRoleManagement();
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen || !user) return null;

  const currentRoleNumber = user.role === 'admin' ? 3 : 
                           user.role === 'partner' ? 2 :
                           user.role === 'organizer' ? 1 : 0;

  const roles = [
    {
      id: 0,
      name: 'Client',
      description: 'Browse and discover restaurants and events',
      icon: <UserIcon className="w-8 h-8" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 1,
      name: 'Organizer',
      description: 'Manage restaurants and dining experiences',
      icon: <UserCheck className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 2,
      name: 'Partner',
      description: 'Create and manage events',
      icon: <Building className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      name: 'Admin',
      description: 'Full access to all system features',
      icon: <Crown className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleRoleSelect = (roleId: number) => {
    setSelectedRole(roleId);
    if (roleId !== currentRoleNumber) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmRoleChange = async () => {
    try {
      await updateUserRole(user.id, selectedRole);
      setShowConfirmation(false);
      onRoleChanged?.();
      onClose();
      // Show success message
      alert('Role updated successfully! Please refresh the page to see changes.');
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleCancel = () => {
    setSelectedRole(currentRoleNumber);
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-gray-600 mt-1">Choose the role that best fits your needs</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Role Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Current Role: <span className="capitalize">{user.role}</span>
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                  ${selectedRole === role.id ? 
                    `${role.borderColor} ${role.bgColor} shadow-md` : 
                    'border-gray-200 hover:border-gray-300'
                  }
                  ${currentRoleNumber === role.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${role.color} flex-shrink-0`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role.name}
                      </h3>
                      {currentRoleNumber === role.id && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedRole === role.id ? 
                        'bg-blue-600 border-blue-600' : 
                        'border-gray-300'
                      }
                    `}>
                      {selectedRole === role.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedRole !== currentRoleNumber) {
                  setShowConfirmation(true);
                } else {
                  onClose();
                }
              }}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>
                {selectedRole !== currentRoleNumber ? 'Change Role' : 'Close'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Role Change
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to change your role from{' '}
              <span className="font-medium capitalize">{getRoleName(currentRoleNumber)}</span> to{' '}
              <span className="font-medium capitalize">{getRoleName(selectedRole)}</span>?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>Confirm Change</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionModal;
