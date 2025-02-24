from fastapi import APIRouter

from api.routes import volunteer_actions

from .routes import (
    auth,
    machine_groups,
    machine_types,
    machine_usages,
    machines,
    officer_actions,
    public,
    resource_slots,
    resources,
    semesters,
    users,
    use_a_machine,
)

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(machine_groups.router, tags=["machine_groups"])
api_router.include_router(machine_types.router, tags=["machine_types"])
api_router.include_router(machine_usages.router, tags=["machine_usages"])
api_router.include_router(machines.router, tags=["machines"])
api_router.include_router(officer_actions.router, tags=["officer_actions"])
api_router.include_router(public.router, tags=["public"])
api_router.include_router(resource_slots.router, tags=["resource_slots"])
api_router.include_router(resources.router, tags=["resources"])
api_router.include_router(semesters.router, tags=["semesters"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(use_a_machine.router, tags=["use_a_machine"])
api_router.include_router(volunteer_actions.router, tags=["volunteer_actions"])