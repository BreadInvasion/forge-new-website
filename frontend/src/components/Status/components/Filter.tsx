import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import {
    ToolButton,
    PopoverContent,
    FilterSection,
    FilterSectionTitle,
    FilterSectionSeparator,
    FilterGroup,
    FilterItem,
    FilterX,
    PopoverClose,
} from "./FilterComponents";



interface FilterProps {
    filters: {name: string, value: string[]}[];
    activeFilters: string[];
    handleDeleteFilter: (e: React.MouseEvent, value: string) => void;
    handleFilterClick: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({
    filters, 
    activeFilters, 
    handleDeleteFilter,
    handleFilterClick
}) => {

    
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <ToolButton aria-label="Customise options">
                    <MixerHorizontalIcon />
                </ToolButton>
            </Popover.Trigger>
            <Popover.Portal>
                <PopoverContent>
                    {filters.map((filter, index) => (
                        <FilterSection key={index}>
                            <FilterSectionTitle>{filter.name}</FilterSectionTitle>
                            <FilterSectionSeparator orientation="horizontal" />
                            <FilterGroup>
                                {filter.value.map((value, index) => {
                                    const isActive = activeFilters.includes(value);

                                    return (
                                        <FilterItem
                                            key={index}
                                            onClick={() => handleFilterClick(value)}
                                            data-state={isActive ? "active" : undefined}
                                        >
                                            {isActive && (
                                                <FilterX onClick={(e) => handleDeleteFilter(e, value)}>
                                                    <Cross2Icon />
                                                </FilterX>
                                            )}
                                            {value}
                                        </FilterItem>
                                    );
                                })}
                            </FilterGroup>
                        </FilterSection>
                    ))}
                    <PopoverClose asChild>
                        <Cross2Icon />
                    </PopoverClose>
                    <Popover.Arrow />
                </PopoverContent>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default Filter;