export const PERMISSIONS = {
  USER_CREATE: "user.delete",
  USER_READ: "user.read",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",
};

export const ROLES = {
  "1": {
    id: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Full access",
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
    ],
  },
  "2": {
    id: "ADMIN",
    name: "Admin",
    description: "Limited management access",
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
    ],
  },
  "3": {
    id: "USER",
    name: "User",
    description: "Read only",
    permissions: [PERMISSIONS.USER_READ],
  },
};
