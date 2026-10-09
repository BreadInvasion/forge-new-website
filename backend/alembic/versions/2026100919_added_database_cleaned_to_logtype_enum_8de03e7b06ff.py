"""added database cleaned to logtype enum

Revision ID: 8de03e7b06ff
Revises: 2e29f9a333d1
Create Date: 2026-10-09 18:19:01.610499

"""

from alembic import op
import sqlalchemy as sa

from schemas.enums import LogType

enum_name = LogType.mro()[0].__name__.lower()

enum_keys_to_add = [
    LogType.DATABASE_CLEANED.name
]

# revision identifiers, used by Alembic.
revision = "8de03e7b06ff"
down_revision = "2e29f9a333d1"
branch_labels = None
depends_on = None


def upgrade():
    for v in enum_keys_to_add:
            # Use ALTER TYPE.
            # See more information https://www.postgresql.org/docs/9.1/sql-altertype.html
            op.execute(f"ALTER TYPE {enum_name} ADD VALUE '{v}'")
        # Note that ALTER TYPE is not effective within the same transaction https://medium.com/makimo-tech-blog/upgrading-postgresqls-enum-type-with-sqlalchemy-using-alembic-migration-881af1e30abe

def downgrade():
     # https://stackoverflow.com/a/39878233/315168
        for v in enum_keys_to_add:
            sql = f"""DELETE FROM pg_enum
                WHERE enumlabel = '{v}'
                AND enumtypid = (
                  SELECT oid FROM pg_type WHERE typname = '{enum_name}'
                )"""
            op.execute(sql)
