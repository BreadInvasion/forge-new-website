import{c as pe,r as g,f as _,j as e,g as xe,P,h as fe,i as Se,d as he,b as Te,q as h,y as Le,z as _e,u as t,B as ge,G as Ne}from"./index-BvyJdg8B.js";import{b as Oe}from"./background-_MUij_O6.js";var I="Collapsible",[ze,ue]=pe(I),[He,N]=ze(I),me=g.forwardRef((n,o)=>{const{__scopeCollapsible:i,open:s,defaultOpen:l,disabled:r,onOpenChange:c,...p}=n,[x,f]=_({prop:s,defaultProp:l??!1,onChange:c,caller:I});return e.jsx(He,{scope:i,disabled:r,contentId:xe(),open:x,onOpenToggle:g.useCallback(()=>f(u=>!u),[f]),children:e.jsx(P.div,{"data-state":z(x),"data-disabled":r?"":void 0,...p,ref:o})})});me.displayName=I;var be="CollapsibleTrigger",ve=g.forwardRef((n,o)=>{const{__scopeCollapsible:i,...s}=n,l=N(be,i);return e.jsx(P.button,{type:"button","aria-controls":l.contentId,"aria-expanded":l.open||!1,"data-state":z(l.open),"data-disabled":l.disabled?"":void 0,disabled:l.disabled,...s,ref:o,onClick:fe(n.onClick,l.onOpenToggle)})});ve.displayName=be;var O="CollapsibleContent",ye=g.forwardRef((n,o)=>{const{forceMount:i,...s}=n,l=N(O,n.__scopeCollapsible);return e.jsx(Se,{present:i||l.open,children:({present:r})=>e.jsx(Be,{...s,ref:o,present:r})})});ye.displayName=O;var Be=g.forwardRef((n,o)=>{const{__scopeCollapsible:i,present:s,children:l,...r}=n,c=N(O,i),[p,x]=g.useState(s),f=g.useRef(null),u=he(o,f),m=g.useRef(0),C=m.current,v=g.useRef(0),R=v.current,y=c.open||p,w=g.useRef(y),j=g.useRef(void 0);return g.useEffect(()=>{const d=requestAnimationFrame(()=>w.current=!1);return()=>cancelAnimationFrame(d)},[]),Te(()=>{const d=f.current;if(d){j.current=j.current||{transitionDuration:d.style.transitionDuration,animationName:d.style.animationName},d.style.transitionDuration="0s",d.style.animationName="none";const A=d.getBoundingClientRect();m.current=A.height,v.current=A.width,w.current||(d.style.transitionDuration=j.current.transitionDuration,d.style.animationName=j.current.animationName),x(s)}},[c.open,s]),e.jsx(P.div,{"data-state":z(c.open),"data-disabled":c.disabled?"":void 0,id:c.contentId,hidden:!y,...r,ref:u,style:{"--radix-collapsible-content-height":C?`${C}px`:void 0,"--radix-collapsible-content-width":R?`${R}px`:void 0,...n.style},children:y&&l})});function z(n){return n?"open":"closed"}var We=me,Ve=ve,Fe=ye,b="Accordion",Ge=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[H,Ue,Ye]=Le(b),[D,qn]=pe(b,[Ye,ue]),B=ue(),we=h.forwardRef((n,o)=>{const{type:i,...s}=n,l=s,r=s;return e.jsx(H.Provider,{scope:n.__scopeAccordion,children:i==="multiple"?e.jsx(Je,{...r,ref:o}):e.jsx(Qe,{...l,ref:o})})});we.displayName=b;var[je,Ke]=D(b),[Ce,qe]=D(b,{collapsible:!1}),Qe=h.forwardRef((n,o)=>{const{value:i,defaultValue:s,onValueChange:l=()=>{},collapsible:r=!1,...c}=n,[p,x]=_({prop:i,defaultProp:s??"",onChange:l,caller:b});return e.jsx(je,{scope:n.__scopeAccordion,value:h.useMemo(()=>p?[p]:[],[p]),onItemOpen:x,onItemClose:h.useCallback(()=>r&&x(""),[r,x]),children:e.jsx(Ce,{scope:n.__scopeAccordion,collapsible:r,children:e.jsx(Ae,{...c,ref:o})})})}),Je=h.forwardRef((n,o)=>{const{value:i,defaultValue:s,onValueChange:l=()=>{},...r}=n,[c,p]=_({prop:i,defaultProp:s??[],onChange:l,caller:b}),x=h.useCallback(u=>p((m=[])=>[...m,u]),[p]),f=h.useCallback(u=>p((m=[])=>m.filter(C=>C!==u)),[p]);return e.jsx(je,{scope:n.__scopeAccordion,value:c,onItemOpen:x,onItemClose:f,children:e.jsx(Ce,{scope:n.__scopeAccordion,collapsible:!0,children:e.jsx(Ae,{...r,ref:o})})})}),[Xe,$]=D(b),Ae=h.forwardRef((n,o)=>{const{__scopeAccordion:i,disabled:s,dir:l,orientation:r="vertical",...c}=n,p=h.useRef(null),x=he(p,o),f=Ue(i),m=_e(l)==="ltr",C=fe(n.onKeyDown,v=>{var V;if(!Ge.includes(v.key))return;const R=v.target,y=f().filter(T=>{var F;return!((F=T.ref.current)!=null&&F.disabled)}),w=y.findIndex(T=>T.ref.current===R),j=y.length;if(w===-1)return;v.preventDefault();let d=w;const A=0,M=j-1,E=()=>{d=w+1,d>M&&(d=A)},S=()=>{d=w-1,d<A&&(d=M)};switch(v.key){case"Home":d=A;break;case"End":d=M;break;case"ArrowRight":r==="horizontal"&&(m?E():S());break;case"ArrowDown":r==="vertical"&&E();break;case"ArrowLeft":r==="horizontal"&&(m?S():E());break;case"ArrowUp":r==="vertical"&&S();break}const Ee=d%j;(V=y[Ee].ref.current)==null||V.focus()});return e.jsx(Xe,{scope:i,disabled:s,direction:l,orientation:r,children:e.jsx(H.Slot,{scope:i,children:e.jsx(P.div,{...c,"data-orientation":r,ref:x,onKeyDown:s?void 0:C})})})}),k="AccordionItem",[Ze,W]=D(k),Pe=h.forwardRef((n,o)=>{const{__scopeAccordion:i,value:s,...l}=n,r=$(k,i),c=Ke(k,i),p=B(i),x=xe(),f=s&&c.value.includes(s)||!1,u=r.disabled||n.disabled;return e.jsx(Ze,{scope:i,open:f,disabled:u,triggerId:x,children:e.jsx(We,{"data-orientation":r.orientation,"data-state":Me(f),...p,...l,ref:o,disabled:u,open:f,onOpenChange:m=>{m?c.onItemOpen(s):c.onItemClose(s)}})})});Pe.displayName=k;var Re="AccordionHeader",ke=h.forwardRef((n,o)=>{const{__scopeAccordion:i,...s}=n,l=$(b,i),r=W(Re,i);return e.jsx(P.h3,{"data-orientation":l.orientation,"data-state":Me(r.open),"data-disabled":r.disabled?"":void 0,...s,ref:o})});ke.displayName=Re;var L="AccordionTrigger",Ie=h.forwardRef((n,o)=>{const{__scopeAccordion:i,...s}=n,l=$(b,i),r=W(L,i),c=qe(L,i),p=B(i);return e.jsx(H.ItemSlot,{scope:i,children:e.jsx(Ve,{"aria-disabled":r.open&&!c.collapsible||void 0,"data-orientation":l.orientation,id:r.triggerId,...p,...s,ref:o})})});Ie.displayName=L;var De="AccordionContent",$e=h.forwardRef((n,o)=>{const{__scopeAccordion:i,...s}=n,l=$(b,i),r=W(De,i),c=B(i);return e.jsx(Fe,{role:"region","aria-labelledby":r.triggerId,"data-orientation":l.orientation,...c,...s,ref:o,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...n.style}})});$e.displayName=De;function Me(n){return n?"open":"closed"}var en=we,nn=Pe,tn=ke,on=Ie,an=$e;const rn="https://www.figma.com/api/mcp/asset/985350f4-0e73-467a-a68c-d3a49c3e1c07",sn="https://www.figma.com/api/mcp/asset/fcadc8e2-4ed1-4591-8ceb-9844b0a96897",ln="https://www.figma.com/api/mcp/asset/89f022fa-4c4b-433d-9526-8f0955c8c183",a={navy:"#111c36",navyMid:"#2d4a80",navyLight:"#31519c",red:"#a51c1c",redLight:"rgba(165,28,28,0.15)",blueLight:"rgba(45,74,128,0.15)",slate:"#64748b",lightBlue:"#bac8db",bgLight:"#eef2f8",divider:"#e2e8f0"},cn=ge`
  from { height: 0; }
  to   { height: var(--radix-accordion-content-height); }
`,dn=ge`
  from { height: var(--radix-accordion-content-height); }
  to   { height: 0; }
`,pn=[{title:"Ask Questions",desc:"We welcome curiosity and excitement. Everyone will be coming in with different levels of experience so don't hesitate to ask questions."},{title:"Be Kind",desc:"The Forge is a welcoming place due to our staff being student volunteers. We are not paid and often have exams when you do!"},{title:"Have Fun",desc:"Our space is for making and creating! We are here to help you realize your dreams, so let us know how we can help!"}],xn=[{title:"Assume",desc:"We know that many students walking in have experience with 3D printing. We have specific rules that don't change because we operate 24/7/365."},{title:"Rush",desc:"We understand that everyone has deadlines, but our space is always changing and trying to help as many people as possible."},{title:"Make Boxes",desc:"Unless the container being made is hyper specialized, please consider buying a box or using the laser cutter. Both options are cheaper and faster!"}],fn=[{title:"Filament",rows:[{mat:"PLA",price:"$0.06",unit:"/gram"},{mat:"PETG",price:"$0.09",unit:"/gram"},{mat:"TPU",price:"$0.09",unit:"/gram"}]},{title:"Resin",rows:[{mat:"Clear",price:"$0.18",unit:"/mL"},{mat:"Grey",price:"$0.18",unit:"/mL"}]},{title:"Vinyl",rows:[{mat:"Standard",price:"$0.20",unit:"/in"},{mat:"Holographic",price:"$0.20",unit:"/in"},{mat:"Ink",price:"$2.00",unit:"/cc"}]}],hn=[{label:"FDM 3D Printing",title:"Filament rules & recommendations",subtitle:"Make sure to check the banned filaments",banned:[{header:"NOT ALLOWED",sub:"Banned material types",items:["Particulate filaments","Wood","Fiber Additives","Metal","Marble Silk","PLA Pro","Ultra & Super variants","etc."]},{header:"NOT ALLOWED",sub:"Banned brands",items:["Elegoo","Sunlu","GeeeTech","XYZPrinting","Ender","Amazon Basics","Generic + No Names","Unnamed + Blank Spools"]}],allowed:[{header:"RECOMMENDED",sub:"Filaments we trust",items:["Prusament","Polar","Polymaker","InLand","Jessie","Printed Solid","Overture","Hatchbox"]}]},{label:"Laser Cutter",title:"Laser Cutter",subtitle:"Materials you can and can't use",banned:[{header:"NOT ALLOWED",sub:"Banned materials",items:["Pressure treated wood","Corrugated cardboard","PVC","Vinyl","ABS","Materials containing chlorine/halogen"]}],allowed:[{header:"ALLOWED",sub:"Filaments we trust",items:["Wood","MDF","Taskboard","Cardboard","Acrylic","Polystyrene","Polyethylene","Polypropylene","Butyl rubber"]}]},{label:"Vinyl/Sticker Printer",title:"Vinyl/Sticker Printer",subtitle:"Materials you can and can't use",banned:[{header:"NOT ALLOWED",sub:"Banned",items:["Over 24 inches wide"]}],allowed:[{header:"RECOMMENDED",sub:"Allowed",items:["Glossy Vinyl","Matte Vinyl","Clear Glossy","Clear Matte","Holographic","Heat Transfer","Banner Cloth","Oracle 3651"]}]}],gn=t.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`,un=t.section`
  position: relative;
  width: 100%;
  min-height: 362px;
  background: linear-gradient(to right, #2d0707, ${a.red});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`,mn=t.div`
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
`,bn=t.div`
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
`,vn=t.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 174px 60px 127px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 60px 80px; }
  @media (max-width: 640px)  { padding: 48px 24px; }
`,yn=t.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 16px 0;
`,wn=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${a.lightBlue};
  line-height: 1.25;
  max-width: 680px;
  margin: 0;
`,jn=t.section`
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${Oe});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.05;
    pointer-events: none;
  }
`,Cn=t.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 79px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  img {
    transform: rotate(-90deg) scaleY(-1);
    width: 2000px;
    height: 79px;
    object-fit: fill;
    flex-shrink: 0;
  }
`,An=t.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 120px 80px 174px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 48px 60px 64px 80px; }
  @media (max-width: 640px)  { padding: 40px 24px 56px 24px; }
`,Pn=t(en)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`,G=t(nn)`
  border: 1.5px solid ${a.divider};
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  &[data-state='open'] {
    border-color: ${a.navyMid};
  }
`,U=t(tn)`
  all: unset;
  display: block;
  margin: 0;
  padding: 0;
`,Y=t(on)`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px;
  cursor: pointer;
  background: #fff;
  transition: background 0.15s ease;

  &:hover { background: ${a.bgLight}; }
  &[data-state='open'] { background: ${a.bgLight}; border-bottom: 1.5px solid ${a.divider}; }
`,K=t.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,q=t.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  color: ${a.navy};
  line-height: 1.25;
`,Q=t.span`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: ${a.slate};
  letter-spacing: 0.5px;
`,J=t(Ne)`
  color: ${a.navyMid};
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);

  [data-state='open'] & { transform: rotate(180deg); }
`,X=t(an)`
  overflow: hidden;
  background: #fff;

  &[data-state='open']  { animation: ${cn} 300ms cubic-bezier(0.87, 0, 0.13, 1); }
  &[data-state='closed']{ animation: ${dn}   300ms cubic-bezier(0.87, 0, 0.13, 1); }
`,Rn=t.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 48px 48px 56px 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 24px 40px 24px;
  }
