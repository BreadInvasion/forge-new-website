FROM python:3.12.0-slim-bullseye

ENV PYTHONUNBUFFERED 1
WORKDIR /build

# Create venv, add it to path and install requirements
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"

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


# Create new user to run app process as unprivileged user
RUN addgroup --gid 1001 --system uvicorn && \
    adduser --gid 1001 --shell /bin/false --disabled-password --uid 1001 uvicorn

RUN chown -R uvicorn:uvicorn /build
CMD ["fastapi", "run", "main.py", "--port", "8000", "--reload"]
EXPOSE 8000