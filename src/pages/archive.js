import React, { useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledArchive = styled.main`
  padding-top: 160px;

  .archive-title {
    margin-bottom: 12px;
    color: var(--lightest-slate);
    font-size: clamp(40px, 8vw, 72px);
  }

  .archive-intro {
    max-width: 650px;
  }

  .table-container {
    margin: 70px -20px 40px;
    overflow-x: auto;

    @media (max-width: 768px) {
      margin: 45px -10px 30px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;

    th,
    td {
      padding: 14px 12px;
      vertical-align: top;
    }

    th {
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      font-weight: 400;
      text-transform: uppercase;
    }

    tbody tr {
      border-top: 1px solid var(--lightest-navy);
      transition: var(--transition);

      &:hover {
        background: var(--light-navy);
      }
    }

    .year {
      width: 70px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    .title {
      min-width: 320px;
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
      font-weight: 600;
    }

    .range,
    .company {
      display: block;
      margin-top: 5px;
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      font-weight: 400;
    }

    .description {
      max-width: 560px;
      color: var(--light-slate);
      font-size: var(--fz-md);
      font-weight: 400;

      p {
        margin: 8px 0;
      }

      p:first-child {
        margin-top: 12px;
      }
    }

    .tech {
      min-width: 180px;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.8;
    }

    .links {
      min-width: 88px;

      a {
        display: inline-flex;
        margin: 0 8px 5px 0;
        color: var(--light-slate);

        &:hover {
          color: var(--green);
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .archive-back-link {
    margin-top: 32px;
  }

  @media (max-width: 768px) {
    .table-container {
      overflow: visible;
    }

    thead {
      display: none;
    }

    tbody tr {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr) 64px;
      align-items: start;
    }

    table {
      .year {
        grid-column: 1;
        grid-row: 1 / span 3;
      }

      .title {
        grid-column: 2;
        min-width: 0;
      }

      .company.hide-on-mobile {
        display: none;
      }

      .tech.hide-on-mobile {
        display: block;
        grid-column: 2 / 4;
        padding-top: 0;
      }

      .links {
        grid-column: 3;
        grid-row: 1;
        min-width: 0;
        padding-top: 12px;
      }
    }
  }
`;

const ArchivePage = ({ data, location }) => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const projects = data.allMarkdownRemark.nodes;

  useEffect(() => {
    if (!prefersReducedMotion && revealContainer.current) {
      sr?.reveal(revealContainer.current, srConfig(0, 0.05));
    }
  }, [prefersReducedMotion]);

  return (
    <Layout location={location}>
      <Helmet title="Project archive" />
      <StyledArchive ref={revealContainer}>
        <p className="overline">Selected Work · Archive</p>
        <h1 className="archive-title">More projects</h1>
        <p className="archive-intro">
          Research, internships, open-source work, and earlier projects, sorted from newest to
          oldest.
        </p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Project</th>
                <th className="hide-on-mobile">Associated with</th>
                <th className="hide-on-mobile">Focus</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(({ frontmatter, html }) => (
                <tr key={frontmatter.title}>
                  <td className="year">{frontmatter.date.slice(0, 4)}</td>
                  <td className="title">
                    {frontmatter.title}
                    <span className="range">{frontmatter.range}</span>
                    <div className="description" dangerouslySetInnerHTML={{ __html: html }} />
                  </td>
                  <td className="company hide-on-mobile">{frontmatter.company || '—'}</td>
                  <td className="tech hide-on-mobile">{frontmatter.tech?.join(' · ') || '—'}</td>
                  <td className="links">
                    {frontmatter.external && (
                      <a
                        href={frontmatter.external}
                        aria-label={`More about ${frontmatter.title}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon name="External" />
                      </a>
                    )}
                    {frontmatter.github && (
                      <a
                        href={frontmatter.github}
                        aria-label={`${frontmatter.title} on GitHub`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Icon name="GitHub" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="archive-back-link">
          <a href="/#projects">← Back to selected work</a>
        </p>
      </StyledArchive>
    </Layout>
  );
};

ArchivePage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  query ProjectArchive {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/projects/" }
        frontmatter: { showInProjects: { eq: false } }
      }
      sort: [{ frontmatter: { date: DESC } }, { frontmatter: { sortOrder: ASC } }]
    ) {
      nodes {
        frontmatter {
          date
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
`;