`,Z=t.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`,ee=t.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 50px;
  color: ${a.navy};
  line-height: 1.25;
  margin: 0 0 4px 0;
`,ne=t.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,te=t.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,kn=t.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${a.navyMid};
  flex-shrink: 0;
`,In=t.div`
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
    color: ${a.navy};
    line-height: 1;
    margin-top: 4px;
  }
`,ie=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 30px;
  color: ${a.navy};
  line-height: 1.25;
  margin: 0;
`,oe=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: ${a.navyMid};
  line-height: 1.35;
  margin: 0;
  max-width: 340px;
`,Dn=t.div`
  padding: 48px 48px 56px 48px;
  display: flex;
  flex-direction: column;
  gap: 56px;

  @media (max-width: 768px) { padding: 32px 24px 40px 24px; }
`,$n=t.h2`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(32px, 3vw, 48px);
  color: ${a.red};
  margin: 0 0 6px 0;
`,Mn=t.p`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${a.slate};
  letter-spacing: 1.12px;
  margin: 0 0 28px 0;
  max-width: 588px;
`,En=t.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`,Sn=t.div`
  flex: 1 1 280px;
  max-width: 352px;
  border: 1px solid ${a.navyLight};
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
`,Tn=t.div`
  padding: 14px 24px 10px;
  border-bottom: 1px solid ${a.divider};
