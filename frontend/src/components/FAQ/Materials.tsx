import React from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';

// ── Figma Assets ──────────────────────────────────────────────────────────
// Ruler images — three variants, alternated between sections so consecutive
// sections never show the same pattern (matches the Create/GettingStarted page).
const RULER_1   = 'https://www.figma.com/api/mcp/asset/c96236fb-9208-4949-9a04-e9e32cf364fe';
const RULER_2   = 'https://www.figma.com/api/mcp/asset/7c80f8d8-834a-4822-b125-67a1c47398d7';
const RULER_3   = 'https://www.figma.com/api/mcp/asset/be993c25-e7d4-4f74-bebf-6dfba428cb75';
const HERO_DECO = 'https://www.figma.com/api/mcp/asset/366c8e9b-0c94-4167-934e-fb6eff4d35f9';

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  navy:      '#111c36',
  navyMid:   '#2d4a80',
  navyLight: '#31519c',
  red:       '#a51c1c',
  redBright: '#d12b2b',
  // Vibrant red / blue panel fills — top-lit gradient so the panel reads as
  // an actual coloured card instead of a flat 15%-alpha wash. Paired with a
  // thicker left accent bar and a saturated drop-shadow below.
  redFill:     'linear-gradient(180deg, rgba(209, 43, 43, 0.22) 0%, rgba(165, 28, 28, 0.12) 100%)',
  redBorder:   'rgba(165, 28, 28, 0.35)',
  redShadow:   'rgba(165, 28, 28, 0.28)',
  blueFill:    'linear-gradient(180deg, rgba(62, 99, 172, 0.22) 0%, rgba(45, 74, 128, 0.12) 100%)',
  blueBorder:  'rgba(45, 74, 128, 0.35)',
  blueShadow:  'rgba(45, 74, 128, 0.28)',
  slate:     '#64748b',
  lightBlue: '#bac8db',
  divider:   '#e2e8f0',
  // Alternating section backgrounds (matches the Create/GettingStarted page)
  bgWhite:   '#ffffff',
  bgLight:   '#eef2f8',
};

// ── Data ──────────────────────────────────────────────────────────────────

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
      { header: 'RECOMMENDED', sub: 'Filaments we trust', items: ['Prusament','Polar','Polymaker','InLand','Jessie','Printed Solid','Overture','Hatchbox'] },
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
      { header: 'ALLOWED', sub: 'Approved materials', items: ['Wood','MDF','Taskboard','Cardboard','Acrylic','Polystyrene','Polyethylene','Polypropylene','Butyl rubber'] },
    ],
  },
  {
    label:    'Vinyl/Sticker Printer',
    title:    'Vinyl/Sticker Printer',
    subtitle: "Materials you can and can't use",
    banned: [
      { header: 'NOT ALLOWED', sub: 'Banned', items: ['Over 24 inches wide'] },
    ],
    allowed: [
      { header: 'RECOMMENDED', sub: 'Allowed', items: ['Glossy Vinyl','Matte Vinyl','Clear Glossy','Clear Matte','Holographic','Heat Transfer','Banner Cloth','Oracle 3651'] },
    ],
  },
];

// =============================================================================
// Styled components
// =============================================================================

const PageWrapper = styled.div`
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

/**
 * Vertical ruler decoration. A single 750px image is centered vertically
 * inside a 79px-wide strip and clipped by the parent section's
 * `overflow: hidden`. Each section renders its OWN ruler, so consecutive
 * sections never visually collide — matching the Create/GettingStarted page.
 *
 * Flip logic:
 *   - $side="left"  → rotate(-90deg) scaleY(-1)   (tick marks face inward / right)
 *   - $side="right" → rotate( 90deg) scaleY(-1)   (tick marks face inward / left)
 */
const RulerStrip = styled.div<{ $side?: 'left' | 'right' }>`
  position: absolute;
  ${p => p.$side === 'right' ? 'right: -1px;' : 'left: -1px;'}
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
    width: 750px;
    height: 79px;
    object-fit: fill;
    flex-shrink: 0;
    transform: ${p => p.$side === 'right'
      ? 'rotate(90deg) scaleY(-1)'
      : 'rotate(-90deg) scaleY(-1)'};
  }
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

// SectionRuler reuses RulerStrip — defined above

