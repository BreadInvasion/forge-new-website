const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Summary-Doc_BRqL.js","./index-BvyJdg8B.js","./index-CV9iRW6F.css","./OmniAPI-CvjLIPs_.js","./Summary-DD_6ssZl.css","./Machines-D8I5dazF.js","./Table-CfTDemQw.js","./Table-GVKEA3Si.css","./background-_MUij_O6.js","./MachineTypes-VnCAyO6H.js","./MachineGroups-D5I6Er8q.js","./Resources-D9I1Xiao.js","./ResourceSlots-Bg0mSeAJ.js","./Users-iq6Gbz-r.js","./Usages-S9XMWsl-.js","./ComingSoon-DNV8B1HW.js","./ComingSoon-DZH9AyBh.css","./Semesters-BOddjdK3.js","./ChargeSheets-D70Az_8o.js"])))=>i.map(i=>d[i]);
import{o as re,j as e,v as ie,L as C,U as x,r as o,p as se,u as t,w as oe,x as S,_ as $}from"./index-BvyJdg8B.js";import{O as T}from"./OmniAPI-CvjLIPs_.js";import{b as O}from"./background-_MUij_O6.js";const le=()=>{const{user:n}=re(),s=g=>n.permissions.includes(g)||n.permissions.includes(x.IS_SUPERUSER);return e.jsxs("div",{className:"sidebar",children:[e.jsxs("div",{className:"user-summary",children:[e.jsx(ie,{user:n,isNav:!1}),e.jsxs("h2",{children:[n.first_name," ",n.last_name]}),e.jsx("h3",{children:n.display_role})]}),e.jsx("div",{className:"divider"}),e.jsxs("nav",{className:"options-container",children:[e.jsxs("ul",{className:"user-options member",children:[e.jsx("li",{children:e.jsx(C,{to:"/myforge/summary",className:"btn",children:"Summary"})}),(s(x.CAN_USE_MACHINES)||s(x.CAN_USE_MACHINES_BETWEEN_SEMESTERS))&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/create",className:"btn",children:"Use a Machine"})}),e.jsx("li",{children:e.jsx(C,{to:"/myforge/usages",className:"btn",children:"Usages"})})]}),s(x.CAN_FAIL_MACHINES)&&e.jsx("hr",{className:"divider"}),s(x.CAN_FAIL_MACHINES)&&e.jsx("ul",{className:"user-options volunteer",children:e.jsx("li",{children:e.jsx(C,{to:"/myforge/fail",className:"btn",children:"Failure Form"})})}),(s(x.CAN_SEE_MACHINE_TYPES)||s(x.CAN_SEE_MACHINE_GROUPS)||s(x.CAN_SEE_MACHINES)||s(x.CAN_SEE_RESOURCES)||s(x.CAN_SEE_USERS))&&e.jsx("hr",{className:"divider"}),e.jsxs("ul",{className:"user-options manager",children:[s(x.CAN_SEE_MACHINE_TYPES)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/machine_types",className:"btn",children:"Machine Types"})}),s(x.CAN_SEE_MACHINE_GROUPS)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/machine_groups",className:"btn",children:"Machine Groups"})}),s(x.CAN_SEE_MACHINES)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/machines",className:"btn",children:"Machines"})}),s(x.CAN_SEE_RESOURCES)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/resources",className:"btn",children:"Resources"})}),s(x.CAN_SEE_RESOURCE_SLOTS)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/resource_slots",className:"btn",children:"Resource Slots"})}),s(x.CAN_SEE_USERS)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/users",className:"btn",children:"Users"})})]}),(s(x.CAN_SEE_SEMESTERS)||s(x.CAN_GET_CHARGES))&&e.jsx("hr",{className:"divider"}),e.jsxs("ul",{className:"user-options eboard",children:[s(x.CAN_SEE_SEMESTERS)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/semesters",className:"btn",children:"Semesters"})}),s(x.CAN_GET_CHARGES)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/charge_sheets",className:"btn",children:"Charge Sheets"})}),s(x.IS_SUPERUSER)&&e.jsx("li",{children:e.jsx(C,{to:"/myforge/change_config",className:"btn",children:"Change Configuration"})})]})]})]})};let L;const ce=new Uint8Array(16);function de(){if(!L&&(L=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!L))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return L(ce)}const _=[];for(let n=0;n<256;++n)_.push((n+256).toString(16).slice(1));function pe(n,s=0){return _[n[s+0]]+_[n[s+1]]+_[n[s+2]]+_[n[s+3]]+"-"+_[n[s+4]]+_[n[s+5]]+"-"+_[n[s+6]]+_[n[s+7]]+"-"+_[n[s+8]]+_[n[s+9]]+"-"+_[n[s+10]]+_[n[s+11]]+_[n[s+12]]+_[n[s+13]]+_[n[s+14]]+_[n[s+15]]}const xe=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),K={randomUUID:xe};function ue(n,s,g){if(K.randomUUID&&!n)return K.randomUUID();n=n||{};const E=n.random||(n.rng||de)();return E[6]=E[6]&15|64,E[8]=E[8]&63|128,pe(E)}const d={navy:"#111c36",red:"#a51c1c",white:"#ffffff",black:"#000000"},he=t.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 74px);
    padding: 40px 16px;
    box-sizing: border-box;
    background: #EEF2F8;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${O});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.09;
        pointer-events: none;
    }
