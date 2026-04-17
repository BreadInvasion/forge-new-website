import{r as m,j as l,u as y,a as mn,P as ee,b as Oe,c as ht,d as _e,e as wn,f as xt,g as bn,h as te,i as mt,k as vn,l as yn,R as Cn,m as Pn,n as An,F as _n,D as jn,M as Sn,C as Me,o as Rn,p as kn,q as En,U as ge,s as On,E as Mn,t as $n}from"./index-BvyJdg8B.js";import{O as je}from"./OmniAPI-CvjLIPs_.js";import{b as Tn}from"./background-_MUij_O6.js";const wt=m.createContext(void 0),Fn=({children:e})=>{const[t,n]=m.useState(null);return l.jsx(wt.Provider,{value:{selectedMachine:t,setSelectedMachine:n},children:e})},bt=()=>{const e=m.useContext(wt);if(!e)throw new Error("useSelectedMachine must be used within a SelectedMachineProvider");return e},Dn={whiteA11:"rgba(255, 255, 255, 0.9)"};y.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: visible;
    @media screen and (max-width: 850px) {
        /* don't force full viewport height on mobile: let toolbar and sidebar size naturally */
        height: auto;
    }
`;y.div`
    grid-area: status;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: flex-start;
    column-gap: 10px;
    overflow: visible;
    @media screen and (max-width: 850px) {
    overflow-y: auto;
    /* ensure padding remains visible on narrow viewports even if global rules exist */
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    }
`;const Nn=y.div`
    /* ── Figma small card ── */
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid ${({$highlightFailed:e,$failed:t})=>e||t?"#a51c1c":"#2d4a80"};
    box-shadow: ${({$highlightFailed:e,$failed:t})=>e||t?"0 0 8px 2px rgba(165,28,28,0.5)":"0 1px 4px rgba(17,28,54,0.10)"};
    padding: ${({$minimized:e})=>e?"10px 10px 18px 10px":"18px 20px 20px 20px"};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: ${({$minimized:e})=>e?"200px":"100%"};
    min-width: ${({$minimized:e})=>e?"180px":"0"};
    flex-shrink: ${({$minimized:e})=>e?"0":"1"};
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.15s ease, transform 0.15s ease;

    /* progress fill at bottom — minimized cards only */
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: ${({$failed:e,progress:t})=>e?"100%":`${t}%`};
        height: ${({$minimized:e})=>e?"10px":"0"};
        background: ${({$failed:e})=>e?"#a51c1c":"#2d9c5c"};
        border-radius: 0 6px 0 0;
        transition: width 1s linear;
    }

    &:hover {
        box-shadow: 0 3px 12px rgba(17,28,54,0.18);
        transform: translateY(-1px);
    }

    @media screen and (max-width: 850px) {
        width: ${({$minimized:e})=>e?"180px":"100%"};
    }
`;y.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: left;
    gap: 0.25rem;
`;y.p`
    font-size: ${({$minimized:e})=>e?"10px":"12px"};
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.3;
`;y.div`
    font-size: ${({$minimized:e})=>e?"11px":"14px"};
    font-weight: 500;
    color: #111c36;
    margin: 0;
    line-height: 1.3;
`;const Qe=y.h3`
    font-size: ${({$minimized:e})=>e?"15px":"20px"};
    font-weight: 700;
    color: #111c36;
    text-transform: uppercase;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    letter-spacing: 0.6px;
    line-height: 1.2;
    margin: 0 0 6px 0;
    text-align: center;
    width: 100%;
`,Ln=y.p`
    font-size: ${({$minimized:e})=>e?"10px":"12px"};
    color: #64748b;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
`;y.div`
    width: 10%;
    height: 100%;
    background-color: ${Dn.whiteA11};
    border-radius: 1vw;
    border: 1px solid #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    ${e=>e.$horizontal&&`
        width: auto;
        height: 10%;
        min-height: 10px;
        flex-direction: row;
        justify-content: flex-start;
    `}
`;y.div`
    width: 100%;
    height: ${e=>e.$progress}%;
    background-color: green;
    border-radius: 1vw;
    ${e=>e.$horizontal&&`
        width: ${e.$progress}%;
        height: 10%;
    `}
`;y.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;y.div`
    width: 100%;
    height: 11%;
    display: flex;
    border-radius: 15px;
    border: 1px solid #000;
    justify-content: start;
    align-items: center;
    padding: 5px;
    gap: 1%;
    filter: drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.25));
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.5);

`;y.div`
    height: 100%;
    aspect-ratio: 1 / 1;

    background-image: url(src/assets/img/symbols/${e=>e.$symbol}.svg);
    background-size: auto 90%;
    background-repeat: no-repeat;
    background-position: center;
`;y.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;const $e=(e,t)=>{const n=e;return new Date(n.getTime()+t*1e3).toLocaleString("en-US",{month:"long",day:"numeric",hour:"numeric",minute:"numeric",hour12:!0})},Te=(e,t)=>{if(!e||!t)return 0;const n=new Date(e.getTime()+t*1e3),o=(new Date().getTime()-e.getTime())/(n.getTime()-e.getTime());return Math.min(100,Math.max(0,o*100))},et=(e,t,n)=>{if(!e||!t||!n)return 0;const r=new Date(e.getTime()+t*1e3),o=(n.getTime()-e.getTime())/(r.getTime()-e.getTime());return Math.min(100,Math.max(0,o*100))},zn=y.button`
    background-color:rgb(228, 23, 19);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 2.0vh;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    z-index: 10;
    position: relative;
    &:hover {
        background-color:rgb(186, 7, 7);
    }
`,he=y.div`
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 4px;
    width: 100%;
`,xe=y.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-align: right;
    white-space: nowrap;
`,me=y.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 400;
    color: #111c36;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 110px;
`,Hn=y.div`
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 12px;
    row-gap: 8px;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding: 4px 0 2px 0;
`,G=y.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    text-align: right;
    white-space: nowrap;
    line-height: 1.4;
`,X=y.span`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 500;
    color: ${e=>e.$failed?"#a51c1c":"#111c36"};
    text-align: left;
    line-height: 1.4;
    word-break: break-word;
`,Ee=y.div`
    grid-column: 1 / -1;
    height: 1px;
    background: #e2e8f0;
    margin: 2px 0;
