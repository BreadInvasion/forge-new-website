"""add last login to users

Revision ID: 2e29f9a333d1
Revises: c24b16432b5e
Create Date: 2026-09-27 22:31:41.747087

"""

from alembic import op
import sqlalchemy as sa

from schemas.enums import LogType
from models.audit_log import AuditLog

# revision identifiers, used by Alembic.
revision = "2e29f9a333d1"
down_revision = "c24b16432b5e"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column(
            "last_login",
            sa.DateTime(),
            nullable=True,
        )
        
    )
    
def downgrade():
    op.drop_column("users", "last_login")