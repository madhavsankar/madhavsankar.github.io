import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Layout } from '@components';

const NotFound = styled.main`
  display: flex;
  min-height: 70vh;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  h1 {
    font-size: clamp(42px, 8vw, 72px);
  }
`;

const NotFoundPage = ({ location }) => (
  <Layout location={location}>
    <NotFound>
      <h1>Page not found.</h1>
      <Link to="/">Return home</Link>
    </NotFound>
  </Layout>
);

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
