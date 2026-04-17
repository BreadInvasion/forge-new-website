import{j as e,u as t}from"./index-BvyJdg8B.js";import{b as o}from"./background-_MUij_O6.js";const r="https://www.figma.com/api/mcp/asset/f5317051-1b0b-4812-a79c-8e691f277dcd",i=t.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`,n=t.section`
  position: relative;
  width: 100%;
  flex: 1;
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  overflow: hidden;

  /* Background pattern */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${o});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
  }

  /* Red top accent */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-red);
    z-index: 2;
  }
`,a=t.div`
  
`,d=t.div`
  position: absolute;
  left: -1px;
  bottom: -31px;
  width: 70px;
  height: 737px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;

  img {
    transform: rotate(-90deg) scaleY(-1);
    width: 737px;
    height: 70px;
    object-fit: fill;
    flex-shrink: 0;
  }
`,c=t.div`
  position: relative;
  width: min(1250px, calc(100% - 80px));
  height: 600px;
  background: var(--color-bg-light);
  border: var(--border-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  z-index: 1;

  @media (max-width: 768px) {
    height: 500px;
    width: calc(100% - 40px);
  }
`,s=t.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`,x=()=>e.jsx(i,{children:e.jsxs(n,{children:[e.jsx(d,{children:e.jsx("img",{src:r,alt:"","aria-hidden":"true"})}),e.jsx(a,{}),e.jsx(c,{children:e.jsx(s,{src:"https://calendar.google.com/calendar/embed?src=k2r6osjjms6lqt41bi5a7j48n0%40group.calendar.google.com&ctz=America%2FNew_York&mode=WEEK",title:"The Forge | The MILL — Weekly Calendar",scrolling:"no"})})]})});export{x as default};