`,Ln=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: ${a.navy};
  letter-spacing: 1.68px;
  margin: 0;
`,_n=t.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid ${a.divider};
  &:last-child { border-bottom: none; }
`,Nn=t.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 19px;
  color: ${a.slate};
  letter-spacing: 1.4px;
`,On=t.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: ${a.navyMid};
`,zn=t.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  color: ${a.slate};
`,Hn=t.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,Bn=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: ${a.red};
  letter-spacing: 1.12px;
  margin: 0;
`,Wn=t.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 48px);
  color: ${a.navy};
  letter-spacing: 2px;
  margin: 0;
`,Vn=t.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: ${a.slate};
  letter-spacing: 1.4px;
  margin: 0;
`,Fn=t.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`,ae=t.div`
  flex: 1 1 280px;
  border-left: 2px solid ${n=>n.variant==="banned"?a.red:a.navyMid};
  background: ${n=>n.variant==="banned"?a.redLight:a.blueLight};
  border-radius: 0 5px 5px 0;
  overflow: hidden;
`,re=t.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`,se=t.div`
  background: ${n=>n.variant==="banned"?a.red:a.navyMid};
  padding: 6px 12px;
  border-radius: 2px;

  span {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 14px;
    color: #fff;
    letter-spacing: 1px;
  }
