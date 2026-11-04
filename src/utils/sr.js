let scrollReveal;

const sr = {
  reveal: (...args) => {
    if (typeof window === 'undefined') return;

    if (!scrollReveal) {
      const ScrollReveal = require('scrollreveal');
      scrollReveal = (ScrollReveal.default || ScrollReveal)();
    }

    return scrollReveal.reveal(...args);
  },
};

export default sr;