`,me=t.div`
    position: relative;
    z-index: 1;
    background: ${d.white};
    border: 4px solid ${d.navy};
    border-radius: 12px;
    width: clamp(340px, 50vw, 600px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 12px 48px rgba(17,28,54,0.18), 0 2px 8px rgba(17,28,54,0.08);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${O});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.04;
        pointer-events: none;
        z-index: 0;
    }
`,fe=t.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 28px 0;
`,ge=t.div`
    width: 100%;
    background: ${d.navy};
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`,be=t.h2`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
    color: ${d.white};
    text-align: center;
    margin: 0;
`;t.div`
    width: calc(100% - 40px);
    height: 2px;
    background: #e2e8f0;
    flex-shrink: 0;
`;const Q=t.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    width: calc(100% - 40px);
    padding: 18px 0 12px 0;
`,ye=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 10px;
    width: 100%;
    justify-content: flex-end;
`,_e=t.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 20px);
    font-weight: 700;
    color: ${d.black};
    white-space: nowrap;
    flex-shrink: 0;
`;t.input`
    height: 35px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${d.black};
    border-radius: 5px;
    background: ${d.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;

    &:focus {
        border-color: ${d.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        opacity: 1;
    }
`;const je=t.select`
    height: 35px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${d.black};
    border-radius: 5px;
    background: ${d.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;

    &:focus {
        border-color: ${d.navy};
    }
`,we=t.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    justify-content: center;
    width: 100%;
`,X=t.input`
    height: 35px;
    width: clamp(60px, 10vw, 100px);
    border: 2px solid ${d.black};
    border-radius: 5px;
    background: ${d.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    text-align: right;
    outline: none;
    box-sizing: border-box;

    &:focus { border-color: ${d.navy}; }
`,B=t.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 20px);
    font-weight: 700;
    color: ${d.black};
`,ve=t.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 14px 10px;
`,H=t.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    width: 100%;
`,G=t.input`
    width: 22px;
    height: 22px;
    border: 2px solid ${d.black};
    border-radius: 4px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${d.navy};
`,Y=t.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(12px, 1.2vw, 15px);
    font-weight: 700;
    color: ${d.black};
    cursor: pointer;
`,Se=t.div`
    width: calc(100% - 24px);
    padding: 14px 0 8px 0;
    overflow-x: auto;
`,Ee=t.table`
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
`,ke=t.thead`
    color: ${d.navy};

    th {
        padding: 8px 6px;
        border-bottom: 2px solid ${d.navy};
        text-align: center;
        font-weight: 700;
        white-space: nowrap;
        font-size: clamp(11px, 1.1vw, 13px);
    }
`,Ce=t.tbody`
    td {
        padding: 6px;
        text-align: center;
        border-bottom: 1px solid #e2e8f0;
    }

    tr:last-child td { border-bottom: none; }

    select, input[type="number"] {
        padding: 4px 6px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-size: 12px;
        width: 100%;
        box-sizing: border-box;
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        outline: none;
        &:focus { border-color: ${d.navy}; }
    }

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: ${d.navy};
        cursor: pointer;
    }
`,Ne=t.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: 700;
    color: ${d.navy};
    margin: 0 0 10px 0;
    text-align: left;
    padding: 0 10px;
`,$e=t.div`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 6px 20px;
    min-height: 20px;
    color: ${({$type:n})=>n==="success"?"#1d7a48":n==="error"?"#a51c1c":n==="warning"?"#8a5c00":"transparent"};
`,Ae=t.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 0 0 0;
    width: 100%;
`,Fe=t.div`
    width: ${n=>n.$active?"28px":"10px"};
    height: 10px;
    border-radius: 100px;
    background: ${n=>n.$active?d.navy:"#c8d3e8"};
    transition: width 0.2s ease, background 0.2s ease;
`,Re=t.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 40px);
    padding: 12px 0 4px 0;
    box-sizing: border-box;
`,q=t.button`
    height: 44px;
    min-width: 100px;
    padding: 0 24px;
    background: ${d.red};
    border: 2px solid ${d.black};
    border-radius: 6px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 1.8vw, 22px);
    font-weight: 700;
    color: ${d.white};
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, box-shadow 0.1s;

    &:hover:not(:disabled) {
        background: #8a1515;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(165,28,28,0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: none;
    }

    &:disabled {
        background: #c9a0a0;
        border-color: #aaa;
        cursor: not-allowed;
        transform: none;
    }
