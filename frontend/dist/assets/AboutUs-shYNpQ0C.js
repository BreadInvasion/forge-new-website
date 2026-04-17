import{j as e,u as i}from"./index-BvyJdg8B.js";import{b as d}from"./background-_MUij_O6.js";const l="https://www.figma.com/api/mcp/asset/09344755-fef6-4d67-835d-d6a67d76e91e",p="https://www.figma.com/api/mcp/asset/38734e6c-bd37-40a0-8ec8-db3a837c4103",c="https://www.figma.com/api/mcp/asset/02019811-b8fc-4937-bf9e-c260373092ea",x="https://www.figma.com/api/mcp/asset/31583bbc-4b05-48fa-8877-c4caddcfd7bc",t={navy:"#111c36",navyMid:"#2d4a80",navyLight:"#31519c",red:"#a51c1c",slate:"#64748b",bgLight:"#eef2f8",divider:"#e2e8f0"},h=i.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`,o=i.div`
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 79px;
  height: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;

  img {
    transform: rotate(-90deg) scaleY(-1);
    width: 750px;
    height: 79px;
    object-fit: fill;
    flex-shrink: 0;
  }
`,f=i.section`
  position: relative;
  width: 100%;
  min-height: 279px;
  background: linear-gradient(to right, ${t.red}, ${t.navyLight});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`,g=i.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  /* left:113 → padding-left; right content at ~880px so use space-between */
  padding: 40px 80px 40px 113px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  gap: 40px;

  @media (max-width: 1024px) {
    padding: 40px 60px;
    gap: 32px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 24px;
    gap: 20px;
  }
`,m=i.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6.94vw, 100px);
  color: #fff;
  letter-spacing: 7px;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
`,w=i.div`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(22px, 4.17vw, 60px);
  color: #fff;
  letter-spacing: 4.2px;
  line-height: 1.25;
  white-space: pre;
  text-align: left;
  flex-shrink: 0;
`,y=i.section`
  position: relative;
  width: 100%;
  background: ${t.bgLight};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${d});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
  }
`,v=i.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 113px 55px 174px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  gap: 60px;
  min-height: 697px;

  @media (max-width: 1200px) { padding: 40px 80px 55px 80px; gap: 48px; }
  @media (max-width: 768px)  {
    flex-direction: column;
    padding: 40px 24px 56px 24px;
    gap: 40px;
    min-height: unset;
  }
`,u=i.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`,b=i.div`
  display: flex;
  flex-direction: column;
`,j=i.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(32px, 3.47vw, 50px);
  color: #000;
  letter-spacing: 3.5px;
  line-height: 1.25;
  margin: 0 0 0 0;
`,k=i.div`
  max-width: 583px;
  margin-top: 4px;

  p {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(14px, 1.39vw, 20px);
    color: #000;
    letter-spacing: 1.4px;
    line-height: 1.25;
    margin: 0;

    & + p { margin-top: 8px; }
  }
`,$=i.div`
  display: flex;
  flex-direction: column;
`,L=i.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3.47vw, 50px);
  color: ${t.navy};
  line-height: 1.25;
  margin: 0 0 10px 0;
`,C=i.p`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${t.slate};
  letter-spacing: 1.12px;
  line-height: 1.25;
  max-width: 572px;
  margin: 0 0 24px 0;
`,z=i.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
`,a=i.div`
  width: 262px;
  height: 160px;
  border: 1px solid ${t.navyLight};
  border-radius: 5px;
  background: ${t.bgLight};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`,s=i.div`
  background: linear-gradient(to right, ${n=>n.$from}, ${n=>n.$to});
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  flex-shrink: 0;
`,r=i.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  letter-spacing: 1.26px;
  margin: 0;
`,I=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  flex: 1;
  border-bottom: 1px solid ${t.divider};

  &:last-child { border-bottom: none; }
`,R=i.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${t.slate};
  letter-spacing: 1.05px;
`,H=i.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 10px;
  color: ${t.navyMid};
  letter-spacing: 0.7px;
  text-align: right;
`,W=i.div`
  padding: 14px 18px 16px 18px;
  flex: 1;
`,T=i.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${t.slate};
  letter-spacing: 1.05px;
  line-height: 1.35;
  margin: 0;

  strong {
    font-weight: 700;
    color: ${t.red};
  }
`,F=i.div`
  flex-shrink: 0;
  width: clamp(260px, 35.6vw, 513px);
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 480px;
  }
`,M=i.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`,P=()=>e.jsxs(h,{children:[e.jsxs(f,{children:[e.jsx(o,{style:{top:"calc(50% + 15.5px)"},children:e.jsx("img",{src:p,alt:"","aria-hidden":"true"})}),e.jsxs(g,{children:[e.jsx(m,{children:"10+ Years of"}),e.jsx(w,{children:`Build-ing
    Create-ing
        Invent-ing`})]})]}),e.jsxs(y,{children:[e.jsx(o,{style:{top:"calc(50% - 31.5px)"},children:e.jsx("img",{src:c,alt:"","aria-hidden":"true"})}),e.jsxs(v,{children:[e.jsxs(u,{children:[e.jsxs(b,{children:[e.jsx(j,{children:"Who We Are"}),e.jsxs(k,{children:[e.jsx("p",{children:"For over 10 years, The Forge has been a space where curiosity becomes creation and ideas become reality."}),e.jsx("p",{children:"What started as a small corner for adventurous students has grown into one of RPI's most active spaces, driven entirely by the makers who call it home."}),e.jsx("p",{children:"Our printers have logged over 1,000 days of total print time, and one machine has produced enough material to wrap around the entire Earth."})]})]}),e.jsxs($,{children:[e.jsx(L,{children:"Where to Find Us"}),e.jsx(C,{children:"We're on campus and easy to find. Look for the makerspace signs on the second floor of the DCC."}),e.jsxs(z,{children:[e.jsxs(a,{children:[e.jsx(s,{$from:t.navy,$to:t.navyMid,children:e.jsx(r,{children:"Hours"})}),[{day:"Monday - Friday",time:"9am - 6 pm"},{day:"Saturday",time:"Closed"},{day:"Sunday",time:"Check the Calendar"}].map(n=>e.jsxs(I,{children:[e.jsx(R,{children:n.day}),e.jsx(H,{children:n.time})]},n.day))]}),e.jsxs(a,{children:[e.jsxs(s,{$from:t.navy,$to:t.navyLight,children:[e.jsx(r,{children:"Location"}),e.jsx("img",{src:x,alt:"","aria-hidden":"true",style:{height:30,width:25,flexShrink:0}})]}),e.jsx(W,{children:e.jsxs(T,{children:["We are located in the basement of the"," ",e.jsx("strong",{children:"Center of Industrial Innovation"})," building in"," ",e.jsx("strong",{children:"room CII2037A"})]})})]})]})]})]}),e.jsx(F,{children:e.jsx(M,{children:e.jsx("img",{src:l,alt:"The Forge makerspace interior"})})})]})]})]});export{P as default};
