import React from 'react';
import useAuth from '../../Auth/useAuth';
import { PieChart } from 'react-minimal-pie-chart';
import {ReactComponent as DiscordIcon} from '../../../assets/img/discord-mark-blue.svg'; 
import '../styles/Summary.scss';

// Temp hardcoded values 

const usage_value = {
    id: 1,
    machine: 'Laser Cutter',
    time: '2021-09-01T12:00:00Z',
    cost: 10.00,
}

const hours_chart = [
    { machine: 'Laser Cutter', usage: 10 },
    { machine: 'Alpha', usage: 5 },
    { machine: 'Beta', usage: 15 },
    { machine: 'Resin Printer', usage: 15 },
]

const cost_chart = [
    { machine: 'Laser Cutter', usage: 1 },
    { machine: 'Alpha', usage: 10 },
    { machine: 'Beta', usage: 5 },
    { machine: 'Resin Printer', usage: 15 },
]

const Summary = () => {

    const { user } = useAuth();

    const flexStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '10px',
        width: 'inherit',
    } as React.CSSProperties;

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '10px',
        padding: '10px'
    } as React.CSSProperties;

    // TODO replace these with object data
    return (
        <div className='mf-flex-container' style={flexStyle}>
            <div className='mf-flex-row' style={rowStyle} >
                <DisplayObject id='cost' name='Semester Cost' semester_cost={user.semester_balance} />
                <SingleObject id='current' name='Current Usage' value={usage_value} /> 
            </div>
            <div className='mf-flex-row' style={rowStyle}>
                <ChartObject id='chart_hours' name='Machine Usage Hours' value={hours_chart}/> 
                <ChartObject id='chart_cost' name='Machine Usage Cost' value={cost_chart}/> 
            </div>
            <div className='mf-flex-row' style={rowStyle}>
                <ListObject id='uages' name='Machine Usage History' value=''/>
            </div>
            <div className='mf-flex-row' style={rowStyle}>
                <LinkObject id='discord' name='Join Our Discord!' value='https://discord.gg/vnPvMPadNy'/>
            </div>
        </div>
    );
};

export default Summary;

interface ListObjectProps {
    id: string;
    name: string;
    value: any;
}

const ListObject = ({ id, name, value }: ListObjectProps) => {

    const listStyle = {
        flex: '1',
    }

    return (
        <div className='mf-list mf-component' style={listStyle}>
            <h4>placeholder for usages</h4>
        </div>
    );
}

interface DisplayObjectProps {
    id: string;
    name: string;
    semester_cost: string;
}

const DisplayObject = ({ id, name, semester_cost }: DisplayObjectProps) => {

    const displayStyle = {
        flex: '1',
        padding: '10px',
        minWidth: '150px'
    } as React.CSSProperties;

    return (
        <div className='mf-display mf-component' style={displayStyle}>
            <h3>{name}</h3>
            <h2>${semester_cost}</h2>
        </div>
    );
}

interface LinkObjectProps {
    id: string;
    name: string;
    value: any;
}

const LinkObject = ({ id, name, value }: LinkObjectProps) => {

    const linkStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: '#5865F2',
        textDecoration: 'none',
    } as React.CSSProperties;

    const iconStyle = {
        marginRight: '10px',
        width: '24px',
        height: '24px',
    } as React.CSSProperties;

    return (
        <div className='mf-link mf-component' style={linkStyle}>
            <DiscordIcon className='cs-logo' style={iconStyle} />
            <a href={value} style={{ color: '#5865F2', textDecoration: 'none', fontSize: '24px' }}>{name}</a>
        </div>
    );
}

interface ChartObjectProps {
    id: string;
    name: string;
    value: any;
}

const ChartObject = ({ id, name, value }: ChartObjectProps) => {

    const chartStyle = {
       flex: '1',
       padding: '10px',
    } as React.CSSProperties;

    const colors = [
        '#9d9d9d','#e30000', '#5e5e5e', '#d6d6d6',  '#9b0808', 
        '#671403', '#f11717', '#fbb0b0', '#aab6cc', '#18155b'
    ];

    return (
        <div className='mf-chart mf-component' style={chartStyle}>
            <h1>{name}</h1>
            <div className='mf-chart-container'>
                <ul className='mf-chart-legend'>
                    {value.map((item: any, index: number) => {
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
                    data={value.map((item: any, index: number) => {
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
    id: string;
    name: string;
    value: any
}

const SingleObject = ({ id, name, value }: SingleObjectProps) => {

    const singleStyle = {
        flex: '2',
        padding: '10px',
        minWidth: '350px',
        minHeight: '80px'
    } as React.CSSProperties;

    const infoStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    } as React.CSSProperties;

    return (
        <div className='mf-single mf-component' style={singleStyle}>
            <h3 style={{ textAlign: 'left' }}>{name}</h3>
            <h2>{value.machine}</h2>
            <div style={infoStyle}>
                <h4>{value.time}</h4>
                <h4>${value.cost}</h4>
            </div>
        </div>
    );
}