`,Me=()=>{const[n,s]=o.useState([]),[g,E]=o.useState("0"),[b,i]=o.useState({}),[h,N]=o.useState({hours:0,minutes:0,policy:!1,org:!1,reprint:!1}),[R,j]=o.useState([{slot_id:"_",name:"_",brand:"_",color:"_",amount:0,own:!1,cost:0}]),[I,D]=o.useState(null),[k,U]=o.useState(1),[A,l]=o.useState({text:"",type:""}),w=se();o.useEffect(()=>{(async()=>{const c=await T.getAll("machines");s(c)})()},[]);const M=r=>{r!=="_"&&E(r)};o.useEffect(()=>{if(g=="0")return;(async()=>{const c=await T.get("use",`${g}/schema`);i(c)})()},[g]),o.useEffect(()=>{if(!b.resource_slots)return;const r=b.resource_slots.map(m=>({slot_id:m.resource_slot_id,name:"_",brand:"_",color:"_",amount:0,own:!1,cost:0}));j(r);const c=ue(),u={slots:b.resource_slots,initialValues:r,setSlots:m=>{j(v=>{const F=[...v],P=F.findIndex(ae=>ae.slot_id===m.slot_id);return F[P]=m,F})}};D(e.jsx(ze,{...u},c))},[b]);function a(r,c){var u;l({text:r,type:c});try{(u=document.getElementById("status-text"))==null||u.scrollIntoView({behavior:"smooth",block:"center"})}catch{console.log("Failed to display status text")}}function y(){a("","")}const z=async r=>{if(r.preventDefault(),!h.policy){a("Please accept the usage policy.","error");return}const c={};R.map(v=>{v.resource_id&&(c[v.slot_id]={resource_id:v.resource_id,amount:v.amount*1,is_own_material:v.own})});const u=Math.ceil(h.hours*3600+h.minutes*60),m={as_org_id:h.org?h.org:null,duration_seconds:u,resource_usages:c};try{if(await T.use(g,m)==null)a("Usage submitted successfully.","success"),window.setTimeout(()=>w("../../status"),1e3);else throw new Error("An error occurred. Please try again.")}catch(v){v.status==409?a("This machine is already in use. Please clear it before submitting a new usage.","error"):v.status==404?a("The selected machine does not exist.","error"):v.status==403?a("You are not permitted to use this machine.","error"):a("An error occurred. Please try again.","error")}},p=r=>{var c,u,m,v;return!((c=b.resource_slots.find(F=>F.resource_slot_id===r.slot_id))!=null&&c.allow_own_material)&&r.own?`${(u=b.resource_slots.find(P=>P.resource_slot_id===r.slot_id))==null?void 0:u.display_name} does not allow personal material.`:!((m=b.resource_slots.find(F=>F.resource_slot_id===r.slot_id))!=null&&m.allow_empty)&&r.amount<=0&&!r.own?`Please enter an amount greater than 0 for ${(v=b.resource_slots.find(P=>P.resource_slot_id===r.slot_id))==null?void 0:v.display_name}.`:null},V=r=>{if(r==2&&g=="0"){a("Please select a machine first.","error");return}if(r==3){const c=R.find(u=>p(u));if(c){a(p(c)??"Please contact the site administrators.","error");return}R.forEach(u=>{u.amount>1e3&&!u.own?a(`WARNING: The amount for ${u.name} exceeds one spool. Please alert a volunteer after starting.`,"warning"):u.amount>1e3&&u.own&&a(`WARNING: The amount for ${u.name} exceeds one spool. Ensure you have enough material.`,"warning")})}if(r==4&&h.hours==0&&h.minutes==0){a("Please enter a valid duration.","error");return}y(),U(r)};return e.jsx(he,{children:e.jsx(me,{children:e.jsx(fe,{children:e.jsxs("form",{onSubmit:z,style:{width:"100%",display:"contents"},children:[e.jsx(ge,{children:e.jsx(be,{children:"Machine Usage Form"})}),k===1&&e.jsx(Q,{children:e.jsxs(ye,{children:[e.jsx(_e,{htmlFor:"machine-select",children:"Choose a Machine"}),e.jsxs(je,{id:"machine-select",value:g,onChange:r=>M(r.target.value),children:[e.jsx("option",{value:"0",disabled:!0,hidden:!0,children:"Please Select a Machine"}),n.map(r=>e.jsx("option",{value:r.id,children:r.name},r.id))]})]})}),k===2&&e.jsxs(Se,{children:[e.jsx(Ne,{children:"Resource Selection"}),I]}),k===3&&e.jsx(Q,{children:e.jsxs(we,{children:[e.jsx(B,{children:"Usage Duration"}),e.jsx(X,{id:"hours",type:"number",inputMode:"numeric",step:"1",min:"0",placeholder:"0",value:h.hours,onChange:r=>N(c=>({...c,hours:r.target.valueAsNumber}))}),e.jsx(B,{children:"hr"}),e.jsx(X,{id:"minutes",type:"number",inputMode:"numeric",step:"1",min:"0",placeholder:"0",value:h.minutes,onChange:r=>N(c=>({...c,minutes:r.target.valueAsNumber}))}),e.jsx(B,{children:"min"})]})}),k===4&&e.jsxs(ve,{children:[e.jsxs(H,{children:[e.jsx(G,{id:"policy",type:"checkbox",onChange:r=>N(c=>({...c,policy:r.target.checked}))}),e.jsxs(Y,{htmlFor:"policy",children:[e.jsx("span",{style:{color:d.red,marginRight:4},children:"*"}),"Do you agree to the Machine Usage Policy?"]})]}),e.jsxs(H,{children:[e.jsx(G,{id:"reprint",type:"checkbox",onChange:r=>N(c=>({...c,reprint:r.target.checked}))}),e.jsx(Y,{htmlFor:"reprint",children:"Is this a reprint?"})]}),e.jsxs(H,{children:[e.jsx(G,{id:"org",type:"checkbox",onChange:r=>N(c=>({...c,org:r.target.checked}))}),e.jsx(Y,{htmlFor:"org",children:"Is this usage for an organization?"})]})]}),e.jsx($e,{id:"status-text",$type:A.type,children:A.text||" "}),e.jsx(Ae,{children:[1,2,3,4].map(r=>e.jsx(Fe,{$active:r===k},r))}),e.jsxs(Re,{children:[e.jsx(q,{type:"button",onClick:()=>{y(),U(k-1)},disabled:k===1,children:"Back"}),k!==4&&e.jsx(q,{type:"button",onClick:()=>V(k+1),children:"Next"}),k===4&&e.jsx(q,{type:"submit",children:"Submit"})]})]})})})})},ze=({slots:n,initialValues:s,setSlots:g})=>{const E=!!n.find(i=>i.valid_resources.find(h=>h.brand)),b=!1;return e.jsx(o.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsxs(Ee,{children:[e.jsx(ke,{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Slot"}),e.jsx("th",{children:"Material"}),E&&e.jsx("th",{children:"Brand"}),b,e.jsx("th",{children:"Amount"}),e.jsx("th",{children:"Own"}),e.jsx("th",{children:"Cost"})]})}),e.jsx(Ce,{children:n.map((i,h)=>e.jsx(De,{slot:i,slotValue:s[h],setSlotValue:g,showBrand:E,showColor:b},i.resource_slot_id+h))})]})})},De=({slot:n,slotValue:s,setSlotValue:g,showBrand:E,showColor:b})=>{const[i,h]=o.useState({slot_id:n.resource_slot_id,name:"_",brand:"_",color:"_",amount:0,own:!1,cost:0}),[N,R]=o.useState(0),j=n.valid_resources,I=o.useMemo(()=>[...new Set(j.map(l=>l.name))],[j]),D=o.useMemo(()=>[...new Set(j.filter(l=>l.name===i.name||i.name==="_").map(l=>l.brand))],[j,i.name]),k=o.useMemo(()=>[...new Set(j.filter(l=>l.name===i.name&&l.brand===i.brand||i.name==="_").map(l=>l.color))],[j,i.name,i.brand]),U=(l,w,M)=>j.find(a=>a.name===l&&(w==="_"||a.brand===w)&&(M==="_"||a.color===M))??null,A=l=>{const{name:w,value:M,type:a}=l.target,y=a==="checkbox"?l.target.checked:M;h(z=>{let p={...z,[w]:y};const V=j.filter(m=>m.name===p.name).map(m=>m.brand),r=j.filter(m=>m.name===p.name&&m.brand===p.brand).map(m=>m.color);w==="name"&&!V.includes(p.brand)&&(p.brand="_"),(w==="name"||w==="brand")&&!r.includes(p.color)&&(p.color="_");const c=U(p.name,p.brand||"_",p.color||"_"),u=parseFloat((c==null?void 0:c.cost)??"0");return p.cost=p.own?0:p.amount*u,p})};return o.useEffect(()=>{const l=j.find(w=>w.name===i.name&&(w.brand===i.brand||i.brand==="_")&&(w.color===i.color||i.color==="_"));g({slot_id:i.slot_id,resource_id:l==null?void 0:l.id,name:i.name,brand:i.brand,color:i.color,amount:Number.isNaN(i.amount)?0:i.amount,own:i.own,cost:N})},[i,g]),o.useEffect(()=>{R(i.cost)},[i.cost]),e.jsxs("tr",{children:[e.jsx("td",{children:n.display_name}),e.jsx("td",{children:e.jsxs("select",{name:"name",value:i.name,onChange:A,required:!n.allow_empty,children:[e.jsx("option",{value:"_",children:"-- Material --"}),I.map(l=>e.jsx("option",{value:l,children:l},l))]})}),E&&e.jsx("td",{children:e.jsxs("select",{name:"brand",value:i.brand,onChange:A,disabled:i.name==="_",children:[e.jsx("option",{value:"_",children:"-- Brand --"}),D.map(l=>e.jsx("option",{value:l,children:l},l))]})}),b&&e.jsx("td",{children:e.jsxs("select",{name:"color",value:i.color,onChange:A,disabled:i.name==="_"||i.brand==="_",children:[e.jsx("option",{value:"_",children:"-- Color --"}),k.map(l=>e.jsx("option",{value:l,children:l},l))]})}),e.jsx("td",{children:e.jsx("input",{type:"number",name:"amount",value:i.amount,onChange:A,required:!n.allow_empty})}),e.jsx("td",{children:e.jsx("input",{type:"checkbox",name:"own",checked:i.own,onChange:A})}),e.jsx("td",{children:"$"+N.toFixed(2)})]})},f={navy:"#111c36",red:"#a51c1c",white:"#ffffff",black:"#000000"},Ie=t.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 74px);
    padding: 40px 16px;
    box-sizing: border-box;
    background: #EEF2F8;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${O});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.09;
        pointer-events: none;
    }
`,Ue=t.div`
    position: relative;
    z-index: 1;
    background: ${f.white};
    border: 4px solid ${f.navy};
    border-radius: 12px;
    width: clamp(340px, 50vw, 600px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 12px 48px rgba(17,28,54,0.18), 0 2px 8px rgba(17,28,54,0.08);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${O});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.04;
        pointer-events: none;
        z-index: 0;
    }
`,Pe=t.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 0 0;
`,Te=t.div`
    width: 100%;
    background: ${f.navy};
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`,Le=t.h2`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
    color: ${f.white};
    text-align: center;
    margin: 0;
