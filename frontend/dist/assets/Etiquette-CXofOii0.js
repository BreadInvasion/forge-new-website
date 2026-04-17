import{j as e,u as i}from"./index-BvyJdg8B.js";import{b as c}from"./background-_MUij_O6.js";const x="https://www.figma.com/api/mcp/asset/b898873a-74bf-4a50-8908-851628aa2d27",h="https://www.figma.com/api/mcp/asset/87c5c392-123f-42ff-8433-68d7da8166c2",f="https://www.figma.com/api/mcp/asset/366c8e9b-0c94-4167-934e-fb6eff4d35f9",n={navy:"#111c36",navyMid:"#2d4a80",red:"#a51c1c",lightBlue:"#bac8db"},g=[{title:"Ask Questions",desc:"We welcome curiosity and excitement. Everyone will be coming in with different levels of experience so don't hesitate to ask questions."},{title:"Be Kind",desc:"The Forge is a welcoming place due to our staff being student volunteers. We are not paid and often have exams when you do!"},{title:"Have Fun",desc:"Our space is for making and creating! We are here to help you realize your dreams, so let us know how we can help!"}],m=[{title:"Assume",desc:"We know that many students walking in have experience with 3D printing. We have specific rules that don't change because we operate 24/7/365."},{title:"Rush",desc:"We understand that everyone has deadlines, but our space is always changing and trying to help as many people as possible."},{title:"Make Boxes",desc:"Unless the container being made is hyper specialized, please consider buying a box or using the laser cutter. Both options are cheaper and faster!"}],u=i.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`,w=i.section`
  position: relative;
  width: 100%;
  min-height: 362px;
  background: linear-gradient(to right, #2d0707, ${n.red});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`,o=i.div`
  position: absolute;
  right: -1px;
  top: 0;
  width: 79px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    width: 5000px;
    height: 79px;
    left: calc(50% - 2500px);
    top: -2539.5px;
    transform: rotate(-90deg) scaleY(-1);
    transform-origin: center center;
    background-image: url(${t=>t.$url});
    background-size: 750px 79px;
    background-repeat: repeat-x;
    background-position: 0 0;
  }
`,v=i.div`
  position: absolute;
  right: 100px;
  top: 23px;
  width: 550px;
  height: 310px;
  transform: rotate(180deg) scaleY(-1);
  overflow: hidden;
  pointer-events: none;

  img {
    position: absolute;
    width: 122.18%;
    height: 216.89%;
    left: -3.51%;
    top: -4.18%;
    max-width: none;
    object-fit: cover;
  }
`,y=i.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 174px 60px 127px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 60px 80px; }
  @media (max-width: 640px)  { padding: 48px 24px; }
`,b=i.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 16px 0;
`,j=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${n.lightBlue};
  line-height: 1.25;
  max-width: 680px;
  margin: 0;
`,D=i.section`
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${c});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
  }
`,k=i.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 120px 80px 174px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 48px 60px 64px 80px; }
  @media (max-width: 640px)  { padding: 40px 24px 56px 24px; }
`,z=i.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`,a=i.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`,s=i.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 50px;
  color: ${n.navy};
  line-height: 1.25;
  margin: 0 0 4px 0;
`,r=i.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,d=i.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,$=i.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${n.navyMid};
  flex-shrink: 0;
`,E=i.div`
  position: relative;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: polygon(50% 8%, 95% 90%, 5% 90%);
    background: #f5c518;
  }

  span {
    position: relative;
    z-index: 1;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 13px;
    color: ${n.navy};
    line-height: 1;
    margin-top: 4px;
  }
`,p=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 30px;
  color: ${n.navy};
  line-height: 1.25;
  margin: 0;
`,l=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: ${n.navyMid};
  line-height: 1.35;
  margin: 0;
  max-width: 340px;
`;function R(){return e.jsxs(u,{children:[e.jsxs(w,{children:[e.jsx(o,{$url:x}),e.jsx(v,{children:e.jsx("img",{src:f,alt:"","aria-hidden":"true"})}),e.jsxs(y,{children:[e.jsx(b,{children:"Etiquette"}),e.jsx(j,{children:"Things to help you navigate our space and streamline your visit."})]})]}),e.jsxs(D,{children:[e.jsx(o,{$url:h}),e.jsx(k,{children:e.jsxs(z,{children:[e.jsxs(a,{children:[e.jsx(s,{children:"Do"}),g.map(t=>e.jsxs(r,{children:[e.jsxs(d,{children:[e.jsx($,{}),e.jsx(p,{children:t.title})]}),e.jsx(l,{children:t.desc})]},t.title))]}),e.jsxs(a,{children:[e.jsx(s,{children:"Don't"}),m.map(t=>e.jsxs(r,{children:[e.jsxs(d,{children:[e.jsx(E,{children:e.jsx("span",{children:"!"})}),e.jsx(p,{children:t.title})]}),e.jsx(l,{children:t.desc})]},t.title))]})]})})]})]})}export{R as default};