const ContentSection = styled.section<{ $bg?: 'white' | 'light' }>`
  position: relative;
  width: 100%;
  background: ${p => p.$bg === 'light' ? C.bgLight : C.bgWhite};
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
  /* leave room on the right for the ruler strip (79px wide) */
  padding: 64px 174px 80px 120px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 1024px) { padding: 48px 100px 64px 60px; }
  @media (max-width: 640px)  { padding: 40px 40px 56px 24px; }
`;

// ── Pricing ───────────────────────────────────────────────────────────────

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

// ── Machine rules ─────────────────────────────────────────────────────────

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
  position: relative;
  /* Thicker accent bar on the left + a soft framing border everywhere else
     so the panel reads as a contained, coloured card instead of a wash. */
  border-left: 5px solid ${p => p.variant === 'banned' ? C.red : C.navyMid};
  border-top: 1px solid ${p => p.variant === 'banned' ? C.redBorder : C.blueBorder};
  border-right: 1px solid ${p => p.variant === 'banned' ? C.redBorder : C.blueBorder};
  border-bottom: 1px solid ${p => p.variant === 'banned' ? C.redBorder : C.blueBorder};
  background: ${p => p.variant === 'banned' ? C.redFill : C.blueFill};
  border-radius: 0 6px 6px 0;
  overflow: hidden;
  /* Saturated drop-shadow in the panel's own hue — lifts the card off the
     page without turning grey like a generic black shadow would. */
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.4) inset,
    0 2px 4px rgba(17, 28, 54, 0.06),
    0 12px 28px ${p => p.variant === 'banned' ? C.redShadow : C.blueShadow};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.5) inset,
      0 4px 8px rgba(17, 28, 54, 0.08),
      0 16px 36px ${p => p.variant === 'banned' ? C.redShadow : C.blueShadow};
  }
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
  border-radius: 3px;
  box-shadow: 0 2px 6px ${p => p.variant === 'banned'
    ? 'rgba(165, 28, 28, 0.35)'
    : 'rgba(45, 74, 128, 0.35)'};

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

// Inline SVG data URLs for the bullet icons. Banned items get a red circle
// with a white X; allowed items get a navy circle with a white checkmark.
// Using %23 for the `#` so the hex colors survive URL-encoding, and keeping
// the stroke chunky so the glyphs read clearly at 16px.
const BANNED_ICON = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='%23a51c1c'/><path d='M5 5l6 6M11 5l-6 6' stroke='white' stroke-width='2.2' stroke-linecap='round'/></svg>")`;
const ALLOWED_ICON = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='%232d4a80'/><path d='M4.3 8.2l2.4 2.4 5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>")`;

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
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border-radius: 50%;
    background-image: ${p => p.variant === 'banned' ? BANNED_ICON : ALLOWED_ICON};
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    box-shadow: 0 0 0 2px ${p => p.variant === 'banned'
      ? 'rgba(165, 28, 28, 0.18)'
      : 'rgba(45, 74, 128, 0.18)'};
  }
`;
// ── Info Box (for special notes like Resin Printer) ──────────────────────

const InfoBoxSection = styled.div`
  display: flex;
  gap: 48px;
  align-items: flex-start;
  padding: 0;
`;

const InfoBoxLeft = styled.div`
  flex: 0 0 auto;
  max-width: 320px;
`;

const InfoBoxLeftTitle = styled.h3`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 42px);
  color: ${C.navy};
  letter-spacing: 1px;
  margin: 0 0 16px 0;
  line-height: 1.2;
`;

const InfoBoxLeftSubtitle = styled.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 16px;
  color: ${C.slate};
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  flex: 1;
  border-left: 5px solid ${C.red};
  border-top: 1px solid ${C.redBorder};
  border-right: 1px solid ${C.redBorder};
  border-bottom: 1px solid ${C.redBorder};
  background: ${C.redFill};
  border-radius: 0 6px 6px 0;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.4) inset,
    0 2px 4px rgba(17, 28, 54, 0.06),
    0 12px 28px ${C.redShadow};
`;

const InfoBoxIcon = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: ${C.red};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  box-shadow: 0 3px 10px rgba(165, 28, 28, 0.4);
`;

const InfoBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoBoxTitle = styled.h4`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: ${C.red};
  letter-spacing: 1px;
  margin: 0;
