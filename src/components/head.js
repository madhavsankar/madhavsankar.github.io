import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';

const Head = ({ title, description, image }) => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          description
          siteUrl
          image
        }
      }
    }
  `);
  const metadata = site.siteMetadata;
  const pageTitle = title ? `${title} | ${metadata.title}` : metadata.title;
  const pageDescription = description || metadata.description;
  const pageImage = new URL(image || metadata.image, metadata.siteUrl).href;
  const pageUrl = new URL(pathname, metadata.siteUrl).href;

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
};

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};

export default Head;
