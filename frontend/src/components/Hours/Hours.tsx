import React from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';
import rulerMask from '../../assets/img/ruler-mask-tile.svg?url';
import PageRuler from '../shared/PageRuler';

const RULER_IMG = rulerMask;

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const PageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CalendarSection = styled.section`
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
    background-image: url(${bgPattern});
    background-repeat: repeat;
    background-size: 122px 140px;
    opacity: 0.03;
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
`;

const CalendarCard = styled.div`
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
  }
`;

const CalendarFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Hours = () => {
  return (
    <PageWrapper>
      {/* Single continuous ruler spanning the entire page */}
      <PageRuler src={RULER_IMG} side="left" zIndex={1} />
      <CalendarSection>
        <CalendarCard>
          <CalendarFrame
            src="https://calendar.google.com/calendar/embed?src=k2r6osjjms6lqt41bi5a7j48n0%40group.calendar.google.com&ctz=America%2FNew_York&mode=WEEK"
            title="The Forge | The MILL — Weekly Calendar"
            scrolling="no"
          />
        </CalendarCard>
      </CalendarSection>
    </PageWrapper>
  );
};

export default Hours;
