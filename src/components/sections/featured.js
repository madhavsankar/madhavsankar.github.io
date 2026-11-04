import React, { useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
`;

const StyledProject = styled.li`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
  align-items: center;
  margin-bottom: 100px;

  &:last-child {
    margin-bottom: 60px;
  }

  &:nth-of-type(even) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;
    }

    .project-visual {
      grid-column: 1 / 8;
    }

    .project-tech-list,
    .project-links {
      justify-content: flex-end;
    }
  }

  .project-content {
    position: relative;
    z-index: 2;
    grid-column: 1 / 8;
    grid-row: 1;
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    margin: 0 0 20px;
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 30px);
  }

  .project-summary {
    margin: 0 0 14px;
    color: var(--light-slate);
    font-size: var(--fz-lg);
  }

  .project-description {
    position: relative;
    padding: 20px 24px;
    border-radius: var(--border-radius);
    background: var(--light-navy);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    color: var(--light-slate);
    font-size: var(--fz-md);

    h3 {
      margin: 18px 0 6px;
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
    }

    h3:first-child {
      margin-top: 0;
    }

    ul {
      ${({ theme }) => theme.mixins.fancyList};
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 18px;
    padding: 0;
    margin: 22px 0 8px;
    list-style: none;

    li {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .project-links {
    display: flex;
    margin: 10px 0 0 -10px;

    a {
      ${({ theme }) => theme.mixins.smallButton};
    }
  }

  .project-visual {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 1;
    display: flex;
    grid-column: 6 / -1;
    grid-row: 1;
    min-height: 290px;
    align-items: center;
    justify-content: center;
    padding: 30px;
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    background:
      linear-gradient(135deg, rgb(100 255 218 / 8%), transparent 58%),
      var(--dark-navy);
    color: var(--green);
    font-family: var(--font-mono);
    text-align: center;

    span {
      display: block;
      font-size: clamp(22px, 3vw, 36px);
      font-weight: 600;
      letter-spacing: 0.08em;
    }

    small {
      display: block;
      margin-top: 14px;
      color: var(--light-slate);
      font-size: var(--fz-xs);
      font-weight: 400;
      letter-spacing: 0.02em;
    }
  }

  @media (max-width: 768px) {
    position: relative;
    display: block;
    margin-bottom: 60px;

    .project-content,
    &:nth-of-type(even) .project-content {
      grid-column: 1 / -1;
      padding: 30px;
      text-align: left;
    }

    .project-visual,
    &:nth-of-type(even) .project-visual {
      position: absolute;
      inset: 0;
      min-height: 0;
      opacity: 0.2;
    }

    .project-description {
      padding: 20px 0;
      background: transparent;
      box-shadow: none;
    }

    .project-tech-list,
    .project-links,
    &:nth-of-type(even) .project-tech-list,
    &:nth-of-type(even) .project-links {
      justify-content: flex-start;
    }
  }

  @media (max-width: 480px) {
    .project-content,
    &:nth-of-type(even) .project-content {
      padding: 24px 20px;
    }
  }
`;

const Featured = () => {
  const { featured } = useStaticQuery(graphql`
    query FeaturedProjects {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { frontmatter: { sortOrder: ASC } }
      ) {
        nodes {
          frontmatter {
            title
            summary
            range
            tech
            external
            ctaLabel
          }
          html
        }
      }
    }
  `);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (revealTitle.current) sr?.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((element, index) => {
      if (element) sr?.reveal(element, srConfig(index * 100));
    });
  }, [prefersReducedMotion]);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Selected Work
      </h2>
      <StyledProjectsGrid>
        {featured.nodes.map(({ frontmatter, html }, index) => (
          <StyledProject key={frontmatter.title} ref={element => (revealProjects.current[index] = element)}>
            <div className="project-content">
              <p className="project-overline">Featured Project · {frontmatter.range}</p>
              <h3 className="project-title">{frontmatter.title}</h3>
              <p className="project-summary">{frontmatter.summary}</p>
              <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
              {frontmatter.tech?.length > 0 && (
                <ul className="project-tech-list" aria-label="Technologies and focus areas">
                  {frontmatter.tech.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {frontmatter.external && (
                <div className="project-links">
                  <a
                    href={frontmatter.external}
                    target="_blank"
                    rel="noopener noreferrer">
                    {frontmatter.ctaLabel || 'Learn more'}
                  </a>
                </div>
              )}
            </div>
            <div className="project-visual" aria-hidden="true">
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{frontmatter.title}</small>
              </div>
            </div>
          </StyledProject>
        ))}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
