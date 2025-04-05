export enum UserPermission {
    // Member
    CAN_USE_MACHINES = "canUseMachines",
    CAN_USE_MACHINES_BETWEEN_SEMESTERS = "canUseMachinesBetweenSemesters",

    // //  VOLUNTEER
    CAN_CLEAR_MACHINES = "canClearMachines",
    CAN_FAIL_MACHINES = "canFailMachines",

    // //  VISIBILITY
    CAN_SEE_USERS = "canSeeUsers",

    // //  ADMINISTRATIVE
    CAN_CREATE_ORGS = "canCreateOrgs",

    CAN_EDIT_USER_CORE_INFO = "canEditUserCoreInfo",

    //  For creating new resource representations
    CAN_SEE_RESOURCES = "canSeeResources",
    CAN_CREATE_RESOURCES = "canCreateResources",
    CAN_EDIT_RESOURCES = "canEditResources",
    CAN_DELETE_RESOURCES = "canDeleteResources",

    //  For creating new resource groups (for machine slots)
    CAN_SEE_RESOURCE_SLOTS = "canSeeResourceSlots",
    CAN_CREATE_RESOURCE_SLOTS = "canCreateResourceSlots",
    CAN_EDIT_RESOURCE_SLOTS = "canEditResourceSlots",
    CAN_DELETE_RESOURCE_SLOTS = "canDeleteResourceSlots",

    //  For creating new machine types
    CAN_SEE_MACHINE_TYPES = "canSeeMachineTypes",
    CAN_CREATE_MACHINE_TYPES = "canCreateMachineTypes",
    CAN_EDIT_MACHINE_TYPES = "canEditMachineTypes",
    CAN_DELETE_MACHINE_TYPES = "canDeleteMachineTypes",

    //  For creating new machine groups
    CAN_SEE_MACHINE_GROUPS = "canSeeMachineGroups",
    CAN_CREATE_MACHINE_GROUPS = "canCreateMachineGroups",
    CAN_EDIT_MACHINE_GROUPS = "canEditMachineGroups",
    CAN_DELETE_MACHINE_GROUPS = "canDeleteMachineGroups",

    //  For creating new machines
    CAN_SEE_MACHINES = "canSeeMachines",
    CAN_CREATE_MACHINES = "canCreateMachines",
    CAN_EDIT_MACHINES = "canEditMachines",
    CAN_DELETE_MACHINES = "canDeleteMachines",

    //  For generating charge sheets
    CAN_GET_CHARGES = "canGetCharges",

    //  For changing the active school semester
    CAN_SEE_SEMESTERS = "canSeeSemesters",

    // //  Manual admin database interaction
    CAN_CREATE_SEMESTERS = "canCreateSemesters",
    CAN_EDIT_SEMESTERS = "canEditSemesters",
    CAN_DELETE_SEMESTERS = "canDeleteSemesters",

    // //  Routine active semester changes
    CAN_CHANGE_SEMESTER = "canChangeSemester",

    CAN_VIEW_FAILURE_LOGS = "canViewFailureLogs",

    //  For user role management
    CAN_SEE_ROLES = "canSeeRoles",
    CAN_CREATE_ROLES = "canCreateRoles",
    CAN_EDIT_ROLES = "canEditRoles",
    CAN_DELETE_ROLES = "canDeleteRoles",

    CAN_CHANGE_USER_ROLES = "canChangeUserRoles",

    // DAMAGE CONTROL

    ROLE_CHANGE_IMMUNE = "roleChangeImmune",
    CAN_CONTROL_LOCKOUT = "canControlLockout",
    LOCKOUT = "lockout",

    // SUPERADMIN
    IS_SUPERUSER = "isSuperuser"
}
