from enum import Enum, StrEnum


class GenderType(Enum):
    """Gender statistics type enum. Never shown to users,
    except for in signup and their personal preferences tab."""

    OTHER = 0
    MALE = 1
    FEMALE = 2
    NOTDISCLOSED = 3


class PronounType(StrEnum):
    """Preferred pronouns to show in usage and admin pages. Set in signup and in user preferences.
    Expand upon request."""

    NOT_SHOWN = "not_shown"
    THEY_THEM = "they_them"
    HE_HIM = "he_him"
    SHE_HER = "she_her"
    HE_THEY = "he_they"
    SHE_THEY = "she_they"
    ALL_ANY = "all_any"
    JUST_USE_MY_NAME = "use_name"


class OrgRank(Enum):
    """Org permission levels for members."""

    MEMBER = 0
    MANAGER = 1
    ADMIN = 2


class MachineUsageStatus(Enum):
    """Possible usage completion states."""

    IN_PROGRESS = 0
    COMPLETED = 1
    FAILED = 2


class SemesterSeason(Enum):
    """Semester season options."""

    FALL = 0
    SPRING = 1
    SUMMER = 2


class Unique(Enum):
    """Enforces single row table by only accepting one value."""

    ONE = 1


class Permission(StrEnum):
    """All implemented permissions, which can be assigned to roles.
    This list can easily be expanded to add new permission functionality."""

    ## OVERRIDE
    # These permissions modify the permission-checking process itself.

    # Automatically passes all authentication. Ignores all other permissions. Cannot be removed by an "inverse" permission assignment.
    ADMINISTRATOR = "administrator"

    # Prevents all access to website functions. Overrides all permissions *except* administrator.
    LOCKOUT = "lockout"

    ## VOLUNTEER
    # These permissions concern basic staff actions, usually performed by volunteers.

    # Clear a machine's active usage.
    CLEAR_MACHINES = "clear_machines"

    # Mark an active usage as failed.
    FAIL_MACHINES = "fail_machines"

    ## MAINTENANCE
    # These permissions cover functions related to performing machine maintenance.

    # Mark a machine as "Out of Order".
    DISABLE_MACHINES = "disable_machines"

    # Remove a machine's "Out of Order" tag.
    ENABLE_MACHINES = "enable_machines"

    # Create detailed maintenance logs.
    LOG_MAINTENANCE = "log_maintenance"

    # View detailed failure info for a machine.
    FAILURE_DETAILS = "failure_details"

    ## MANAGER
    # These permissions cover non-maintenance tasks usually performed by Room Managers.

    # Update inventory for a resource.
    MANAGE_INVENTORY = "manage_inventory"

    # Allows user to assign or remove basic roles to other non-superusers.
    MANAGE_ROLES = "manage_roles"

    # Allows user to assign roles with the LOCKOUT permission to other non-superusers.
    ASSIGN_LOCKOUT = "assign_lockout"

    # Allows user to remove roles with the LOCKOUT permission from other non-superusers.
    REMOVE_LOCKOUT = "remove_lockout"

    # Ban a user from a specific machine.
    USER_MACHINE_BAN = "machine_ban"

    # Unban a user from a specific machine.
    USER_MACHINE_UNBAN = "machine_unban"

    ## ADMINISTRATIVE
    # These permissions cover functions related to administrative tasks.

    # Change the currently active semester.
    CHANGE_SEMESTER = "change_semester"

    # Generate and download charge sheets for a particular semester.
    CHARGE_SHEETS = "charge_sheets"

    # Override usage costs.
    OVERRIDE_COSTS = "override_costs"

    # Create or soft-delete a member organization.
    MANAGE_ORGS = "manage_orgs"

    ## DATABASE
    # These permissions cover behind-the-scenes actions relating to database objects.

    # Visibility of Machine, MachineType, ResourceSlot, Resource objects.
    SEE_MACHINES = "see_machines"
    # Allows creation and modification of Machine, MachineType, ResourceSlot, Resource objects.
    MODIFY_MACHINES = "modify_machines"

    # Visibility of all MachineUsages
    SEE_USAGES = "see_usages"
    # Allows manual modification of all MachineUsage objects.
    MODIFY_USAGES = "modify_usages"

    # Allows creation and modification of all Roles (except superuser and lockout roles).
    MODIFY_ROLES = "modify_roles"

    # Visibility of all Users
    SEE_USERS = "see_users"
    # Allows manual modification of all Users.
    MODIFY_USERS = "modify_users"

    # Visibility of all Orgs
    SEE_ORGS = "see_orgs"
    # Allows manual modification of all Orgs.
    MODIFY_ORGS = "modify_orgs"
