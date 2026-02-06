import React, { ReactNode } from 'react';
import { useState } from 'react';
import Table, { DeleteItem, ITEMS_PER_PAGE } from '../components/Table';
import { TableHead } from '../components/Table';
import { Resource } from 'src/interfaces';
import { OmniAPI } from 'src/apis/OmniAPI';

import '../styles/TabStyles.scss';


import {Cross2Icon, PlusIcon} from "@radix-ui/react-icons";
import * as Dialog from '@radix-ui/react-dialog';

interface aemenuprops {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    resource: Resource | null;
    setResource: (resource: Resource | null) => void;
    refresh: () => void;
}

const aemenu = (props: aemenuprops): [ReactNode, (state: boolean, res: Resource | null) => void] =>  {
    let { isDialogOpen, setIsDialogOpen, resource, setResource, refresh} = props;
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [units, setUnits] = useState("");
    const [cost, setCost] = useState(0);

    const setOpenExtra = (state: boolean, res: Resource | null) => {
            setResource(res);
            if (res != null) {
                console.log("resource not null");
                setName(res.name);
                setBrand(res.brand?res.brand:"");
                setColor(res.color?res.color:"");
                setUnits(res.units?res.units:"");
                setCost(res.cost?res.cost:0);
            } else {
                console.log("resource is null");
                setName("");
                setBrand("");
                setColor("");
                setUnits("");
                setCost(0);
            }
            if (isDialogOpen != state) setIsDialogOpen(state);
        };

    function create() {
        if (name == "" || brand == "" || color == "" || units == "") {
            alert("All fields must be populated!");
            return;
        }
        OmniAPI.create("resources", {name: name, brand: brand, color: color, units: units, cost: cost})
        .then( () => {
            refresh();
            setOpenExtra(false, null);
        });
    };
    
    function edit() {
        if (resource == null) {return}
        OmniAPI.edit("resources", resource.id, {name: name, brand: brand, color: color, units: units, cost: cost})
        .then( () => {
            refresh();
            setOpenExtra(false, null);
        });
    }
            
    return [(
        <Dialog.Root open={isDialogOpen} onOpenChange={(e: boolean) => { setOpenExtra(e, resource); }}>
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
                        <Dialog.Title className="DialogTitle">{resource == null ? "Adding" : "Editing"} Resource</Dialog.Title>

                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="name">Name</label>
                            <input className="Input" id="name" value={name} onChange={e => setName(e.target.value)}/>

                            <label className="Label" htmlFor="brand">Brand</label>
                            <input className="Input" id="brand" value={brand} onChange={e => setBrand(e.target.value)}/>

                            <label className="Label" htmlFor="color">Color</label>
                            <input className="Input" id="color" value={color} onChange={e => setColor(e.target.value)}/>

                            <label className="Label" htmlFor="units">Units</label>
                            <input className="Input" id="units" value={units} onChange={e => setUnits(e.target.value)}/>

                            <label className="Label" htmlFor="cost">Cost</label>
                            <input className="Input" id="cost" type='number' value={cost} onChange={e => setCost(Number(e.target.value) || 0)}/>
                        </fieldset>
                        
                        <Dialog.Close asChild>
                            <button className="Button SaveBtn" onClick={resource == null ? create : edit}>Save</button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    ), setOpenExtra];
}


const Resources: React.FC = () => {

    const [data, setData] = React.useState<Resource[]>([]);
    const columns: (keyof Resource)[] = data.length > 0 ? (Object.keys(data[0]) as (keyof Resource)[]).filter((key) => !key.includes('_id') && key !== 'id') : [];
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPage = (page: number) => {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        OmniAPI.getAll("resources", { limit: ITEMS_PER_PAGE, offset }).then( (data) => {
            setData(data);
            setCurrentPage(page);
        });
    };

    React.useEffect(() => {
        fetchPage(1);
    }, []);

    const refreshPage = () => fetchPage(currentPage);

    const onDelete = (index_local: number, index_real: number) => {
        DeleteItem("resources", data[index_real], refreshPage);
    };

    let [resource, setResource]:[Resource | null, (resource: any) => void] = useState(null);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [ae, setOpen] = aemenu({isDialogOpen, setIsDialogOpen, resource, setResource, refresh: refreshPage});

    return (
        <div className='tab-column-cover align-center'>
            <TableHead
                heading="Resources"
                type="resources"
                aemenu={ae}
            />
            <Table<Resource>
                columns={columns}
                data={data}
                onDelete={onDelete}
                onEdit={(e) => { setOpen(true, e);}}
                canEdit
                currentPage={currentPage}
                onPageChange={fetchPage}
                resourceType="resources"
            />
        </div>
    );
};

export default Resources;