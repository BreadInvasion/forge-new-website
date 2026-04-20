import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { styled, keyframes } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';
import PageRuler from '../shared/PageRuler';

// ── Figma Assets (expire 7 days) ──────────────────────────────────────────
const RULER_SECTION = 'https://www.figma.com/api/mcp/asset/fcadc8e2-4ed1-4591-8ceb-9844b0a96897';
const HERO_DECO     = 'https://www.figma.com/api/mcp/asset/89f022fa-4c4b-433d-9526-8f0955c8c183';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  navy:      '#111c36',
  navyMid:   '#2d4a80',
  navyLight: '#31519c',
  red:       '#a51c1c',
  redLight:  'rgba(165,28,28,0.15)',
  blueLight: 'rgba(45,74,128,0.15)',
  slate:     '#64748b',
  lightBlue: '#bac8db',
  bgLight:   '#eef2f8',
  divider:   '#e2e8f0',
};

// ── Animations ────────────────────────────────────────────────────────────
const slideDown = keyframes`
  from { height: 0; }
  to   { height: var(--radix-accordion-content-height); }
`;
const slideUp = keyframes`
  from { height: var(--radix-accordion-content-height); }
  to   { height: 0; }
`;

// ── Data ──────────────────────────────────────────────────────────────────

const DOS = [
  {
    title: 'Ask Questions',
    desc: "We welcome curiosity and excitement. Everyone will be coming in with different levels of experience so don't hesitate to ask questions.",
  },
  {
    title: 'Be Kind',
    desc: 'The Forge is a welcoming place due to our staff being student volunteers. We are not paid and often have exams when you do!',
  },
  {
    title: 'Have Fun',
    desc: 'Our space is for making and creating! We are here to help you realize your dreams, so let us know how we can help!',
  },
];

const DONTS = [
  {
    title: 'Assume',
    desc: "We know that many students walking in have experience with 3D printing. We have specific rules that don't change because we operate 24/7/365.",
  },
  {
    title: 'Rush',
    desc: 'We understand that everyone has deadlines, but our space is always changing and trying to help as many people as possible.',
  },
  {
    title: 'Make Boxes',
    desc: 'Unless the container being made is hyper specialized, please consider buying a box or using the laser cutter. Both options are cheaper and faster!',
  },
];

const PRICING = [
  {
    title: 'Filament',
    rows: [
      { mat: 'PLA',  price: '$0.06', unit: '/gram' },
      { mat: 'PETG', price: '$0.09', unit: '/gram' },
      { mat: 'TPU',  price: '$0.09', unit: '/gram' },
    ],
  },
  {
    title: 'Resin',
    rows: [
      { mat: 'Clear', price: '$0.18', unit: '/mL' },
      { mat: 'Grey',  price: '$0.18', unit: '/mL' },
    ],
  },
  {
    title: 'Vinyl',
    rows: [
      { mat: 'Standard',    price: '$0.20', unit: '/in' },
      { mat: 'Holographic', price: '$0.20', unit: '/in' },
      { mat: 'Ink',         price: '$2.00', unit: '/cc' },
    ],
  },
];

const MACHINE_RULES = [
  {
    label:    'FDM 3D Printing',
    title:    'Filament rules & recommendations',
    subtitle: 'Make sure to check the banned filaments',
    banned: [
      { header: 'NOT ALLOWED', sub: 'Banned material types', items: ['Particulate filaments','Wood','Fiber Additives','Metal','Marble Silk','PLA Pro','Ultra & Super variants','etc.'] },
      { header: 'NOT ALLOWED', sub: 'Banned brands',         items: ['Elegoo','Sunlu','GeeeTech','XYZPrinting','Ender','Amazon Basics','Generic + No Names','Unnamed + Blank Spools'] },
    ],
    allowed: [
      { header: 'RECOMMENDED', sub: 'Filaments we trust',    items: ['Prusament','Polar','Polymaker','InLand','Jessie','Printed Solid','Overture','Hatchbox'] },
    ],
  },
  {
    label:    'Laser Cutter',
    title:    'Laser Cutter',
    subtitle: "Materials you can and can't use",
    banned: [
      { header: 'NOT ALLOWED', sub: 'Banned materials', items: ['Pressure treated wood','Corrugated cardboard','PVC','Vinyl','ABS','Materials containing chlorine/halogen'] },
    ],
    allowed: [
      { header: 'ALLOWED', sub: 'Filaments we trust',   items: ['Wood','MDF','Taskboard','Cardboard','Acrylic','Polystyrene','Polyethylene','Polypropylene','Butyl rubber'] },
    ],
  },
  {
    label:    'Vinyl/Sticker Printer',
    title:    'Vinyl/Sticker Printer',
    subtitle: "Materials you can and can't use",
    banned: [
      { header: 'NOT ALLOWED', sub: 'Banned',      items: ['Over 24 inches wide'] },
    ],
    allowed: [
      { header: 'RECOMMENDED', sub: 'Allowed', items: ['Glossy Vinyl','Matte Vinyl','Clear Glossy','Clear Matte','Holographic','Heat Transfer','Banner Cloth','Oracle 3651'] },
    ],
  },
];

