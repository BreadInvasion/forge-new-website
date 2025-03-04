"""Added Resource Colors

Revision ID: b6fa8a91dd31
Revises: 29da92db7ac9
Create Date: 2025-01-12 02:46:00.076016

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b6fa8a91dd31"
down_revision = "29da92db7ac9"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("resources", sa.Column("color", sa.String(), nullable=True))
    op.drop_constraint("uq_resources", "resources", type_="unique")
    op.create_unique_constraint(None, "resources", ["brand", "color", "name", "units"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "resources", type_="unique")
    op.create_unique_constraint("uq_resources", "resources", ["brand", "name", "units"])
    op.drop_column("resources", "color")
    # ### end Alembic commands ###
