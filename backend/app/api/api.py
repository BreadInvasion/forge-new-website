from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    finance,
    machines,
    materialgroups,
    materials,
    organizations,
    roles,
    semesters,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(finance.router, tags=["finance"])
api_router.include_router(machines.router, tags=["machines"])
api_router.include_router(materialgroups.router, tags=["materialgroups"])
api_router.include_router(materials.router, tags=["materials"])
api_router.include_router(organizations.router, tags=["organizations"])
api_router.include_router(roles.router, tags=["roles"])
api_router.include_router(semesters.router, tags=["semesters"])
api_router.include_router(users.router, tags=["users"])
