import{p as v,r as g,j as e,u as n}from"./index-BvyJdg8B.js";import{b as j}from"./background-_MUij_O6.js";const k="https://www.figma.com/api/mcp/asset/e8a3284e-3457-4355-bbdf-65163140905b",C="https://www.figma.com/api/mcp/asset/bba8fd43-c457-48c7-9661-f9b17452f667",i={navy:"#111c36",red:"#a51c1c",white:"#ffffff"},S=n.div`
    position: relative;
    width: 100%;
    min-height: calc(100vh - 74px);
    background: linear-gradient(to right, ${i.red} 0%, #2d4a80 100%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
`,F=n.img`
    position: absolute;
    left: 4%;
    top: 50%;
    transform: translateY(-50%);
    height: 90%;
    max-height: 816px;
    width: auto;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
`,R=n.div`
    position: absolute;
    left: -1px;
    top: 0;
    width: 70px;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;

    &::after {
        content: '';
        position: absolute;
        width: 5000px;
        height: 70px;
        left: calc(50% - 2500px);
        top: -2535px;
        transform: rotate(-90deg) scaleY(-1);
        transform-origin: center center;
        background-image: url(${C});
        background-size: 750px 70px;
        background-repeat: repeat-x;
        background-position: 0 0;
    }
`,$=n.div`
    position: relative;
    z-index: 2;
    background: ${i.white};
    border: 4px solid ${i.navy};
    border-radius: 10px;
    width: clamp(320px, 38vw, 552px);
    padding: 0 0 20px 0;
    margin-right: clamp(24px, 6vw, 96px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 32px rgba(17,28,54,0.25);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${j});
        background-repeat: repeat;
        background-size: 122px 140px;
        opacity: 0.05;
        pointer-events: none;
        z-index: 0;
    }

    @media screen and (max-width: 700px) {
        width: calc(100% - 48px);
        margin-right: 24px;
        margin-left: 24px;
    }
`,E=n.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`,z=n.h1`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(20px, 2.5vw, 30px);
    font-weight: 700;
    color: ${i.navy};
    text-align: center;
    margin: 20px 0 14px 0;
`,h=n.div`
    width: calc(100% - 40px);
    height: 2px;
    background: ${i.navy};
    flex-shrink: 0;
`,I=n.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    width: calc(100% - 40px);
    padding: 12px 0 8px 0;
`,c=n.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 5px 10px;
    width: 100%;
    justify-content: flex-end;
`,l=n.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(13px, 1.4vw, 20px);
    font-weight: 700;
    color: #000;
    white-space: nowrap;
    flex-shrink: 0;
`,d=n.input`
    height: 30px;
    width: clamp(130px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${i.white};
    padding: 4px 8px;
    font-size: 13px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;
    box-sizing: border-box;

    &:focus {
        border-color: ${i.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }
`,D=n.select`
    height: 30px;
    width: clamp(130px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${i.white};
    padding: 4px 8px;
    font-size: 13px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        border-color: ${i.navy};
    }
`,P=n.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    width: calc(100% - 40px);
    padding: 8px 10px 4px 10px;
`,u=n.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 7px 0;
    width: 100%;
`,m=n.input`
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${i.navy};
    border: 2px solid #000;
    border-radius: 4px;
`,f=n.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(11px, 1.1vw, 14px);
    font-weight: 700;
    color: #000;
    cursor: pointer;
    line-height: 1.3;