`,le=t.p`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  color: ${n=>n.variant==="banned"?a.red:a.navyMid};
  letter-spacing: 1px;
  margin: 0;
`,ce=t.ul`
  list-style: none;
  margin: 0;
  padding: 8px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,de=t.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${a.navy};
  letter-spacing: 1px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${n=>n.variant==="banned"?a.red:a.navyMid};
  }
`;function Gn(){return e.jsxs(Rn,{children:[e.jsxs(Z,{children:[e.jsx(ee,{children:"Do"}),pn.map(n=>e.jsxs(ne,{children:[e.jsxs(te,{children:[e.jsx(kn,{}),e.jsx(ie,{children:n.title})]}),e.jsx(oe,{children:n.desc})]},n.title))]}),e.jsxs(Z,{children:[e.jsx(ee,{children:"Don't"}),xn.map(n=>e.jsxs(ne,{children:[e.jsxs(te,{children:[e.jsx(In,{children:e.jsx("span",{children:"!"})}),e.jsx(ie,{children:n.title})]}),e.jsx(oe,{children:n.desc})]},n.title))]})]})}function Un(){return e.jsxs(Dn,{children:[e.jsxs("div",{children:[e.jsx($n,{children:"Material Pricing"}),e.jsxs(Mn,{children:["We stock everything you need. Pay only for what you use — priced per gram, mL, or inch depending on the material. Before you come to the space check out the"," ",e.jsx("strong",{style:{fontWeight:800,color:a.red},children:"banned filaments section below."})]}),e.jsx(En,{children:fn.map(n=>e.jsxs(Sn,{children:[e.jsx(Tn,{children:e.jsx(Ln,{children:n.title})}),n.rows.map(o=>e.jsxs(_n,{children:[e.jsx(Nn,{children:o.mat}),e.jsxs("span",{children:[e.jsx(On,{children:o.price}),e.jsx(zn,{children:o.unit})]})]},o.mat))]},n.title))})]}),hn.map(n=>e.jsxs(Hn,{children:[e.jsx(Bn,{children:n.label}),e.jsx(Wn,{children:n.title}),e.jsx(Vn,{children:n.subtitle}),e.jsxs(Fn,{children:[n.banned.map(o=>e.jsxs(ae,{variant:"banned",children:[e.jsxs(re,{children:[e.jsx(se,{variant:"banned",children:e.jsx("span",{children:o.header})}),e.jsx(le,{variant:"banned",children:o.sub})]}),e.jsx(ce,{children:o.items.map(i=>e.jsx(de,{variant:"banned",children:i},i))})]},o.sub)),n.allowed.map(o=>e.jsxs(ae,{variant:"allowed",children:[e.jsxs(re,{children:[e.jsx(se,{variant:"allowed",children:e.jsx("span",{children:o.header})}),e.jsx(le,{variant:"allowed",children:o.sub})]}),e.jsx(ce,{children:o.items.map(i=>e.jsx(de,{variant:"allowed",children:i},i))})]},o.sub))]})]},n.title))]})}function Qn(){return e.jsxs(gn,{children:[e.jsxs(un,{children:[e.jsx(mn,{children:e.jsx("img",{src:rn,alt:"","aria-hidden":"true"})}),e.jsx(bn,{children:e.jsx("img",{src:ln,alt:"","aria-hidden":"true"})}),e.jsxs(vn,{children:[e.jsx(yn,{children:"FAQ"}),e.jsx(wn,{children:"Everything you need to know — our do's & don'ts, material rules, and pricing."})]})]}),e.jsxs(jn,{children:[e.jsx(Cn,{children:e.jsx("img",{src:sn,alt:"","aria-hidden":"true"})}),e.jsx(An,{children:e.jsxs(Pn,{type:"multiple",children:[e.jsxs(G,{value:"dos-and-donts",children:[e.jsx(U,{children:e.jsxs(Y,{children:[e.jsxs(K,{children:[e.jsx(q,{children:"Do's and Don'ts"}),e.jsx(Q,{children:"Things to help you navigate our space and streamline your visit"})]}),e.jsx(J,{"aria-hidden":!0})]})}),e.jsx(X,{children:e.jsx(Gn,{})})]}),e.jsxs(G,{value:"materials",children:[e.jsx(U,{children:e.jsxs(Y,{children:[e.jsxs(K,{children:[e.jsx(q,{children:"Material Information"}),e.jsx(Q,{children:"Pricing, filament rules, laser cutter materials, and more"})]}),e.jsx(J,{"aria-hidden":!0})]})}),e.jsx(X,{children:e.jsx(Un,{})})]})]})})]})]})}export{Qn as default};
