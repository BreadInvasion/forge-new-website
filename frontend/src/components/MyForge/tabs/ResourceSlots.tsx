import React from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { OmniAPI } from "src/apis/OmniAPI";
import { Resource, ResourceSlot } from 'src/interfaces';

import '../styles/TabStyles.scss';


import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import { Dialog } from 'radix-ui';
import { useState } from 'react';

const aemenu = (updateExisting:boolean) => {
    const [recname, setRecname] = useState("");
    const [resources, setResources] = useState<Resource[]>([]);
    React.useEffect(() => {
            fetch('http://localhost:3000/api/resources?limit=100', {
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
                    console.log('Resources:', data);
                    if (Array.isArray(data) && data.every(item => 'id' in item && 'name' in item)) {
                        console.log('Resources:', data);
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

    function req(){
        fetch(`http://localhost:3000/api/resourceslots/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: `{
  "db_name": "${recname}",
  "display_name": "${recname}",
  "resource_ids": [${resources.filter(r => resourceIDS.includes(r.id)).map(r => '"' + r.id + '"')}],
  "allow_own_material": ${useown},
  "allow_empty": ${canempty}}`
        })
        .then(res => {
                if (res.status !== 200) {
                    res.text().then((json) => {
                    alert(JSON.parse(json)['detail']);
                });
                }
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                document.location.reload(); // make this reload only table later
                // console.log(`${type} deleted:`, data);
                // const newData = [...data];
                // newData.splice(index, 1);
                // setData(newData);
            })
            .catch(error => {
                console.error(`Error adding resourceslot:`, error);
            });
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="addbtn"><PlusIcon /></button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <div className='AEdiv'>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <Dialog.Title className="DialogTitle">Adding Resource Slot</Dialog.Title>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name"><div>Name</div></label>
                            <input className="Input" id="name" value={recname} onChange={e => setRecname(e.target.value)}/>

                            <label className="Label" htmlFor="resources">Resources</label>
                            {/* <input className="Input" id="resources" value={resources} onChange={e => setResources(e.target.value)}/> */}
                            {resources.map((resource: Resource) => (
                                <div className="checkbox-labels">
                                    <input
                                        id='checkbox-layer-shift'
                                        className='styled-checkbox'
                                        type="checkbox"
                                        checked={resourceIDS.includes(resource.id)}
                                        onChange={() => handleCheckboxChange(resource.id)}
                                    />
                                    <label htmlFor='checkbox-layer-shift' className='checkbox-label'>
                                        {resource.name}
                                    </label>
                                </div>
                            ))}
                            

                            <label className="Label" htmlFor="useown"><div>Allow using own material?</div></label>
                            <input className="Input" id="useown" type='checkbox' value={String(useown)} onChange={e => setUseown(Boolean(e.target.value))}/>

                            <label className="Label" htmlFor="canempty"><div>Allow empty?</div></label>
                            <input className="Input" id="canempty" type='checkbox' value={String(canempty)} onChange={e => setCanempty(Boolean(e.target.value))}/>
                        </fieldset>
                        
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={req}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

const ResourceSlots: React.FC = () => {

    const [data, setData] = React.useState<ResourceSlot[]>([]);
    const columns: (keyof ResourceSlot)[] = data.length > 0 ? Object.keys(data[0]).filter((key) => !key.includes('_id') && key !== 'id') : [];

    React.useEffect(() => {
        fetch('http://localhost:3000/api/resourceslots?limit=100', {
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
                console.log('Resource Slots:', data);
                if (Array.isArray(data) && data.every(item => 'id' in item && 'db_name' in item)) {
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
        DeleteItem("resourceslots", data[index_real], index_local, setData);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Resource Slots"
                type='resourceslots'
                aemenu={aemenu(false)}
            />
            <Table<ResourceSlot>
                columns={columns}
                data={data}
                onDelete={onDelete}
                canEdit
            />
        </div>
    );
};

export default ResourceSlots;