"""Add USER_LOGIN to LogType

Revision ID: 7e3f1a2b4c6d
Revises: c24b16432b5e
Create Date: 2026-09-13 00:00:00.000000

"""

from alembic import op

from schemas.enums import LogType


enum_name = LogType.mro()[0].__name__.lower()
enum_keys_to_add = [LogType.USER_LOGIN.name]


# revision identifiers, used by Alembic.
revision = "7e3f1a2b4c6d"
down_revision = "c24b16432b5e"
branch_labels = None
depends_on = None


def upgrade():
    for value in enum_keys_to_add:
        op.execute(f"ALTER TYPE {enum_name} ADD VALUE '{value}'")


def downgrade():
    for value in enum_keys_to_add:
        op.execute(
            f"""DELETE FROM pg_enum
            WHERE enumlabel = '{value}'
            AND enumtypid = (
              SELECT oid FROM pg_type WHERE typname = '{enum_name}'
            )"""
        )
