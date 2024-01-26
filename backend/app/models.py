"""
SQL Alchemy models declaration.
https://docs.sqlalchemy.org/en/14/orm/declarative_styles.html#example-two-dataclasses-with-declarative-table
Dataclass style for powerful autocompletion support.

https://alembic.sqlalchemy.org/en/latest/tutorial.html
Note, it is used by alembic migrations logic, see `alembic/env.py`

Alembic shortcuts:
# create migration
alembic revision --autogenerate -m "migration_name"

# apply all migrations
alembic upgrade head
"""
from datetime import datetime
from typing import List, Optional, Set
import uuid

from sqlalchemy import Column, ForeignKey, String, Float, Table
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.schemas.enums import (
    GenderType,
    Permissions,
    PronounType,
    SemesterType,
)


class Base(DeclarativeBase):
    pass


roles_association_table = Table(
    "roles_association_table",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
)


class Role(Base):
    __tablename__ = "roles"

    # Unique table identifier for the role
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Display name of the role
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    permissions: Mapped[List[Permissions]] = mapped_column(ARRAY(String))
    inverse_permissions: Mapped[List[Permissions]] = mapped_column(ARRAY(String))

    # If this role is the highest priority role with display_role set, it will show as the user's primary role in the frontend
    display_role: Mapped[bool]

    # Priority determines whether a role overrides the permissions defined by another role that the
    # user possesses. Higher = override.
    priority: Mapped[int]

    users: Mapped[List["User"]] = relationship(
        secondary=roles_association_table, back_populates="roles"
    )


class User(Base):
    __tablename__ = "users"

    # Unique table identifier for the user
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Is RPI Faculty or Staff. Negates statistics fields.
    is_rpi_staff: Mapped[bool]

    # RPI identification details. Cannot be changed after account creation
    # except by administrator override.
    RCSID: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    RIN: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    # First and last name for display. User editable.
    first_name: Mapped[str] = mapped_column(String(64), nullable=False)
    last_name: Mapped[str] = mapped_column(String(64), nullable=False)

    # Major. Reported for statistics purposes only. User editable. Only None for RPI faculty/staff.
    major: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Gender Identity. Reported for statistics purposes only. User editable. Only None for RPI faculty/staff.
    gender_identity: Mapped[Optional[GenderType]]

    # Pronouns
    # Being able to consistently refer to our users correctly is good
    # for our reputation as an organization. As such, we allow each user
    # to set their "pronoun pair" at any time. Supported pronoun pairs include:
    # "he/him"  "she/her"  "they/them"  "he/they"  "she/they"  "all/any"  "Just use my name please!"
    # The development team is open to considering further development on this feature - the supported
    # pronoun pairs represent our best efforts working within UI limitations, and do not represent an
    # effort to exclude any members of our community.
    #
    # Because pronoun pairs behave inconsistently when multiple types are mixed
    # (for instance, the correct FEMININE/NEUTRAL pairing becomes "she/they", not
    # "she/them"), we use the enum PronounType to contain all supported pronoun pairs, and translate the
    # user's selected pronoun pair into one of the members of PronounType. The following section provides
    # a few examples of how we translate user input into PronounType values.
    #
    # not shown: (A=undefined, B=undefined)
    # he/him: (A=MASCULINE, B=MASCULINE)
    # she/they: (A=FEMININE, B=NEUTRAL)
    # all/any: (A=ALL, B=ALL)
    # Just use my name please! (A=NONE, B=NONE)
    #
    # One can extrapolate as needed in order to determine the storage representations of the other supported
    # pronoun pairs.
    pronouns: Mapped[PronounType]

    # Password hash (actual password not stored for security)
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)

    # Roles assigned to the user, which grant (or remove) permissions
    roles: Mapped[List[Role]] = relationship(
        secondary=roles_association_table, back_populates="users"
    )

    # Is this user active for the semester? Determines whether or not they can use the forge,
    # as well as whether or not they will be charged membership and usage fees.
    active: Mapped[bool]

    # Is this user graduating in this semester? Determines which charge sheet they are added to.
    is_graduating: Mapped[bool]


class Organization(Base):
    __tablename__ = "organizations"

    # Unique table identifier for the organization
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Forces password reset if true. Used when org is initially created,
    # to make them set a password that isn't just the username.
    force_password_reset_on_login: Mapped[bool]

    # Is Org active? Resets each semester.
    active: Mapped[bool]

    # "ID" of org for use during login. Should be lowercase, alphabet only, no spaces.
    org_username: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)

    # Proper name of org. Can include spaces.
    org_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    primary_contact_email: Mapped[str] = mapped_column(String(254), nullable=False)

    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)