`,Oe=t.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 20px 0 12px 0;
`,W=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 10px;
    width: 100%;
    justify-content: flex-end;
`,J=t.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(14px, 1.5vw, 20px);
    font-weight: 700;
    color: ${f.black};
    white-space: nowrap;
    flex-shrink: 0;
`,Z=t.input`
    height: 32px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${f.black};
    border-radius: 5px;
    background: ${f.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;

    &:focus {
        border-color: ${f.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        opacity: 1;
    }
`,Ve=t.select`
    height: 32px;
    width: clamp(120px, 25vw, 300px);
    border: 2px solid ${f.black};
    border-radius: 5px;
    background: ${f.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;

    &:focus {
        border-color: ${f.navy};
    }
`,ee=t.div`
    width: calc(100% - 40px);
    height: 2px;
    background: #e2e8f0;
    flex-shrink: 0;
    margin: 4px 0;
`,Be=t.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: calc(100% - 40px);
    padding: 14px 10px 8px 10px;
`,He=t.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(15px, 1.6vw, 20px);
    font-weight: 700;
    color: ${f.black};
    margin: 0 0 8px 0;
`,Ge=t.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 7px 0;
    width: 100%;
`,Ye=t.input`
    width: 22px;
    height: 22px;
    border: 2px solid ${f.black};
    border-radius: 4px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${f.navy};