`,In=y.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    color: #64748b;
    font-weight: 400;
    margin: 6px 0 0 0;
    text-align: center;
    width: 100%;
`,Bn=y.div`
    width: calc(100% - 8px);
    height: 22px;
    background: ${e=>e.$failed?"#f5e0e0":"#e0f0e8"};
    border-radius: 100px;
    overflow: hidden;
    margin-top: 12px;
    flex-shrink: 0;
    position: relative;
`,Wn=y.div`
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: ${e=>e.$pct}%;
    background: ${e=>e.$failed?"#a51c1c":"#2d9c5c"};
    border-radius: 100px;
    /* no transition when frozen so it snaps to the failure position instantly */
    transition: ${e=>e.$failed?"none":"width 1s linear"};
`,tt=(e,t)=>{if(!e||!t)return 0;const n=e.getTime()+t*1e3;return Math.max(0,Math.floor((n-Date.now())/1e3))},Un=e=>{if(e<=0)return"Complete";const t=Math.floor(e/3600),n=Math.floor(e%3600/60),r=e%60;return t>0?`${t}h ${String(n).padStart(2,"0")}m ${String(r).padStart(2,"0")}s`:n>0?`${n}m ${String(r).padStart(2,"0")}s`:`${r}s`},vt=({machine:e,$minimized:t,$highlightFailed:n})=>{const r=R=>{try{const k=localStorage.getItem(`failure_data_${R}`);if(!k)return null;const A=JSON.parse(k);return{percent_completed:typeof A.percent_completed=="number"?A.percent_completed:null,failed_at:A.failed_at?new Date(A.failed_at):null}}catch{return null}},[o,i]=m.useState(e),[s,d]=m.useState(()=>{if(e.failed){const R=r(e.id);return(R==null?void 0:R.percent_completed)!=null?R.percent_completed:e.percent_completed??et(e.usage_start,e.usage_duration,e.failed_at)}return Te(e.usage_start,e.usage_duration)}),[a,c]=m.useState(()=>{if(e.failed){const R=r(e.id);return(R==null?void 0:R.failed_at)??e.failed_at}return e.failed_at}),[h,g]=m.useState(()=>e.failed?0:tt(e.usage_start,e.usage_duration));m.useEffect(()=>{i(e)},[e]),m.useEffect(()=>{if(o.failed){const A=r(o.id),M=(A==null?void 0:A.percent_completed)!=null?A.percent_completed:o.percent_completed??et(o.usage_start,o.usage_duration,o.failed_at);d(M),c((A==null?void 0:A.failed_at)??o.failed_at),g(0);return}const R=()=>{d(Te(o.usage_start,o.usage_duration)),g(tt(o.usage_start,o.usage_duration))};if(R(),!o.in_use||!o.usage_start||!o.usage_duration)return;const k=setInterval(R,1e3);return()=>clearInterval(k)},[o.in_use,o.usage_start,o.usage_duration,o.failed,o.failed_at]);const{id:x,name:p,in_use:u,usage_start:f,usage_duration:w,user:b,maintenance_mode:C,disabled:P,failed:v,failed_at:_,weight:j,material:E}=o,{setSelectedMachine:$}=bt(),T=()=>{$({id:x,name:p,in_use:u,usage_start:f,usage_duration:w,user:b,maintenance_mode:C,disabled:P,failed:v,failed_at:_,weight:j,material:E})},D=async R=>{if(R.stopPropagation(),v||u)try{if(!localStorage.getItem("authToken")){alert("Error, not authenticated. Must be logged in to clear machines.");return}const A=await je.clear(`${o.id}`);if(A!=null)if(A.status===404&&alert("Machine not found. Please check the machine ID."),A.status===403){alert("Error, not authenticated. Must be logged in to clear machines.");return}else throw new Error(`Failed to clear machine: ${A.statusText}`);localStorage.removeItem(`failure_data_${o.id}`);const M={...o,failed:!1,in_use:!1,maintenance_mode:!1,disabled:!1,failed_at:void 0,progress:0};i(M),$({id:x,name:p,in_use:u,usage_start:f,usage_duration:w,user:b,maintenance_mode:C,disabled:P,failed:v,failed_at:_,weight:j,material:E}),window.location.reload()}catch(k){console.error("Error clearing machine:",k),alert("Failed to clear the machine. Please try again.")}};function F(R){const k=Math.floor(R/3600),A=Math.floor(R%3600/60);return`${k}h ${A}m`}const O=(R,k,A,M)=>{const S=[];return k?S.push("Failed"):s===100?S.push("Completed"):(R&&S.push("In Use"),A&&S.push("Under Maintenance"),M&&S.push("Disabled"),!R&&!A&&!M&&S.push("Available")),S.length>0?S.join(", "):"Operational"};return l.jsx(Nn,{$symbol:p,$minimized:t,$highlightFailed:n&&!!v,$failed:!!v,progress:s,onClick:T,children:t?l.jsxs(l.Fragment,{children:[l.jsx(Qe,{$minimized:!0,$clearable:n&&(v||u),children:p}),l.jsxs(he,{children:[l.jsx(xe,{children:"User :"}),l.jsx(me,{children:b||"N/A"})]}),l.jsxs(he,{children:[l.jsx(xe,{children:"Est. Completion :"}),l.jsx(me,{children:f&&w?$e(f,w):"N/A"})]}),l.jsxs(he,{children:[l.jsx(xe,{children:"Material :"}),l.jsx(me,{children:E||"N/A"})]}),l.jsxs(he,{children:[l.jsx(xe,{children:"Status :"}),l.jsx(me,{children:O(u,v,C,P)})]}),n&&(v||u)&&l.jsx(zn,{onClick:D,children:"Clear"})]}):l.jsxs(l.Fragment,{children:[l.jsx(Qe,{$minimized:!1,$clearable:n&&(v||u),children:p}),l.jsxs(Hn,{children:[l.jsx(G,{children:"User"}),l.jsx(X,{children:b||"N/A"}),u&&!v&&l.jsxs(l.Fragment,{children:[l.jsx(Ee,{}),l.jsx(G,{children:"Start Time"}),l.jsx(X,{children:f==null?void 0:f.toLocaleString("en-US",{month:"long",day:"numeric",hour:"numeric",minute:"numeric",hour12:!0})}),l.jsx(G,{children:"Total Time"}),l.jsx(X,{children:F(w??0)}),l.jsx(G,{children:"Time Left"}),l.jsx(X,{children:Un(h)}),l.jsx(G,{children:"Progress"}),l.jsxs(X,{children:[s.toFixed(1),"%"]})]}),v&&l.jsxs(l.Fragment,{children:[l.jsx(Ee,{}),l.jsx(G,{children:"Progress at Failure"}),l.jsxs(X,{$failed:!0,children:[s.toFixed(1),"%"]}),l.jsx(G,{children:"Failed At"}),l.jsx(X,{$failed:!0,children:(a==null?void 0:a.toLocaleString("en-US",{month:"long",day:"numeric",hour:"numeric",minute:"numeric",hour12:!0}))??"Unknown"})]}),l.jsx(Ee,{}),l.jsx(G,{children:"Status"}),l.jsx(X,{$failed:!!v,children:O(u,v,C,P)})]}),f&&w&&!v&&l.jsxs(In,{children:["Est. Completion: ",$e(f,w)]}),l.jsx(Bn,{$failed:!!v,children:l.jsx(Wn,{$pct:v?100:s,$failed:!!v})})]})})},nt=y.div`
    background: #ffffff;
    border: 1px solid #2d4a80;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(17,28,54,0.10);
    flex-shrink: 0;
`,rt=y.div`
    background: #2d4a80;
    padding: 10px 14px;

    h2 {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-weight: 700;
        font-size: 13px;
        color: #ffffff;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
    }
`,ot=y.div`
    padding: 10px 12px;
    max-height: 280px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.15) transparent;

    p {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-size: 12px;
        color: #64748b;
        margin: 0;
        padding: 6px 0;
    }
`,Vn=y.div`
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
    &:last-child { border-bottom: none; }
`,Yn=y.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
`,Gn=y.h3`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 700;
    color: #111c36;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
`,Xn=y.div`
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 700;
    color: #2d4a80;
    background: rgba(45,74,128,0.08);
    border: 1px solid rgba(45,74,128,0.2);
    border-radius: 4px;
    white-space: nowrap;
`,Zn=y.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 2px 0;
`,qn=y(Ln)`
    font-size: 11px;
    text-align: left;
`,Kn=()=>{const[e,t]=m.useState([]),[n,r]=m.useState(!0),[o,i]=m.useState(null);m.useEffect(()=>{const c=async()=>{try{r(!0),i(null);const g=await je.getPublic("machinestatus"),p=[...g.loners,...g.groups.flatMap(u=>u.machines)].map(u=>({name:u.name,in_use:u.in_use,failed:u.failed,user:u.user_name,usage_start:u.usage_start?new Date(u.usage_start):void 0,usage_duration:u.usage_duration}));t(p)}catch(g){console.error("Error fetching machines:",g),i("Failed to fetch machine data. Please try again later.")}finally{r(!1)}};c();const h=setInterval(c,1e4);return()=>clearInterval(h)},[]);const s=e.filter(c=>c.in_use&&!c.failed).sort((c,h)=>{const g=new Date(c.usage_start).getTime()+c.usage_duration*1e3,x=new Date(h.usage_start).getTime()+h.usage_duration*1e3;return g-x}),d=Date.now(),a=s.filter(c=>{const h=new Date(c.usage_start).getTime()+c.usage_duration*1e3;return h-d<=30*6e4&&h>d});return a.length===0?l.jsxs(nt,{children:[l.jsx(rt,{children:l.jsx("h2",{children:"Machines Up Next"})}),l.jsx(ot,{children:l.jsx("p",{children:"Nothing finishing in the next 30 min."})})]}):l.jsxs(nt,{children:[l.jsx(rt,{children:l.jsx("h2",{children:"Machines Up Next"})}),l.jsx(ot,{children:a.map((c,h)=>l.jsxs(Vn,{children:[l.jsxs(Yn,{children:[l.jsxs(Gn,{children:[" ",c.name]}),l.jsxs(Xn,{children:[l.jsx("svg",{width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:l.jsx("path",{d:"M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z",fill:"currentColor","fill-rule":"evenodd","clip-rule":"evenodd"})}),c.usage_start&&c.usage_duration?`${((new Date(c.usage_start).getTime()+c.usage_duration*1e3-d)/1e3/60).toFixed(1)} min`:"N/A"]})]}),l.jsxs(Zn,{children:[" Being used by: ",c.user?c.user:"N/A"]}),l.jsxs(qn,{$area:"date",children:["Est. Completion: ",$e(c.usage_start,c.usage_duration)]})]},h))})]})},Jn=y.div`
    background: #ffffff;
    border: 1px solid #2d4a80;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(17,28,54,0.10);
    flex-shrink: 0;
`,Qn=y.div`
    background: #111c36;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;

    h2 {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-weight: 700;
        font-size: 13px;
        color: #ffffff;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
    }
`,er=y.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${e=>e.$active?"#4ade80":"#64748b"};
    flex-shrink: 0;
