import { Pencil1Icon, ExclamationTriangleIcon, Cross2Icon, EraserIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Filter from "./Filter";
import { ToolButton, FilterItem, FilterX } from "./FilterComponents";
import { Toggle } from "@radix-ui/react-toggle";

const ToolbarContainer = styled.div`
    grid-area: tools;
    display: flex;
    padding-bottom: 10px;
    gap: 10px;
`;

interface ToolbarProps {
    highlightFailed?: boolean;
    setHighlightFailed?: (value : boolean) => void;
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

const Toolbar: React.FC<ToolbarProps> = ({highlightFailed, setHighlightFailed}) => {

    const filters = [
        {
            name: "Machine Type",
            value: ["Mk3", "Mk4", "Mini", "XL", "Formlabs", "Markforged", "Other"]
        },
        {
            name: "Status",
            value: ["In Progress", "Completed", "Available", "Failed"]
        }
    ]
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    const handleFilterClick = (value: string) => {
        if(!activeFilters.includes(value)) {
            setActiveFilters((prevFilters) => [...prevFilters, value]);
        }
    };

    const handleDeleteFilter = (e: any, value: string) => {
        e.stopPropagation();
        setActiveFilters((prevFilters) =>
            prevFilters.filter((filter) => filter !== value)
        );
    };

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

    return (
        <ToolbarContainer>
            <ToolButton aria-label="Edit">
                <Pencil1Icon />
            </ToolButton>
            <ToolButton aria-label="Report">
                <ExclamationTriangleIcon />
            </ToolButton>
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