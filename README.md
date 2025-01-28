# RPI Forge Website (New)

This repository contains the code for the website of The Forge, Rensselaer Polytechnic Institute's student-run makerspace. This is a complete rebuild from the club's original website (originally using Django statically-served pages without DRF), adhering to modern standards of development wherever possible.

## Installation for Development

1. Download Docker for Desktop if you don't already have it installed. (You can use a different compatible container engine if you'd like)
2. Make a copy of the .env.example file renamed to .env in the same folder, because .env is gitignored (This is done so no actual .env files are ever accidentally placed in the github)
3. in the root project folder, run the command `docker-compose build && docker-compose up -d`. This will first build the docker image for each service (frontend, backend, db), then run them in your machine's docker engine.
4. Profit! You can access the frontend at localhost:3000, and any changes to the code while the docker containers are running should automatically update and reload the frontend or backend depending on what was changed.

## The Stack

### Backend
#### API Framework: FastAPI [(docs)](https://fastapi.tiangolo.com/)
FastAPI is a modern API framework for Python 3 with a focus on being intuitive while maximizing both high performance and the availability of modern features. There are higher-performance options available which might be stronger choices for industry or real-time applications, such as the [Phoenix](https://www.phoenixframework.org/) framework for Elixir or the [Gin](https://gin-gonic.com/docs/) framework for Golang - however, given that the Forge website does not require high throughput or even particularly high response time from the website, FastAPI was chosen for its accessibility and built-in features. Python is taught in multiple basic programming courses at RPI, so it makes sense to choose a framework that uses it to improve future maintainability.

#### ORM (Object-Relational Mapping): SQLAlchemy [(docs)](https://docs.sqlalchemy.org/en/20/)
SQLAlchemy is, frankly, the only robust solution currently available for modeling database data in Python. While FastAPI's developer has a package derived from SQLAlchemy, [SQLModel](https://sqlmodel.tiangolo.com/), at time of writing it possesses notable defects which led to it not being chosen for this project. Maintainers of this project should monitor project status of SQLModel, as it does mesh well with the FastAPI structure and would further improve the cleanliness of this codebase.

#### Database Migration: Alembic [(docs)](https://alembic.sqlalchemy.org/en/latest/)
Alembic is a tool which allows developers to iterate upon the database structure without being forced to either completely wipe an existing database or manually convert rows of data to a new format. This tool holds limited value in dev environments, but will prove essential when continuing development after the initial launch of the new website.

### Frontend
#### UI Framework: React [(docs)](https://react.dev/)
React is the UI framework that, at least at time of writing, truly needs no introduction. It is twice as popular as the next most used framework ([Angular](https://angular.dev/)), and is well-regarded for its focus on reactivity. This project hopes to serve as a reflection of industry standards for young engineers at RPI.

#### UI Component Library: Radix Primitives [(docs)](https://www.radix-ui.com/primitives)
Radix Primitives is simply a collection of basic, unstyled components which covers much of the basic functionality required for a website. It is very popular because it keeps developers from having to re-invent the wheel, promotes interoperability between components, and makes it easier to fulfill modern accessibility standards.

#### Routing: React Router [(docs)](https://reactrouter.com)
Routing frameworks are used to imitate the multi-page functionality of traditional websites inside the Single Page Application (SPA) structure. Whether you're using React Router, [Tanstack Router](https://tanstack.com/router/latest), [wouter](https://www.npmjs.com/package/wouter), or one of the many other options available for React, the basics are largely the same: You use a routing package to associate a certain URL path with a specific set of components to be rendered. By being creative with the nesting and branching structures of the router components, there are countless possibilities for site structure.

#### HTTP Requests: Axios [(docs)](https://axios-http.com/docs/intro)
While it is *technically* possible to perform HTTP requests in raw javascript using the `fetch()` function, libraries like Axios provide useful features and make request code more legible. Axios is just one of many, but it fulfills this project's needs.

#### Shared State: Recoil [(docs)](https://recoiljs.org/)
React has great built-in functionality for storing component state and passing it between components, but because data must be passed directly from parent to child or child to parent, this process can quickly become cumbersome, especially when a piece of data is read or modified by multiple "leaves" of the component tree. Packages like Recoil address this by implementing a "shared" state for the app - a central location from which components can pull data, or push updates to, as needed. If you are new to this concept, I (@breadinvasion) recommend you take some time to learn about [Redux](https://redux.js.org/), as it is one of the classic examples of global state management in frontend (though I would personally avoid using it like the plague 😝). Recoil is a React-specific global state management solution, which attempts to improve code structure and consistency by mirroring the flow of React's `useState()` hook in its own `atom()` hook which serves as the primary method of interacting with the global state.

#### Miscellaneous Packages
[**React Minimal Pie Chart:**](https://www.npmjs.com/package/react-minimal-pie-chart) Used on the MyForge Summary page as a cleaner way to display usage breakdown.

### Database: PostgreSQL [(docs)](https://www.postgresql.org/docs/current/)
Not much to say here - Postgres is an open-source relational database which is well-regarded across the software engineering field. There are many perfectly valid databases, but this one is ours.
