import React, { useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import Icon from '@components/icons/icon';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
`;

const StyledProject = styled.li`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 60px;
  }

  .project-card {
    padding: clamp(24px, 5vw, 48px);
    border-top: 2px solid var(--green);
    border-radius: var(--border-radius);
    background: var(--light-navy);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
  }

  .project-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .project-icon {
    display: flex;
    color: var(--green);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  .project-overline {
    margin: 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    text-transform: uppercase;
  }

  .project-title {
    margin: 0 0 14px;
    color: var(--lightest-slate);
    font-size: clamp(24px, 4vw, 30px);
  }

  .project-range {
    margin: 0 0 12px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .project-summary {
    max-width: 900px;
    margin: 0;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.6;
  }

  .project-details {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
    gap: 28px;
    margin-top: 42px;
  }

  .project-detail {
    padding-left: 20px;
    border-left: 1px solid var(--lightest-navy);
  }

  .project-detail h4 {
    margin: 0 0 14px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    font-weight: 400;
  }

  .project-detail p,
  .project-detail ul {
    margin: 0;
    color: var(--light-slate);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    font-weight: 400;
    line-height: 1.65;
  }

  .project-detail ul {
    ${({ theme }) => theme.mixins.fancyList};
    padding-left: 20px;
  }

  .project-detail li {
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    line-height: 1.65;
  }

  .project-detail li + li {
    margin-top: 10px;
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    padding: 0;
    margin: 32px 0 0;
    list-style: none;

    li {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .project-links {
    margin: 20px 0 0;

    a {
      ${({ theme }) => theme.mixins.smallButton};
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 900px) {
    .project-card {
      padding: 26px 24px;
    }

    .project-details {
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 32px;
    }

    .project-tech-list {
      margin-top: 26px;
    }
  }

  @media (max-width: 480px) {
    .project-card {
      padding: 24px 20px;
    }

    .project-header {
      margin-bottom: 24px;
    }

    .project-summary {
      font-size: var(--fz-md);
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
            details {
              title
              text
              bullets
            }
          }
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
        {featured.nodes.map(({ frontmatter }, index) => (
          <StyledProject
            key={frontmatter.title}
            ref={element => (revealProjects.current[index] = element)}>
            <article className="project-card">
              <header className="project-header">
                <span className="project-icon" aria-hidden="true">
                  <Icon name="Folder" />
                </span>
                <p className="project-overline">Featured · {String(index + 1).padStart(2, '0')}</p>
              </header>
              <h3 className="project-title">{frontmatter.title}</h3>
              <p className="project-range">{frontmatter.range}</p>
              <p className="project-summary">{frontmatter.summary}</p>

              <div className="project-details">
                {frontmatter.details.map(detail => (
                  <div className="project-detail" key={detail.title}>
                    <h4>{detail.title}</h4>
                    {detail.text && <p>{detail.text}</p>}
                    {detail.bullets?.length > 0 && (
                      <ul>
                        {detail.bullets.map(bullet => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

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
                    <Icon name="External" />
                  </a>
                </div>
              )}
            </article>
          </StyledProject>
        ))}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
