import React, { useEffect, useRef, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 900px;

  .inner {
    display: flex;
    min-height: 340px;

    @media (max-width: 600px) {
      display: block;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border: 0;
  border-left: 2px solid ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--lightest-navy)')};
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  &:hover,
  &:focus-visible {
    background-color: var(--light-navy);
  }

  @media (max-width: 600px) {
    justify-content: center;
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid
      ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--lightest-navy)')};
    text-align: center;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  h4 {
    margin: 1.4rem 0 0.4rem;
    color: var(--lightest-slate);
    font-size: var(--fz-lg);
  }

  p,
  li {
    font-size: var(--fz-md);
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Jobs = () => {
  const { jobs } = useStaticQuery(graphql`
    query JobHistory {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { frontmatter: { sortOrder: ASC } }
      ) {
        nodes {
          frontmatter {
            title
            company
            location
            range
            url
          }
          html
        }
      }
    }
  `);
  const jobsData = jobs.nodes;
  const [activeTabId, setActiveTabId] = useState(0);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion && revealContainer.current) {
      sr?.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  const onKeyDown = event => {
    let nextIndex = activeTabId;

    if (event.key === KEY_CODES.ARROW_UP || event.key === KEY_CODES.ARROW_LEFT) {
      nextIndex = (activeTabId + jobsData.length - 1) % jobsData.length;
    } else if (event.key === KEY_CODES.ARROW_DOWN || event.key === KEY_CODES.ARROW_RIGHT) {
      nextIndex = (activeTabId + 1) % jobsData.length;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTabId(nextIndex);
    tabs.current[nextIndex]?.focus();
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Where I’ve Worked</h2>
      <div className="inner">
        <StyledTabList
          role="tablist"
          aria-label="Experience by organization"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}>
          {jobsData.map(({ frontmatter }, index) => (
            <StyledTabButton
              key={frontmatter.company}
              isActive={activeTabId === index}
              onClick={() => setActiveTabId(index)}
              ref={element => (tabs.current[index] = element)}
              id={`tab-${index}`}
              type="button"
              role="tab"
              tabIndex={activeTabId === index ? 0 : -1}
              aria-selected={activeTabId === index}
              aria-controls={`panel-${index}`}>
              {frontmatter.company}
            </StyledTabButton>
          ))}
        </StyledTabList>

        <StyledTabPanels>
          {jobsData.map(({ frontmatter, html }, index) => (
            <CSSTransition
              key={frontmatter.company}
              in={activeTabId === index}
              timeout={250}
              classNames="fade">
              <StyledTabPanel
                id={`panel-${index}`}
                role="tabpanel"
                tabIndex={activeTabId === index ? 0 : -1}
                aria-labelledby={`tab-${index}`}
                aria-hidden={activeTabId !== index}
                hidden={activeTabId !== index}>
                <h3>
                  <span>{frontmatter.title}</span>
                  <span className="company">
                    &nbsp;@&nbsp;
                    {frontmatter.url ? (
                      <a href={frontmatter.url}>{frontmatter.company}</a>
                    ) : (
                      frontmatter.company
                    )}
                  </span>
                </h3>
                <p className="range">
                  {frontmatter.location} · {frontmatter.range}
                </p>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </StyledTabPanel>
            </CSSTransition>
          ))}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