// =============================================================================
// Styled components — Page shell
// =============================================================================

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-x: hidden;
`;

// ── Hero ──────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 362px;
  background: linear-gradient(to right, #2d0707, ${C.red});
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;


const HeroDecoWrap = styled.div`
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
`;

const HeroInner = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 174px 60px 127px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 60px 80px; }
  @media (max-width: 640px)  { padding: 48px 24px; }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(48px, 6vw, 75px);
  color: #fff;
  line-height: 1.25;
  margin: 0 0 16px 0;
`;

const HeroSubtitle = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 2.2vw, 32px);
  color: ${C.lightBlue};
  line-height: 1.25;
  max-width: 680px;
  margin: 0;
`;

// ── Content section ───────────────────────────────────────────────────────

const ContentSection = styled.section`
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.03;
    pointer-events: none;
  }
`;

const SectionInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 120px 80px 174px;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { padding: 48px 60px 64px 80px; }
  @media (max-width: 640px)  { padding: 40px 24px 56px 24px; }
`;

// =============================================================================
// Styled components — Radix Accordion
// =============================================================================

const AccordionRoot = styled(Accordion.Root)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const AccordionItem = styled(Accordion.Item)`
  border: 1.5px solid ${C.divider};
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  &[data-state='open'] {
    border-color: ${C.navyMid};
  }
`;

const AccordionHeader = styled(Accordion.Header)`
  all: unset;
  display: block;
  margin: 0;
  padding: 0;
`;

const AccordionTrigger = styled(Accordion.Trigger)`
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

  &:hover { background: ${C.bgLight}; }
  &[data-state='open'] { background: ${C.bgLight}; border-bottom: 1.5px solid ${C.divider}; }
`;

const TriggerLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TriggerTitle = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  color: ${C.navy};
  line-height: 1.25;
`;

const TriggerSub = styled.span`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: ${C.slate};
  letter-spacing: 0.5px;
`;

const Chevron = styled(ChevronDownIcon)`
  color: ${C.navyMid};
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);

  [data-state='open'] & { transform: rotate(180deg); }
`;

const AccordionContentPanel = styled(Accordion.Content)`
  overflow: hidden;
  background: #fff;

  &[data-state='open']  { animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1); }
  &[data-state='closed']{ animation: ${slideUp}   300ms cubic-bezier(0.87, 0, 0.13, 1); }
`;

// =============================================================================
// Styled components — Do's and Don'ts content
// =============================================================================

const DosDontsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 48px 48px 56px 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 24px 40px 24px;
  }
`;

const DDColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const DDColTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 50px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0 0 4px 0;
`;

const DDItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DDItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CircleIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${C.navyMid};
  flex-shrink: 0;
`;

const TriangleIcon = styled.div`
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
    color: ${C.navy};
    line-height: 1;
    margin-top: 4px;
  }
`;

const DDItemTitle = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 30px;
  color: ${C.navy};
  line-height: 1.25;
  margin: 0;
`;

const DDItemDesc = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  color: ${C.navyMid};
  line-height: 1.35;
  margin: 0;
  max-width: 340px;
`;

// =============================================================================
// Styled components — Materials content
// =============================================================================

