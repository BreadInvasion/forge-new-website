# Forge Website

This repository contains the code for the website of The Forge, Rensselaer Polytechnic Institute's student-run makerspace. This is a complete rebuild from the club's original website (originally using Django statically-served pages without DRF), adhering to modern standards of development wherever possible.

## Installation for Development

1. Download Docker for Desktop if you don't already have it installed. (You can use a different compatible container engine if you'd like)
2. Make a copy of the .env.example file renamed to .env in the same folder, because .env is gitignored (This is done so no actual .env files are ever accidentally placed in the github)
3. in the root project folder, run the command `docker-compose build && docker-compose up -d` (You only need `docker-compose up -d` unless you're changing the Dockerfiles or docker-compose file, or they were changed in the code you pull from the repo)
4. Profit! You can access the frontend at localhost:3000, and any changes to the code while the docker containers are running should automatically update and reload the frontend or backend depending on what was changed.


Join the [Forge Discord](https://discord.gg/bwQCwRSPUa) if you have any questions.