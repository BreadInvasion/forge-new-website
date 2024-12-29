import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

import '../styles/Summary.scss';

const layout = `
    'cost current current current'
    'machines machines usages usages'
    'machines machines usages usages'
    'join join usages usages'
`;

const components = [
    {
        type: 'display',
        id: 'cost',
        name: 'Semester Cost',
        value: `$160.67`,
    },
    {
        type: 'list',
        id: 'usages',
        name: 'Usages',
        value: [
            {
                id: 1,
                machine: 'Laser Cutter',
                time: '2021-09-01T12:00:00Z',
                cost: 10.00,
            },
            {
                id: 2,
                machine: '3D Printer',
                time: '2021-09-01T12:00:00Z',
                cost: 5.00,
            },
            {
                id: 3,
                machine: 'CNC Mill',
                time: '2021-09-01T12:00:00Z',
                cost: 15.00,
            },
        ]
    },
    {
        type: 'link',
        id: 'join',
        name: 'Join Our Discord Community!', 
        value: `https://discord.gg/vnPvMPadNy`,
    },
    {
        type: 'chart',
        id: 'machines',
        name: 'Machine Usage',
        value: [
            { machine: 'Laser Cutter', usage: 10 },
            { machine: 'Alpha', usage: 5 },
            { machine: 'Beta', usage: 15 },
            { machine: 'Resin Printer', usage: 15 },
        ]
    },
    {
        type: 'single',
        id: 'current',
        name: 'Current Usage',
        value: {
            id: 1,
            machine: 'Laser Cutter',
            time: '2021-09-01T12:00:00Z',
            cost: 10.00,
        },
    },
]

interface GridProps {
    gridId: string;
    cols: number;
    rows: number;
    layout?: string[][]; // optional
}

const Summary = () => {

    const gridStyle = {
        display: 'grid',
        gridTemplateAreas: layout,
        gridAutoColumns: '1fr',
        gridAutoRows: '1fr',
    } as React.CSSProperties;

    return (
        <div className='mf-grid-container'>
            <div className='mf-grid' style={gridStyle}>
                {components.map((component) => {
                    // if (component.type === 'display') {
                    //     return <DisplayObject key={component.id} component={component} />
                    // } else if (component.type === 'list') {
                    //     return <ListObject key={component.id} component={component} />
                    // }
                    switch (component.type) {
                        case 'display':
                            return <DisplayObject key={component.id} component={component} />
                        case 'list':
                            return <ListObject key={component.id} component={component} />
                        case 'link':
                            return <LinkObject key={component.id} component={component} />
                        case 'chart':
                            return <ChartObject key={component.id} component={component} />
                        case 'single':
                            return <SingleObject key={component.id} component={component} />
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};

export default Summary;

interface ListObjectProps {
    component: {
        type: string;
        id: string;
        name: string;
        value: any;
    }
}

const ListObject = ({ component }: ListObjectProps) => {

    const listStyle = {
        gridArea: component.id,
    }

    return (
        <div className='mf-list mf-component' style={listStyle}>
            <h1>{component.name}</h1>
            <ul>
                {component.value.map((item: any) => {
                    return (
                        <li key={item.id}>
                            <h2>{item.machine}</h2>
                            <h3>{item.time}</h3>
                            <h4>{item.cost}</h4>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

interface DisplayObjectProps {
    component: {
        type: string;
        id: string;
        name: string;
        value: any;
    }
}

const DisplayObject = ({ component }: DisplayObjectProps) => {

    const displayStyle = {
        gridArea: component.id,
    }

    return (
        <div className='mf-display mf-component' style={displayStyle}>
            <h1>{component.name}</h1>
            <h2>{component.value}</h2>
        </div>
    );
}

interface LinkObjectProps {
    component: {
        type: string;
        id: string;
        name: string;
        value: any;
    }
}

const LinkObject = ({ component }: LinkObjectProps) => {

    const linkStyle = {
        gridArea: component.id,
    }

    return (
        <div className='mf-link mf-component' style={linkStyle}>
            <a href={component.value}>{component.name}</a>
        </div>
    );
}

interface ChartObjectProps {
    component: {
        type: string;
        id: string;
        name: string;
        value: any;
    }
}

const ChartObject = ({ component }: ChartObjectProps) => {

    const chartStyle = {
        gridArea: component.id,
    }

    const colors = [
        '#FF5733', '#3357FF', '#FF8333', '#FF33A1', '#A133FF',
        '#33FFA1', '#FF8C33', '#8C33FF', '#33FF57', '#FF338C',
        '#338CFF', '#33FF8C', '#8333FF', '#33FF83', '#FF3383'
    ];

    return (
        <div className='mf-chart mf-component' style={chartStyle}>
            <h1>{component.name}</h1>
            <div className='mf-chart-container'>
                <ul className='mf-chart-legend'>
                    {component.value.map((item: any, index: number) => {
                        return (
                            <li key={index} className='mf-chart-legend-item'>
                                <div className='mf-chart-legend-color' style={{ backgroundColor: colors[index] }}></div>
                                <h2>{item.machine}</h2>
                            </li>
                        );
                    })}
                </ul>
                <PieChart
                    className='mf-pie-chart'
                    data={component.value.map((item: any, index: number) => {
                        return { title: item.machine, value: item.usage, color: colors[index], }
                    })}
                    label={({ dataEntry }) => `${Math.round(dataEntry.value)} hrs`}
                    labelStyle={{
                        fontSize: '50%',
                        fontFamily: 'sans-serif',
                        fill: 'black',
                    }}
                    labelPosition={65}
                />
            </div>
        </div>
    );
}

interface SingleObjectProps {
    component: {
        type: string;
        id: string;
        name: string;
        value: any;
    }
}

const SingleObject = ({ component }: SingleObjectProps) => {

    const singleStyle = {
        gridArea: component.id,
    }

    return (
        <div className='mf-single mf-component' style={singleStyle}>
            <h1>{component.name}</h1>
            <h2>{component.value.machine}</h2>
            <h3>{component.value.time}</h3>
            <h4>{component.value.cost}</h4>
        </div>
    );
}