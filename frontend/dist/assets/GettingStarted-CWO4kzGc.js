import{r as w,j as e,u as i}from"./index-BvyJdg8B.js";import{b as k}from"./background-_MUij_O6.js";const P="https://www.figma.com/api/mcp/asset/2ee84860-092b-437d-a811-cd043d04c5d0",S="https://www.figma.com/api/mcp/asset/eac57d69-f072-4e3a-b856-5314d8f551a8",L="https://www.figma.com/api/mcp/asset/c96236fb-9208-4949-9a04-e9e32cf364fe",j="https://www.figma.com/api/mcp/asset/7c80f8d8-834a-4822-b125-67a1c47398d7",b="https://www.figma.com/api/mcp/asset/be993c25-e7d4-4f74-bebf-6dfba428cb75",M="https://www.figma.com/api/mcp/asset/8f36fbb2-423f-4013-a256-1e53fb0798a2",T="https://www.figma.com/api/mcp/asset/70eb0629-d89b-47c7-8c0a-2b33fc9a6b24",n={navy:"#111c36",navyMid:"#2d4a80",navyLight:"#31519c",red:"#a51c1c",redMuted:"rgba(165,28,28,0.75)",slate:"#64748b",lightBlue:"#bac8db",bgLight:"#eef2f8",divider:"#e2e8f0"},z=i.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`,r=i.section`
  position: relative;
  width: 100%;
  background: ${s=>s.bg??"#fff"};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${k});
    background-repeat: repeat;
    background-size: 122px 140px;
    background-position: 0 var(--pattern-y, 0px);
    opacity: 0.05;
    pointer-events: none;
  }
`,o=i.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 120px 0 174px;
  position: relative;

  @media (max-width: 1024px) {
    padding-left: 80px;
    padding-right: 60px;
  }

  @media (max-width: 640px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`,l=i.div`
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
`,d=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${n.red};
  letter-spacing: 1.12px;
  margin: 0 0 12px 0;
`,p=i.h2`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: ${n.navy};
  line-height: 1.25;
  margin: 0 0 16px 0;
`,c=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: ${n.slate};
  letter-spacing: 1.12px;
  line-height: 1.25;
  max-width: 572px;
  margin: 0 0 40px 0;
`,C=i.section`
  position: relative;
  width: 100%;
  min-height: 361px;
  background: linear-gradient(to right, ${n.navy}, ${n.navyLight});
  overflow: hidden;
  flex-shrink: 0;
`,E=i.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 174px;
  position: relative;
  min-height: 361px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`,B=i.div`
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

  img {
    transform: rotate(-90deg) scaleY(-1);
    width: 750px;
    height: 79px;
    object-fit: fill;
    flex-shrink: 0;
  }
