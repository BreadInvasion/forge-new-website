from fastapi import APIRouter

from .routes import (
    auth,
    machine_groups,
    machine_types,
    machines,
    resource_slots,
    resources,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(machine_groups.router, tags=["machine_groups"])
api_router.include_router(machine_types.router, tags=["machine_types"])
api_router.include_router(machines.router, tags=["machines"])
api_router.include_router(resource_slots.router, tags=["resource_slots"])
api_router.include_router(resources.router, tags=["resources"])
api_router.include_router(users.router, tags=["users"])
