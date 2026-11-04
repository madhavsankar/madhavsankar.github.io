import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import Constellation from '@components/constellation';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  position: relative;
  isolation: isolate;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  max-width: none;
  padding: 0 max(25px, calc((100vw - 1000px) / 2));
  overflow: hidden;
  background: var(--dark-navy);

  .constellation,
  .hero-vignette {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .hero-vignette {
    background: radial-gradient(ellipse at center, transparent 10%, rgb(2 12 27 / 62%) 100%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin-top: 40px;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.95;
  }

  p {
    max-width: 600px;
    margin: 20px 0 0;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .hero-button {
    ${({ theme }) => theme.mixins.bigButton};
    margin: 0;
  }

  .hero-button.secondary {
    border-color: var(--lightest-navy);
    color: var(--lightest-slate);
  }

  .scroll-cue {
    position: absolute;
    z-index: 2;
    bottom: 28px;
    left: 50%;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transform: translateX(-50%);

    &:after {
      display: block;
      width: 1px;
      height: 28px;
      margin: 10px auto 0;
      background: var(--slate);
      content: '';
    }
  }

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    min-height: 100vh;
    padding-top: var(--nav-height);
    padding-bottom: 90px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const items = [
    <h1 key="intro">Hi, my name is</h1>,
    <h2 className="big-heading" key="name">
      Madhav Sankar Krishnakumar.
    </h2>,
    <h3 className="big-heading" key="role">
      I build large-scale APIs and agentic systems.
    </h3>,
    <p key="copy">
      I’m a Senior Software Engineer at Google, working on the platform behind Google Ads API.
      Previously, I worked on Microsoft 365 security and compliance.
    </p>,
    <div className="hero-actions" key="actions">
      <Link className="hero-button" to="/#projects">
        Explore my work
      </Link>
      <a
        className="hero-button secondary"
        href="https://www.linkedin.com/in/madhavsankar/"
        target="_blank"
        rel="noopener noreferrer">
        Connect on LinkedIn
      </a>
    </div>,
  ];

  return (
    <StyledHeroSection id="hero" aria-label="Introduction">
      <Constellation />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content">
        {prefersReducedMotion ? (
          items.map(item => <div key={item.key}>{item}</div>)
        ) : (
          <TransitionGroup component={null}>
            {isMounted &&
              items.map((item, index) => (
                <CSSTransition key={item.key} classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: `${(index + 1) * 100}ms` }}>{item}</div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </div>
      <Link className="scroll-cue" to="/#about">
        Scroll to explore
      </Link>
    </StyledHeroSection>
  );
};

export default Hero;
