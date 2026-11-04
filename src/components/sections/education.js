import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 1000px;

  .credentials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .credential-card {
    padding: 26px 28px;
    border-radius: var(--border-radius);
    background: var(--light-navy);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);

    h3 {
      margin: 0 0 20px;
      color: var(--lightest-slate);
      font-size: var(--fz-xxl);
    }

    p,
    li {
      color: var(--light-slate);
      font-size: var(--fz-md);
    }

    ul {
      ${({ theme }) => theme.mixins.fancyList};
    }
  }

  .credential-date {
    display: block;
    margin-top: 5px;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Education = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion && revealContainer.current) {
      sr?.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 className="numbered-heading">Education &amp; Recognition</h2>
      <div className="credentials-grid">
        <article className="credential-card">
          <h3>Education</h3>
          <p>
            <strong>University of California, Los Angeles</strong>
            <span className="credential-date">M.S. in Computer Science · 2021–2022</span>
          </p>
          <p>
            <strong>National Institute of Technology Tiruchirappalli</strong>
            <span className="credential-date">B.Tech. in Computer Science · 2015–2019</span>
          </p>
          <p>
            <strong>National Institute of Technology Tiruchirappalli</strong>
            <span className="credential-date">Minor, Humanities/Economics · 2017–2019</span>
          </p>
        </article>
        <article className="credential-card">
          <h3>Publications</h3>
          <ul>
            <li>
              <a href="https://arxiv.org/abs/1707.06391" target="_blank" rel="noopener noreferrer">
                Deterministic dispersion of mobile robots in dynamic rings
              </a>{' '}
              · ICDCN 2018
            </li>
            <li>
              <a
                href="https://link.springer.com/article/10.1007/s12046-020-01501-3"
                target="_blank"
                rel="noopener noreferrer">
                RNN-based question-answer generation and ranking for financial documents using
                financial NER
              </a>{' '}
              · Sādhanā, 2020
            </li>
          </ul>
        </article>
        <article className="credential-card">
          <h3>Honors &amp; Certifications</h3>
          <ul>
            <li>Winner — Reverse Coding, Shaastra ’17</li>
            <li>
              <a
                href="https://www.coursera.org/account/accomplishments/specialization/certificate/2BPUMXPXT9B2"
                target="_blank"
                rel="noopener noreferrer">
                Deep Learning Specialization by DeepLearning.AI
              </a>
            </li>
            <li>
              <a
                href="https://www.coursera.org/account/accomplishments/certificate/9SCC42WDHXS7"
                target="_blank"
                rel="noopener noreferrer">
                Game Theory Course by Stanford University
              </a>
            </li>
            <li>
              <a
                href="https://www.coursera.org/account/accomplishments/certificate/GBPDNR4362Y6"
                target="_blank"
                rel="noopener noreferrer">
                Python for Data Science, AI &amp; Development Course by IBM
              </a>
            </li>
          </ul>
        </article>
        <article className="credential-card">
          <h3>Skills &amp; Technologies</h3>
          <ul>
            <li>Languages: C/C++, Java, C#, Python, JavaScript, and TypeScript</li>
            <li>Backend &amp; cloud: .NET, Django, SQL, MongoDB, Azure Cloud Services, and Apache Spark</li>
            <li>AI &amp; data: PyTorch, OpenCV, NumPy, Pandas, and scikit-learn</li>
            <li>Platforms &amp; tools: Kubernetes, Git, Linux, and Android Studio</li>
          </ul>
        </article>
      </div>
    </StyledEducationSection>
  );
};

export default Education;
