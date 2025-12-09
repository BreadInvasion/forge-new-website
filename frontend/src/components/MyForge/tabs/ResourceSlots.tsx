import React, { ReactNode } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { OmniAPI } from "src/apis/OmniAPI";
import { Resource, ResourceSlot } from 'src/interfaces';

import '../styles/TabStyles.scss';


import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import { Dialog } from 'radix-ui';
import { useState } from 'react';


interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    resourceSlot: ResourceSlot | null;
    setResourceSlot: (resourceSlot: ResourceSlot | null) => void;
    dataSetter: (data: ResourceSlot[]) => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, rslot: ResourceSlot | null) => void] => {
    let { isDialogOpen, setIsDialogOpen, resourceSlot, setResourceSlot, dataSetter} = props;
    
    const [name, setName] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    React.useEffect(() => {
            fetch('http://localhost:3000/api/resources?limit=100', { // TODO: Switch this to OmniAPI
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    // console.log('Resources:', data);
                    if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                        // console.log('Resources:', data);
                        setResources(data);
                    } else {
                        throw new Error('Data is not of type Resource');
                    }
                })
                .catch(error => {
                    console.error('Error fetching resources:', error);
                });
        }, []);
    const [resourceIDS, setResourceIDS] = useState<string[]>([]);
    const [useown, setUseown] = useState(false);
    const [canempty, setCanempty] = useState(false);
    const handleCheckboxChange = (value: string) => {
        // console.log("new: " + );
        setResourceIDS(prev =>
            prev.includes(value)
            ? prev.filter(item => item !== value) // remove
            : [...prev, value] // add
        );
    };

//     function req(){
//         fetch(`http://localhost:3000/api/resourceslots/new`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//             },
//             body: `{
//   "db_name": "${recname}",
//   "display_name": "${recname}",
//   "resource_ids": [${resources.filter(r => resourceIDS.includes(r.id)).map(r => '"' + r.id + '"')}],
//   "allow_own_material": ${useown},
//   "allow_empty": ${canempty}}`
//         })
//         .then(res => {
//                 if (res.status !== 200) {
//                     res.text().then((json) => {
//                     alert(JSON.parse(json)['detail']);
//                 });
//                 }
//                 if (!res.ok) {
//                     throw new Error(`HTTP error! status: ${res.status}`);
//                 }
//                 return res.json();
//             })
//             .then(data => {
//                 document.location.reload(); // make this reload only table later
//                 // console.log(`${type} deleted:`, data);
//                 // const newData = [...data];
//                 // newData.splice(index, 1);
//                 // setData(newData);
//             })
//             .catch(error => {
//                 console.error(`Error adding resourceslot:`, error);
//             });
//     }

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
        if (name == "" || resourceIDS == null) {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.create("resourceslots", {db_name: name, display_name: name, allow_empty: canempty, allow_own_material: useown, resource_ids: resources.filter(r => resourceIDS.includes(r.id)).map(m => m.id)} ).then( () => {
            let mappings: {[key: string]: string} = {};
            OmniAPI.getAll("resources").then(m => {
                m.map((m2: Resource) => mappings[m2.id] = m2.name);
            }).then(() => {
            OmniAPI.getAll("resourceslots").then(d => {
                    if (Array.isArray(d) && d.every(item => 'id' in item && 'valid_resource_ids' in item)) {
                        let newData: ResourceSlot[] = [];
                        for (const item of d) {
                            newData.push({
                                id: item.id,
                                name: item.name,
                                display_name: item.display_name,
                                db_name: item.db_name,
                                valid_resource_ids : item.valid_resource_ids.map((m:string) => mappings[m]),
                                allow_own_material: item.allow_own_material,
                                allow_empty: item.allow_empty,
                            });
                        }
                        dataSetter(newData);
                    } else {
                        throw new Error('Data is not of type ResourceSlot');
                    }
                })
                .catch(error => {
                    console.error('Error fetching resource slots:', error);
                });
            });
            setOpenExtra(false, null);
        });
        return;
    }

    function edit() {
        if (resourceSlot == null) return;
        if (name == "" || resourceIDS == null) {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.edit("resourceslots", resourceSlot? resourceSlot.id : "", {db_name: name, display_name: name, resource_ids: resourceIDS, allow_empty: canempty, allow_own_material: useown}).then( () => {
            let mappings: {[key: string]: string} = {};
            OmniAPI.getAll("resources").then(m => {
                m.map((m2: Resource) => mappings[m2.id] = m2.name);
            }).then(() => {
            OmniAPI.getAll("resourceslots").then(d => {
                    if (Array.isArray(d) && d.every(item => 'id' in item && 'db_name' in item && 'valid_resource_ids' in item)) {
                        let newData: ResourceSlot[] = [];
                        for (const item of d) {
                            newData.push({
                                id: item.id,
                                name: item.name,
                                db_name: item.db_name,
                                display_name: item.display_name,
                                valid_resource_ids: item.valid_resource_ids.map((m:string) => mappings[m]),
                                allow_own_material: item.allow_own_material,
                                allow_empty: item.allow_empty,
                            });
                        }
                        dataSetter(newData);
                    } else {
                        throw new Error('Data is not of type ResourceSlot');
                    }
                })
                .catch(error => {
                    console.error('Error fetching resource slots:', error);
                });
            });
            setOpenExtra(false, null);
        });
        return;
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
                                <div className="checkbox-labels">
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
                            <input className="styled-checkbox" id="useown" type='checkbox' checked={useown} onChange={e => setUseown(Boolean(e.target.value))}/>

                            <label className="Label" htmlFor="canempty"><div>Allow empty?</div></label>
                            <input className="styled-checkbox" id="canempty" type='checkbox' checked={canempty} onChange={e => setCanempty(Boolean(e.target.value))}/>
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

    React.useEffect(() => {
        fetch('http://localhost:3000/api/resourceslots?limit=100', { // TODO: change this to use onmiapi
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                data.map((x:ResourceSlot) => x.name = x.display_name);
                console.log('Resource Slots:', data);
                if (Array.isArray(data) && data.every(item => 'id' in item && 'valid_resource_ids' in item)) {
                    console.log('Resource Slots:', data);
                    setData(data);
                } else {
                    throw new Error('Data is not of type ResourceSlot');
                }
            })
            .catch(error => {
                console.error('Error fetching resource slots:', error);
            });
    }, []);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("resourceslots", data[index_real], index_local, data, setData);
    };

    
    let [resourceSlot, setResourceSlot]:[ResourceSlot | null, (resourceSlot: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, resourceSlot, setResourceSlot, dataSetter: setData});

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
            />
        </div>
    );
};

export default ResourceSlots;