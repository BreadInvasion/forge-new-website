"""Cost per hour

Revision ID: 6eceebb82f1b
Revises: b6fa8a91dd31
Create Date: 2025-01-25 23:05:54.629686

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6eceebb82f1b"
down_revision = "b6fa8a91dd31"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "machine_types",
        sa.Column(
            "cost_per_hour",
            sa.DECIMAL(precision=10, scale=5),
            server_default="0",
            nullable=False,
        ),
    )
    op.alter_column(
        "machine_usages",
        "cost",
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        type_=sa.DECIMAL(precision=10, scale=5),
        existing_nullable=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "machine_usages",
        "cost",
        existing_type=sa.DECIMAL(precision=10, scale=5),
        type_=sa.DOUBLE_PRECISION(precision=53),
        existing_nullable=False,
    )
    op.drop_column("machine_types", "cost_per_hour")
    # ### end Alembic commands ###
