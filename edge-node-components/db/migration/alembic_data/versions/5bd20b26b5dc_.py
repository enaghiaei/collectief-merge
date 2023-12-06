"""empty message

Revision ID: 5bd20b26b5dc
Revises: 
Create Date: 2023-09-12 16:14:48.126734

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision = '5bd20b26b5dc'
down_revision = None
branch_labels = None
depends_on = None
removing_table = 'ig_uuid_identification'

def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    table_names = Inspector.from_engine(op.get_bind()).get_table_names()
    if removing_table in table_names:
        op.drop_table(removing_table)

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    table_names = Inspector.from_engine(op.get_bind()).get_table_names()
    if removing_table not in table_names:
        op.create_table(removing_table,
        sa.Column('uuid', mysql.VARCHAR(length=36), nullable=False),
        sa.Column('parent', mysql.VARCHAR(length=36), nullable=True),
        sa.Column('reference', mysql.VARCHAR(length=64), nullable=True),
        sa.PrimaryKeyConstraint('uuid'),
        mariadb_collate='utf8mb4_general_ci',
        mariadb_default_charset='utf8mb4',
        mariadb_engine='InnoDB'
        )
    # ### end Alembic commands ###
