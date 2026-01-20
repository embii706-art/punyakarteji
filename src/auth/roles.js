// Roles and Permissions for KARTEJI
// FIXED roles - cannot be deleted or modified

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  KETUA: 'ketua',
  WAKIL_KETUA: 'wakil_ketua',
  BENDAHARA: 'bendahara',
  SEKRETARIS: 'sekretaris',
  HUMAS: 'humas',
  ANGGOTA: 'anggota'
};

// Role labels for display
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.KETUA]: 'Ketua',
  [ROLES.WAKIL_KETUA]: 'Wakil Ketua',
  [ROLES.BENDAHARA]: 'Bendahara',
  [ROLES.SEKRETARIS]: 'Sekretaris',
  [ROLES.HUMAS]: 'Humas',
  [ROLES.ANGGOTA]: 'Anggota'
};

// Role colors for badges
export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800',
  [ROLES.KETUA]: 'bg-purple-100 text-purple-800',
  [ROLES.WAKIL_KETUA]: 'bg-blue-100 text-blue-800',
  [ROLES.BENDAHARA]: 'bg-yellow-100 text-yellow-800',
  [ROLES.SEKRETARIS]: 'bg-green-100 text-green-800',
  [ROLES.HUMAS]: 'bg-pink-100 text-pink-800',
  [ROLES.ANGGOTA]: 'bg-gray-100 text-gray-800'
};

// Permissions list
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ALL_DATA: 'view_all_data',
  
  // Members
  VIEW_MEMBERS: 'view_members',
  CREATE_MEMBER: 'create_member',
  EDIT_MEMBER: 'edit_member',
  DELETE_MEMBER: 'delete_member',
  MANAGE_ROLES: 'manage_roles',
  
  // Bank Sampah
  VIEW_BANK_SAMPAH: 'view_bank_sampah',
  CREATE_DEPOSIT: 'create_deposit',
  EDIT_DEPOSIT: 'edit_deposit',
  DELETE_DEPOSIT: 'delete_deposit',
  GENERATE_REPORTS: 'generate_reports',
  MANAGE_WASTE_SALES: 'manage_waste_sales',
  
  // Finance
  VIEW_FINANCE: 'view_finance',
  CREATE_TRANSACTION: 'create_transaction',
  EDIT_TRANSACTION: 'edit_transaction',
  DELETE_TRANSACTION: 'delete_transaction',
  APPROVE_TRANSACTION: 'approve_transaction',
  VIEW_BALANCE: 'view_balance',
  
  // UMKM
  VIEW_UMKM: 'view_umkm',
  CREATE_UMKM: 'create_umkm',
  EDIT_UMKM: 'edit_umkm',
  DELETE_UMKM: 'delete_umkm',
  PUBLISH_UMKM: 'publish_umkm',
  
  // Aspiration
  VIEW_ASPIRATIONS: 'view_aspirations',
  CREATE_ASPIRATION: 'create_aspiration',
  MANAGE_ASPIRATIONS: 'manage_aspirations',
  
  // System
  SYSTEM_SETTINGS: 'system_settings',
  VIEW_AUDIT_LOG: 'view_audit_log'
};