class Material(Base):
    # Represents a single usable material, with its associated cost per unit of measure.
    __tablename__ = "materials"

    # Unique table identifier for the material
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Display name of the material
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Unit of measure for the material
    units: Mapped[str] = mapped_column(String(8), nullable=False)

    # Cost in dollars per <unit> of material
    cost: Mapped[float] = mapped_column(Float, nullable=False)


class MaterialUsageQuantity(Base):
    # Represents an amount of material used during a particular machine usage, for future data collection
    __tablename__ = "material_usage_quantities"

    # Unique table identifier
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    usage_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("machine_usages.id", name="fk_machine_usages")
    )
    usage: Mapped["MachineUsage"] = relationship(
        back_populates="materials_used", foreign_keys=[usage_id]
    )

    is_personal_material: Mapped[bool]

    material_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("materials.id", name="fk_usage_material")
    )
    material: Mapped[Material] = relationship(foreign_keys=[material_id])
    quantity: Mapped[float]


materials_association_table = Table(
    "materials_association_table",
    Base.metadata,
    Column("group_id", ForeignKey("material_groups.id"), primary_key=True),
    Column("material_id", ForeignKey("materials.id"), primary_key=True),
)


class MaterialGroup(Base):
    # Represents a group of materials that are considered valid options for a given input slot on a machine.
    __tablename__ = "material_groups"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    materials: Mapped[List[Material]] = relationship(
        secondary=materials_association_table
    )


material_groups_association_table = Table(
    "material_groups_association_table",
    Base.metadata,
    Column("type_id", ForeignKey("machine_types.id"), primary_key=True),
    Column("group_id", ForeignKey("material_groups.id"), primary_key=True),
)


class MachineType(Base):
    __tablename__ = "machine_types"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # A list of input slots that must be filled in order to use the machine.
    # One MaterialGroup represents one input slot.
    material_inputs: Mapped[List[MaterialGroup]] = relationship(
        secondary=material_groups_association_table
    )


class MachineUsage(Base):
    __tablename__ = "machine_usages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    semester_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("semesters.id"), name="fk_usage_semester"
    )
    semester: Mapped["Semester"] = relationship(foreign_keys=[semester_id])

    machine_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("machines.id", name="fk_usage_machine")
    )
    machine: Mapped["Machine"] = relationship(foreign_keys=[machine_id])

    is_org_usage: Mapped[bool]

    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("organizations.id", name="fk_usage_org")
    )
    organization: Mapped[Optional[Organization]] = relationship(
        foreign_keys=[organization_id]
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", name="fk_usage_user")
    )
    user: Mapped[User] = relationship(foreign_keys=[user_id])

    time_started: Mapped[datetime]
    time_finished: Mapped[datetime]

    # State management. The two act independently because it is
    # possible (and normal) to clear a failed print, but we still
    # want to know that it failed
    active: Mapped[bool]  # If not active, then cleared
    failed: Mapped[bool]  # Self-explanatory

    cost: Mapped[float]

    materials_used: Mapped[List[MaterialUsageQuantity]] = relationship(
        back_populates="usage", cascade="all, delete"
    )

    # nullable field that notes who failed the usage, if it was failed
    failed_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", name="fk_failed_by")
    )
    failed_by: Mapped[Optional[User]] = relationship(foreign_keys=[failed_by_id])

    # nullable field that notes the fail reason, if it was failed
    failure_reason: Mapped[Optional[str]]

    # time failed at, for hold period
    failed_at: Mapped[Optional[datetime]]

    # nullable field that notes who cleared the usage, if it was cleared
    cleared_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", name="fk_cleared_by")
    )
    cleared_by: Mapped[Optional[User]] = relationship(foreign_keys=[cleared_by_id])


class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    type: Mapped[MachineType] = relationship()
    type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("machine_types.id"))

    active_usage_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("machine_usages.id", name="fk_active_usage")
    )
    active_usage: Mapped[Optional[MachineUsage]] = relationship(
        foreign_keys=[active_usage_id]
    )


class Semester(Base):
    __tablename__ = "semesters"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    semester_type: Mapped[SemesterType]
    calendar_year: Mapped[int]

    active: Mapped[bool]
