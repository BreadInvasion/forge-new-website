"""added user login audit log type

Revision ID: 2e29f9a333d1
Revises: c24b16432b5e
Create Date: 2026-09-27 22:31:41.747087

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2e29f9a333d1"
down_revision = "c24b16432b5e"
branch_labels = None
depends_on = None

old_options = (
                "MACHINE_USED",
                "MACHINE_CREATED",
                "MACHINE_EDITED",
                "MACHINE_DELETED",
                "MACHINE_TYPE_CREATED",
                "MACHINE_TYPE_EDITED",
                "MACHINE_TYPE_DELETED",
                "MACHINE_GROUP_CREATED",
                "MACHINE_GROUP_EDITED",
                "MACHINE_GROUP_DELETED",
                "MACHINE_USAGE_CREATED",
                "MACHINE_USAGE_EDITED",
                "MACHINE_USAGE_DELETED",
                "MACHINE_USAGE_CLEARED",
                "MACHINE_USAGE_FAILED",
                "RESOURCE_CREATED",
                "RESOURCE_EDITED",
                "RESOURCE_DELETED",
                "RESOURCE_SLOT_CREATED",
                "RESOURCE_SLOT_EDITED",
                "RESOURCE_SLOT_DELETED",
                "RESOURCE_USAGE_QUANTITY_CREATED",
                "RESOURCE_USAGE_QUANTITY_EDITED",
                "RESOURCE_USAGE_QUANTITY_DELETED",
                "ROLE_CREATED",
                "ROLE_EDITED",
                "ROLE_DELETED",
                "SEMESTER_CREATED",
                "SEMESTER_EDITED",
                "SEMESTER_DELETED",
                "USER_CREATED",
                "USER_EDITED",
                "USER_DELETED",
                "ORG_CREATED",
                "ORG_EDITED",
                "ORG_DELETED",)

new_options = ("MACHINE_USED",
                "MACHINE_CREATED",
                "MACHINE_EDITED",
                "MACHINE_DELETED",
                "MACHINE_TYPE_CREATED",
                "MACHINE_TYPE_EDITED",
                "MACHINE_TYPE_DELETED",
                "MACHINE_GROUP_CREATED",
                "MACHINE_GROUP_EDITED",
                "MACHINE_GROUP_DELETED",
                "MACHINE_USAGE_CREATED",
                "MACHINE_USAGE_EDITED",
                "MACHINE_USAGE_DELETED",
                "MACHINE_USAGE_CLEARED",
                "MACHINE_USAGE_FAILED",
                "RESOURCE_CREATED",
                "RESOURCE_EDITED",
                "RESOURCE_DELETED",
                "RESOURCE_SLOT_CREATED",
                "RESOURCE_SLOT_EDITED",
                "RESOURCE_SLOT_DELETED",
                "RESOURCE_USAGE_QUANTITY_CREATED",
                "RESOURCE_USAGE_QUANTITY_EDITED",
                "RESOURCE_USAGE_QUANTITY_DELETED",
                "ROLE_CREATED",
                "ROLE_EDITED",
                "ROLE_DELETED",
                "SEMESTER_CREATED",
                "SEMESTER_EDITED",
                "SEMESTER_DELETED",
                "USER_CREATED",
                "USER_EDITED",
                "USER_DELETED",
                "USER_LOGIN", # new audit log type
                "ORG_CREATED",
                "ORG_EDITED",
                "ORG_DELETED",)
 
old_logtype = sa.Enum(*old_options, name="logtype")
new_logtype = sa.Enum(*new_options, name="logtype")
temp_logtype = sa.Enum(*new_options, name="temp_logtype") # placeholder type to avoid name collision


def upgrade():
    temp_logtype.create(op.get_bind(), checkfirst=False)
    # converts to temp logtype
    op.execute('ALTER TABLE audit_logs ALTER COLUMN type TYPE temp_logtype USING type::text::temp_logtype')
    old_logtype.drop(op.get_bind(), checkfirst=False)
    new_logtype.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE audit_logs ALTER COLUMN type TYPE logtype USING type::text::logtype')
    temp_logtype.drop(op.get_bind(), checkfirst=False)


def downgrade():
    #delete all USER_LOGIN audit logs
    op.execute('DELETE FROM audit_logs WHERE type::text=\'USER_LOGIN\'')
    temp_logtype.create(op.get_bind(), checkfirst=False)
    # converts to temp logtype
    op.execute('ALTER TABLE audit_logs ALTER COLUMN type TYPE temp_logtype USING type::text::temp_logtype')
    new_logtype.drop(op.get_bind(), checkfirst=False)
    old_logtype.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE audit_logs ALTER COLUMN type TYPE logtype USING type::text::logtype')
    temp_logtype.drop(op.get_bind(), checkfirst=False)
