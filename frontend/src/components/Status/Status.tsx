import React, { useEffect, useState } from 'react';
import { OmniAPI } from "src/apis/OmniAPI";
import { styled } from 'styled-components';
import { SelectedMachineProvider } from './SelectedMachineContext';
import UpNext from './components/UpNext';
import Highlight from './components/Highlight';
import Toolbar from './components/Toolbar';
import MachineCard, { getProgress } from './MachineCard';
import { Machine, AllMachinesStatusResponse } from "src/interfaces";
import bgPattern from '../../assets/img/background.svg?url';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import PageRuler from '../shared/PageRuler';


// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  navy:    '#111c36',
  navyMid: '#2d4a80',
  red:     '#a51c1c',
  slate:   '#64748b',
  bgGrad:  '#e0e7f0',
  divider: '#e2e8f0',
};

// ── Page background with gradient + ruler ──────────────────────────────────

const PageBackground = styled.div`
  position: relative;
  min-height: calc(100vh - 74px);
  background: linear-gradient(to bottom, #ffffff 0%, ${C.bgGrad} 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
`;

// ── Main grid layout ───────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Styled components — matches the Figma "Status Page" design (node 97:2663).
// Layout: [ruler] [toolbar sidebar] [machine grid] [right sidebar]
// ---------------------------------------------------------------------------

const Page = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr minmax(280px, 320px);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "tools   sidebar"
    "status  sidebar";
  padding: 0.75rem 1.5rem 1.5rem 86px; /* 86px left = ruler (70) + gap (16) */
  gap: 12px;
  position: relative;
  z-index: 1;
  min-height: 0;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "tools"
      "sidebar"
      "status";
    padding: 0.75rem 1rem 1.5rem 86px;
  }
`;

const StatusArea = styled.div`
  grid-area: status;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
  overflow-y: auto;
  /* Top padding leaves room for the card's hover transform (translateY(-1px))
     and its enlarged drop-shadow so the first row doesn't get clipped by the
     scroll container's top edge. */
  padding: 8px 4px 1rem 4px;

  /* subtle scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 4px; }
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.15) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
`;

export const Status: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [highlightFailed, setHighlightFailed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await OmniAPI.getPublic("machinestatus");
        const data: AllMachinesStatusResponse = response;

        const groups = [...data.groups.map(g => ({ id: g.machines[0].group_id, name: g.name }))];

        const flattenedMachines = [
          ...data.loners,
          ...data.groups.flatMap((group) => group.machines),
        ];

        const transformedMachines = flattenedMachines.map((machine) => ({
          ...machine,
          group_id: machine.group_id,
          group: machine.group_id
            ? (groups.find(g => g.id === String(machine.group_id))?.name ?? 'Unknown Group')
            : 'No Group',
          type_id: machine.type_id,
          type: "Unknown Type",
          id: machine.id,
          name: machine.name,
          in_use: machine.in_use,
          usage_start: machine.usage_start ? new Date(machine.usage_start) : undefined,
          usage_duration: machine.usage_duration,
          user: (machine as any).user_name ?? machine.user_id,
          maintenance_mode: machine.maintenance_mode,
          disabled: machine.disabled,
          failed: machine.failed,
          failed_at: machine.failed_at ? new Date(machine.failed_at) : undefined,
          percent_completed: machine.percent_completed,
        }));

        setMachines(transformedMachines);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };

    fetchMachines();
    // Poll every 10 s so failure/completion state updates automatically
    const poll = setInterval(fetchMachines, 10000);
    return () => clearInterval(poll);
  }, []);

  const STATUS_FILTERS = ["In Progress", "Completed", "Available", "Failed", "Maintenance"];

  const filteredMachines = machines.filter((machine) => {
    if (activeFilters.length === 0) return true;

    const statusFilters = activeFilters.filter((f) => STATUS_FILTERS.includes(f));
    const otherFilters  = activeFilters.filter((f) => !STATUS_FILTERS.includes(f));

    let statusOk = true;
    if (statusFilters.length > 0) {
      const progress = getProgress(machine.usage_start, machine.usage_duration);
      statusOk = statusFilters.some((filter) => {
        switch (filter) {
          case "In Progress":  return progress < 100 && progress > 0;
          case "Completed":    return progress === 100;
          case "Available":    return !machine.in_use && !machine.failed && !machine.maintenance_mode;
          case "Failed":       return machine.failed;
          case "Maintenance":  return machine.maintenance_mode;
          default:             return true;
        }
      });
    }

    const otherOk = otherFilters.length === 0
      || otherFilters.every((filter) => filter === machine.type || filter === machine.group);

    return statusOk && otherOk;
  });

  return (
    <SelectedMachineProvider>
      <PageBackground>
        <Page>
          <Toolbar
            highlightFailed={highlightFailed}
            setHighlightFailed={setHighlightFailed}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />

          <StatusArea>
            {filteredMachines.map((machine, index) => (
              <MachineCard
                key={`${machine.name}-${index}`}
                id={machine.id}
                name={machine.name}
                in_use={machine.in_use}
                usage_start={machine.usage_start}
                usage_duration={machine.usage_duration}
                user={machine.user}
                maintenance_mode={machine.maintenance_mode}
                disabled={machine.disabled}
                failed={machine.failed}
                failed_at={machine.failed_at}
                machine={machine as any}
                $highlightFailed={highlightFailed}
                $minimized={true}
              />
            ))}
          </StatusArea>

          <Sidebar>
            <Highlight />
            <UpNext />
          </Sidebar>
        </Page>
      </PageBackground>
    </SelectedMachineProvider>
  );
};

export default Status;
