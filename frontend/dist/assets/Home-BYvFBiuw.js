import{j as e,u as t,L as i}from"./index-BvyJdg8B.js";const n="https://www.figma.com/api/mcp/asset/e305a98f-4e8a-4f0d-9728-79c478ed49fa",o="https://www.figma.com/api/mcp/asset/6ec9052a-dfc2-46ee-946b-c83d3607a3ea",s=t.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: hidden;
`,a=t.section`
    position: relative;
    width: 100%;
    min-height: 826px;
    background: linear-gradient(to right, #2d4a80 10%, #a51c1c 100%);
    overflow: hidden;
    flex-shrink: 0;
`,r=t.div`
    position: absolute;
    left: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 70px;
    height: 850px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1;

    img {
        transform: rotate(-90deg) scaleY(-1);
        width: 850px;
        height: 70px;
        object-fit: fill;
        flex-shrink: 0;
    }
`,c=t.div`
    position: absolute;
    left: 127px;
    top: 50%;
    transform: translateY(calc(-50% - 126.5px));
    width: 477px;
    z-index: 2;
`,l=t.h1`
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(60px, 7vw, 100px);
    line-height: 1.25;
    color: #ffffff;
    white-space: pre;
    margin: 0;
`,p=t.p`
    position: absolute;
    left: 127px;
    top: calc(50% + 220px);
    transform: translateY(-50%);
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: clamp(22px, 2.5vw, 35px);
    color: #ffffff;
    line-height: normal;
    margin: 0;
    white-space: pre;
    z-index: 2;
`,f=t.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 920px;
    height: 792px;
    /* make sure it sits behind text */
    z-index: 0;

    img {
        position: absolute;
        /* Figma framing offsets */
        height: 103.28%;
        left: -58.18%;
        top: -2.27%;
        width: 158.18%;
        max-width: none;
        object-fit: cover;
    }
`,d=t.div`
    position: relative;
    width: 100%;
    height: 91px;
    background: #ffffff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    overflow: hidden;

    /* Red top accent */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #a51c1c;
    }

    /* Red right accent */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background: #a51c1c;
    }
`,h=t.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px 0 100px;

    p {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 700;
        font-size: clamp(22px, 3.5vw, 50px);
        color: #111c36;
        text-align: center;
        white-space: nowrap;
        margin: 0;
    }
`,x=t(i)`
    flex-shrink: 0;
    margin-right: 80px;
    width: 260px;
    height: 50px;
    background: #a51c1c;
    border: 2px solid #111c36;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.85;
    }

    span {
        font-family: 'Funnel Display', sans-serif;
        font-weight: 600;
        font-size: 30px;
        color: #ffffff;
    }
`;function m(){return e.jsxs(s,{children:[e.jsxs(a,{children:[e.jsx(r,{children:e.jsx("img",{src:o,alt:"","aria-hidden":"true"})}),e.jsx(c,{children:e.jsx(l,{children:`Build.
  Create.
      Invent.`})}),e.jsx(p,{children:`3D Print
   Laser Cut
       Sticker Print
            and Much More!`}),e.jsx(f,{children:e.jsx("img",{src:n,alt:"The Forge makerspace tools and equipment"})})]}),e.jsxs(d,{children:[e.jsx(h,{children:e.jsx("p",{children:"Membership is Only $20 Per Semester!"})}),e.jsx(x,{to:"/getting-started",children:e.jsx("span",{children:"Get Started"})})]})]})}export{m as default};
