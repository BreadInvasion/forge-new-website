import React from 'react';
import { useState } from 'react';
import Table, { DeleteItem } from '../components/Table';
import { TableHead } from '../components/Table';
import { Resource } from 'src/interfaces';

import '../styles/TabStyles.scss';


import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import { Dialog } from 'radix-ui';

const aemenu = (updateExisting:boolean) => {
    const [recname, setRecname] = useState("");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [units, setUnits] = useState("");
    const [cost, setCost] = useState(0);

    function req(){
        fetch(`http://localhost:3000/api/resources/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: `\{"name": "${recname}","brand": "${brand}","color": "${color}","units": "${units}","cost": ${cost}\}`
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
                console.error(`Error adding resource:`, error);
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
                        <Dialog.Title className="DialogTitle">Adding Resource</Dialog.Title>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={recname} onChange={e => setRecname(e.target.value)}/>

                            <label className="Label" htmlFor="brand">Brand</label>
                            <input className="Input" id="brand" value={brand} onChange={e => setBrand(e.target.value)}/>

                            <label className="Label" htmlFor="color">Color</label>
                            <input className="Input" id="color" value={color} onChange={e => setColor(e.target.value)}/>

                            <label className="Label" htmlFor="units">Units</label>
                            <input className="Input" id="units" value={units} onChange={e => setUnits(e.target.value)}/>

                            <label className="Label" htmlFor="cost">Cost</label>
                            <input className="Input" id="cost" type='number' value={cost} onChange={e => setCost(parseFloat(e.target.value))}/>
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


const Resources: React.FC = () => {

    const [data, setData] = React.useState<Resource[]>([]);
    const columns: (keyof Resource)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Resource)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];

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
                    setData(data);
                } else {
                    throw new Error('Data is not of type Resource');
                }
            })
            .catch(error => {
                console.error('Error fetching resources:', error);
            });
    }, []);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("resources", data[index_real], index_local, data, setData);
    };

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Resources"
                type="resources"
                aemenu={aemenu(false)}
            />
            <Table<Resource>
                columns={columns}
                data={data}
                onDelete={onDelete}
                canEdit
            />
        </div>
    );
};

export default Resources;