// Role-based permissions matrix
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.CREATE_MEMBER,
    PERMISSIONS.EDIT_MEMBER,
    PERMISSIONS.DELETE_MEMBER,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_BANK_SAMPAH,
    PERMISSIONS.CREATE_DEPOSIT,
    PERMISSIONS.EDIT_DEPOSIT,
    PERMISSIONS.DELETE_DEPOSIT,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.MANAGE_WASTE_SALES,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.CREATE_TRANSACTION,
    PERMISSIONS.EDIT_TRANSACTION,
    PERMISSIONS.DELETE_TRANSACTION,
    PERMISSIONS.APPROVE_TRANSACTION,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.VIEW_UMKM,
    PERMISSIONS.CREATE_UMKM,
    PERMISSIONS.EDIT_UMKM,
    PERMISSIONS.DELETE_UMKM,
    PERMISSIONS.PUBLISH_UMKM,
    PERMISSIONS.VIEW_ASPIRATIONS,
    PERMISSIONS.CREATE_ASPIRATION,
    PERMISSIONS.MANAGE_ASPIRATIONS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOG
  ],
  
  [ROLES.KETUA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_BANK_SAMPAH,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.APPROVE_TRANSACTION,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.VIEW_UMKM,
    PERMISSIONS.VIEW_ASPIRATIONS,
    PERMISSIONS.MANAGE_ASPIRATIONS,
    PERMISSIONS.CREATE_ASPIRATION,
    PERMISSIONS.VIEW_AUDIT_LOG
  ],
  
  [ROLES.WAKIL_KETUA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_BANK_SAMPAH,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.APPROVE_TRANSACTION,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.VIEW_UMKM,
    PERMISSIONS.VIEW_ASPIRATIONS,
    PERMISSIONS.MANAGE_ASPIRATIONS,
    PERMISSIONS.CREATE_ASPIRATION
  ],
  
  [ROLES.BENDAHARA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_BANK_SAMPAH,
    PERMISSIONS.MANAGE_WASTE_SALES,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.CREATE_TRANSACTION,
    PERMISSIONS.EDIT_TRANSACTION,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.CREATE_ASPIRATION
  ],
  
  [ROLES.SEKRETARIS]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.CREATE_MEMBER,
    PERMISSIONS.EDIT_MEMBER,
    PERMISSIONS.VIEW_BANK_SAMPAH,
    PERMISSIONS.VIEW_UMKM,
    PERMISSIONS.VIEW_ASPIRATIONS,
    PERMISSIONS.MANAGE_ASPIRATIONS,
    PERMISSIONS.CREATE_ASPIRATION
  ],
  
  [ROLES.HUMAS]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_UMKM,
    PERMISSIONS.CREATE_UMKM,
    PERMISSIONS.EDIT_UMKM,
    PERMISSIONS.PUBLISH_UMKM,
    PERMISSIONS.CREATE_ASPIRATION
  ],
  
  [ROLES.ANGGOTA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.CREATE_DEPOSIT,
    PERMISSIONS.CREATE_ASPIRATION
  ]
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role is admin (can approve, manage)
 */
export function isAdminRole(role) {
  return [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA].includes(role);
}

/**
 * Check if role can manage members
 */
export function canManageMembers(role) {
  return roleHasPermission(role, PERMISSIONS.CREATE_MEMBER) ||
         roleHasPermission(role, PERMISSIONS.EDIT_MEMBER);
}

/**
 * Check if role can approve transactions
 */
export function canApproveTransactions(role) {
  return roleHasPermission(role, PERMISSIONS.APPROVE_TRANSACTION);
}

/**
 * Get role label
 */
export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}

/**
 * Get role color class
 */
export function getRoleColor(role) {
  return ROLE_COLORS[role] || ROLE_COLORS[ROLES.ANGGOTA];
}

/**
 * Get all roles for dropdown
 */
export function getAllRoles() {
  return Object.values(ROLES).map(role => ({
    value: role,
    label: ROLE_LABELS[role]
  }));
}

/**
 * Role responsibilities description
 */
export const ROLE_RESPONSIBILITIES = {
  [ROLES.SUPER_ADMIN]: [
    'Full system access',
    'Manage users & roles',
    'System settings',
    'View all data and reports'
  ],
  [ROLES.KETUA]: [
    'Approve financial transactions',
    'Monitor bank sampah & UMKM',
    'View all reports',
    'Manage aspirations'
  ],
  [ROLES.WAKIL_KETUA]: [
    'Backup ketua approval',
    'View reports',
    'Manage aspirations'
  ],
  [ROLES.BENDAHARA]: [
    'Manage finances',
    'Create transactions',
    'Manage waste sales',
    'Generate financial reports'
  ],
  [ROLES.SEKRETARIS]: [
    'Manage members',
    'Documentation & archives',
    'Manage aspirations'
  ],
  [ROLES.HUMAS]: [
    'Manage UMKM catalog',
    'Publish activities',
    'Public content management'
  ],
  [ROLES.ANGGOTA]: [
    'View dashboard',
    'Submit waste deposits',
    'Submit aspirations',
    'Pay dues'
  ]
};

/**
 * Get role responsibilities
 */
export function getRoleResponsibilities(role) {
  return ROLE_RESPONSIBILITIES[role] || [];
}