`,qe=t.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(13px, 1.3vw, 16px);
    font-weight: 700;
    color: ${f.black};
    cursor: pointer;
`,We=t.div`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 6px 20px;
    min-height: 20px;
    width: 100%;
    box-sizing: border-box;
    color: ${({$type:n})=>n==="success"?"#1d7a48":n==="error"?"#a51c1c":n==="warning"?"#8a5c00":"transparent"};
`,Je=t.button`
    height: 44px;
    width: calc(100% - 40px);
    background: ${f.red};
    border: 2px solid ${f.black};
    border-radius: 6px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 1.8vw, 22px);
    font-weight: 700;
    color: ${f.white};
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
    margin: 0 0 20px 0;

    &:hover:not(:disabled) {
        background: #8a1515;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(165,28,28,0.3);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: none;
    }

    &:disabled {
        background: #c9a0a0;
        border-color: #aaa;
        cursor: not-allowed;
    }
`,Ke=()=>{const[n,s]=o.useState([]),[g,E]=o.useState("_"),[b,i]=o.useState(0),[h,N]=o.useState(""),[R,j]=o.useState([]),[I,D]=o.useState({text:"",type:""}),k=se();o.useEffect(()=>{(async()=>{const y=await T.getAll("machines");s(y)})()},[]);const U=a=>{a!=="_"&&E(a)},A=a=>{j(y=>y.includes(a)?y.filter(z=>z!==a):[...y,a])},l=async a=>{a.preventDefault();const y=g;try{if(await T.fail(y,{percent_completed:b,error_message:h,noticeable_faults:R})==null){localStorage.setItem(`failure_data_${y}`,JSON.stringify({percent_completed:b,failed_at:new Date().toISOString()})),D({text:"Failure reported. Redirecting to status page...",type:"success"});const p=document.querySelector(".usage-form");p==null||p.reset(),w(),window.setTimeout(()=>k("/status"),1200)}else D({text:"An error occurred, please try again.",type:"error"})}catch(z){console.error("Error:",z),D({text:"An error occurred, please try again.",type:"error"})}},w=()=>{i(0),N(""),j([])},M=["Layer Shift","Filament Jam","Lack of Bed Adhesion","Other"];return e.jsx(Ie,{children:e.jsx(Ue,{children:e.jsx(Pe,{children:e.jsxs("form",{className:"usage-form",onSubmit:l,style:{width:"100%",display:"contents"},children:[e.jsx(Te,{children:e.jsx(Le,{children:"Failure Form"})}),e.jsxs(Oe,{children:[e.jsxs(W,{children:[e.jsx(J,{htmlFor:"machine-select",children:"Machine"}),e.jsxs(Ve,{id:"machine-select",defaultValue:"_",onChange:a=>U(a.target.value),required:!0,children:[e.jsx("option",{value:"_",disabled:!0,hidden:!0,children:"Please Select a Machine"}),n.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})]}),e.jsxs(W,{children:[e.jsx(J,{htmlFor:"percent-completed",children:"Percent Completed"}),e.jsx(Z,{id:"percent-completed",type:"number",value:b,placeholder:"0",min:"0",max:"100",onChange:a=>{const y=parseInt(a.target.value);y>=0&&y<=100&&i(y)}})]}),e.jsxs(W,{children:[e.jsx(J,{htmlFor:"error-message",children:"Error Message"}),e.jsx(Z,{id:"error-message",type:"text",value:h,placeholder:"Printer Error Message",onChange:a=>N(a.target.value),required:!0})]})]}),e.jsx(ee,{}),e.jsxs(Be,{children:[e.jsx(He,{children:"Noticeable Faults"}),M.map(a=>e.jsxs(Ge,{children:[e.jsx(Ye,{id:`fault-${a.toLowerCase().replace(/\s+/g,"-")}`,type:"checkbox",checked:R.includes(a),onChange:()=>A(a)}),e.jsx(qe,{htmlFor:`fault-${a.toLowerCase().replace(/\s+/g,"-")}`,children:a})]},a))]}),e.jsx(We,{$type:I.type,children:I.text||" "}),e.jsx(ee,{style:{marginBottom:"16px"}}),e.jsx(Je,{type:"submit",disabled:g==="_",children:"Submit"})]})})})})},ne=o.lazy(()=>$(()=>import("./Summary-Doc_BRqL.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url)),te=o.lazy(()=>$(()=>import("./Machines-D8I5dazF.js"),__vite__mapDeps([5,1,2,6,3,7,8]),import.meta.url)),Qe=o.lazy(()=>$(()=>import("./MachineTypes-VnCAyO6H.js"),__vite__mapDeps([9,1,2,6,3,7,8]),import.meta.url)),Xe=o.lazy(()=>$(()=>import("./MachineGroups-D5I6Er8q.js"),__vite__mapDeps([10,1,2,6,3,7,8]),import.meta.url)),Ze=o.lazy(()=>$(()=>import("./Resources-D9I1Xiao.js"),__vite__mapDeps([11,1,2,6,3,7,8]),import.meta.url)),en=o.lazy(()=>$(()=>import("./ResourceSlots-Bg0mSeAJ.js"),__vite__mapDeps([12,1,2,6,3,7,8]),import.meta.url)),nn=o.lazy(()=>$(()=>import("./Users-iq6Gbz-r.js"),__vite__mapDeps([13,1,2,3,6,7,8]),import.meta.url)),tn=o.lazy(()=>$(()=>import("./Usages-S9XMWsl-.js"),__vite__mapDeps([14,1,2,3,6,7,8]),import.meta.url)),sn=o.lazy(()=>$(()=>import("./ComingSoon-DNV8B1HW.js"),__vite__mapDeps([15,1,2,16]),import.meta.url)),an=o.lazy(()=>$(()=>import("./Semesters-BOddjdK3.js"),__vite__mapDeps([17,1,2,6,3,7,8]),import.meta.url)),rn=o.lazy(()=>$(()=>import("./ChargeSheets-D70Az_8o.js"),__vite__mapDeps([18,1,2,3,6,7,17,8]),import.meta.url)),dn=()=>e.jsxs("div",{className:"myforge",children:[e.jsx(le,{}),e.jsx("div",{className:"tab-container",children:e.jsx(o.Suspense,{fallback:e.jsx("div",{}),children:e.jsxs(oe,{children:[e.jsx(S,{index:!0,element:e.jsx(ne,{})}),e.jsx(S,{path:"summary",element:e.jsx(ne,{})}),e.jsx(S,{path:"create",element:e.jsx(Me,{})}),e.jsx(S,{path:"fail",element:e.jsx(Ke,{})}),e.jsx(S,{path:"usages",element:e.jsx(tn,{})}),e.jsx(S,{path:"machines",element:e.jsx(te,{})}),e.jsx(S,{path:"machine_types",element:e.jsx(Qe,{})}),e.jsx(S,{path:"machine_groups",element:e.jsx(Xe,{})}),e.jsx(S,{path:"machines",element:e.jsx(te,{})}),e.jsx(S,{path:"resources",element:e.jsx(Ze,{})}),e.jsx(S,{path:"resource_slots",element:e.jsx(en,{})}),e.jsx(S,{path:"users",element:e.jsx(nn,{})}),e.jsx(S,{path:"semesters",element:e.jsx(an,{})}),e.jsx(S,{path:"charge_sheets",element:e.jsx(rn,{})}),e.jsx(S,{path:"change_config",element:e.jsx(sn,{})})]})})})]});export{dn as default};