`;

const InfoBoxText = styled.p`
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  color: ${C.navy};
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
`;

// Add this data object at the top with your other data
const RESIN_INFO = {
  title: 'Resin Printer',
  subtitle: 'Please read the information regarding printing with resin',
  boxTitle: 'Important Information on Resin',
  boxText: 'You cannot bring your own resin to The Forge. All resin printing must use materials stocked and approved by staff. This ensures machine compatibility and keeps our printers in good condition for everyone.',
};

// ... rest of your styled components ...

export default function Materials() {
  return (
    <PageWrapper>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection>
        <RulerStrip $side="right">
          <img src={RULER_1} alt="" aria-hidden="true" />
        </RulerStrip>
        <HeroDecoWrap>
          <img src={HERO_DECO} alt="" aria-hidden="true" />
        </HeroDecoWrap>
        <HeroInner>
          <HeroTitle>Material Information</HeroTitle>
          <HeroSubtitle>
            Pricing, filament rules, laser cutter materials, and more.
          </HeroSubtitle>
        </HeroInner>
      </HeroSection>

      {/* ── Pricing section (white) ──────────────────────────────────────── */}
      <ContentSection $bg="white">
        <RulerStrip $side="right">
          <img src={RULER_2} alt="" aria-hidden="true" />
        </RulerStrip>
        <SectionInner>
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
        </SectionInner>
      </ContentSection>

      {/* ── Machine rule sections (each in its own container) ───────────── */}
      {MACHINE_RULES.map((machine, index) => {
        // Ruler sequence down the page — RULER_2 is red, RULER_3 is blue.
        // No two adjacent sections share a ruler so the eye keeps moving.
        //   Hero      → R1
        //   Pricing   → R2  (red)
        //   FDM       → R3  (blue)   — machine idx 0
        //   Laser     → R2  (red)    — machine idx 1
        //   Resin box → R3  (blue)   — conditional, injected after Laser below
        //   Vinyl     → R2  (red)    — machine idx 2
        // Vinyl (the Sticker Printer) is explicitly red per design; Resin
        // explicitly blue; both drive the picks on their respective rows.
        const MACHINE_RULERS = [RULER_3, RULER_2, RULER_2];
        const machineRuler = MACHINE_RULERS[index];
        // Background alternation across ALL sections (Pricing, FDM, Laser, Resin, Vinyl).
        // Pricing is white; the Resin info block (inserted after Laser) takes the "light"
        // slot between Laser and Vinyl — so Vinyl at idx 2 flips back to white to keep
        // the stripe cadence going.
        //   FDM (idx 0) → light, Laser (idx 1) → white, Vinyl (idx 2) → white
        const machineBg: 'white' | 'light' =
          (['light', 'white', 'white'] as const)[index];
        return (
        <React.Fragment key={machine.title}>
          <ContentSection $bg={machineBg}>
            <RulerStrip $side="right">
              <img src={machineRuler} alt="" aria-hidden="true" />
            </RulerStrip>
            <SectionInner>
              <MachineBlock>
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
            </SectionInner>
          </ContentSection>

          {/* Resin Printer Info Box — its own container, rendered after the
              Laser Cutter section (index 1). Uses RULER_3 (blue) per design;
              its neighbours — Laser above (red R2) and Vinyl below (red R2)
              — both sit on red, so the blue ruler breaks up the run cleanly. */}
          {index === 1 && (
            <ContentSection $bg="light">
              <RulerStrip $side="right">
                <img src={RULER_3} alt="" aria-hidden="true" />
              </RulerStrip>
              <SectionInner>
                <InfoBoxSection>
                  <InfoBoxLeft>
                    <InfoBoxLeftTitle>{RESIN_INFO.title}</InfoBoxLeftTitle>
                    <InfoBoxLeftSubtitle>{RESIN_INFO.subtitle}</InfoBoxLeftSubtitle>
                  </InfoBoxLeft>
                  <InfoBox>
                    <InfoBoxIcon>!</InfoBoxIcon>
                    <InfoBoxContent>
                      <InfoBoxTitle>{RESIN_INFO.boxTitle}</InfoBoxTitle>
                      <InfoBoxText>{RESIN_INFO.boxText}</InfoBoxText>
                    </InfoBoxContent>
                  </InfoBox>
                </InfoBoxSection>
              </SectionInner>
            </ContentSection>
          )}
        </React.Fragment>
        );
      })}

    </PageWrapper>
  );
}