const MaterialsContent = styled.div`
  padding: 48px 48px 56px 48px;
  display: flex;
  flex-direction: column;
  gap: 56px;

  @media (max-width: 768px) { padding: 32px 24px 40px 24px; }
`;

// ── Pricing ──

const PricingSectionTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(32px, 3vw, 48px);
  color: ${C.red};
  margin: 0 0 6px 0;
`;

const PricingSectionSub = styled.p`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${C.slate};
  letter-spacing: 1.12px;
  margin: 0 0 28px 0;
  max-width: 588px;
`;

const PricingGrid = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const PricingCard = styled.div`
  flex: 1 1 280px;
  max-width: 352px;
  border: 1px solid ${C.navyLight};
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
`;

const PricingCardHeader = styled.div`
  padding: 14px 24px 10px;
  border-bottom: 1px solid ${C.divider};
`;

const PricingCardTitle = styled.p`
  font-family: var(--font-display);
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

const PricingMat = styled.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 19px;
  color: ${C.slate};
  letter-spacing: 1.4px;
`;

const PricingAmt = styled.span`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: ${C.navyMid};
`;

const PricingUnit = styled.span`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  color: ${C.slate};
`;

// ── Machine rules ──

const MachineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MachineLabel = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: ${C.red};
  letter-spacing: 1.12px;
  margin: 0;
`;

const MachineTitle = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 48px);
  color: ${C.navy};
  letter-spacing: 2px;
  margin: 0;
`;

const MachineSubtitle = styled.p`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: ${C.slate};
  letter-spacing: 1.4px;
  margin: 0;
`;

const RulesPanelRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const RulePanel = styled.div<{ variant: 'banned' | 'allowed' }>`
  flex: 1 1 280px;
  border-left: 2px solid ${p => p.variant === 'banned' ? C.red : C.navyMid};
  background: ${p => p.variant === 'banned' ? C.redLight : C.blueLight};
  border-radius: 0 5px 5px 0;
  overflow: hidden;
`;

const RulePanelTop = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RuleBadge = styled.div<{ variant: 'banned' | 'allowed' }>`
  background: ${p => p.variant === 'banned' ? C.red : C.navyMid};
  padding: 6px 12px;
  border-radius: 2px;

  span {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 14px;
    color: #fff;
    letter-spacing: 1px;
  }
`;

const RuleBadgeSub = styled.p<{ variant: 'banned' | 'allowed' }>`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  color: ${p => p.variant === 'banned' ? C.red : C.navyMid};
  letter-spacing: 1px;
  margin: 0;
`;

const RuleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RuleListItem = styled.li<{ variant: 'banned' | 'allowed' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: ${C.navy};
  letter-spacing: 1px;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${p => p.variant === 'banned' ? C.red : C.navyMid};
  }
`;

// =============================================================================
// Sub-components
// =============================================================================

function DosDontsContent() {
  return (
    <DosDontsGrid>
      {/* Do column */}
      <DDColumn>
        <DDColTitle>Do</DDColTitle>
        {DOS.map(item => (
          <DDItem key={item.title}>
            <DDItemHeader>
              <CircleIcon />
              <DDItemTitle>{item.title}</DDItemTitle>
            </DDItemHeader>
            <DDItemDesc>{item.desc}</DDItemDesc>
          </DDItem>
        ))}
      </DDColumn>

      {/* Don't column */}
      <DDColumn>
        <DDColTitle>Don't</DDColTitle>
        {DONTS.map(item => (
          <DDItem key={item.title}>
            <DDItemHeader>
              <TriangleIcon><span>!</span></TriangleIcon>
              <DDItemTitle>{item.title}</DDItemTitle>
            </DDItemHeader>
            <DDItemDesc>{item.desc}</DDItemDesc>
          </DDItem>
        ))}
      </DDColumn>
    </DosDontsGrid>
  );
}

