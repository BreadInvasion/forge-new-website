import{j as e,q as g,u as i}from"./index-BvyJdg8B.js";import{b as m}from"./background-_MUij_O6.js";const u="https://www.figma.com/api/mcp/asset/b426b84f-2581-4ff9-a424-ceec5398c918",b="https://www.figma.com/api/mcp/asset/654fb1de-c65d-4527-b4d9-0ad91b65b34a",y="https://www.figma.com/api/mcp/asset/366c8e9b-0c94-4167-934e-fb6eff4d35f9",t={navy:"#111c36",navyMid:"#2d4a80",navyLight:"#31519c",red:"#a51c1c",redLight:"rgba(165,28,28,0.15)",blueLight:"rgba(45,74,128,0.15)",slate:"#64748b",lightBlue:"#bac8db",divider:"#e2e8f0"},v=[{title:"Filament",rows:[{mat:"PLA",price:"$0.06",unit:"/gram"},{mat:"PETG",price:"$0.09",unit:"/gram"},{mat:"TPU",price:"$0.09",unit:"/gram"}]},{title:"Resin",rows:[{mat:"Clear",price:"$0.18",unit:"/mL"},{mat:"Grey",price:"$0.18",unit:"/mL"}]},{title:"Vinyl",rows:[{mat:"Standard",price:"$0.20",unit:"/in"},{mat:"Holographic",price:"$0.20",unit:"/in"},{mat:"Ink",price:"$2.00",unit:"/cc"}]}],w=[{label:"FDM 3D Printing",title:"Filament rules & recommendations",subtitle:"Make sure to check the banned filaments",banned:[{header:"NOT ALLOWED",sub:"Banned material types",items:["Particulate filaments","Wood","Fiber Additives","Metal","Marble Silk","PLA Pro","Ultra & Super variants","etc."]},{header:"NOT ALLOWED",sub:"Banned brands",items:["Elegoo","Sunlu","GeeeTech","XYZPrinting","Ender","Amazon Basics","Generic + No Names","Unnamed + Blank Spools"]}],allowed:[{header:"RECOMMENDED",sub:"Filaments we trust",items:["Prusament","Polar","Polymaker","InLand","Jessie","Printed Solid","Overture","Hatchbox"]}]},{label:"Laser Cutter",title:"Laser Cutter",subtitle:"Materials you can and can't use",banned:[{header:"NOT ALLOWED",sub:"Banned materials",items:["Pressure treated wood","Corrugated cardboard","PVC","Vinyl","ABS","Materials containing chlorine/halogen"]}],allowed:[{header:"ALLOWED",sub:"Approved materials",items:["Wood","MDF","Taskboard","Cardboard","Acrylic","Polystyrene","Polyethylene","Polypropylene","Butyl rubber"]}]},{label:"Vinyl/Sticker Printer",title:"Vinyl/Sticker Printer",subtitle:"Materials you can and can't use",banned:[{header:"NOT ALLOWED",sub:"Banned",items:["Over 24 inches wide"]}],allowed:[{header:"RECOMMENDED",sub:"Allowed",items:["Glossy Vinyl","Matte Vinyl","Clear Glossy","Clear Matte","Holographic","Heat Transfer","Banner Cloth","Oracle 3651"]}]}],j=i.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`,P=i.section`
  position: relative;
  width: 100%;
  min-height: 362px;
  background: linear-gradient(to right, #2d0707, ${t.red});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`,s=i.div`
  position: absolute;
  left: -1px;
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
    top: calc(50% - 39.5px);
    transform: rotate(-90deg) scaleY(-1);
    transform-origin: center center;
    background-image: url(${n=>n.$url});
    background-size: 750px 79px;
    background-repeat: repeat-x;
  }
`,$=i.div`
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
`,L=i.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 174px 60px 127px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 60px 80px; }
  @media (max-width: 640px)  { padding: 48px 24px; }
`,k=i.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 16px 0;
`,M=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${t.lightBlue};
  line-height: 1.25;
  max-width: 680px;
  margin: 0;
`,R=i.section`
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${m});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
  }
`,z=i.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 120px 80px 174px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 56px;

  @media (max-width: 1024px) { padding: 48px 60px 64px 80px; }
  @media (max-width: 640px)  { padding: 40px 24px 56px 24px; }
`,B=i.h2`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(32px, 3vw, 48px);
  color: ${t.red};
  margin: 0 0 6px 0;
`,E=i.p`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${t.slate};
  letter-spacing: 1.12px;
  margin: 0 0 28px 0;
  max-width: 588px;
`,I=i.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`,S=i.div`
  flex: 1 1 280px;
  max-width: 352px;
  border: 1px solid ${t.navyLight};
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
`,T=i.div`
  padding: 14px 24px 10px;
  border-bottom: 1px solid ${t.divider};
`,C=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: ${t.navy};
  letter-spacing: 1.68px;
  margin: 0;
`,O=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid ${t.divider};
  &:last-child { border-bottom: none; }
`,A=i.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 19px;
  color: ${t.slate};
  letter-spacing: 1.4px;
