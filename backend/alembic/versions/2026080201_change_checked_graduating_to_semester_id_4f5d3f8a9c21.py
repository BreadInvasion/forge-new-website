"""Change checked_graduating to semester id

Revision ID: 4f5d3f8a9c21
Revises: 8d1c2a4b7f6e
Create Date: 2026-08-02 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4f5d3f8a9c21"
down_revision = "8d1c2a4b7f6e"
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    current_semester_id = connection.execute(
        sa.text("SELECT active_semester_id FROM state LIMIT 1")
    ).scalar_one_or_none()

    op.add_column(
        "users",
        sa.Column("checked_graduating_semester_id", sa.UUID(), nullable=True),
    )

    if current_semester_id is not None:
        connection.execute(
            sa.text(
                "UPDATE users SET checked_graduating_semester_id = :semester_id "
                "WHERE checked_graduating = true"
            ),
            {"semester_id": current_semester_id},
        )

    op.drop_column("users", "checked_graduating")
    op.alter_column(
        "users",
        "checked_graduating_semester_id",
        new_column_name="checked_graduating",
    )
    op.create_foreign_key(
        "fk_users_checked_graduating_semester",
        "users",
        "semesters",
        ["checked_graduating"],
        ["id"],
    )


def downgrade():
    connection = op.get_bind()

    op.add_column(
        "users",
        sa.Column("checked_graduating_bool", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    connection.execute(
        sa.text(
            "UPDATE users SET checked_graduating_bool = true "
            "WHERE checked_graduating IS NOT NULL"
        )
    )

    op.drop_constraint("fk_users_checked_graduating_semester", "users", type_="foreignkey")
    op.drop_column("users", "checked_graduating")
    op.alter_column(
        "users",
        "checked_graduating_bool",
        new_column_name="checked_graduating",
    )
