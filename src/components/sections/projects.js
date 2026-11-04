import React, { useEffect, useRef } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    position: relative;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 15px;
    width: 100%;
    margin-top: 45px;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    min-height: 340px;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-bottom: 30px;
  }

  .folder {
    color: var(--green);

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .project-links {
    display: flex;
    margin-right: -10px;

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 7px;
      color: var(--light-slate);

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .project-company,
  .project-range {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .project-title {
    margin: 8px 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
  }

  .project-description {
    color: var(--light-slate);
    font-size: var(--fz-md);
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0 15px;
    padding: 0;
    margin: 20px 0 0;
    list-style: none;

    li {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
    }
  }
`;

const Projects = () => {
  const { projects } = useStaticQuery(graphql`
    query SelectedProjects {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { eq: true } }
        }
        sort: { frontmatter: { sortOrder: ASC } }
      ) {
        nodes {
          frontmatter {
            title
            range
            company
            tech
            external
            github
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
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>
      <Link className="archive-link inline-link" to="/archive/">
        View the archive
      </Link>
      <ul className="projects-grid">
        {projects.nodes.map(({ frontmatter, html }, index) => (
          <StyledProject
            key={frontmatter.title}
            ref={element => (revealProjects.current[index] = element)}>
            <div className="project-inner">
              <header>
                <div className="project-top">
                  <div className="folder" aria-hidden="true">
                    <Icon name="Folder" />
                  </div>
                  <div className="project-links">
                    {frontmatter.github && (
                      <a
                        href={frontmatter.github}
                        aria-label={`View ${frontmatter.title} on GitHub`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {frontmatter.external && (
                      <a
                        href={frontmatter.external}
                        aria-label={`More about ${frontmatter.title}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="project-company">{frontmatter.company}</p>
                <h3 className="project-title">{frontmatter.title}</h3>
                <p className="project-range">{frontmatter.range}</p>
                <div
                  className="project-description"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </header>
              {frontmatter.tech?.length > 0 && (
                <ul className="project-tech-list" aria-label="Technologies and focus areas">
                  {frontmatter.tech.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </StyledProject>
        ))}
      </ul>
    </StyledProjectsSection>
  );
};

export default Projects;
