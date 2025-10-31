FROM python:3.12.0-slim-bullseye

ENV PYTHONUNBUFFERED 1
WORKDIR /botdir

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of app
COPY .env .
COPY bot.py .

# Create new user to run app process as unprivileged user
RUN addgroup --gid 1001 --system bot && \
    adduser --gid 1001 --shell /bin/false --disabled-password --uid 1001 bot

RUN chown -R bot:bot /botdir
CMD ["python3", "bot.py"]