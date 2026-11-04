import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import { GlobalStyle, theme } from '@styles';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const isPageLoading = isLoading && isHome;

  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    allLinks.forEach(link => {
      if (
        ['http:', 'https:'].includes(link.protocol) &&
        link.host !== window.location.host
      ) {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
  };

  useEffect(() => {
    if (!isLoading && location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView();
      target?.focus({ preventScroll: true });
    }

    handleExternalLinks();
  }, [isLoading, location.hash, location.pathname]);

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <a className="skip-to-content" href="#content">
            Skip to Content
          </a>

          {isPageLoading && <Loader finishLoading={() => setIsLoading(false)} />}
          <StyledContent
            aria-hidden={isPageLoading}
            inert={isPageLoading ? '' : undefined}>
            <Nav isHome={isHome} />
            <Social isHome={isHome} />
            <Email isHome={isHome} />

            <div id="content">
              {children}
              <Footer />
            </div>
          </StyledContent>
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
