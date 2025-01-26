from enum import Enum, StrEnum
from typing import Set


class GenderStatsType(StrEnum):
    NOTDISCLOSED = "notdisclosed"
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class PronounType(StrEnum):
    NOT_SHOWN = "not_shown"
    THEY_THEM = "they_them"
    HE_HIM = "he_him"
    SHE_HER = "she_her"
    HE_THEY = "he_they"
    SHE_THEY = "she_they"
    ALL_ANY = "all_any"
    JUST_USE_MY_NAME = "use_name"


class OrgRole(Enum):
    MEMBER = 0
    OFFICER = 1
    ADMIN = 2


class Permissions(StrEnum):
    ## BASIC
    # Permissions in this section are fundamental to being a
    # member of the space.

    # Allows use of machines in the space.
    CAN_USE_MACHINES = "canUseMachines"

    # Allows use of machines between semesters (will not be charged)
    CAN_USE_MACHINES_BETWEEN_SEMESTERS = "canUseMachinesBetweenSemesters"

    ## VOLUNTEER
    # Permissions in this section are necessary to perform
    # various duties of a volunteer.

    # Allows the user to clear machines.
    CAN_CLEAR_MACHINES = "canClearMachines"

    # Allows the user to mark an active machine as Failed.
    CAN_FAIL_MACHINES = "canFailMachines"

    ## VISIBILITY
    # Permissions in this section reveal data that we
    # may want to restrict, mostly for privacy and security
    # reasons.

    # Allows the user to view user data belonging to other users
    CAN_SEE_USERS = "canSeeUsers"

    ## ADMINISTRATIVE
    # Permissions in this section are necessary for certain
    # administrative actions, which should not be available
    # to most people.

    # We want organizations to be invite-only, so only certain staff should be able to create them
    CAN_CREATE_ORGS = "canCreateOrgs"

    # For changing core data of other users, that are too dangerous
    # to allow a user to freely change (RCSID and RIN)
    CAN_EDIT_USER_CORE_INFO = "canEditUserCoreInfo"

    # For creating new resource representations
    CAN_SEE_RESOURCES = "canSeeResources"
    CAN_CREATE_RESOURCES = "canCreateResources"
    CAN_EDIT_RESOURCES = "canEditResources"
    CAN_DELETE_RESOURCES = "canDeleteResources"

    # For creating new resource groups (for machine slots)
    CAN_SEE_RESOURCE_SLOTS = "canSeeResourceSlots"
    CAN_CREATE_RESOURCE_SLOTS = "canCreateResourceSlots"
    CAN_EDIT_RESOURCE_SLOTS = "canEditResourceSlots"
    CAN_DELETE_RESOURCE_SLOTS = "canDeleteResourceSlots"

    # For creating new machine types
    CAN_SEE_MACHINE_TYPES = "canSeeMachineTypes"
    CAN_CREATE_MACHINE_TYPES = "canCreateMachineTypes"
    CAN_EDIT_MACHINE_TYPES = "canEditMachineTypes"
    CAN_DELETE_MACHINE_TYPES = "canDeleteMachineTypes"

    # For creating new machine groups
    CAN_SEE_MACHINE_GROUPS = "canSeeMachineGroups"
    CAN_CREATE_MACHINE_GROUPS = "canCreateMachineGroups"
    CAN_EDIT_MACHINE_GROUPS = "canEditMachineGroups"
    CAN_DELETE_MACHINE_GROUPS = "canDeleteMachineGroups"

    # For creating new machines
    CAN_SEE_MACHINES = "canSeeMachines"
    CAN_CREATE_MACHINES = "canCreateMachines"
    CAN_EDIT_MACHINES = "canEditMachines"
    CAN_DELETE_MACHINES = "canDeleteMachines"

    # For generating charge sheets
    CAN_GET_CHARGES = "canGetCharges"

    # For changing the active school semester
    CAN_SEE_SEMESTERS = "canSeeSemesters"

    ## Manual admin database interaction
    CAN_CREATE_SEMESTERS = "canCreateSemesters"
    CAN_EDIT_SEMESTERS = "canEditSemesters"
    CAN_DELETE_SEMESTERS = "canDeleteSemesters"

    ## Routine active semester changes
    CAN_CHANGE_SEMESTER = "canChangeSemester"

    CAN_VIEW_FAILURE_LOGS = "canViewFailureLogs"

    # For user role management
    CAN_SEE_ROLES = "canSeeRoles"
    CAN_CREATE_ROLES = "canCreateRoles"
    CAN_EDIT_ROLES = "canEditRoles"
    CAN_DELETE_ROLES = "canDeleteRoles"

    CAN_CHANGE_USER_ROLES = "canChangeUserRoles"

    # DAMAGE CONTROL
    # Roles used to combat abuse of website privileges.

    # This permission prevents the bearer's roles from being changed by anyone but themselves or a superuser.
    # Used to prevent shenanigans.
    ROLE_CHANGE_IMMUNE = "roleChangeImmune"

    # Allows the user to apply or remove a role with LOCKOUT to the accounts of other users. Does not prevent a user from applying
    # a role with LOCKOUT to superusers... but it won't do anything.
    CAN_CONTROL_LOCKOUT = "canControlLockout"

    # Locks out all account activity. Can only be applied to roles by superusers,
    # and can only be applied to users by those with CAN_CONTROL_LOCKOUT.
    LOCKOUT = "lockout"

    # SUPERADMIN
    # Assumed to have all permissions. Grant judiciously.
    # Roles with this tag can only be assigned or edited by another superuser.
    IS_SUPERUSER = "isSuperuser"


