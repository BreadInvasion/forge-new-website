import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import useAuth from '../../Auth/useAuth';
import * as Dialog from "@radix-ui/react-dialog";
import { PieChart } from 'react-minimal-pie-chart';
import {ReactComponent as DiscordIcon} from '../../../assets/img/discord-mark-blue.svg'; 
import { MachineUsage, Semester } from 'src/interfaces';
import { OmniAPI } from "src/apis/OmniAPI";
import { AuthAPI } from "src/apis/AuthAPI";
import '../styles/Summary.scss';

const Summary: React.FC = () => {

    const { user, setUser } = useAuth();
    const location = useLocation();

    const [currentUsage, setCurrentUsage] = React.useState<MachineUsage | null>(null);
    const [currentUsageCount, setCount] = useState<number>(0)
    const [machineUsages, setMachineUsages] = React.useState<MachineUsage[]>([]);
    
    const [showGraduationPrompt, setShowGraduationPrompt] = useState(false);
    const graduationPromptHandled = useRef(false);
    const [showEmailVerificationPrompt, setShowEmailVerificationPrompt] = useState(false);

    const [costData, setCostData] = React.useState<ChartUsageData[]>([]);
    const [hoursData, setHoursData] = React.useState<ChartUsageData[]>([]);

    interface ChartUsageData {
        machine: string;
        usage: number;
    }

    useEffect(() => {
        if (graduationPromptHandled.current) return;
        if (!user?.id) return;

        const checkGraduationAndVerification = async () => {
            const currentSemester = await OmniAPI.get("semesters", "current").catch(() => null);

            console.log("Current Semester:", currentSemester);
            console.log("User Checked Graduating:", user.checked_graduating, !user.checked_graduating);

            if (currentSemester && (!user.checked_graduating || user.checked_graduating !== currentSemester.id)) {
                setShowGraduationPrompt(true);
            } else if (!user.is_email_verified) {
                if (!location.state?.justLoggedIn) return;
                setShowEmailVerificationPrompt(true);
            }
        };
        checkGraduationAndVerification();
        graduationPromptHandled.current = true;
    }, [user.id, user.checked_graduating, user.is_email_verified]);

    const saveGraduationDetails = async (isGraduating: boolean) => {
        setShowGraduationPrompt(false);
        try {
            const data = await OmniAPI.edit("users", "graduation", {
                is_graduating: isGraduating,
            });

            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            if (!data.is_email_verified) {
                setShowEmailVerificationPrompt(true);
            }
        } catch (error) {
            console.error("Error saving graduation details:", error);
        }
    };

    const resendVerificationEmail = () => {
        setShowEmailVerificationPrompt(false);
        void AuthAPI.makeVerifyToken({ token_type: "email_verification" })
            .catch((error) => console.error("Error sending verification email:", error));
        alert('A verification email has been sent to your RPI email (It may be in spam). Please open the email, click the link, and verify your email');
    };

    useEffect(() => {
        const getUsages = async () => {
            try {
                const response = await OmniAPI.get("usages", "me");
                const data: MachineUsage[] = response;
                setMachineUsages(data);
            } catch (error) {
                console.error("Error fetching machine usages:", error);
            }
        };
    
        getUsages();
    }, []);
    
    useEffect(() => {
        if (machineUsages.length === 0) return;
    
        const getChartData = (usages: MachineUsage[]) => {
            const sums = usages.reduce((acc, usage) => {
                const machine = usage.machine_name;
    
                if (!acc[machine]) {
                    acc[machine] = { cost: 0, hours: 0 };
                }
    
                acc[machine].cost += Number(usage.cost);
                acc[machine].hours += Number(usage.duration) / 3600;
    
                return acc;
            }, {} as Record<string, { cost: number; hours: number }>);

            setCostData(Object.entries(sums).map(([machine, { cost }]) => ({ 
                machine, 
                usage: cost 
            })));

            setHoursData(Object.entries(sums).map(([machine, { hours }]) => ({
                machine, 
                usage: hours
            })));
        };
    
        getChartData(machineUsages);
    }, [machineUsages]);

    useEffect(() => {
        if (machineUsages.length === 0) return;
   
        const getCurrentUsage = async () => {
            try {
                const response = await OmniAPI.get("usages/current", "me");
                console.log(response);
                const data: MachineUsage[] = response;
                setCurrentUsage(data[0]);
                setCount(data.length);
            } catch (error) {
                console.error("Error fetching current machine usages:", error);
            }
        };
        
        getCurrentUsage();
    }, [machineUsages]);

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

    return (
        <div className='mf-flex-container' style={flexStyle}>
            <Dialog.Root open={showGraduationPrompt} onOpenChange={setShowGraduationPrompt}>
                <Dialog.Portal>
                    <Dialog.Overlay className="AlertDialogOverlay" />
                    <Dialog.Content className="AlertDialogContent" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                        <Dialog.Title className="AlertDialogTitle">
                            Are you graduating this semester?
                        </Dialog.Title>
                        <div className="mf-graduation-dialog-actions">
                            <button className="Button" onClick={() => saveGraduationDetails(true)}>
                                Yes
                            </button>
                            <button className="Button" onClick={() => saveGraduationDetails(false)}>
                                No
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <Dialog.Root open={showEmailVerificationPrompt} onOpenChange={setShowEmailVerificationPrompt}>
                <Dialog.Portal>
                    <Dialog.Overlay className="AlertDialogOverlay" />
                    <Dialog.Content className="AlertDialogContent" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                        <Dialog.Title className="AlertDialogTitle">
                            Your email is not verified
                        </Dialog.Title>
                        <p>If you have just created your account, please click the link sent to your email to verify your account. Click resend if the link expired to send a new email.</p>
                        <div className="mf-graduation-dialog-actions">
                            <button className="Button" onClick={resendVerificationEmail}>
                                Resend
                            </button>
                            <button className="Button" onClick={() => setShowEmailVerificationPrompt(false)}>
                                Close
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <div className='mf-flex-row' style={rowStyle} >
                <DisplayObject id='cost' name='Semester Cost' semester_cost={user.semester_balance} />
                <SingleObject id='current' name='Current Usage' value={currentUsage} count={currentUsageCount} /> 
            </div>
            <div className='mf-flex-row' style={rowStyle}>
                <ChartObject id='chart_hours' name='Machine Usage Hours' unit="hours" value={hoursData}/> 
                <ChartObject id='chart_cost' name='Machine Usage Cost' unit="cost" value={costData}/> 
            </div>
            <div className='mf-flex-row' style={rowStyle}>
                <ListObject id='uages' name='Machine Usage History' value={machineUsages}/>
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
    value: MachineUsage[];
}

const ListObject = ({ id, name, value }: ListObjectProps) => {

    const listStyle = {
        flex: '1',
    } as React.CSSProperties;

    return (
        <div className='mf-list mf-component' style={listStyle}>
            <ul>
                {value.map((usage) => (
                    <li key={usage.time_started.toString()}>
                        <strong>{usage.machine_name}</strong> - {usage.time_started.toString()} - ${Number(usage.cost).toFixed(2)}
                    </li>
                ))}
            </ul>
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
        minWidth: '150px',
    } as React.CSSProperties;

    return (
        <div className='mf-display mf-component' style={displayStyle}>
            <h4>{name}</h4>
            <h3>${semester_cost}</h3>
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
    unit: string;
    value: any;
}

const ChartObject = ({ id, name, unit, value }: ChartObjectProps) => {

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
                    label={({ dataEntry }) => 
                        (unit == 'cost') ? `$${Math.round(dataEntry.value)}` : `${Math.round(dataEntry.value)} hrs`
                    }
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
    value: MachineUsage | null
    count: number
}

const SingleObject = ({ id, name, value, count }: SingleObjectProps) => {

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
            <h4 style={{ textAlign: 'left' }}>
                {name} {count > 1 ? `(${count})` : ""}
            </h4>
            {value ? (
                <>
                    <h3>{value.machine_name}</h3>
                    <div style={infoStyle}>
                        <h4>{new Date(value.time_started).toLocaleDateString()}</h4>
                        <h4>{Math.ceil(Number(value.duration)/60)} minutes</h4>
                    </div>
                </>
            ) : (
                <h2>No current usages</h2>
            )}
        </div>
    );
}