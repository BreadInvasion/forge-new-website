import React, { useLayoutEffect, useRef } from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';

// ---------------------------------------------------------------------------
// Figma asset URLs — valid for 7 days after generation.
// TODO: Download and replace with local imports from src/assets/img/getting-started/
// ---------------------------------------------------------------------------
const HERO_BG_DESKTOP = 'https://www.figma.com/api/mcp/asset/2ee84860-092b-437d-a811-cd043d04c5d0';
const HERO_BG_MOBILE  = 'https://www.figma.com/api/mcp/asset/eac57d69-f072-4e3a-b856-5314d8f551a8';
const RULER_1         = 'https://www.figma.com/api/mcp/asset/c96236fb-9208-4949-9a04-e9e32cf364fe';
const RULER_2         = 'https://www.figma.com/api/mcp/asset/7c80f8d8-834a-4822-b125-67a1c47398d7';
const RULER_3         = 'https://www.figma.com/api/mcp/asset/be993c25-e7d4-4f74-bebf-6dfba428cb75';
const STEP_DOT        = 'https://www.figma.com/api/mcp/asset/8f36fbb2-423f-4013-a256-1e53fb0798a2';
const LOC_PIN         = 'https://www.figma.com/api/mcp/asset/70eb0629-d89b-47c7-8c0a-2b33fc9a6b24';

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
  navy:        '#111c36',
  navyMid:     '#2d4a80',
  navyLight:   '#31519c',
  red:         '#a51c1c',
  redMuted:    'rgba(165,28,28,0.75)',
  slate:       '#64748b',
  lightBlue:   '#bac8db',
  bgLight:     '#eef2f8',
  divider:     '#e2e8f0',
};

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

/** Full-bleed section wrapper */
const Section = styled.section<{ bg?: string }>`
  position: relative;
  width: 100%;
  background: ${p => p.bg ?? '#fff'};
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    background-position: 0 var(--pattern-y, 0px);
    opacity: 0.05;
    pointer-events: none;
  }
`;

/** Left-aligned content with Figma-matching horizontal margins */
const SectionInner = styled.div`
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
`;

/** Vertical ruler decoration pinned to the left edge of a section */
const RulerWrap = styled.div`
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
`;

// ---------------------------------------------------------------------------
// Step label (red, tracking)
// ---------------------------------------------------------------------------
const StepLabel = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${C.red};
  letter-spacing: 1.12px;
  margin: 0 0 12px 0;
`;

const SectionTitle = styled.h2`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0 0 16px 0;
`;

const SectionSubtitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: ${C.slate};
  letter-spacing: 1.12px;
  line-height: 1.25;
  max-width: 572px;
  margin: 0 0 40px 0;
`;

// ============================================================
// HERO
// ============================================================
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 361px;
  background: linear-gradient(to right, ${C.navy}, ${C.navyLight});
  overflow: hidden;
  flex-shrink: 0;