class LogType(StrEnum):
    MACHINE_USED = "machine_used"

    MACHINE_CREATED = "machine_created"
    MACHINE_EDITED = "machine_edited"
    MACHINE_DELETED = "machine_deleted"

    MACHINE_TYPE_CREATED = "machine_type_created"
    MACHINE_TYPE_EDITED = "machine_type_edited"
    MACHINE_TYPE_DELETED = "machine_type_deleted"

    MACHINE_GROUP_CREATED = "machine_group_created"
    MACHINE_GROUP_EDITED = "machine_group_edited"
    MACHINE_GROUP_DELETED = "machine_group_deleted"

    # Specifically an internal manual usage creation
    MACHINE_USAGE_CREATED = "machine_usage_created"
    MACHINE_USAGE_EDITED = "machine_usage_edited"
    MACHINE_USAGE_DELETED = "machine_usage_deleted"
    MACHINE_USAGE_CLEARED = "machine_usage_cleared"
    MACHINE_USAGE_FAILED = "machine_usage_failed"

    RESOURCE_CREATED = "resource_created"
    RESOURCE_EDITED = "resource_edited"
    RESOURCE_DELETED = "resource_deleted"

    RESOURCE_SLOT_CREATED = "resource_slot_created"
    RESOURCE_SLOT_EDITED = "resource_slot_edited"
    RESOURCE_SLOT_DELETED = "resource_slot_deleted"

    RESOURCE_USAGE_QUANTITY_CREATED = "resource_usage_quantity_created"
    RESOURCE_USAGE_QUANTITY_EDITED = "resource_usage_quantity_edited"
    RESOURCE_USAGE_QUANTITY_DELETED = "resource_usage_quantity_deleted"

    ROLE_CREATED = "role_created"
    ROLE_EDITED = "role_edited"
    ROLE_DELETED = "role_deleted"

    SEMESTER_CREATED = "semester_created"
    SEMESTER_EDITED = "semester_edited"
    SEMESTER_DELETED = "semester_deleted"

    ACTIVE_SEMESTER_CHANGED = "active_semester_changed"

    USER_CREATED = "user_created"
    USER_EDITED = "user_edited"
    USER_DELETED = "user_deleted"

    ORG_CREATED = "org_created"
    ORG_EDITED = "org_edited"
    ORG_DELETED = "org_deleted"


# Used to indicate no particular permission is required to access
# an endpoint. Lockout is still checked.
PERMISSIONS_NONE: Set[Permissions] = set()

RESTRICTED_PERMISSIONS = {
    Permissions.IS_SUPERUSER,
    Permissions.ROLE_CHANGE_IMMUNE,
    Permissions.LOCKOUT,
}


class SemesterType(Enum):
    FALL = 0
    SPRING = 1
    SUMMER = 2
