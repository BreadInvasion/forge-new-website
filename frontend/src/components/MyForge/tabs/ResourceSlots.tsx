import React, { ReactNode } from 'react';
import Table, { DeleteItem, TableHead, ITEMS_PER_PAGE } from '../components/Table';
import { OmniAPI } from "src/apis/OmniAPI";
import { Resource, ResourceSlot } from 'src/interfaces';

import '../styles/TabStyles.scss';


import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';


interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    resourceSlot: ResourceSlot | null;
    setResourceSlot: (resourceSlot: ResourceSlot | null) => void;
    refresh: () => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, rslot: ResourceSlot | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, resourceSlot, setResourceSlot, refresh} = props;
    
    const [name, setName] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    React.useEffect(() => {
            OmniAPI.getAll("resources")
                .then((data) => {
                    if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                        setResources(data);
                    } else {
                        throw new Error('Data is not of type Resource');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching resources:', error);
                });
        }, []);
    const [resourceIDS, setResourceIDS] = useState<string[]>([]);
    const [useown, setUseown] = useState(false);
    const [canempty, setCanempty] = useState(false);
    const handleCheckboxChange = (value: string) => {
        setResourceIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

    function setOpenExtra (state: boolean, rslot: ResourceSlot | null) {
        setResourceSlot(rslot);
        if (rslot != null) {
            setName(rslot.display_name);
            OmniAPI.get("resourceslots", rslot.id).then((r: ResourceSlot) => {
                setResourceIDS(r.valid_resource_ids);
                setCanempty(r.allow_empty);
                setUseown(r.allow_own_material);
                setIsDialogOpen(state);
            });
        } else {
            setName("");
            setResourceIDS([]);
            setCanempty(false);
            setUseown(false);
            setIsDialogOpen(state);
        }
    }

    function create() {
        if (!name || !resourceIDS) {
            alert("All fields must be populated!");
            return;
        }

        OmniAPI.create("resourceslots", {
            db_name: name,
            display_name: name,
            allow_empty: canempty,
            allow_own_material: useown,
            resource_ids: resources
                .filter(r => resourceIDS.includes(r.id))
                .map(r => r.id)
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    }

    function edit() {
        if (!resourceSlot) return;
        if (!name || !resourceIDS) {
            alert("All fields must be populated!");
            return;
        }

        OmniAPI.edit("resourceslots", resourceSlot.id, {
            db_name: name,
            display_name: name,
            resource_ids: resourceIDS,
            allow_empty: canempty,
            allow_own_material: useown
        }).then(() => {
            refresh();
            setOpenExtra(false, null);
        });
    }
    
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, resourceSlot); }}>
            <button className="addbtn" onClick={() => { setOpenExtra(true, null); }}><PlusIcon /></button>
            <Dialog.Portal>
                <div className='AEdiv'>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">{resourceSlot == null ? "Adding" : "Editing"} Resource Slot</Dialog.Title>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name"><div>Name</div></label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)}/>

                            <label className="Label" htmlFor="resources">Resources</label>
                            {resources.map((resource: Resource) => (
                                <div className="checkbox-labels" key={resource.id}>
                                    <input
                                        className='styled-checkbox'
                                        type="checkbox"
                                        checked={resourceIDS ? resourceIDS.includes(resource.id) : false}
                                        onChange={() => handleCheckboxChange(resource.id)}
                                    />
                                    <label className='checkbox-label'>
                                        {resource.name}
                                    </label>
                                </div>
                            ))}

                            <label className="Label" htmlFor="useown"><div>Allow using own material?</div></label>
                            <input
                                className="styled-checkbox"
                                id="useown"
                                type="checkbox"
                                checked={useown}
                                onChange={e => setUseown(e.target.checked)}
                            />

                            <label className="Label" htmlFor="canempty"><div>Allow empty?</div></label>
                            <input
                                className="styled-checkbox"
                                id="canempty"
                                type="checkbox"
                                checked={canempty}
                                onChange={e => setCanempty(e.target.checked)}
                            />
                        </fieldset>
                        
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={resourceSlot == null ? create : edit}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    ), setOpenExtra];
}

const ResourceSlots: React.FC = () => {

    const [data, setData] = React.useState<ResourceSlot[]>([]);
    const columns: (keyof ResourceSlot)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof ResourceSlot)[]).filter((key) => !key.includes('db_name') && !(key == 'name') && !key.includes('id') && !key.includes('valid_resource_ids')) : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll("resourceslots", { limit: ITEMS_PER_PAGE, offset }).then( (data) => {
            setData(data);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number) => {
        DeleteItem("resourceslots", data[index_local], refreshPage);
    };
    
    let [resourceSlot, setResourceSlot]:[ResourceSlot | null, (resourceSlot: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, resourceSlot, setResourceSlot, refresh: refreshPage});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Resource Slots"
                type='resourceslots'
                aemenu={ae}
            />
            <Table<ResourceSlot>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => setOpen(true, e)}
                canEdit
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="resourceslots"
            />
        </div>
    );
};

export default ResourceSlots;