`;

const HeroInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 174px;
  position: relative;
  min-height: 361px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroRuler = styled.div`
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
`;

/** Decorative floating geometry in the hero right area */
const HeroDeco = styled.div<{ src: string; w: number; h: number; right: number; top: number }>`
  position: absolute;
  width: ${p => p.w}px;
  height: ${p => p.h}px;
  right: ${p => p.right}px;
  top: ${p => p.top}px;
  background-image: url(${p => p.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  overflow: hidden;
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(40px, 5.2vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 20px 0;
  max-width: 820px;
`;

const HeroSubtitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${C.lightBlue};
  line-height: 1.25;
  max-width: 780px;
  margin: 0;
`;

// ============================================================
// STEP PROGRESS BAR  (sits at top of Step-1 section)
// ============================================================
const StepBar = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  padding: 12px 0 8px 0;
  flex-wrap: wrap;
`;

const StepItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const StepDot = styled.div`
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
`;

const StepName = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  line-height: 1.25;
  white-space: nowrap;
`;

// ============================================================
// FILE TYPES  (Step 1)
// ============================================================
const FileCardsGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const FileCard = styled.div`
  flex: 1 1 150px;
  max-width: 171px;
  min-height: 284px;
  border: 1px solid ${C.slate};
  border-radius: 5px;
  background: #fff;
  padding: 24px 16px 20px 16px;
  display: flex;
  flex-direction: column;
`;

const FileExtRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  margin-bottom: 10px;
`;

const FileDot = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${C.red};
`;

const FileExt = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${C.navy};
  letter-spacing: 1.68px;
`;

const FileMachine = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${C.slate};
  letter-spacing: 1.4px;
  line-height: 1.25;
  margin: 0 0 8px 0;
`;

const FileDesc = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.slate};
  line-height: 1.35;
  margin: 0;
  flex: 1;
`;

// ============================================================
// MATERIALS & PRICING  (Step 2)
// ============================================================
const PricingGrid = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 36px;
`;

const PricingCard = styled.div`
  flex: 1 1 300px;
  max-width: 352px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: ${C.bgLight};
  overflow: hidden;
`;

const PricingCardHeader = styled.div`
  padding: 16px 24px 10px 24px;
  border-bottom: 1px solid ${C.divider};
`;

const PricingCardTitle = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  letter-spacing: 1.68px;
  margin: 0;
`;

const PricingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  border-bottom: 1px solid ${C.divider};

  &:last-child { border-bottom: none; }
`;

const PricingMaterial = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
`;

const PricingAmount = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${C.navyMid};
`;

const PricingUnit = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${C.slate};
`;

const BannedBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 28px;
  background: ${C.red};
  border: 2px solid ${C.navy};
  border-radius: 10px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
`;

// ============================================================
// MACHINES  (Step 3)
// ============================================================
const MachineGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const MachineCard = styled.div`
  flex: 1 1 200px;
  max-width: 256px;
  min-height: 284px;
  border: 1px solid ${C.slate};
  border-radius: 5px;
  background: #fff;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MachineTag = styled.div`
  background: ${C.lightBlue};
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
  border-radius: 5px;
  margin: 12px 0 0 16px;
  align-self: flex-start;
`;

const MachineTagText = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;
`;

const MachineName = styled.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: ${C.navy};
  letter-spacing: 1.68px;
  line-height: 1.25;
  padding: 10px 16px 0 16px;
  margin: 0;
`;

const MachineDesc = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.slate};
  line-height: 1.25;
  letter-spacing: 1.05px;
  padding: 8px 16px 0 16px;
  margin: 0;
  flex: 1;
`;

const MachineBestFor = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: ${C.red};
  letter-spacing: 1.05px;
  padding: 10px 16px 6px 16px;
  margin: 0;
`;

const MachineTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px;
`;

const MachineUseTag = styled.span`
  background: ${C.redMuted};
  border-radius: 5px;
  padding: 4px 8px;
  font-family: 'Funnel Display', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.05px;
`;

// ============================================================
// WHERE TO FIND US  (Step 4)
// ============================================================
const LocationGrid = styled.div`
  display: flex;
  gap: 72px;
  flex-wrap: wrap;
`;

const InfoCard = styled.div`
  flex: 1 1 380px;
  max-width: 426px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: ${C.bgLight};
  overflow: hidden;
`;

const InfoCardHeader = styled.div<{ from: string; to: string }>`
  background: linear-gradient(to right, ${p => p.from}, ${p => p.to});
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoCardHeaderTitle = styled.h3`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 34px;
  color: #fff;
  letter-spacing: 2.52px;
  margin: 0;
`;

const HoursRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  border-bottom: 1px solid ${C.divider};

  &:last-child { border-bottom: none; }
`;

const HoursDay = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
`;

const HoursTime = styled.span`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${C.navyMid};
`;

const LocationBody = styled.div`
  padding: 18px 28px 20px 28px;
`;

const LocationText = styled.p`
  font-family: 'Funnel Display', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
  line-height: 1.35;
  margin: 0;

  strong { font-weight: 700; color: ${C.red}; }
`;

// ============================================================
// FILE TYPES DATA
// ============================================================
const FILE_TYPES = [
  { ext: 'STL', machine: 'FFF & Resin 3D Printing', desc: 'Standard 3D model format. Export from Fusion 360, Blender, NX, etc.' },
  { ext: 'SVG', machine: 'Laser Cutter & Sticker Printer', desc: 'Vector format required. Use Illustrator, Inkscape, or Figma. Outline all paths.' },
  { ext: 'DXF', machine: 'Laser Cutter', desc: 'CAD vector format from Fusion 360, AutoCAD, or SolidWorks exports.' },
  { ext: 'PNG', machine: 'Sticker Printer & Laser Cutter', desc: 'White background preferred for vinyl and stickers.' },
  { ext: '3MF', machine: 'FFF 3D Printing', desc: 'A modern, zipped file format designed specifically for 3D printing. Export from Fusion 360, Blender, NX, etc.' },
  { ext: 'PDF', machine: 'Sticker Printer & Laser Cutter', desc: 'Vector PDF only — not a rasterized export. Verify in Acrobat before visiting.' },
];

// ============================================================
// MACHINES DATA
// ============================================================
const MACHINES = [
  {
    tag: 'Cut & Engrave',
    name: 'Laser Cutter',
    desc: 'Cuts and engraves flat sheet materials with precision. Great for 2D shapes and custom designs.',
    uses: ['Wood', 'Acrylic', 'More'],
  },
  {
    tag: '3D Models',
    name: 'FDM 3D Printers',
    desc: 'Builds 3D objects layer by layer with plastic filament. Best for prototypes and functional parts.',
    uses: ['Prototypes', 'More'],
  },
  {
    tag: 'High Resolution',
    name: 'Resin Printer',
    desc: 'UV-cured resin for ultra-fine detail. Ideal for miniatures, molds, and complex geometries.',
    uses: ['Mini Figures', 'More'],
  },
  {
    tag: 'Decals & Stickers',
    name: 'Vinyl/Sticker Printer',
    desc: 'Cuts adhesive vinyl into custom shapes. Perfect for stickers, decals, and iron-on transfers.',
    uses: ['Stickers', 'Decals'],
  },
];

// ============================================================
// STEPS DATA
// ============================================================
const STEPS = [
  { n: 1, label: 'File Types' },
  { n: 2, label: 'Materials & Pricing' },
  { n: 3, label: 'Pick a Machine' },
  { n: 4, label: 'Where to Find Us' },
  { n: 5, label: 'Register!' },
];

// ============================================================
// COMPONENT
// ============================================================
export default function GettingStarted() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.querySelectorAll<HTMLElement>('[data-pattern]').forEach(el => {
      el.style.setProperty('--pattern-y', `-${el.offsetTop}px`);
    });
  }, []);

  return (
    <PageWrapper ref={wrapperRef}>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <HeroSection>
        <HeroRuler>
          <img src={RULER_1} alt="" aria-hidden="true" />
        </HeroRuler>
        {/* Decorative background shapes */}
        <HeroDeco src={HERO_BG_MOBILE}  w={321} h={315} right={12}  top={23}  />
        <HeroDeco src={HERO_BG_DESKTOP} w={283} h={101} right={336} top={265} />
        <HeroInner>
          <HeroTitle>Getting Started at The Forge</HeroTitle>
          <HeroSubtitle>
            Everything you need to know before your first visit — what machines we have,
            where to find us, what files to bring, and what materials cost.
          </HeroSubtitle>
        </HeroInner>
      </HeroSection>

      {/* ── STEP 1: FILE TYPES ─────────────────────────────────────────────── */}
      <Section data-pattern bg="#fff">
        <RulerWrap>
          <img src={RULER_2} alt="" aria-hidden="true" />
        </RulerWrap>

        {/* Step progress bar */}
        <StepBar>
          {STEPS.map(s => (
            <StepItem key={s.n}>
              <StepDot>
                <img src={STEP_DOT} alt="" aria-hidden="true" />
                <span>{s.n}</span>
              </StepDot>
              <StepName>{s.label}</StepName>
            </StepItem>
          ))}
        </StepBar>

        <SectionInner style={{ paddingTop: 48, paddingBottom: 64 }}>
          <StepLabel>STEP 1</StepLabel>
          <SectionTitle>What file type do you need?</SectionTitle>
          <SectionSubtitle>
            Prepare your files before you visit. Different machines need different formats —
            check below so you're ready to go.
          </SectionSubtitle>

          <FileCardsGrid>
            {FILE_TYPES.map(f => (
              <FileCard key={f.ext}>
                <FileExtRow>
                  <FileDot>.</FileDot>
                  <FileExt>{f.ext}</FileExt>
                </FileExtRow>
                <FileMachine>{f.machine}</FileMachine>
                <FileDesc>{f.desc}</FileDesc>
              </FileCard>
            ))}
          </FileCardsGrid>
        </SectionInner>
      </Section>

      {/* ── STEP 2: MATERIALS & PRICING ────────────────────────────────────── */}
      <Section data-pattern bg={C.bgLight}>
        <RulerWrap>
          <img src={RULER_3} alt="" aria-hidden="true" />
        </RulerWrap>
        <SectionInner style={{ paddingTop: 64, paddingBottom: 64 }}>
          <StepLabel>STEP 2</StepLabel>
          <SectionTitle>Materials &amp; Pricing</SectionTitle>
          <SectionSubtitle>
            We stock everything you need. Pay only for what you use — priced per gram, mL,
            or inch depending on the material. Before you come to the space check out the{' '}
            <strong style={{ fontWeight: 800, color: C.red }}>banned filaments page.</strong>
          </SectionSubtitle>

          <PricingGrid>
            {/* Filament */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Filament</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'PLA',  price: '$0.06', unit: '/gram' },
                { mat: 'PETG', price: '$0.09', unit: '/gram' },
                { mat: 'TPU',  price: '$0.09', unit: '/gram' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>

            {/* Resin */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Resin</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'Clear', price: '$0.18', unit: '/mL' },
                { mat: 'Grey',  price: '$0.18', unit: '/mL' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>

            {/* Vinyl */}
            <PricingCard>
              <PricingCardHeader>
                <PricingCardTitle>Vinyl</PricingCardTitle>
              </PricingCardHeader>
              {[
                { mat: 'Standard',     price: '$0.20', unit: '/in' },
                { mat: 'Holographic',  price: '$0.20', unit: '/in' },
                { mat: 'Ink',          price: '$2.00', unit: '/cc' },
              ].map(r => (
                <PricingRow key={r.mat}>
                  <PricingMaterial>{r.mat}</PricingMaterial>
                  <span>
                    <PricingAmount>{r.price}</PricingAmount>
                    <PricingUnit>{r.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>
          </PricingGrid>

          <BannedBtn href="#">Banned Filaments</BannedBtn>
        </SectionInner>
      </Section>

      {/* ── STEP 3: MACHINES ───────────────────────────────────────────────── */}
      <Section data-pattern bg="#fff">
        <RulerWrap>
          <img src={RULER_2} alt="" aria-hidden="true" />
        </RulerWrap>
        <SectionInner style={{ paddingTop: 64, paddingBottom: 64 }}>
          <StepLabel>STEP 3</StepLabel>
          <SectionTitle>Pick a Machine</SectionTitle>
          <SectionSubtitle>
            Find the right tool for your project. Not sure? Ask a volunteer — we're always
            on-site to help.
          </SectionSubtitle>

          <MachineGrid>
            {MACHINES.map(m => (
              <MachineCard key={m.name}>
                <MachineTag>
                  <MachineTagText>{m.tag}</MachineTagText>
                </MachineTag>
                <MachineName>{m.name}</MachineName>
                <MachineDesc>{m.desc}</MachineDesc>
                <MachineBestFor>BEST FOR</MachineBestFor>
                <MachineTags>
                  {m.uses.map(u => (
                    <MachineUseTag key={u}>{u}</MachineUseTag>
                  ))}
                </MachineTags>
              </MachineCard>
            ))}
          </MachineGrid>
        </SectionInner>
      </Section>

      {/* ── STEP 4: WHERE TO FIND US ───────────────────────────────────────── */}
      <Section data-pattern bg={C.bgLight}>
        <RulerWrap>
          <img src={RULER_3} alt="" aria-hidden="true" />
        </RulerWrap>
        <SectionInner style={{ paddingTop: 64, paddingBottom: 80 }}>
          <StepLabel>STEP 4</StepLabel>
          <SectionTitle>Where to Find Us</SectionTitle>
          <SectionSubtitle>
            We're on campus and easy to find. Look for the makerspace signs on the second
            floor of the DCC.
          </SectionSubtitle>

          <LocationGrid>
            {/* Hours card */}
            <InfoCard>
              <InfoCardHeader from={C.navy} to={C.navyMid}>
                <InfoCardHeaderTitle>Hours</InfoCardHeaderTitle>
              </InfoCardHeader>
              {[
                { day: 'Monday – Friday', time: '9 am – 6 pm' },
                { day: 'Saturday',        time: 'Closed' },
                { day: 'Sunday',          time: 'Check the Calendar' },
              ].map(r => (
                <HoursRow key={r.day}>
                  <HoursDay>{r.day}</HoursDay>
                  <HoursTime>{r.time}</HoursTime>
                </HoursRow>
              ))}
            </InfoCard>

            {/* Location card */}
            <InfoCard>
              <InfoCardHeader from={C.navy} to={C.navyLight}>
                <InfoCardHeaderTitle>Location</InfoCardHeaderTitle>
                <img src={LOC_PIN} alt="" aria-hidden="true" style={{ height: 40, width: 34, marginLeft: 8 }} />
              </InfoCardHeader>
              <LocationBody>
                <LocationText>
                  We are located in the basement of the{' '}
                  <strong>Center of Industrial Innovation</strong> building in{' '}
                  <strong>room CII2037A</strong>
                </LocationText>
              </LocationBody>
            </InfoCard>
          </LocationGrid>
        </SectionInner>
      </Section>

    </PageWrapper>
  );
}
