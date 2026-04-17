import{r as p,o as j,p as D,j as e,A as c,u as t}from"./index-BvyJdg8B.js";import{b as F}from"./background-_MUij_O6.js";const $="https://www.figma.com/api/mcp/asset/0ca5af14-4911-42d6-b056-db8c2c2dec01",z="https://www.figma.com/api/mcp/asset/c39237df-01e0-4113-8117-8aff7f16b4bb",n={navy:"#111c36",red:"#a51c1c",white:"#ffffff"},L=t.div`
    position: relative;
    width: 100%;
    min-height: calc(100vh - 74px);
    background: linear-gradient(to right, ${n.red} 0%, #2d4a80 100%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
`,R=t.img`
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
`,S=t.div`
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
        background-image: url(${z});
        background-size: 750px 70px;
        background-repeat: repeat-x;
        background-position: 0 0;
    }
`,I=t.div`
    position: relative;
    z-index: 2;
    background: ${n.white};
    border: 4px solid ${n.navy};
    border-radius: 10px;
    width: clamp(320px, 38vw, 552px);
    padding: 0 0 28px 0;
    margin-right: clamp(24px, 6vw, 96px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 32px rgba(17,28,54,0.25);

    /* subtle background pattern inside card */
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url(${F});
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
`,E=t.div`
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`,A=t.h1`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(22px, 2.5vw, 30px);
    font-weight: 700;
    color: ${n.navy};
    text-align: center;
    margin: 24px 0 16px 0;
`,d=t.div`
    width: calc(100% - 40px);
    height: 2px;
    background: ${n.navy};
    margin: 0 20px;
    flex-shrink: 0;
`,C=t.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    width: calc(100% - 40px);
    padding: 16px 0;
`,x=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 10px;
    width: 100%;
    justify-content: flex-end;
`,f=t.label`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(15px, 1.5vw, 20px);
    font-weight: 700;
    color: #000;
    white-space: nowrap;
    flex-shrink: 0;
`,g=t.input`
    height: 32px;
    width: clamp(140px, 20vw, 300px);
    border: 2px solid #000;
    border-radius: 5px;
    background: ${n.white};
    padding: 4px 8px;
    font-size: 14px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    outline: none;
    flex-shrink: 0;

    &:focus {
        border-color: ${n.navy};
        box-shadow: 0 0 0 2px rgba(17,28,54,0.15);
    }
`,U=t.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 8px 20px 16px 20px;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
`,P=t.button`
    height: 36px;
    width: clamp(130px, 13vw, 181px);
    background: ${n.red};
    border: 1px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(12px, 1.1vw, 15px);
    font-weight: 700;
    color: ${n.white};
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;

    &:hover {
        background: #8a1515;
        transform: translateY(-1px);
    }
    &:active {
        transform: translateY(0);
    }
`,B=t.a`
    height: 36px;
    width: clamp(130px, 13vw, 181px);
    background: ${n.red};
    border: 1px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(12px, 1.1vw, 15px);
    font-weight: 700;
    color: ${n.white};
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;

    &:hover {
        background: #8a1515;
    }
`,Y=t.p`
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(16px, 2vw, 28px);
    font-weight: 700;
    color: #000;
    text-align: center;
    margin: 16px 20px 12px 20px;
`,T=t.a`
    display: flex;
    align-items: center;
    justify-content: center;
    height: clamp(40px, 4vw, 50px);
    width: calc(100% - 80px);
    max-width: 461px;
    background: ${n.red};
    border: 2px solid #000;
    border-radius: 5px;
    font-family: var(--font-display, 'Funnel Display', sans-serif);
    font-size: clamp(18px, 2vw, 30px);
    font-weight: 700;
    color: ${n.white};
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
    margin-bottom: 4px;

    &:hover {
        background: #8a1515;
        transform: translateY(-1px);
    }
`;function q(){const[i,u]=p.useState(""),[l,h]=p.useState(""),{setAuth:m,setUser:w}=j(),v=D(),b=async()=>{try{const a=await c.me();if(a.status===200)return await a.data;console.error("Retrieve User Data failed:",a.status)}catch(a){console.error("Error:",a)}return null},y=async a=>{a.preventDefault();try{const r=await c.login(i,l);if(console.log("Login response:",r),r.status===200){const k=r.data.access_token,o=Math.floor(Date.now()/1e3)+3*60;console.log("Expires at:",o*1e3),console.log("Expires in (minutes):",(o*1e3-Date.now())/1e3/60),m(!0),localStorage.setItem("authToken",k),localStorage.setItem("token_expiration",o.toString()||"0");const s=await b();s&&(w(s),localStorage.setItem("user",JSON.stringify(s))),v("/myforge")}else console.error("Login failed:",r.status),console.error("Login failed:",r.statusText),alert("Login failed: "+r.status),alert("Login failed: "+r.statusText)}catch(r){console.error("Error:",r),r.status===401?alert("Invalid username or password"):alert("Error occured:"+r)}};return e.jsxs(L,{children:[e.jsx(R,{src:$,alt:""}),e.jsx(S,{}),e.jsx(I,{children:e.jsx(E,{children:e.jsxs("form",{onSubmit:y,style:{width:"100%",display:"contents"},children:[e.jsx(A,{children:"Sign In"}),e.jsx(d,{}),e.jsxs(C,{children:[e.jsxs(x,{children:[e.jsx(f,{htmlFor:"rscid",children:"RSC ID"}),e.jsx(g,{id:"rscid",type:"text",value:i,onChange:a=>u(a.target.value),required:!0})]}),e.jsxs(x,{children:[e.jsx(f,{htmlFor:"password",children:"Password"}),e.jsx(g,{id:"password",type:"password",value:l,onChange:a=>h(a.target.value),required:!0})]})]}),e.jsxs(U,{children:[e.jsx(P,{type:"submit",children:"Start Making!"}),e.jsx(B,{href:"/reset-password",children:"Forgot Password?"})]}),e.jsx(d,{}),e.jsx(Y,{children:"Don't have an account?"}),e.jsx(T,{href:"/register",children:"Register Here!"})]})})})]})}export{q as default};
