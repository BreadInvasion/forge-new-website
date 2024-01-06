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
from typing import List, Optional
import uuid

from sqlalchemy import String, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from app.schemas.enums import GenderType, MachineUsageStatus, PronounType

class Base(DeclarativeBase):
    pass

class Role(Base):
    __tablename__ = "roles"

    # Unique table identifier for the role
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Display name of the role
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    permissions: Mapped[List[str]]
    inverse_permissions: Mapped[List[str]]

    # Priority determines whether a role overrides the permissions defined by another role that the
    # user possesses. Higher = override.
    priority: Mapped[int]

class User(Base):
    __tablename__ = "users"

    # RPI identification details. Cannot be changed after account creation
    # except by administrator override.
    RCSID: Mapped[str] = mapped_column(
        String(32), primary_key=True
    )
    RIN: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    # First and last name for display. User editable.
    first_name: Mapped[str] = mapped_column(
        String(64), nullable=False
    )
    last_name: Mapped[str] = mapped_column(
        String(64), nullable=False
    )

    # Major. Reported for statistics purposes only. User editable.
    major: Mapped[str] = mapped_column(String(64))

    # Gender Identity. Reported for statistics purposes only. User editable.
    gender_identity: Mapped[GenderType]

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
    # "she/them"), the PronounType enum allows us to represent several different possible configurations
    # in a simple data structure. Here are some examples of how we would represent the above pronoun pairs:
    #
    # he/him: (A=MASCULINE, B=MASCULINE)
    # she/they: (A=FEMININE, B=NEUTRAL)
    # all/any: (A=ALL, B=ALL)
    # Just use my name please! (A=NONE, B=NONE) <Note: these are not the None type. The None type is used for
    # individuals who choose not to set pronouns>
    #
    # One can extrapolate as needed in order to determine the storage representations of the other supported
    # pronoun pairs.
    pronoun_A: Mapped[Optional[PronounType]]
    pronoun_B: Mapped[Optional[PronounType]]

    # Password hash (actual password not stored for security)
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)

class Organization(Base):
    __tablename__ = "organizations"

    # "ID" of org for use during login. Should be lowercase, alphabet only, no spaces.
    org_username: Mapped[str] = mapped_column(
        String(32), primary_key=True
    )

    # Proper name of org. Can include spaces.
    org_name: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False
    )
    primary_contact_email: Mapped[str] = mapped_column(String(254), nullable=False)

    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)

class Material(Base):
    # Represents a single usable material, with its associated cost per unit of measure.
    __tablename__ = "materials"

    # Unique table identifier for the material
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Display name of the material
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Unit of measure for the material
    units: Mapped[str] = mapped_column(String(8), nullable=False)

    # Cost in dollars per <unit> of material
    cost: Mapped[float] = mapped_column(Float, nullable=False)

class MaterialGroup(Base):
    # Represents a group of materials that are considered valid options for a given input slot on a machine.
    __tablename__ = "material_groups"


    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    materials: Mapped[List[Material]] = relationship()

class MachineType(Base):
    __tablename__ = "machine_types"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # A list of input slots that must be filled in order to use the machine.
    # One MaterialGroup represents one input slot.
    material_inputs: Mapped[List[MaterialGroup]] = relationship()

class MachineUsage(Base):
    __tablename__ = "machine_usages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user: Mapped[User] = relationship()

    time_started: Mapped[datetime]
    time_finished: Mapped[datetime]

    status: Mapped[MachineUsageStatus]



class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    type: Mapped[MachineType] = relationship()

    active_usage: Mapped[Optional[MachineUsage]]