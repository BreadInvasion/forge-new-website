from enum import Enum, StrEnum
from typing import Set


class GenderType(Enum):
    OTHER = 0
    MALE = 1
    FEMALE = 2
    NOTDISCLOSED = 3


class PronounType(StrEnum):
    NOT_SHOWN = "not_shown"
    THEY_THEM = "they_them"
    HE_HIM = "he_him"
    SHE_HER = "she_her"
    HE_THEY = "he_they"
    SHE_THEY = "she_they"
    ALL_ANY = "all_any"
    JUST_USE_MY_NAME = "use_name"


class Permissions(StrEnum):
    ## BASIC
    # Permissions in this section are fundamental to being a
    # member of the space.

    # Allows use of machines in the space.
    CAN_USE_MACHINES = "canUseMachines"

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

    # For changing core data of other users, that are too dangerous
    # to allow a user to freely change (RCSID and RIN)
    CAN_EDIT_USER_CORE_INFO = "canEditUserCoreInfo"

    # For deleting users. Should be very restricted, as deleted
    # users will not appear in charge sheets!
    CAN_DELETE_USERS = "canDeleteUsers"

    # For creating new material representations
    CAN_SEE_MATERIALS = "canSeeMaterials"
    CAN_CREATE_MATERIALS = "canCreateMaterials"
    CAN_EDIT_MATERIALS = "canEditMaterials"
    CAN_DELETE_MATERIALS = "canDeleteMaterials"

    # For creating new material groups (for machine slots)
    CAN_SEE_MATERIAL_GROUPS = "canSeeMaterialGroups"
    CAN_CREATE_MATERIAL_GROUPS = "canCreateMaterialGroups"
    CAN_EDIT_MATERIAL_GROUPS = "canEditMaterialGroups"
    CAN_DELETE_MATERIAL_GROUPS = "canDeleteMaterialGroups"

    # For creating new machine types
    CAN_SEE_MACHINE_TYPES = "canSeeMachineTypes"
    CAN_CREATE_MACHINE_TYPES = "canCreateMachineTypes"
    CAN_EDIT_MACHINE_TYPES = "canEditMachineTypes"
    CAN_DELETE_MACHINE_TYPES = "canDeleteMachineTypes"

    # For creating new machines
    CAN_CREATE_MACHINES = "canCreateMachines"
    CAN_EDIT_MACHINES = "canEditMachines"
    CAN_DELETE_MACHINES = "canDeleteMachines"

    # For generating charge sheets
    CAN_GET_CHARGES = "canGetCharges"

    # For changing the active school semester
    CAN_SEE_SEMESTERS = "canSeeSemesters"
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