`,tr=y.div`
    padding: 0;
    width: 100%;

    p {
        font-family: var(--font-display, 'Funnel Display', sans-serif);
        font-size: 12px;
        color: #64748b;
        margin: 0;
        text-align: center;
        padding: 16px;
    }
`,nr=()=>{const{selectedMachine:e}=bt();return l.jsxs(Jn,{children:[l.jsxs(Qn,{children:[l.jsx(er,{$active:!!e}),l.jsx("h2",{children:"Selected Machine"})]}),l.jsx(tr,{children:e?l.jsx(vt,{id:e.id,name:e.name,in_use:e.in_use,usage_start:e.usage_start,usage_duration:e.usage_duration,user:e.user,maintenance_mode:e.maintenance_mode,disabled:e.disabled,failed:e.failed,failed_at:e.failed_at,weight:e.weight,material:e.material,machine:e,$highlightFailed:!1,$minimized:!1}):l.jsx("p",{children:"Click a machine to see details"})})]})},rr=["top","right","bottom","left"],Z=Math.min,L=Math.max,ye=Math.round,we=Math.floor,q=e=>({x:e,y:e}),or={left:"right",right:"left",bottom:"top",top:"bottom"},ir={start:"end",end:"start"};function Fe(e,t,n){return L(e,Z(t,n))}function W(e,t){return typeof e=="function"?e(t):e}function U(e){return e.split("-")[0]}function ie(e){return e.split("-")[1]}function Ne(e){return e==="x"?"y":"x"}function Le(e){return e==="y"?"height":"width"}function se(e){return["top","bottom"].includes(U(e))?"y":"x"}function ze(e){return Ne(se(e))}function sr(e,t,n){n===void 0&&(n=!1);const r=ie(e),o=ze(e),i=Le(o);let s=o==="x"?r===(n?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(s=Ce(s)),[s,Ce(s)]}function ar(e){const t=Ce(e);return[De(e),t,De(t)]}function De(e){return e.replace(/start|end/g,t=>ir[t])}function lr(e,t,n){const r=["left","right"],o=["right","left"],i=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return n?t?o:r:t?r:o;case"left":case"right":return t?i:s;default:return[]}}function cr(e,t,n,r){const o=ie(e);let i=lr(U(e),n==="start",r);return o&&(i=i.map(s=>s+"-"+o),t&&(i=i.concat(i.map(De)))),i}function Ce(e){return e.replace(/left|right|bottom|top/g,t=>or[t])}function dr(e){return{top:0,right:0,bottom:0,left:0,...e}}function yt(e){return typeof e!="number"?dr(e):{top:e,right:e,bottom:e,left:e}}function Pe(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function it(e,t,n){let{reference:r,floating:o}=e;const i=se(t),s=ze(t),d=Le(s),a=U(t),c=i==="y",h=r.x+r.width/2-o.width/2,g=r.y+r.height/2-o.height/2,x=r[d]/2-o[d]/2;let p;switch(a){case"top":p={x:h,y:r.y-o.height};break;case"bottom":p={x:h,y:r.y+r.height};break;case"right":p={x:r.x+r.width,y:g};break;case"left":p={x:r.x-o.width,y:g};break;default:p={x:r.x,y:r.y}}switch(ie(t)){case"start":p[s]-=x*(n&&c?-1:1);break;case"end":p[s]+=x*(n&&c?-1:1);break}return p}const fr=async(e,t,n)=>{const{placement:r="bottom",strategy:o="absolute",middleware:i=[],platform:s}=n,d=i.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:e,floating:t,strategy:o}),{x:h,y:g}=it(c,r,a),x=r,p={},u=0;for(let f=0;f<d.length;f++){const{name:w,fn:b}=d[f],{x:C,y:P,data:v,reset:_}=await b({x:h,y:g,initialPlacement:r,placement:x,strategy:o,middlewareData:p,rects:c,platform:s,elements:{reference:e,floating:t}});h=C??h,g=P??g,p={...p,[w]:{...p[w],...v}},_&&u<=50&&(u++,typeof _=="object"&&(_.placement&&(x=_.placement),_.rects&&(c=_.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:o}):_.rects),{x:h,y:g}=it(c,x,a)),f=-1)}return{x:h,y:g,placement:x,strategy:o,middlewareData:p}};async function le(e,t){var n;t===void 0&&(t={});const{x:r,y:o,platform:i,rects:s,elements:d,strategy:a}=e,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:g="floating",altBoundary:x=!1,padding:p=0}=W(t,e),u=yt(p),w=d[x?g==="floating"?"reference":"floating":g],b=Pe(await i.getClippingRect({element:(n=await(i.isElement==null?void 0:i.isElement(w)))==null||n?w:w.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(d.floating)),boundary:c,rootBoundary:h,strategy:a})),C=g==="floating"?{...s.floating,x:r,y:o}:s.reference,P=await(i.getOffsetParent==null?void 0:i.getOffsetParent(d.floating)),v=await(i.isElement==null?void 0:i.isElement(P))?await(i.getScale==null?void 0:i.getScale(P))||{x:1,y:1}:{x:1,y:1},_=Pe(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:d,rect:C,offsetParent:P,strategy:a}):C);return{top:(b.top-_.top+u.top)/v.y,bottom:(_.bottom-b.bottom+u.bottom)/v.y,left:(b.left-_.left+u.left)/v.x,right:(_.right-b.right+u.right)/v.x}}const ur=e=>({name:"arrow",options:e,async fn(t){const{x:n,y:r,placement:o,rects:i,platform:s,elements:d,middlewareData:a}=t,{element:c,padding:h=0}=W(e,t)||{};if(c==null)return{};const g=yt(h),x={x:n,y:r},p=ze(o),u=Le(p),f=await s.getDimensions(c),w=p==="y",b=w?"top":"left",C=w?"bottom":"right",P=w?"clientHeight":"clientWidth",v=i.reference[u]+i.reference[p]-x[p]-i.floating[u],_=x[p]-i.reference[p],j=await(s.getOffsetParent==null?void 0:s.getOffsetParent(c));let E=j?j[P]:0;(!E||!await(s.isElement==null?void 0:s.isElement(j)))&&(E=d.floating[P]||i.floating[u]);const $=v/2-_/2,T=E/2-f[u]/2-1,D=Z(g[b],T),F=Z(g[C],T),O=D,R=E-f[u]-F,k=E/2-f[u]/2+$,A=Fe(O,k,R),M=!a.arrow&&ie(o)!=null&&k!==A&&i.reference[u]/2-(k<O?D:F)-f[u]/2<0,S=M?k<O?k-O:k-R:0;return{[p]:x[p]+S,data:{[p]:A,centerOffset:k-A-S,...M&&{alignmentOffset:S}},reset:M}}}),pr=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n,r;const{placement:o,middlewareData:i,rects:s,initialPlacement:d,platform:a,elements:c}=t,{mainAxis:h=!0,crossAxis:g=!0,fallbackPlacements:x,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:u="none",flipAlignment:f=!0,...w}=W(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};const b=U(o),C=U(d)===d,P=await(a.isRTL==null?void 0:a.isRTL(c.floating)),v=x||(C||!f?[Ce(d)]:ar(d));!x&&u!=="none"&&v.push(...cr(d,f,u,P));const _=[d,...v],j=await le(t,w),E=[];let $=((r=i.flip)==null?void 0:r.overflows)||[];if(h&&E.push(j[b]),g){const O=sr(o,s,P);E.push(j[O[0]],j[O[1]])}if($=[...$,{placement:o,overflows:E}],!E.every(O=>O<=0)){var T,D;const O=(((T=i.flip)==null?void 0:T.index)||0)+1,R=_[O];if(R)return{data:{index:O,overflows:$},reset:{placement:R}};let k=(D=$.filter(A=>A.overflows[0]<=0).sort((A,M)=>A.overflows[1]-M.overflows[1])[0])==null?void 0:D.placement;if(!k)switch(p){case"bestFit":{var F;const A=(F=$.map(M=>[M.placement,M.overflows.filter(S=>S>0).reduce((S,N)=>S+N,0)]).sort((M,S)=>M[1]-S[1])[0])==null?void 0:F[0];A&&(k=A);break}case"initialPlacement":k=d;break}if(o!==k)return{reset:{placement:k}}}return{}}}};function st(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function at(e){return rr.some(t=>e[t]>=0)}const gr=function(e){return e===void 0&&(e={}),{name:"hide",options:e,async fn(t){const{rects:n}=t,{strategy:r="referenceHidden",...o}=W(e,t);switch(r){case"referenceHidden":{const i=await le(t,{...o,elementContext:"reference"}),s=st(i,n.reference);return{data:{referenceHiddenOffsets:s,referenceHidden:at(s)}}}case"escaped":{const i=await le(t,{...o,altBoundary:!0}),s=st(i,n.floating);return{data:{escapedOffsets:s,escaped:at(s)}}}default:return{}}}}};async function hr(e,t){const{placement:n,platform:r,elements:o}=e,i=await(r.isRTL==null?void 0:r.isRTL(o.floating)),s=U(n),d=ie(n),a=se(n)==="y",c=["left","top"].includes(s)?-1:1,h=i&&a?-1:1,g=W(t,e);let{mainAxis:x,crossAxis:p,alignmentAxis:u}=typeof g=="number"?{mainAxis:g,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...g};return d&&typeof u=="number"&&(p=d==="end"?u*-1:u),a?{x:p*h,y:x*c}:{x:x*c,y:p*h}}const xr=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var n,r;const{x:o,y:i,placement:s,middlewareData:d}=t,a=await hr(t,e);return s===((n=d.offset)==null?void 0:n.placement)&&(r=d.arrow)!=null&&r.alignmentOffset?{}:{x:o+a.x,y:i+a.y,data:{...a,placement:s}}}}},mr=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:r,placement:o}=t,{mainAxis:i=!0,crossAxis:s=!1,limiter:d={fn:w=>{let{x:b,y:C}=w;return{x:b,y:C}}},...a}=W(e,t),c={x:n,y:r},h=await le(t,a),g=se(U(o)),x=Ne(g);let p=c[x],u=c[g];if(i){const w=x==="y"?"top":"left",b=x==="y"?"bottom":"right",C=p+h[w],P=p-h[b];p=Fe(C,p,P)}if(s){const w=g==="y"?"top":"left",b=g==="y"?"bottom":"right",C=u+h[w],P=u-h[b];u=Fe(C,u,P)}const f=d.fn({...t,[x]:p,[g]:u});return{...f,data:{x:f.x-n,y:f.y-r}}}}},wr=function(e){return e===void 0&&(e={}),{options:e,fn(t){const{x:n,y:r,placement:o,rects:i,middlewareData:s}=t,{offset:d=0,mainAxis:a=!0,crossAxis:c=!0}=W(e,t),h={x:n,y:r},g=se(o),x=Ne(g);let p=h[x],u=h[g];const f=W(d,t),w=typeof f=="number"?{mainAxis:f,crossAxis:0}:{mainAxis:0,crossAxis:0,...f};if(a){const P=x==="y"?"height":"width",v=i.reference[x]-i.floating[P]+w.mainAxis,_=i.reference[x]+i.reference[P]-w.mainAxis;p<v?p=v:p>_&&(p=_)}if(c){var b,C;const P=x==="y"?"width":"height",v=["top","left"].includes(U(o)),_=i.reference[g]-i.floating[P]+(v&&((b=s.offset)==null?void 0:b[g])||0)+(v?0:w.crossAxis),j=i.reference[g]+i.reference[P]+(v?0:((C=s.offset)==null?void 0:C[g])||0)-(v?w.crossAxis:0);u<_?u=_:u>j&&(u=j)}return{[x]:p,[g]:u}}}},br=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){const{placement:n,rects:r,platform:o,elements:i}=t,{apply:s=()=>{},...d}=W(e,t),a=await le(t,d),c=U(n),h=ie(n),g=se(n)==="y",{width:x,height:p}=r.floating;let u,f;c==="top"||c==="bottom"?(u=c,f=h===(await(o.isRTL==null?void 0:o.isRTL(i.floating))?"start":"end")?"left":"right"):(f=c,u=h==="end"?"top":"bottom");const w=p-a[u],b=x-a[f],C=!t.middlewareData.shift;let P=w,v=b;if(g){const j=x-a.left-a.right;v=h||C?Z(b,j):j}else{const j=p-a.top-a.bottom;P=h||C?Z(w,j):j}if(C&&!h){const j=L(a.left,0),E=L(a.right,0),$=L(a.top,0),T=L(a.bottom,0);g?v=x-2*(j!==0||E!==0?j+E:L(a.left,a.right)):P=p-2*($!==0||T!==0?$+T:L(a.top,a.bottom))}await s({...t,availableWidth:v,availableHeight:P});const _=await o.getDimensions(i.floating);return x!==_.width||p!==_.height?{reset:{rects:!0}}:{}}}};function K(e){return Ct(e)?(e.nodeName||"").toLowerCase():"#document"}function z(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Y(e){var t;return(t=(Ct(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ct(e){return e instanceof Node||e instanceof z(e).Node}function V(e){return e instanceof Element||e instanceof z(e).Element}function I(e){return e instanceof HTMLElement||e instanceof z(e).HTMLElement}function lt(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof z(e).ShadowRoot}function de(e){const{overflow:t,overflowX:n,overflowY:r,display:o}=H(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&!["inline","contents"].includes(o)}function vr(e){return["table","td","th"].includes(K(e))}function He(e){const t=Ie(),n=H(e);return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!t&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!t&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(n.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(n.contain||"").includes(r))}function yr(e){let t=re(e);for(;I(t)&&!Se(t);){if(He(t))return t;t=re(t)}return null}function Ie(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Se(e){return["html","body","#document"].includes(K(e))}function H(e){return z(e).getComputedStyle(e)}function Re(e){return V(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function re(e){if(K(e)==="html")return e;const t=e.assignedSlot||e.parentNode||lt(e)&&e.host||Y(e);return lt(t)?t.host:t}function Pt(e){const t=re(e);return Se(t)?e.ownerDocument?e.ownerDocument.body:e.body:I(t)&&de(t)?t:Pt(t)}function ce(e,t,n){var r;t===void 0&&(t=[]),n===void 0&&(n=!0);const o=Pt(e),i=o===((r=e.ownerDocument)==null?void 0:r.body),s=z(o);return i?t.concat(s,s.visualViewport||[],de(o)?o:[],s.frameElement&&n?ce(s.frameElement):[]):t.concat(o,ce(o,[],n))}function At(e){const t=H(e);let n=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const o=I(e),i=o?e.offsetWidth:n,s=o?e.offsetHeight:r,d=ye(n)!==i||ye(r)!==s;return d&&(n=i,r=s),{width:n,height:r,$:d}}function Be(e){return V(e)?e:e.contextElement}function ne(e){const t=Be(e);if(!I(t))return q(1);const n=t.getBoundingClientRect(),{width:r,height:o,$:i}=At(t);let s=(i?ye(n.width):n.width)/r,d=(i?ye(n.height):n.height)/o;return(!s||!Number.isFinite(s))&&(s=1),(!d||!Number.isFinite(d))&&(d=1),{x:s,y:d}}const Cr=q(0);function _t(e){const t=z(e);return!Ie()||!t.visualViewport?Cr:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Pr(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==z(e)?!1:t}function Q(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);const o=e.getBoundingClientRect(),i=Be(e);let s=q(1);t&&(r?V(r)&&(s=ne(r)):s=ne(e));const d=Pr(i,n,r)?_t(i):q(0);let a=(o.left+d.x)/s.x,c=(o.top+d.y)/s.y,h=o.width/s.x,g=o.height/s.y;if(i){const x=z(i),p=r&&V(r)?z(r):r;let u=x,f=u.frameElement;for(;f&&r&&p!==u;){const w=ne(f),b=f.getBoundingClientRect(),C=H(f),P=b.left+(f.clientLeft+parseFloat(C.paddingLeft))*w.x,v=b.top+(f.clientTop+parseFloat(C.paddingTop))*w.y;a*=w.x,c*=w.y,h*=w.x,g*=w.y,a+=P,c+=v,u=z(f),f=u.frameElement}}return Pe({width:h,height:g,x:a,y:c})}const Ar=[":popover-open",":modal"];function jt(e){return Ar.some(t=>{try{return e.matches(t)}catch{return!1}})}function _r(e){let{elements:t,rect:n,offsetParent:r,strategy:o}=e;const i=o==="fixed",s=Y(r),d=t?jt(t.floating):!1;if(r===s||d&&i)return n;let a={scrollLeft:0,scrollTop:0},c=q(1);const h=q(0),g=I(r);if((g||!g&&!i)&&((K(r)!=="body"||de(s))&&(a=Re(r)),I(r))){const x=Q(r);c=ne(r),h.x=x.x+r.clientLeft,h.y=x.y+r.clientTop}return{width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-a.scrollLeft*c.x+h.x,y:n.y*c.y-a.scrollTop*c.y+h.y}}function jr(e){return Array.from(e.getClientRects())}function St(e){return Q(Y(e)).left+Re(e).scrollLeft}function Sr(e){const t=Y(e),n=Re(e),r=e.ownerDocument.body,o=L(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),i=L(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-n.scrollLeft+St(e);const d=-n.scrollTop;return H(r).direction==="rtl"&&(s+=L(t.clientWidth,r.clientWidth)-o),{width:o,height:i,x:s,y:d}}function Rr(e,t){const n=z(e),r=Y(e),o=n.visualViewport;let i=r.clientWidth,s=r.clientHeight,d=0,a=0;if(o){i=o.width,s=o.height;const c=Ie();(!c||c&&t==="fixed")&&(d=o.offsetLeft,a=o.offsetTop)}return{width:i,height:s,x:d,y:a}}function kr(e,t){const n=Q(e,!0,t==="fixed"),r=n.top+e.clientTop,o=n.left+e.clientLeft,i=I(e)?ne(e):q(1),s=e.clientWidth*i.x,d=e.clientHeight*i.y,a=o*i.x,c=r*i.y;return{width:s,height:d,x:a,y:c}}function ct(e,t,n){let r;if(t==="viewport")r=Rr(e,n);else if(t==="document")r=Sr(Y(e));else if(V(t))r=kr(t,n);else{const o=_t(e);r={...t,x:t.x-o.x,y:t.y-o.y}}return Pe(r)}function Rt(e,t){const n=re(e);return n===t||!V(n)||Se(n)?!1:H(n).position==="fixed"||Rt(n,t)}function Er(e,t){const n=t.get(e);if(n)return n;let r=ce(e,[],!1).filter(d=>V(d)&&K(d)!=="body"),o=null;const i=H(e).position==="fixed";let s=i?re(e):e;for(;V(s)&&!Se(s);){const d=H(s),a=He(s);!a&&d.position==="fixed"&&(o=null),(i?!a&&!o:!a&&d.position==="static"&&!!o&&["absolute","fixed"].includes(o.position)||de(s)&&!a&&Rt(e,s))?r=r.filter(h=>h!==s):o=d,s=re(s)}return t.set(e,r),r}function Or(e){let{element:t,boundary:n,rootBoundary:r,strategy:o}=e;const s=[...n==="clippingAncestors"?Er(t,this._c):[].concat(n),r],d=s[0],a=s.reduce((c,h)=>{const g=ct(t,h,o);return c.top=L(g.top,c.top),c.right=Z(g.right,c.right),c.bottom=Z(g.bottom,c.bottom),c.left=L(g.left,c.left),c},ct(t,d,o));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Mr(e){const{width:t,height:n}=At(e);return{width:t,height:n}}function $r(e,t,n){const r=I(t),o=Y(t),i=n==="fixed",s=Q(e,!0,i,t);let d={scrollLeft:0,scrollTop:0};const a=q(0);if(r||!r&&!i)if((K(t)!=="body"||de(o))&&(d=Re(t)),r){const g=Q(t,!0,i,t);a.x=g.x+t.clientLeft,a.y=g.y+t.clientTop}else o&&(a.x=St(o));const c=s.left+d.scrollLeft-a.x,h=s.top+d.scrollTop-a.y;return{x:c,y:h,width:s.width,height:s.height}}function dt(e,t){return!I(e)||H(e).position==="fixed"?null:t?t(e):e.offsetParent}function kt(e,t){const n=z(e);if(!I(e)||jt(e))return n;let r=dt(e,t);for(;r&&vr(r)&&H(r).position==="static";)r=dt(r,t);return r&&(K(r)==="html"||K(r)==="body"&&H(r).position==="static"&&!He(r))?n:r||yr(e)||n}const Tr=async function(e){const t=this.getOffsetParent||kt,n=this.getDimensions;return{reference:$r(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await n(e.floating)}}};function Fr(e){return H(e).direction==="rtl"}const Dr={convertOffsetParentRelativeRectToViewportRelativeRect:_r,getDocumentElement:Y,getClippingRect:Or,getOffsetParent:kt,getElementRects:Tr,getClientRects:jr,getDimensions:Mr,getScale:ne,isElement:V,isRTL:Fr};function Nr(e,t){let n=null,r;const o=Y(e);function i(){var d;clearTimeout(r),(d=n)==null||d.disconnect(),n=null}function s(d,a){d===void 0&&(d=!1),a===void 0&&(a=1),i();const{left:c,top:h,width:g,height:x}=e.getBoundingClientRect();if(d||t(),!g||!x)return;const p=we(h),u=we(o.clientWidth-(c+g)),f=we(o.clientHeight-(h+x)),w=we(c),C={rootMargin:-p+"px "+-u+"px "+-f+"px "+-w+"px",threshold:L(0,Z(1,a))||1};let P=!0;function v(_){const j=_[0].intersectionRatio;if(j!==a){if(!P)return s();j?s(!1,j):r=setTimeout(()=>{s(!1,1e-7)},100)}P=!1}try{n=new IntersectionObserver(v,{...C,root:o.ownerDocument})}catch{n=new IntersectionObserver(v,C)}n.observe(e)}return s(!0),i}function Lr(e,t,n,r){r===void 0&&(r={});const{ancestorScroll:o=!0,ancestorResize:i=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:d=typeof IntersectionObserver=="function",animationFrame:a=!1}=r,c=Be(e),h=o||i?[...c?ce(c):[],...ce(t)]:[];h.forEach(b=>{o&&b.addEventListener("scroll",n,{passive:!0}),i&&b.addEventListener("resize",n)});const g=c&&d?Nr(c,n):null;let x=-1,p=null;s&&(p=new ResizeObserver(b=>{let[C]=b;C&&C.target===c&&p&&(p.unobserve(t),cancelAnimationFrame(x),x=requestAnimationFrame(()=>{var P;(P=p)==null||P.observe(t)})),n()}),c&&!a&&p.observe(c),p.observe(t));let u,f=a?Q(e):null;a&&w();function w(){const b=Q(e);f&&(b.x!==f.x||b.y!==f.y||b.width!==f.width||b.height!==f.height)&&n(),f=b,u=requestAnimationFrame(w)}return n(),()=>{var b;h.forEach(C=>{o&&C.removeEventListener("scroll",n),i&&C.removeEventListener("resize",n)}),g==null||g(),(b=p)==null||b.disconnect(),p=null,a&&cancelAnimationFrame(u)}}const zr=mr,Hr=pr,Ir=br,Br=gr,ft=ur,Wr=wr,Ur=(e,t,n)=>{const r=new Map,o={platform:Dr,...n},i={...o.platform,_c:r};return fr(e,t,{...o,platform:i})},Vr=e=>{function t(n){return{}.hasOwnProperty.call(n,"current")}return{name:"arrow",options:e,fn(n){const{element:r,padding:o}=typeof e=="function"?e(n):e;return r&&t(r)?r.current!=null?ft({element:r.current,padding:o}).fn(n):{}:r?ft({element:r,padding:o}).fn(n):{}}}};var be=typeof document<"u"?m.useLayoutEffect:m.useEffect;function Ae(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(typeof e=="function"&&e.toString()===t.toString())return!0;let n,r,o;if(e&&t&&typeof e=="object"){if(Array.isArray(e)){if(n=e.length,n!==t.length)return!1;for(r=n;r--!==0;)if(!Ae(e[r],t[r]))return!1;return!0}if(o=Object.keys(e),n=o.length,n!==Object.keys(t).length)return!1;for(r=n;r--!==0;)if(!{}.hasOwnProperty.call(t,o[r]))return!1;for(r=n;r--!==0;){const i=o[r];if(!(i==="_owner"&&e.$$typeof)&&!Ae(e[i],t[i]))return!1}return!0}return e!==e&&t!==t}function Et(e){return typeof window>"u"?1:(e.ownerDocument.defaultView||window).devicePixelRatio||1}function ut(e,t){const n=Et(e);return Math.round(t*n)/n}function pt(e){const t=m.useRef(e);return be(()=>{t.current=e}),t}function Yr(e){e===void 0&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:r=[],platform:o,elements:{reference:i,floating:s}={},transform:d=!0,whileElementsMounted:a,open:c}=e,[h,g]=m.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:!1}),[x,p]=m.useState(r);Ae(x,r)||p(r);const[u,f]=m.useState(null),[w,b]=m.useState(null),C=m.useCallback(S=>{S!==j.current&&(j.current=S,f(S))},[]),P=m.useCallback(S=>{S!==E.current&&(E.current=S,b(S))},[]),v=i||u,_=s||w,j=m.useRef(null),E=m.useRef(null),$=m.useRef(h),T=a!=null,D=pt(a),F=pt(o),O=m.useCallback(()=>{if(!j.current||!E.current)return;const S={placement:t,strategy:n,middleware:x};F.current&&(S.platform=F.current),Ur(j.current,E.current,S).then(N=>{const B={...N,isPositioned:!0};R.current&&!Ae($.current,B)&&($.current=B,mn.flushSync(()=>{g(B)}))})},[x,t,n,F]);be(()=>{c===!1&&$.current.isPositioned&&($.current.isPositioned=!1,g(S=>({...S,isPositioned:!1})))},[c]);const R=m.useRef(!1);be(()=>(R.current=!0,()=>{R.current=!1}),[]),be(()=>{if(v&&(j.current=v),_&&(E.current=_),v&&_){if(D.current)return D.current(v,_,O);O()}},[v,_,O,D,T]);const k=m.useMemo(()=>({reference:j,floating:E,setReference:C,setFloating:P}),[C,P]),A=m.useMemo(()=>({reference:v,floating:_}),[v,_]),M=m.useMemo(()=>{const S={position:n,left:0,top:0};if(!A.floating)return S;const N=ut(A.floating,h.x),B=ut(A.floating,h.y);return d?{...S,transform:"translate("+N+"px, "+B+"px)",...Et(A.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:N,top:B}},[n,d,A.floating,h.x,h.y]);return m.useMemo(()=>({...h,update:O,refs:k,elements:A,floatingStyles:M}),[h,O,k,A,M])}var Gr="Arrow",Ot=m.forwardRef((e,t)=>{const{children:n,width:r=10,height:o=5,...i}=e;return l.jsx(ee.svg,{...i,ref:t,width:r,height:o,viewBox:"0 0 30 10",preserveAspectRatio:"none",children:e.asChild?n:l.jsx("polygon",{points:"0,0 30,0 15,10"})})});Ot.displayName=Gr;var Xr=Ot;function Zr(e){const[t,n]=m.useState(void 0);return Oe(()=>{if(e){n({width:e.offsetWidth,height:e.offsetHeight});const r=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const i=o[0];let s,d;if("borderBoxSize"in i){const a=i.borderBoxSize,c=Array.isArray(a)?a[0]:a;s=c.inlineSize,d=c.blockSize}else s=e.offsetWidth,d=e.offsetHeight;n({width:s,height:d})});return r.observe(e,{box:"border-box"}),()=>r.unobserve(e)}else n(void 0)},[e]),t}var We="Popper",[Mt,$t]=ht(We),[qr,Tt]=Mt(We),Ft=e=>{const{__scopePopper:t,children:n}=e,[r,o]=m.useState(null);return l.jsx(qr,{scope:t,anchor:r,onAnchorChange:o,children:n})};Ft.displayName=We;var Dt="PopperAnchor",Nt=m.forwardRef((e,t)=>{const{__scopePopper:n,virtualRef:r,...o}=e,i=Tt(Dt,n),s=m.useRef(null),d=_e(t,s),a=m.useRef(null);return m.useEffect(()=>{const c=a.current;a.current=(r==null?void 0:r.current)||s.current,c!==a.current&&i.onAnchorChange(a.current)}),r?null:l.jsx(ee.div,{...o,ref:d})});Nt.displayName=Dt;var Ue="PopperContent",[Kr,Jr]=Mt(Ue),Lt=m.forwardRef((e,t)=>{var Ye,Ge,Xe,Ze,qe,Ke;const{__scopePopper:n,side:r="bottom",sideOffset:o=0,align:i="center",alignOffset:s=0,arrowPadding:d=0,avoidCollisions:a=!0,collisionBoundary:c=[],collisionPadding:h=0,sticky:g="partial",hideWhenDetached:x=!1,updatePositionStrategy:p="optimized",onPlaced:u,...f}=e,w=Tt(Ue,n),[b,C]=m.useState(null),P=_e(t,ae=>C(ae)),[v,_]=m.useState(null),j=Zr(v),E=(j==null?void 0:j.width)??0,$=(j==null?void 0:j.height)??0,T=r+(i!=="center"?"-"+i:""),D=typeof h=="number"?h:{top:0,right:0,bottom:0,left:0,...h},F=Array.isArray(c)?c:[c],O=F.length>0,R={padding:D,boundary:F.filter(eo),altBoundary:O},{refs:k,floatingStyles:A,placement:M,isPositioned:S,middlewareData:N}=Yr({strategy:"fixed",placement:T,whileElementsMounted:(...ae)=>Lr(...ae,{animationFrame:p==="always"}),elements:{reference:w.anchor},middleware:[xr({mainAxis:o+$,alignmentAxis:s}),a&&zr({mainAxis:!0,crossAxis:!1,limiter:g==="partial"?Wr():void 0,...R}),a&&Hr({...R}),Ir({...R,apply:({elements:ae,rects:Je,availableWidth:pn,availableHeight:gn})=>{const{width:hn,height:xn}=Je.reference,pe=ae.floating.style;pe.setProperty("--radix-popper-available-width",`${pn}px`),pe.setProperty("--radix-popper-available-height",`${gn}px`),pe.setProperty("--radix-popper-anchor-width",`${hn}px`),pe.setProperty("--radix-popper-anchor-height",`${xn}px`)}}),v&&Vr({element:v,padding:d}),to({arrowWidth:E,arrowHeight:$}),x&&Br({strategy:"referenceHidden",...R})]}),[B,an]=It(M),ue=wn(u);Oe(()=>{S&&(ue==null||ue())},[S,ue]);const ln=(Ye=N.arrow)==null?void 0:Ye.x,cn=(Ge=N.arrow)==null?void 0:Ge.y,dn=((Xe=N.arrow)==null?void 0:Xe.centerOffset)!==0,[fn,un]=m.useState();return Oe(()=>{b&&un(window.getComputedStyle(b).zIndex)},[b]),l.jsx("div",{ref:k.setFloating,"data-radix-popper-content-wrapper":"",style:{...A,transform:S?A.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:fn,"--radix-popper-transform-origin":[(Ze=N.transformOrigin)==null?void 0:Ze.x,(qe=N.transformOrigin)==null?void 0:qe.y].join(" "),...((Ke=N.hide)==null?void 0:Ke.referenceHidden)&&{visibility:"hidden",pointerEvents:"none"}},dir:e.dir,children:l.jsx(Kr,{scope:n,placedSide:B,onArrowChange:_,arrowX:ln,arrowY:cn,shouldHideArrow:dn,children:l.jsx(ee.div,{"data-side":B,"data-align":an,...f,ref:P,style:{...f.style,animation:S?void 0:"none"}})})})});Lt.displayName=Ue;var zt="PopperArrow",Qr={top:"bottom",right:"left",bottom:"top",left:"right"},Ht=m.forwardRef(function(t,n){const{__scopePopper:r,...o}=t,i=Jr(zt,r),s=Qr[i.placedSide];return l.jsx("span",{ref:i.onArrowChange,style:{position:"absolute",left:i.arrowX,top:i.arrowY,[s]:0,transformOrigin:{top:"",right:"0 0",bottom:"center 0",left:"100% 0"}[i.placedSide],transform:{top:"translateY(100%)",right:"translateY(50%) rotate(90deg) translateX(-50%)",bottom:"rotate(180deg)",left:"translateY(50%) rotate(-90deg) translateX(50%)"}[i.placedSide],visibility:i.shouldHideArrow?"hidden":void 0},children:l.jsx(Xr,{...o,ref:n,style:{...o.style,display:"block"}})})});Ht.displayName=zt;function eo(e){return e!==null}var to=e=>({name:"transformOrigin",options:e,fn(t){var w,b,C;const{placement:n,rects:r,middlewareData:o}=t,s=((w=o.arrow)==null?void 0:w.centerOffset)!==0,d=s?0:e.arrowWidth,a=s?0:e.arrowHeight,[c,h]=It(n),g={start:"0%",center:"50%",end:"100%"}[h],x=(((b=o.arrow)==null?void 0:b.x)??0)+d/2,p=(((C=o.arrow)==null?void 0:C.y)??0)+a/2;let u="",f="";return c==="bottom"?(u=s?g:`${x}px`,f=`${-a}px`):c==="top"?(u=s?g:`${x}px`,f=`${r.floating.height+a}px`):c==="right"?(u=`${-a}px`,f=s?g:`${p}px`):c==="left"&&(u=`${r.floating.width+a}px`,f=s?g:`${p}px`),{data:{x:u,y:f}}}});function It(e){const[t,n="center"]=e.split("-");return[t,n]}var no=Ft,Bt=Nt,ro=Lt,oo=Ht,ke="Popover",[Wt,Wo]=ht(ke,[$t]),fe=$t(),[io,J]=Wt(ke),Ut=e=>{const{__scopePopover:t,children:n,open:r,defaultOpen:o,onOpenChange:i,modal:s=!1}=e,d=fe(t),a=m.useRef(null),[c,h]=m.useState(!1),[g,x]=xt({prop:r,defaultProp:o??!1,onChange:i,caller:ke});return l.jsx(no,{...d,children:l.jsx(io,{scope:t,contentId:bn(),triggerRef:a,open:g,onOpenChange:x,onOpenToggle:m.useCallback(()=>x(p=>!p),[x]),hasCustomAnchor:c,onCustomAnchorAdd:m.useCallback(()=>h(!0),[]),onCustomAnchorRemove:m.useCallback(()=>h(!1),[]),modal:s,children:n})})};Ut.displayName=ke;var Vt="PopoverAnchor",so=m.forwardRef((e,t)=>{const{__scopePopover:n,...r}=e,o=J(Vt,n),i=fe(n),{onCustomAnchorAdd:s,onCustomAnchorRemove:d}=o;return m.useEffect(()=>(s(),()=>d()),[s,d]),l.jsx(Bt,{...i,...r,ref:t})});so.displayName=Vt;var Yt="PopoverTrigger",Gt=m.forwardRef((e,t)=>{const{__scopePopover:n,...r}=e,o=J(Yt,n),i=fe(n),s=_e(t,o.triggerRef),d=l.jsx(ee.button,{type:"button","aria-haspopup":"dialog","aria-expanded":o.open,"aria-controls":o.contentId,"data-state":en(o.open),...r,ref:s,onClick:te(e.onClick,o.onOpenToggle)});return o.hasCustomAnchor?d:l.jsx(Bt,{asChild:!0,...i,children:d})});Gt.displayName=Yt;var Ve="PopoverPortal",[ao,lo]=Wt(Ve,{forceMount:void 0}),Xt=e=>{const{__scopePopover:t,forceMount:n,children:r,container:o}=e,i=J(Ve,t);return l.jsx(ao,{scope:t,forceMount:n,children:l.jsx(mt,{present:n||i.open,children:l.jsx(vn,{asChild:!0,container:o,children:r})})})};Xt.displayName=Ve;var oe="PopoverContent",Zt=m.forwardRef((e,t)=>{const n=lo(oe,e.__scopePopover),{forceMount:r=n.forceMount,...o}=e,i=J(oe,e.__scopePopover);return l.jsx(mt,{present:r||i.open,children:i.modal?l.jsx(fo,{...o,ref:t}):l.jsx(uo,{...o,ref:t})})});Zt.displayName=oe;var co=Pn("PopoverContent.RemoveScroll"),fo=m.forwardRef((e,t)=>{const n=J(oe,e.__scopePopover),r=m.useRef(null),o=_e(t,r),i=m.useRef(!1);return m.useEffect(()=>{const s=r.current;if(s)return yn(s)},[]),l.jsx(Cn,{as:co,allowPinchZoom:!0,children:l.jsx(qt,{...e,ref:o,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:te(e.onCloseAutoFocus,s=>{var d;s.preventDefault(),i.current||(d=n.triggerRef.current)==null||d.focus()}),onPointerDownOutside:te(e.onPointerDownOutside,s=>{const d=s.detail.originalEvent,a=d.button===0&&d.ctrlKey===!0,c=d.button===2||a;i.current=c},{checkForDefaultPrevented:!1}),onFocusOutside:te(e.onFocusOutside,s=>s.preventDefault(),{checkForDefaultPrevented:!1})})})}),uo=m.forwardRef((e,t)=>{const n=J(oe,e.__scopePopover),r=m.useRef(!1),o=m.useRef(!1);return l.jsx(qt,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:i=>{var s,d;(s=e.onCloseAutoFocus)==null||s.call(e,i),i.defaultPrevented||(r.current||(d=n.triggerRef.current)==null||d.focus(),i.preventDefault()),r.current=!1,o.current=!1},onInteractOutside:i=>{var a,c;(a=e.onInteractOutside)==null||a.call(e,i),i.defaultPrevented||(r.current=!0,i.detail.originalEvent.type==="pointerdown"&&(o.current=!0));const s=i.target;((c=n.triggerRef.current)==null?void 0:c.contains(s))&&i.preventDefault(),i.detail.originalEvent.type==="focusin"&&o.current&&i.preventDefault()}})}),qt=m.forwardRef((e,t)=>{const{__scopePopover:n,trapFocus:r,onOpenAutoFocus:o,onCloseAutoFocus:i,disableOutsidePointerEvents:s,onEscapeKeyDown:d,onPointerDownOutside:a,onFocusOutside:c,onInteractOutside:h,...g}=e,x=J(oe,n),p=fe(n);return An(),l.jsx(_n,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:o,onUnmountAutoFocus:i,children:l.jsx(jn,{asChild:!0,disableOutsidePointerEvents:s,onInteractOutside:h,onEscapeKeyDown:d,onPointerDownOutside:a,onFocusOutside:c,onDismiss:()=>x.onOpenChange(!1),children:l.jsx(ro,{"data-state":en(x.open),role:"dialog",id:x.contentId,...p,...g,ref:t,style:{...g.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),Kt="PopoverClose",Jt=m.forwardRef((e,t)=>{const{__scopePopover:n,...r}=e,o=J(Kt,n);return l.jsx(ee.button,{type:"button",...r,ref:t,onClick:te(e.onClick,()=>o.onOpenChange(!1))})});Jt.displayName=Kt;var po="PopoverArrow",Qt=m.forwardRef((e,t)=>{const{__scopePopover:n,...r}=e,o=fe(n);return l.jsx(oo,{...o,...r,ref:t})});Qt.displayName=po;function en(e){return e?"open":"closed"}var go=Ut,ho=Gt,xo=Xt,mo=Zt,wo=Jt,bo=Qt,vo="Separator",gt="horizontal",yo=["horizontal","vertical"],tn=m.forwardRef((e,t)=>{const{decorative:n,orientation:r=gt,...o}=e,i=Co(r)?r:gt,d=n?{role:"none"}:{"aria-orientation":i==="vertical"?i:void 0,role:"separator"};return l.jsx(ee.div,{"data-orientation":i,...d,...o,ref:t})});tn.displayName=vo;function Co(e){return yo.includes(e)}const ve=y.button`
    border-radius: 100%;
    height: 2rem;
    width: 2rem;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.4);

    &:hover, &:focus {
        background-color: rgba(0, 0, 0, 0.1);
    }


    & > svg {
        margin-left: 1px;
        margin-top: 1px;
    }