`,v=i.div`
  position: absolute;
  width: ${s=>s.w}px;
  height: ${s=>s.h}px;
  right: ${s=>s.right}px;
  top: ${s=>s.top}px;
  background-image: url(${s=>s.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  overflow: hidden;
  pointer-events: none;
`,R=i.h1`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(40px, 5.2vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 20px 0;
  max-width: 820px;
`,H=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${n.lightBlue};
  line-height: 1.25;
  max-width: 780px;
  margin: 0;
`,I=i.div`
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  padding: 12px 0 8px 0;
  flex-wrap: wrap;
`,G=i.div`
  display: flex;
  gap: 12px;
  align-items: center;
`,A=i.div`
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  img { position: absolute; inset: 0; width: 100%; height: 100%; }

  span {
    position: absolute;
    top: 2px;
    left: 8px;
    font-family: 'Funnel Display', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: #fff;
    line-height: 1.25;
    pointer-events: none;
  }
`,W=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${n.navy};
  line-height: 1.25;
  white-space: nowrap;
`,U=i.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`,_=i.div`
  flex: 1 1 150px;
  max-width: 171px;
  min-height: 284px;
  border: 1px solid ${n.slate};
  border-radius: 5px;
  background: #fff;
  padding: 24px 16px 20px 16px;
  display: flex;
  flex-direction: column;
`,N=i.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  margin-bottom: 10px;
`,O=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${n.red};
`,V=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${n.navy};
  letter-spacing: 1.68px;
`,Y=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${n.slate};
  letter-spacing: 1.4px;
  line-height: 1.25;
  margin: 0 0 8px 0;
`,X=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${n.slate};
  line-height: 1.35;
  margin: 0;
  flex: 1;
`,q=i.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 36px;
`,x=i.div`
  flex: 1 1 300px;
  max-width: 352px;
  border: 1px solid ${n.navyLight};
  border-radius: 5px;
  background: ${n.bgLight};
  overflow: hidden;
`,f=i.div`
  padding: 16px 24px 10px 24px;
  border-bottom: 1px solid ${n.divider};
`,h=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${n.navy};
  letter-spacing: 1.68px;
  margin: 0;
`,g=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid ${n.divider};

  &:last-child { border-bottom: none; }
`,m=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${n.slate};
  letter-spacing: 1.4px;
`,u=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${n.navyMid};
`,y=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${n.slate};
`,K=i.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 28px;
  background: ${n.red};
  border: 2px solid ${n.navy};
  border-radius: 10px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`,J=i.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`,Q=i.div`
  flex: 1 1 200px;
  max-width: 256px;
  min-height: 284px;
  border: 1px solid ${n.slate};
  border-radius: 5px;
  background: #fff;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Z=i.div`
  background: ${n.lightBlue};
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  margin: 12px 0 0 16px;
  align-self: flex-start;
`,ee=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;
`,ie=i.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${n.navy};
  letter-spacing: 1.68px;
  line-height: 1.25;
  padding: 10px 16px 0 16px;
  margin: 0;
`,ne=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${n.slate};
  line-height: 1.25;
  letter-spacing: 1.05px;
  padding: 8px 16px 0 16px;
  margin: 0;
  flex: 1;
`,te=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${n.red};
  letter-spacing: 1.05px;
  padding: 10px 16px 6px 16px;
  margin: 0;
`,se=i.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px;
`,ae=i.span`
  background: ${n.redMuted};
  border-radius: 5px;
  padding: 4px 8px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;
`,re=i.div`
  display: flex;
  gap: 72px;
  flex-wrap: wrap;
`,F=i.div`
  flex: 1 1 380px;
  max-width: 426px;
  border: 1px solid ${n.navyLight};
  border-radius: 5px;
  background: ${n.bgLight};
  overflow: hidden;
`,$=i.div`
  background: linear-gradient(to right, ${s=>s.from}, ${s=>s.to});
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`,D=i.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #fff;
  letter-spacing: 2.52px;
  margin: 0;
`,oe=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  border-bottom: 1px solid ${n.divider};

  &:last-child { border-bottom: none; }
`,le=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${n.slate};
  letter-spacing: 1.4px;
`,de=i.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${n.navyMid};
`,pe=i.div`
  padding: 18px 28px 20px 28px;
`,ce=i.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${n.slate};
  letter-spacing: 1.4px;
  line-height: 1.35;
  margin: 0;

  strong { font-weight: 700; color: ${n.red}; }
`,xe=[{ext:"STL",machine:"FFF & Resin 3D Printing",desc:"Standard 3D model format. Export from Fusion 360, Blender, NX, etc."},{ext:"SVG",machine:"Laser Cutter & Sticker Printer",desc:"Vector format required. Use Illustrator, Inkscape, or Figma. Outline all paths."},{ext:"DXF",machine:"Laser Cutter",desc:"CAD vector format from Fusion 360, AutoCAD, or SolidWorks exports."},{ext:"PNG",machine:"Sticker Printer & Laser Cutter",desc:"White background preferred for vinyl and stickers."},{ext:"3MF",machine:"FFF 3D Printing",desc:"A modern, zipped file format designed specifically for 3D printing. Export from Fusion 360, Blender, NX, etc."},{ext:"PDF",machine:"Sticker Printer & Laser Cutter",desc:"Vector PDF only — not a rasterized export. Verify in Acrobat before visiting."}],fe=[{tag:"Cut & Engrave",name:"Laser Cutter",desc:"Cuts and engraves flat sheet materials with precision. Great for 2D shapes and custom designs.",uses:["Wood","Acrylic","More"]},{tag:"3D Models",name:"FDM 3D Printers",desc:"Builds 3D objects layer by layer with plastic filament. Best for prototypes and functional parts.",uses:["Prototypes","More"]},{tag:"High Resolution",name:"Resin Printer",desc:"UV-cured resin for ultra-fine detail. Ideal for miniatures, molds, and complex geometries.",uses:["Mini Figures","More"]},{tag:"Decals & Stickers",name:"Vinyl/Sticker Printer",desc:"Cuts adhesive vinyl into custom shapes. Perfect for stickers, decals, and iron-on transfers.",uses:["Stickers","Decals"]}],he=[{n:1,label:"File Types"},{n:2,label:"Materials & Pricing"},{n:3,label:"Pick a Machine"},{n:4,label:"Where to Find Us"},{n:5,label:"Register!"}];function ue(){const s=w.useRef(null);return w.useLayoutEffect(()=>{const t=s.current;t&&t.querySelectorAll("[data-pattern]").forEach(a=>{a.style.setProperty("--pattern-y",`-${a.offsetTop}px`)})},[]),e.jsxs(z,{ref:s,children:[e.jsxs(C,{children:[e.jsx(B,{children:e.jsx("img",{src:L,alt:"","aria-hidden":"true"})}),e.jsx(v,{src:S,w:321,h:315,right:12,top:23}),e.jsx(v,{src:P,w:283,h:101,right:336,top:265}),e.jsxs(E,{children:[e.jsx(R,{children:"Getting Started at The Forge"}),e.jsx(H,{children:"Everything you need to know before your first visit — what machines we have, where to find us, what files to bring, and what materials cost."})]})]}),e.jsxs(r,{"data-pattern":!0,bg:"#fff",children:[e.jsx(l,{children:e.jsx("img",{src:j,alt:"","aria-hidden":"true"})}),e.jsx(I,{children:he.map(t=>e.jsxs(G,{children:[e.jsxs(A,{children:[e.jsx("img",{src:M,alt:"","aria-hidden":"true"}),e.jsx("span",{children:t.n})]}),e.jsx(W,{children:t.label})]},t.n))}),e.jsxs(o,{style:{paddingTop:48,paddingBottom:64},children:[e.jsx(d,{children:"STEP 1"}),e.jsx(p,{children:"What file type do you need?"}),e.jsx(c,{children:"Prepare your files before you visit. Different machines need different formats — check below so you're ready to go."}),e.jsx(U,{children:xe.map(t=>e.jsxs(_,{children:[e.jsxs(N,{children:[e.jsx(O,{children:"."}),e.jsx(V,{children:t.ext})]}),e.jsx(Y,{children:t.machine}),e.jsx(X,{children:t.desc})]},t.ext))})]})]}),e.jsxs(r,{"data-pattern":!0,bg:n.bgLight,children:[e.jsx(l,{children:e.jsx("img",{src:b,alt:"","aria-hidden":"true"})}),e.jsxs(o,{style:{paddingTop:64,paddingBottom:64},children:[e.jsx(d,{children:"STEP 2"}),e.jsx(p,{children:"Materials & Pricing"}),e.jsxs(c,{children:["We stock everything you need. Pay only for what you use — priced per gram, mL, or inch depending on the material. Before you come to the space check out the"," ",e.jsx("strong",{style:{fontWeight:800,color:n.red},children:"banned filaments page."})]}),e.jsxs(q,{children:[e.jsxs(x,{children:[e.jsx(f,{children:e.jsx(h,{children:"Filament"})}),[{mat:"PLA",price:"$0.06",unit:"/gram"},{mat:"PETG",price:"$0.09",unit:"/gram"},{mat:"TPU",price:"$0.09",unit:"/gram"}].map(t=>e.jsxs(g,{children:[e.jsx(m,{children:t.mat}),e.jsxs("span",{children:[e.jsx(u,{children:t.price}),e.jsx(y,{children:t.unit})]})]},t.mat))]}),e.jsxs(x,{children:[e.jsx(f,{children:e.jsx(h,{children:"Resin"})}),[{mat:"Clear",price:"$0.18",unit:"/mL"},{mat:"Grey",price:"$0.18",unit:"/mL"}].map(t=>e.jsxs(g,{children:[e.jsx(m,{children:t.mat}),e.jsxs("span",{children:[e.jsx(u,{children:t.price}),e.jsx(y,{children:t.unit})]})]},t.mat))]}),e.jsxs(x,{children:[e.jsx(f,{children:e.jsx(h,{children:"Vinyl"})}),[{mat:"Standard",price:"$0.20",unit:"/in"},{mat:"Holographic",price:"$0.20",unit:"/in"},{mat:"Ink",price:"$2.00",unit:"/cc"}].map(t=>e.jsxs(g,{children:[e.jsx(m,{children:t.mat}),e.jsxs("span",{children:[e.jsx(u,{children:t.price}),e.jsx(y,{children:t.unit})]})]},t.mat))]})]}),e.jsx(K,{href:"#",children:"Banned Filaments"})]})]}),e.jsxs(r,{"data-pattern":!0,bg:"#fff",children:[e.jsx(l,{children:e.jsx("img",{src:j,alt:"","aria-hidden":"true"})}),e.jsxs(o,{style:{paddingTop:64,paddingBottom:64},children:[e.jsx(d,{children:"STEP 3"}),e.jsx(p,{children:"Pick a Machine"}),e.jsx(c,{children:"Find the right tool for your project. Not sure? Ask a volunteer — we're always on-site to help."}),e.jsx(J,{children:fe.map(t=>e.jsxs(Q,{children:[e.jsx(Z,{children:e.jsx(ee,{children:t.tag})}),e.jsx(ie,{children:t.name}),e.jsx(ne,{children:t.desc}),e.jsx(te,{children:"BEST FOR"}),e.jsx(se,{children:t.uses.map(a=>e.jsx(ae,{children:a},a))})]},t.name))})]})]}),e.jsxs(r,{"data-pattern":!0,bg:n.bgLight,children:[e.jsx(l,{children:e.jsx("img",{src:b,alt:"","aria-hidden":"true"})}),e.jsxs(o,{style:{paddingTop:64,paddingBottom:80},children:[e.jsx(d,{children:"STEP 4"}),e.jsx(p,{children:"Where to Find Us"}),e.jsx(c,{children:"We're on campus and easy to find. Look for the makerspace signs on the second floor of the DCC."}),e.jsxs(re,{children:[e.jsxs(F,{children:[e.jsx($,{from:n.navy,to:n.navyMid,children:e.jsx(D,{children:"Hours"})}),[{day:"Monday – Friday",time:"9 am – 6 pm"},{day:"Saturday",time:"Closed"},{day:"Sunday",time:"Check the Calendar"}].map(t=>e.jsxs(oe,{children:[e.jsx(le,{children:t.day}),e.jsx(de,{children:t.time})]},t.day))]}),e.jsxs(F,{children:[e.jsxs($,{from:n.navy,to:n.navyLight,children:[e.jsx(D,{children:"Location"}),e.jsx("img",{src:T,alt:"","aria-hidden":"true",style:{height:40,width:34,marginLeft:8}})]}),e.jsx(pe,{children:e.jsxs(ce,{children:["We are located in the basement of the"," ",e.jsx("strong",{children:"Center of Industrial Innovation"})," building in"," ",e.jsx("strong",{children:"room CII2037A"})]})})]})]})]})]})]})}export{ue as default};
