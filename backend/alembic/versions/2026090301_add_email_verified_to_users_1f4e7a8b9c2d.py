"""Add email verification status to users

Revision ID: 1f4e7a8b9c2d
Revises: 6f4a8b2c1d9e
Create Date: 2026-09-03 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1f4e7a8b9c2d"
down_revision = "6f4a8b2c1d9e"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column(
            "is_email_verified",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
    )


def downgrade():
    op.drop_column("users", "is_email_verified")