`,Po=y(mo)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 6px;
    padding: 15px;
    width: 250px;
    background-color: white;
    box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
    border: 1px solid black;
    margin-left: 10px;
    z-index: 9999;
`,Ao=y.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`,_o=y(tn)`
    height: 1px;
    width: 100%;
    background-color: black;
`,nn=y.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    padding: 0.5rem 0.5rem;
    border-radius: 5px;
    border: 1px solid black;
    width: fit-content;
    text-wrap: nowrap;
    cursor: pointer;
    font-family: Montserrat;
    font-size: 0.9rem;
    font-weight: 500;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
        
    &[data-state="active"] {
        border: 1px solid #91dfeb;
        background-color: #edfdff;
        color: #007185;
        font-weight: bold;  
        cursor: default;          
    }
`,rn=y.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
    aspect-ratio: 1;
    cursor: pointer;
    font-weight: bold;
`,jo=y.div`
    font-weight: bold;
    font-size: 1rem;
    font-family: Montserrat;
`,So=y(wo)`
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 100%;
    height: 25px;
    width: 25px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: black;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

`,Ro=y.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`,ko=({filters:e,activeFilters:t,handleDeleteFilter:n,handleFilterClick:r})=>l.jsxs(go,{children:[l.jsx(ho,{asChild:!0,children:l.jsx(ve,{"aria-label":"Customise options",children:l.jsx(Sn,{})})}),l.jsx(xo,{children:l.jsxs(Po,{children:[e.map((o,i)=>l.jsxs(Ao,{children:[l.jsx(jo,{children:o.name}),l.jsx(_o,{orientation:"horizontal"}),l.jsx(Ro,{children:o.value.map((s,d)=>{const a=t.includes(s);return l.jsxs(nn,{onClick:()=>r(s),"data-state":a?"active":void 0,children:[a&&l.jsx(rn,{onClick:c=>n(c,s),children:l.jsx(Me,{})}),s]},d)})})]},i)),l.jsx(So,{asChild:!0,children:l.jsx(Me,{})}),l.jsx(bo,{})]})})]});var on="Toggle",sn=m.forwardRef((e,t)=>{const{pressed:n,defaultPressed:r,onPressedChange:o,...i}=e,[s,d]=xt({prop:n,onChange:o,defaultProp:r??!1,caller:on});return l.jsx(ee.button,{type:"button","aria-pressed":s,"data-state":s?"on":"off","data-disabled":e.disabled?"":void 0,...i,ref:t,onClick:te(e.onClick,()=>{e.disabled||d(!s)})})});sn.displayName=on;const Eo=y.div`
    grid-area: tools;
    display: flex;
    padding: 0.5rem;
    padding-bottom: 1rem;
    gap: 10px;
`,Oo=y.div`
    display: flex;
    gap: 5px;
    align-items: center;
    overflow-x: scroll;
    padding-bottom: 5px;
    font-size: 1rem;
    font-family: Montserrat;
    font-weight: 600;

    &::-webkit-scrollbar {
        height: 0px;
        background: transparent;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }

    &::-webkit-scrollbar-thumb {
        background: #999; 
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

`,Mo=({highlightFailed:e,setHighlightFailed:t,activeFilters:n,setActiveFilters:r})=>{const{user:o}=Rn(),i=u=>{var f,w;return((f=o==null?void 0:o.permissions)==null?void 0:f.includes(u))||((w=o==null?void 0:o.permissions)==null?void 0:w.includes(ge.IS_SUPERUSER))},s=kn(),d=()=>{s("/myforge/usages")},a=()=>{s("/myforge/fail")},[c,h]=En.useState([]);m.useEffect(()=>{const u=document.getElementById("active-filters");return u==null||u.addEventListener("wheel",function(f){f.preventDefault(),u.scrollBy({top:0,left:f.deltaY,behavior:"smooth"})}),()=>{u==null||u.removeEventListener("wheel",()=>{})}},[]),m.useEffect(()=>((async()=>{try{const[f]=await Promise.all([je.getPublic("machinestatus")]);if(f.groups){const w=f.groups.map(b=>({id:b.machines[0].group_id,name:b.name}));h(w)}}catch(f){console.error("Error fetching filter data:",f)}})(),()=>{}),[]);const g=[{name:"Machine Group",value:c.map(u=>u.name)||[]},{name:"Status",value:["In Progress","Completed","Available","Failed","Maintenance"]}],x=u=>{n.includes(u)||r(f=>[...f,u])},p=(u,f)=>{u.stopPropagation(),r(w=>w.filter(b=>b!==f))};return l.jsxs(Eo,{children:[i(ge.CAN_EDIT_MACHINES)&&l.jsx(ve,{"aria-label":"Edit",onClick:d,children:l.jsx(On,{})}),i(ge.CAN_FAIL_MACHINES)&&l.jsx(ve,{"aria-label":"Fail",onClick:a,children:l.jsx(Mn,{})}),i(ge.CAN_CLEAR_MACHINES)&&l.jsx(ve,{"aria-label":"Clear",children:l.jsx(sn,{pressed:e,onPressedChange:t,asChild:!0,children:l.jsx("div",{children:l.jsx($n,{})})})}),l.jsx(ko,{filters:g,activeFilters:n,handleDeleteFilter:p,handleFilterClick:x}),n.length!==0&&l.jsxs(Oo,{id:"active-filters",children:["Filters:",n.map((u,f)=>l.jsxs(nn,{"data-state":"active",children:[l.jsx(rn,{onClick:w=>p(w,u),children:l.jsx(Me,{})}),u]},f))]})]})},$o="https://www.figma.com/api/mcp/asset/aff3de3c-e4e6-42fe-ba0d-f29b38e0e322",To={bgGrad:"#e0e7f0"},Fo=y.div`
  position: relative;
  min-height: calc(100vh - 74px);
  background: linear-gradient(to bottom, #ffffff 0%, ${To.bgGrad} 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${Tn});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
  }
`,Do=y.div`
  position: absolute;
  left: -1px;
  top: 0;
  width: 70px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    width: 5000px;
    height: 70px;
    left: calc(50% - 2500px);
    top: -2535px;
    transform: rotate(-90deg) scaleY(-1);
    transform-origin: center center;
    background-image: url(${$o});
    background-size: 750px 70px;
    background-repeat: repeat-x;
    background-position: 0 0;
  }
`,No=y.div`
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
`,Lo=y.div`
  grid-area: status;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
  overflow-y: auto;
  padding-bottom: 1rem;

  /* subtle scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 4px; }
`,zo=y.div`
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
`,Uo=()=>{const[e,t]=m.useState([]),[n,r]=m.useState(!1),[o,i]=m.useState([]);m.useEffect(()=>{const a=async()=>{try{const g=await je.getPublic("machinestatus"),x=[...g.groups.map(f=>({id:f.machines[0].group_id,name:f.name}))],u=[...g.loners,...g.groups.flatMap(f=>f.machines)].map(f=>{var w;return{...f,group_id:f.group_id,group:f.group_id?((w=x.find(b=>b.id===String(f.group_id)))==null?void 0:w.name)??"Unknown Group":"No Group",type_id:f.type_id,type:"Unknown Type",id:f.id,name:f.name,in_use:f.in_use,usage_start:f.usage_start?new Date(f.usage_start):void 0,usage_duration:f.usage_duration,user:f.user_name??f.user_id,maintenance_mode:f.maintenance_mode,disabled:f.disabled,failed:f.failed,failed_at:f.failed_at?new Date(f.failed_at):void 0,percent_completed:f.percent_completed}});t(u)}catch(h){console.error("Error fetching machines:",h)}};a();const c=setInterval(a,1e4);return()=>clearInterval(c)},[]);const s=["In Progress","Completed","Available","Failed","Maintenance"],d=e.filter(a=>{if(o.length===0)return!0;const c=o.filter(p=>s.includes(p)),h=o.filter(p=>!s.includes(p));let g=!0;if(c.length>0){const p=Te(a.usage_start,a.usage_duration);g=c.some(u=>{switch(u){case"In Progress":return p<100&&p>0;case"Completed":return p===100;case"Available":return!a.in_use&&!a.failed&&!a.maintenance_mode;case"Failed":return a.failed;case"Maintenance":return a.maintenance_mode;default:return!0}})}const x=h.length===0||h.every(p=>p===a.type||p===a.group);return g&&x});return l.jsx(Fn,{children:l.jsxs(Fo,{children:[l.jsx(Do,{}),l.jsxs(No,{children:[l.jsx(Mo,{highlightFailed:n,setHighlightFailed:r,activeFilters:o,setActiveFilters:i}),l.jsx(Lo,{children:d.map((a,c)=>l.jsx(vt,{id:a.id,name:a.name,in_use:a.in_use,usage_start:a.usage_start,usage_duration:a.usage_duration,user:a.user,maintenance_mode:a.maintenance_mode,disabled:a.disabled,failed:a.failed,failed_at:a.failed_at,machine:a,$highlightFailed:n,$minimized:!0},`${a.name}-${c}`))}),l.jsxs(zo,{children:[l.jsx(nr,{}),l.jsx(Kn,{})]})]})]})})};export{Uo as Status,Uo as default};
