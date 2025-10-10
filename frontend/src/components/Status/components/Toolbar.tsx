import { Pencil1Icon, ExclamationTriangleIcon, Cross2Icon, EraserIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Filter from "./Filter";
import { ToolButton, FilterItem, FilterX } from "./FilterComponents";
import { Toggle } from "@radix-ui/react-toggle";
import { UserPermission } from "../../../enums";
import { OmniAPI } from "src/apis/OmniAPI";
import useAuth from "../../Auth/useAuth";

const ToolbarContainer = styled.div`
    grid-area: tools;
    display: flex;
    padding: 0.5rem;
    padding-bottom: 1rem;
    gap: 10px;
    @media screen and (max-width: 850px) {
        /* fixed toolbar height on mobile to avoid being pushed offscreen */
        height: 4rem;
        flex: 0 0 4rem;
        align-items: center;
        padding-bottom: 0.5rem;
    }
`;

interface ToolbarProps {
    highlightFailed?: boolean;
    setHighlightFailed: (value : boolean) => void;
    activeFilters: string[];
    setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}
const ActiveFilters = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    overflow-x: scroll;
    padding-bottom: 5px;
    font-size: 1rem;
    font-family: Montserrat;
    font-weight: 600;

    &::-webkit-scrollbar {
        height: 0px;
        background: transparent;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }

    &::-webkit-scrollbar-thumb {
        background: #999; 
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

`;

const Toolbar: React.FC<ToolbarProps> = ({highlightFailed, setHighlightFailed, activeFilters, setActiveFilters}) => {

    const { user } = useAuth();
    const hasPermission = (permission: UserPermission) => 
        user?.permissions?.includes(permission) || user?.permissions?.includes(UserPermission.IS_SUPERUSER);
   
    const navigate = useNavigate();

    const handleEditClick = () => {
        // Navigate to the "Edit Machine" form
        navigate("/myforge/usages");
    };

    const handleFailClick = () => {
        // Navigate to the "Fail Machine" form
        navigate("/myforge/fail");
    };  

    const [groups, setGroups] = React.useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const container = document.getElementById('active-filters') as HTMLElement; // .MAIN is a class since I think It could be more useful
    
        container?.addEventListener('wheel', function(e: WheelEvent) {
            e.preventDefault();

            container.scrollBy({
                top: 0,
                left: e.deltaY,
                behavior: 'smooth'
            });
        });

        return () => {
            container?.removeEventListener('wheel', () => {});
        }
    }, []);

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [machinestatus] = await Promise.all([
                    OmniAPI.getPublic('machinestatus'),
                ]);

                if (machinestatus.groups) {
                    const groupNames = machinestatus.groups.map((g: { machines: { group_id: any; }[]; name: any; }) => ({ id: g.machines[0].group_id, name: g.name }))
                    setGroups(groupNames);
                }
            } catch (err) {console.error('Error fetching filter data:', err);}
        };

        fetchFilterData();

        return () => {};
    }, []);

    const filters: { name: string; value: string[] }[] = [
        {
            name: "Machine Group",
            value: groups.map(g => g.name) || []
        },
        {
            name: "Status",
            value: ["In Progress", "Completed", "Available", "Failed", "Maintenance"]
        }
    ];
    
    const handleFilterClick = (value: string) => {
        if(!activeFilters.includes(value)) {
            setActiveFilters((prevFilters) => [...prevFilters, value]);
        }
    };

    const handleDeleteFilter = (e: any, value: string) => {
        e.stopPropagation();
        setActiveFilters((prevFilters) =>prevFilters.filter((filter) => filter !== value));
    };

    return (
        <ToolbarContainer>
            {hasPermission(UserPermission.CAN_EDIT_MACHINES) && (
            <ToolButton aria-label="Edit" onClick={handleEditClick}>
                <Pencil1Icon />
            </ToolButton>
            )}
            {hasPermission(UserPermission.CAN_FAIL_MACHINES) && (
            <ToolButton aria-label="Fail" onClick={handleFailClick}>
               <ExclamationTriangleIcon />
            </ToolButton>
            )}
             {hasPermission(UserPermission.CAN_CLEAR_MACHINES) && (
            <ToolButton aria-label="Clear"> 
                <Toggle
                    pressed={highlightFailed}
                    onPressedChange={setHighlightFailed}
                    asChild
                >
                <div>
                    <EraserIcon />
                </div>
                </Toggle>    
            </ToolButton>
            )}
            <Filter 
                filters={filters} 
                activeFilters={activeFilters} 
                handleDeleteFilter={handleDeleteFilter}
                handleFilterClick={handleFilterClick}
            />
            {activeFilters.length !== 0 && 
                <ActiveFilters id='active-filters'>
                    Filters:  
                    {activeFilters.map((filter, index) => (
                        <FilterItem key={index} data-state="active">
                            <FilterX onClick={(e) => handleDeleteFilter(e, filter)}>
                                <Cross2Icon />
                            </FilterX>
                            {filter}
                        </FilterItem>
                    ))}
                </ActiveFilters>
            }
        </ToolbarContainer>
    );
}

export default Toolbar;