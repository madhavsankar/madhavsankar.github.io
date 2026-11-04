import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 177px;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  p {
    color: var(--slate);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    font-weight: 400;
    line-height: 1.65;
  }

  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  width: 177px;
  max-width: 100%;

  @media (max-width: 768px) {
    margin: 50px auto 0;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);
    transition: var(--transition);

    &:hover,
    &:focus-within {
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: normal;
      filter: none;
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      display: none;
    }

    &:after {
      top: 14px;
      left: 14px;
      z-index: -1;
      border: 2px solid var(--green);
    }
  }
`;

const skills = [
  'Distributed Systems',
  'API Development',
  'Agentic AI Development',
  'Model Context Protocol (MCP)',
  'Scalable Architecture',
];

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion && revealContainer.current) {
      sr?.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>
      <div className="inner">
        <StyledText>
          <div>
            <p>
              I’m a Senior Software Engineer at Google with 6+ years of experience building
              large-scale backend systems at Google and Microsoft. I work on the platform behind{' '}
              the{' '}
              <a
                href="https://developers.google.com/google-ads/api"
                target="_blank"
                rel="noopener noreferrer">
                Google Ads API
              </a>
              .
            </p>
            <p>My work spans distributed systems and agentic AI development.</p>
            <p>
              Before Google, I worked on Microsoft 365 Security and Compliance. I earned a master’s
              in Computer Science from UCLA and a bachelor’s in Computer Science from NIT Trichy,
              and have published research in distributed algorithms and natural language processing.
            </p>
            <p>Areas of focus:</p>
          </div>
          <ul className="skills-list">
            {skills.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </StyledText>
        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/madhavsankar.png"
              width={177}
              height={172}
              quality={100}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Portrait of Madhav Sankar"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
