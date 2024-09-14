#!/bin/sh

# Wait for db to come online
python wait_for_db.py

# Make sure db is up to date
alembic upgrade head

# Add first user if there isn't one
python initial_data.py

# Start the server
fastapi run main.py --port 8000 --reload