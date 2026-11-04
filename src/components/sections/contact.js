import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { email, srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;

  .overline {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  .title {
    margin: 0 0 20px;
    color: var(--lightest-slate);
    font-size: clamp(40px, 5vw, 60px);
  }

  p {
    margin: 0 auto;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 40px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion && revealContainer.current) {
      sr?.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>
      <h2 className="title">Let’s connect.</h2>
      <p>I’m always happy to talk distributed systems, APIs, or AI agents.</p>
      <a className="email-link" href={`mailto:${email}`}>
        Say hello
      </a>
    </StyledContactSection>
  );
};

export default Contact;