`,A=n.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 4px 20px;
    min-height: 18px;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    color: ${({$type:p})=>p==="error"?"#a51c1c":p==="success"?"#1d7a48":"transparent"};
`,N=n.button`
    height: clamp(54px, 6vw, 72px);
    width: calc(100% - 40px);
    background: ${i.red};
    border: 2px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(18px, 2.2vw, 30px);
    font-weight: 700;
    color: ${i.white};
    cursor: pointer;
    margin-top: 4px;
    transition: background 0.15s ease, transform 0.1s ease;

    &:hover {
        background: #8a1515;
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(0);
    }
`,M=["Aeronautical Engineering","Architecture","Biological Sciences","Biomedical Engineering","Chemical Engineering","Chemistry","Civil Engineering","Cognitive Science","Communication","Computer Science","Computer Systems Engineering","Design, Innovation & Society","Economics","Electrical Engineering","Electronic Media, Arts & Communication","Environmental Engineering","Games & Simulation Arts & Sciences","Geology","Hydrogeology","Industrial & Management Engineering","Information Technology & Web Science","Interdisciplinary Science","Materials Engineering","Mathematics","Mechanical Engineering","Nuclear Engineering","Philosophy","Physics","Psychology","Science, Technology & Society","Undecided"];function L(){const p=v(),[t,w]=g.useState({"first-name":"","last-name":"",rcsid:"",rin:"",major:"",password:"","confirm-password":"",graduating:!1,"bursar-acknowledgement":!1}),[x,a]=g.useState({text:"",type:""}),s=(r,o)=>w(b=>({...b,[r]:o})),y=async r=>{if(r.preventDefault(),!/^\d{9}$/.test(t.rin)){a({text:"RIN must be 9 digits",type:"error"});return}if(!/^662\d{6}$/.test(t.rin)){a({text:"RIN must start with 662",type:"error"});return}if(/[^a-zA-Z0-9]/.test(t.rcsid)){a({text:"RCS ID must not contain special characters",type:"error"});return}if(!t["first-name"]||!t["last-name"]){a({text:"First and last name cannot be empty",type:"error"});return}if(t.password!==t["confirm-password"]){a({text:"Passwords do not match",type:"error"});return}if(t.password.length<5){a({text:"Password must be at least 5 characters",type:"error"});return}if(!t.major||t.major==="Select a major"){a({text:"Please select a major",type:"error"});return}if(!t["bursar-acknowledgement"]){a({text:"Please acknowledge the bursar charge",type:"error"});return}try{const o=await fetch("http://localhost:3000/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({RCSID:t.rcsid,RIN:t.rin,first_name:t["first-name"],last_name:t["last-name"],major:t.major,gender_identity:"notdisclosed",pronouns:"not_shown",password:t.password})});o.ok?(a({text:"Registration successful! Redirecting…",type:"success"}),setTimeout(()=>p("/login"),1200)):a({text:`Registration failed: ${o.status} ${o.statusText}`,type:"error"})}catch(o){a({text:`Error: ${o}`,type:"error"})}};return e.jsxs(S,{children:[e.jsx(F,{src:k,alt:""}),e.jsx(R,{}),e.jsx($,{children:e.jsx(E,{children:e.jsxs("form",{onSubmit:y,style:{width:"100%",display:"contents"},children:[e.jsx(z,{children:"Registration Form"}),e.jsx(h,{}),e.jsxs(I,{children:[e.jsxs(c,{children:[e.jsx(l,{htmlFor:"first-name",children:"First Name"}),e.jsx(d,{id:"first-name",type:"text",value:t["first-name"],onChange:r=>s("first-name",r.target.value),required:!0})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"last-name",children:"Last Name"}),e.jsx(d,{id:"last-name",type:"text",value:t["last-name"],onChange:r=>s("last-name",r.target.value),required:!0})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"rcsid",children:"RCS ID"}),e.jsx(d,{id:"rcsid",type:"text",value:t.rcsid,onChange:r=>s("rcsid",r.target.value),required:!0})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"rin",children:"RIN"}),e.jsx(d,{id:"rin",type:"text",value:t.rin,onChange:r=>s("rin",r.target.value),required:!0})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"major",children:"Major"}),e.jsxs(D,{id:"major",value:t.major,onChange:r=>s("major",r.target.value),required:!0,children:[e.jsx("option",{value:"",disabled:!0,hidden:!0,children:"Select a major"}),M.map(r=>e.jsx("option",{value:r,children:r},r))]})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"password",children:"Password"}),e.jsx(d,{id:"password",type:"password",value:t.password,onChange:r=>s("password",r.target.value),required:!0})]}),e.jsxs(c,{children:[e.jsx(l,{htmlFor:"confirm-password",children:"Confirm Password"}),e.jsx(d,{id:"confirm-password",type:"password",value:t["confirm-password"],onChange:r=>s("confirm-password",r.target.value),required:!0})]})]}),e.jsx(h,{}),e.jsxs(P,{children:[e.jsxs(u,{children:[e.jsx(m,{id:"graduating",type:"checkbox",checked:t.graduating,onChange:r=>s("graduating",r.target.checked)}),e.jsx(f,{htmlFor:"graduating",children:"Are you graduating this semester?"})]}),e.jsxs(u,{children:[e.jsx(m,{id:"bursar-acknowledgement",type:"checkbox",checked:t["bursar-acknowledgement"],onChange:r=>s("bursar-acknowledgement",r.target.checked)}),e.jsx(f,{htmlFor:"bursar-acknowledgement",children:"I acknowledge that $15 will be charged to my bursar account."})]})]}),e.jsx(A,{$type:x.type,children:x.text||" "}),e.jsx(N,{type:"submit",children:"Start Making!"})]})})})]})}export{L as default};