`,D=i.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: ${t.navyMid};
`,H=i.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  color: ${t.slate};
`,N=i.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,W=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: ${t.red};
  letter-spacing: 1.12px;
  margin: 0;
`,F=i.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 48px);
  color: ${t.navy};
  letter-spacing: 2px;
  margin: 0;
`,G=i.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: ${t.slate};
  letter-spacing: 1.4px;
  margin: 0;
`,U=i.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`,d=i.div`
  flex: 1 1 280px;
  border-left: 2px solid ${n=>n.variant==="banned"?t.red:t.navyMid};
  background: ${n=>n.variant==="banned"?t.redLight:t.blueLight};
  border-radius: 0 5px 5px 0;
  overflow: hidden;
`,p=i.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`,c=i.div`
  background: ${n=>n.variant==="banned"?t.red:t.navyMid};
  padding: 6px 12px;
  border-radius: 2px;

  span {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 14px;
    color: #fff;
    letter-spacing: 1px;
  }
`,x=i.p`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  color: ${n=>n.variant==="banned"?t.red:t.navyMid};
  letter-spacing: 1px;
  margin: 0;
`,f=i.ul`
  list-style: none;
  margin: 0;
  padding: 8px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,h=i.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${t.navy};
  letter-spacing: 1px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${n=>n.variant==="banned"?t.red:t.navyMid};
  }
`,V=i.div`
  display: flex;
  gap: 48px;
  align-items: flex-start;
  padding: 0;
`,_=i.div`
  flex: 0 0 auto;
  max-width: 320px;
`,Y=i.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 42px);
  color: ${t.navy};
  letter-spacing: 1px;
  margin: 0 0 16px 0;
  line-height: 1.2;
`,q=i.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 16px;
  color: ${t.slate};
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
`,J=i.div`
  flex: 1;
  border-left: 4px solid ${t.red};
  background: ${t.redLight};
  border-radius: 0 6px 6px 0;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`,X=i.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: ${t.red};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
`,Z=i.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,K=i.h4`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: ${t.red};
  letter-spacing: 1px;
  margin: 0;
`,Q=i.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${t.navy};
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
`,l={title:"Resin Printer",subtitle:"Please read the information regarding printing with resin",boxTitle:"Important Information on Resin",boxText:"You cannot bring your own resin to The Forge. All resin printing must use materials stocked and approved by staff. This ensures machine compatibility and keeps our printers in good condition for everyone."};function te(){return e.jsxs(j,{children:[e.jsxs(P,{children:[e.jsx(s,{$url:u}),e.jsx($,{children:e.jsx("img",{src:y,alt:"","aria-hidden":"true"})}),e.jsxs(L,{children:[e.jsx(k,{children:"Material Information"}),e.jsx(M,{children:"Pricing, filament rules, laser cutter materials, and more."})]})]}),e.jsxs(R,{children:[e.jsx(s,{$url:b}),e.jsxs(z,{children:[e.jsxs("div",{children:[e.jsx(B,{children:"Material Pricing"}),e.jsxs(E,{children:["We stock everything you need. Pay only for what you use — priced per gram, mL, or inch depending on the material. Before you come to the space check out the"," ",e.jsx("strong",{style:{fontWeight:800,color:t.red},children:"banned filaments section below."})]}),e.jsx(I,{children:v.map(n=>e.jsxs(S,{children:[e.jsx(T,{children:e.jsx(C,{children:n.title})}),n.rows.map(r=>e.jsxs(O,{children:[e.jsx(A,{children:r.mat}),e.jsxs("span",{children:[e.jsx(D,{children:r.price}),e.jsx(H,{children:r.unit})]})]},r.mat))]},n.title))})]}),w.map((n,r)=>e.jsxs(g.Fragment,{children:[e.jsxs(N,{children:[e.jsx(W,{children:n.label}),e.jsx(F,{children:n.title}),e.jsx(G,{children:n.subtitle}),e.jsxs(U,{children:[n.banned.map(a=>e.jsxs(d,{variant:"banned",children:[e.jsxs(p,{children:[e.jsx(c,{variant:"banned",children:e.jsx("span",{children:a.header})}),e.jsx(x,{variant:"banned",children:a.sub})]}),e.jsx(f,{children:a.items.map(o=>e.jsx(h,{variant:"banned",children:o},o))})]},a.sub)),n.allowed.map(a=>e.jsxs(d,{variant:"allowed",children:[e.jsxs(p,{children:[e.jsx(c,{variant:"allowed",children:e.jsx("span",{children:a.header})}),e.jsx(x,{variant:"allowed",children:a.sub})]}),e.jsx(f,{children:a.items.map(o=>e.jsx(h,{variant:"allowed",children:o},o))})]},a.sub))]})]}),r===1&&e.jsxs(V,{children:[e.jsxs(_,{children:[e.jsx(Y,{children:l.title}),e.jsx(q,{children:l.subtitle})]}),e.jsxs(J,{children:[e.jsx(X,{children:"!"}),e.jsxs(Z,{children:[e.jsx(K,{children:l.boxTitle}),e.jsx(Q,{children:l.boxText})]})]})]})]},n.title))]})]})]})}export{te as default};
