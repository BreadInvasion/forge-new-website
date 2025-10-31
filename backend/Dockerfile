FROM python:3.12.0-slim-bullseye

ENV PYTHONUNBUFFERED 1
WORKDIR /build

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of app
COPY api api
COPY core core
COPY models models
COPY schemas schemas
COPY alembic alembic
COPY alembic.ini .
COPY .env .
COPY main.py .
COPY init.sh .
COPY initial_data.py .
COPY wait_for_db.py .


# Create new user to run app process as unprivileged user
RUN addgroup --gid 1001 --system uvicorn && \
    adduser --gid 1001 --shell /bin/false --disabled-password --uid 1001 uvicorn

RUN chown -R uvicorn:uvicorn /build
CMD ./init.sh
EXPOSE 8000