import { User } from "src/interfaces";
import { UserPermission } from "src/enums";

/**
 * Returns true if the given user has super-admin (superuser) privileges.
 */
export const isSuperAdmin = (user: User | undefined | null): boolean => {
    if (!user) return false;
    if (Array.isArray(user.permissions) && user.permissions.includes(UserPermission.IS_SUPERUSER)) {
        return true;
    }
    const role = (user.display_role || "").toLowerCase();
    return role === "super_admin" || role === "superadmin" || role === "super admin";
};

/**
 * Returns true if the given user is an admin (or super-admin). Used to gate
 * access to the Admin pages and the Admin button in the nav bar.
 *
 * We treat a user as an admin when they either:
 *   - have the IS_SUPERUSER permission flag, or
 *   - have `display_role` set to "admin" / "super_admin", or
 *   - carry one of the broad administrative CRUD permissions
 *     (CAN_CREATE_MACHINES / CAN_EDIT_MACHINES / CAN_DELETE_MACHINES, etc.)
 */
export const isAdmin = (user: User | undefined | null): boolean => {
    if (!user) return false;

    if (isSuperAdmin(user)) return true;

    const role = (user.display_role || "").toLowerCase();
    if (role === "admin") return true;

    const adminPerms: UserPermission[] = [
        UserPermission.CAN_CREATE_MACHINES,
        UserPermission.CAN_EDIT_MACHINES,
        UserPermission.CAN_DELETE_MACHINES,
        UserPermission.CAN_CREATE_MACHINE_TYPES,
        UserPermission.CAN_EDIT_MACHINE_TYPES,
        UserPermission.CAN_DELETE_MACHINE_TYPES,
        UserPermission.CAN_CREATE_MACHINE_GROUPS,
        UserPermission.CAN_EDIT_MACHINE_GROUPS,
        UserPermission.CAN_DELETE_MACHINE_GROUPS,
    ];
    if (Array.isArray(user.permissions)) {
        return adminPerms.some((p) => user.permissions.includes(p));
    }
    return false;
};
