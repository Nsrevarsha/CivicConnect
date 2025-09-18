import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  UserPlus, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Users, 
  Shield, 
  Settings, 
  UserCheck, 
  UserX,
  Edit3,
  Trash2,
  Eye,
  Download,
  Key,
  Mail,
  User as UserIcon,
  Crown,
  Briefcase,

} from 'lucide-react';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'super_admin',
    departmentId: 'IT',
    isActive: true,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'department_admin',
    departmentId: 'HR',
    isActive: true,
    lastLogin: '2024-01-14T14:20:00Z',
    createdAt: '2023-07-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    role: 'supervisor',
    departmentId: 'Sales',
    isActive: false,
    lastLogin: '2024-01-10T09:15:00Z',
    createdAt: '2023-08-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'user',
    departmentId: 'Marketing',
    isActive: true,
    lastLogin: null,
    createdAt: '2023-12-01T00:00:00Z'
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal states
  const [viewUserModal, setViewUserModal] = useState(null);
  const [editUserModal, setEditUserModal] = useState(null);
  const [addUserModal, setAddUserModal] = useState(false);
  const [emailModal, setEmailModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [resetPasswordModal, setResetPasswordModal] = useState(null);
  
  // Form states
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    role: 'user',
    departmentId: '',
    isActive: true
  });
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });
  
  // Success/error messages
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => 
        selectedStatus === 'active' ? user.isActive : !user.isActive
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleViewUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setViewUserModal(user);
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setEditForm({ ...user });
    setEditUserModal(user);
  };

  const handleSaveUser = () => {
    setUsers(users.map(u => u.id === editForm.id ? editForm : u));
    setEditUserModal(null);
    showMessage('success', 'User updated successfully!');
  };

  const handleAddUser = () => {
    const newUser = {
      ...addForm,
      id: Date.now().toString(),
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setAddForm({
      name: '',
      email: '',
      role: 'user',
      departmentId: '',
      isActive: true
    });
    setAddUserModal(false);
    showMessage('success', 'User added successfully!');
  };

  const handleToggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    const updatedUser = { ...user, isActive: !user.isActive };
    setUsers(users.map(u => u.id === userId ? updatedUser : u));
    showMessage('success', `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleResetPassword = (userId) => {
    setResetPasswordModal(userId);
  };

  const confirmResetPassword = () => {
    const user = users.find(u => u.id === resetPasswordModal);
    showMessage('success', `Password reset email sent to ${user.email}`);
    setResetPasswordModal(null);
  };

  const handleSendEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    setEmailModal(user);
    setEmailForm({
      subject: '',
      message: ''
    });
  };

  const sendEmail = () => {
    showMessage('success', `Email sent to ${emailModal.email} successfully!`);
    setEmailModal(null);
    setEmailForm({ subject: '', message: '' });
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setDeleteModal(user);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter(u => u.id !== deleteModal.id));
    setDeleteModal(null);
    showMessage('success', 'User deleted successfully!');
  };

  const exportUsers = () => {
    const csvContent = [
      'Name,Email,Role,Department,Status,Last Login',
      ...users.map(user => 
        `"${user.name}","${user.email}","${formatRoleName(user.role)}","${user.departmentId || 'N/A'}","${user.isActive ? 'Active' : 'Inactive'}","${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
    showMessage('success', 'Users exported successfully!');
  };

  const getRoleBadgeProps = (role) => {
    switch (role) {
      case 'super_admin':
        return {
          variant: 'destructive',
          icon: <Crown className="h-3 w-3" />,
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
        };
      case 'department_admin':
        return {
          variant: 'default',
          icon: <Briefcase className="h-3 w-3" />,
          className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        };
      case 'supervisor':
        return {
          variant: 'secondary',
          icon: <Settings className="h-3 w-3" />,
          className: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
        };
      case 'user':
        return {
          variant: 'outline',
          icon: <UserIcon className="h-3 w-3" />,
          className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
        };
      default:
        return {
          variant: 'secondary',
          icon: <UserIcon className="h-3 w-3" />,
          className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  const formatRoleName = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'department_admin': return 'Department Admin';
      case 'supervisor': return 'Supervisor';
      case 'user': return 'User';
      default: return role;
    }
  };

  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    inactiveUsers: users.filter(u => !u.isActive).length,
    superAdmins: users.filter(u => u.role === 'super_admin').length,
    departmentAdmins: users.filter(u => u.role === 'department_admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button onClick={() => setAddUserModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-800">{userStats.activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Inactive</p>
                <p className="text-2xl font-bold text-red-800">{userStats.inactiveUsers}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Super Admins</p>
                <p className="text-2xl font-bold text-purple-800">{userStats.superAdmins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Dept. Admins</p>
                <p className="text-2xl font-bold text-blue-800">{userStats.departmentAdmins}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-800">{userStats.regularUsers}</p>
              </div>
              <Users className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="department_admin">Department Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="user">Regular User</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const roleBadgeProps = getRoleBadgeProps(user.role);
                return (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={roleBadgeProps.variant}
                        className={`inline-flex items-center gap-1.5 font-medium ${roleBadgeProps.className}`}
                      >
                        {roleBadgeProps.icon}
                        {formatRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.departmentId || 'System-wide'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.isActive ? 'default' : 'secondary'}
                        className={user.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 font-medium'
                        }
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          user.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString() 
                          : 'Never'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleSendEmail(user.id)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={user.isActive 
                              ? 'text-amber-600 focus:text-amber-600' 
                              : 'text-green-600 focus:text-green-600'
                            }
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate User
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Modal */}
      {viewUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Details</h2>
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p className="text-sm text-gray-600">{viewUserModal.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-sm text-gray-600">{viewUserModal.email}</p>
                </div>
                <div>
                  <Label className="font-semibold">Role</Label>
                  <p className="text-sm text-gray-600">{formatRoleName(viewUserModal.role)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Department</Label>
                  <p className="text-sm text-gray-600">{viewUserModal.departmentId || 'System-wide'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="text-sm text-gray-600">{viewUserModal.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Last Login</Label>
                  <p className="text-sm text-gray-600">
                    {viewUserModal.lastLogin 
                      ? new Date(viewUserModal.lastLogin).toLocaleString() 
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(viewUserModal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setViewUserModal(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Edit User</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={editForm.role || 'user'} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="department_admin">Department Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={editForm.departmentId || ''}
                    onChange={(e) => setEditForm({...editForm, departmentId: e.target.value})}
                    placeholder="e.g., IT, HR, Marketing"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    checked={editForm.isActive || false}
                    onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                  />
                  <Label htmlFor="edit-active">Active User</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEditUserModal(null)}>Cancel</Button>
                <Button onClick={handleSaveUser}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="add-name">Name *</Label>
                  <Input
                    id="add-name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="add-email">Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    placeholder="user@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="add-role">Role</Label>
                  <Select value={addForm.role} onValueChange={(value) => setAddForm({...addForm, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="department_admin">Department Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-department">Department</Label>
                  <Input
                    id="add-department"
                    value={addForm.departmentId}
                    onChange={(e) => setAddForm({...addForm, departmentId: e.target.value})}
                    placeholder="e.g., IT, HR, Marketing"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="add-active"
                    checked={addForm.isActive}
                    onChange={(e) => setAddForm({...addForm, isActive: e.target.checked})}
                  />
                  <Label htmlFor="add-active">Active User</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setAddUserModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddUser}
                  disabled={!addForm.name || !addForm.email}
                >
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Send Email to {emailModal.name}</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="email-message">Message</Label>
                  <Textarea
                    id="email-message"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                    placeholder="Enter your message..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setEmailModal(null)}>Cancel</Button>
                <Button 
                  onClick={sendEmail}
                  disabled={!emailForm.subject || !emailForm.message}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation */}
      {resetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold">Reset Password</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to send a password reset email to this user?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setResetPasswordModal(null)}>Cancel</Button>
                <Button onClick={confirmResetPassword}>Send Reset Email</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold">Delete User</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete <strong>{deleteModal.name}</strong>?
              </p>
              <p className="text-red-600 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
                <Button onClick={confirmDeleteUser} className='text-white'>Delete User</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}