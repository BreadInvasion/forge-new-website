"""Add auth tokens for email verification and password reset

Revision ID: 6f4a8b2c1d9e
Revises: 8d1c2a4b7f6e
Create Date: 2026-08-23 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


revision = "6f4a8b2c1d9e"
down_revision = "8d1c2a4b7f6e"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "auth_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False, unique=True),
        sa.Column(
            "token_type",
            sa.Enum("EMAIL_VERIFICATION", "PASSWORD_RESET", name="tokentype"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_used_by"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("auth_tokens")
    sa.Enum(name="tokentype").drop(op.get_bind(), checkfirst=True)