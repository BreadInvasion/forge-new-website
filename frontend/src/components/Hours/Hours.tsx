import React from 'react';
import { styled } from 'styled-components';
import bgPattern from '../../assets/img/background.svg?url';

// TODO: Download and store locally in src/assets/img/hours/
const RULER_IMG = 'https://www.figma.com/api/mcp/asset/f5317051-1b0b-4812-a79c-8e691f277dcd';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const PageWrapper = styled.div`
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
`;

/* Red right accent — separate element since ::before and ::after are taken */
const RightAccent = styled.div`
  
`;

const RulerWrap = styled.div`
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
      <CalendarSection>
        <RulerWrap>
          <img src={RULER_IMG} alt="" aria-hidden="true" />
        </RulerWrap>

        <RightAccent />

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
