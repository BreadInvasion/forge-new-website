"""Merge migration heads

Revision ID: c24b16432b5e
Revises: 1f4e7a8b9c2d, 4f5d3f8a9c21
Create Date: 2026-09-04 17:32:20.159498

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c24b16432b5e"
down_revision = ("1f4e7a8b9c2d", "4f5d3f8a9c21")
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