function MaterialsContentPanel() {
  return (
    <MaterialsContent>
      {/* Pricing */}
      <div>
        <PricingSectionTitle>Material Pricing</PricingSectionTitle>
        <PricingSectionSub>
          We stock everything you need. Pay only for what you use — priced per gram, mL, or inch
          depending on the material. Before you come to the space check out the{' '}
          <strong style={{ fontWeight: 800, color: C.red }}>banned filaments section below.</strong>
        </PricingSectionSub>
        <PricingGrid>
          {PRICING.map(card => (
            <PricingCard key={card.title}>
              <PricingCardHeader>
                <PricingCardTitle>{card.title}</PricingCardTitle>
              </PricingCardHeader>
              {card.rows.map(row => (
                <PricingRow key={row.mat}>
                  <PricingMat>{row.mat}</PricingMat>
                  <span>
                    <PricingAmt>{row.price}</PricingAmt>
                    <PricingUnit>{row.unit}</PricingUnit>
                  </span>
                </PricingRow>
              ))}
            </PricingCard>
          ))}
        </PricingGrid>
      </div>

      {/* Machine rules */}
      {MACHINE_RULES.map(machine => (
        <MachineBlock key={machine.title}>
          <MachineLabel>{machine.label}</MachineLabel>
          <MachineTitle>{machine.title}</MachineTitle>
          <MachineSubtitle>{machine.subtitle}</MachineSubtitle>
          <RulesPanelRow>
            {machine.banned.map(panel => (
              <RulePanel key={panel.sub} variant="banned">
                <RulePanelTop>
                  <RuleBadge variant="banned"><span>{panel.header}</span></RuleBadge>
                  <RuleBadgeSub variant="banned">{panel.sub}</RuleBadgeSub>
                </RulePanelTop>
                <RuleList>
                  {panel.items.map(item => (
                    <RuleListItem key={item} variant="banned">{item}</RuleListItem>
                  ))}
                </RuleList>
              </RulePanel>
            ))}
            {machine.allowed.map(panel => (
              <RulePanel key={panel.sub} variant="allowed">
                <RulePanelTop>
                  <RuleBadge variant="allowed"><span>{panel.header}</span></RuleBadge>
                  <RuleBadgeSub variant="allowed">{panel.sub}</RuleBadgeSub>
                </RulePanelTop>
                <RuleList>
                  {panel.items.map(item => (
                    <RuleListItem key={item} variant="allowed">{item}</RuleListItem>
                  ))}
                </RuleList>
              </RulePanel>
            ))}
          </RulesPanelRow>
        </MachineBlock>
      ))}
    </MaterialsContent>
  );
}

// =============================================================================
// Main component
// =============================================================================

export default function FAQ() {
  return (
    <PageWrapper>

      {/* Single continuous ruler down the left edge of the page */}
      <PageRuler src={RULER_SECTION} side="left" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection>
        <HeroDecoWrap>
          <img src={HERO_DECO} alt="" aria-hidden="true" />
        </HeroDecoWrap>
        <HeroInner>
          <HeroTitle>FAQ</HeroTitle>
          <HeroSubtitle>
            Everything you need to know — our do's &amp; don'ts, material rules, and pricing.
          </HeroSubtitle>
        </HeroInner>
      </HeroSection>

      {/* ── Accordion section ─────────────────────────────────────────────── */}
      <ContentSection>
        <SectionInner>

          <AccordionRoot type="multiple">

            {/* ── Item 1: Do's and Don'ts ───────────────────────────────── */}
            <AccordionItem value="dos-and-donts">
              <AccordionHeader>
                <AccordionTrigger>
                  <TriggerLeft>
                    <TriggerTitle>Do's and Don'ts</TriggerTitle>
                    <TriggerSub>Things to help you navigate our space and streamline your visit</TriggerSub>
                  </TriggerLeft>
                  <Chevron aria-hidden />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContentPanel>
                <DosDontsContent />
              </AccordionContentPanel>
            </AccordionItem>

            {/* ── Item 2: Material Information ─────────────────────────── */}
            <AccordionItem value="materials">
              <AccordionHeader>
                <AccordionTrigger>
                  <TriggerLeft>
                    <TriggerTitle>Material Information</TriggerTitle>
                    <TriggerSub>Pricing, filament rules, laser cutter materials, and more</TriggerSub>
                  </TriggerLeft>
                  <Chevron aria-hidden />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContentPanel>
                <MaterialsContentPanel />
              </AccordionContentPanel>
            </AccordionItem>

          </AccordionRoot>

        </SectionInner>
      </ContentSection>

    </PageWrapper>
  );
}
