import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import anime from 'animejs';
import styled from 'styled-components';
import { IconLoader } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  inset: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);

  .logo-wrapper {
    width: 84px;
    max-width: 100px;
    opacity: ${({ isMounted }) => (isMounted ? 1 : 0)};
    transition: var(--transition);

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: none;
      user-select: none;

      #M {
        opacity: 0;
      }
    }
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      finishLoading();
      return undefined;
    }

    const mountTimeout = setTimeout(() => setIsMounted(true), 10);
    const animation = anime.timeline({
      complete: finishLoading,
    });

    animation
      .add({
        targets: '#loader-logo polygon',
        delay: 250,
        duration: 1200,
        easing: 'easeInOutQuart',
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: '#loader-logo #M',
        duration: 500,
        easing: 'easeInOutQuart',
        opacity: 1,
      })
      .add({
        targets: '#loader-logo',
        delay: 350,
        duration: 250,
        easing: 'easeInOutQuart',
        opacity: 0,
        scale: 0.1,
      })
      .add({
        targets: '.loader',
        duration: 200,
        easing: 'easeInOutQuart',
        opacity: 0,
        zIndex: -1,
      });

    return () => {
      clearTimeout(mountTimeout);
      animation.pause();
    };
  }, [finishLoading, prefersReducedMotion]);

  return (
    <StyledLoader className="loader" isMounted={isMounted} aria-hidden="true">
      <Helmet bodyAttributes={{ class: 'hidden' }} />
      <div className="logo-wrapper">
        <IconLoader />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
