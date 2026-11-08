(function () {
  "use strict";

  var canvas = document.getElementById("particle-canvas");
  var hero = document.getElementById("hero");
  var header = document.querySelector(".site-header");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  try {
    if (window.location.hash || window.sessionStorage.getItem("portfolio-loader-seen") === "1") {
      document.body.classList.add("loader-skipped");
    } else {
      window.sessionStorage.setItem("portfolio-loader-seen", "1");
    }
  } catch (e) {
    if (window.location.hash) {
      document.body.classList.add("loader-skipped");
    }
  }

  var menuToggle = document.querySelector(".menu-toggle");
  var primaryNav = menuToggle && document.getElementById(menuToggle.getAttribute("aria-controls"));
  var menuBackdrop = header && header.querySelector(".menu-backdrop");

  if (menuToggle && primaryNav && header) {
    function setMenuOpen(isOpen, returnFocus) {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      primaryNav.classList.toggle("is-open", isOpen);
      header.classList.toggle("menu-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        var firstLink = primaryNav.querySelector("a[href]");
        if (firstLink) {
          window.requestAnimationFrame(function () {
            if (menuToggle.getAttribute("aria-expanded") === "true") firstLink.focus();
          });
        }
      } else if (returnFocus) {
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener("click", function () {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true", false);
    });

    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", function () {
        setMenuOpen(false, true);
      });
    }

    primaryNav.addEventListener("click", function (event) {
      if (event.target.closest("a[href]") && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, true);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (menuToggle.getAttribute("aria-expanded") !== "true") return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false, true);
        return;
      }
      if (event.key !== "Tab") return;

      var links = Array.from(primaryNav.querySelectorAll("a[href]"));
      if (!links.length) return;
      var firstLink = links[0];
      var lastLink = links[links.length - 1];
      if (event.shiftKey && document.activeElement === menuToggle) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        menuToggle.focus();
      }
    });

    window.matchMedia("(max-width: 900px)").addEventListener("change", function (event) {
      if (!event.matches && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, false);
      }
    });
  }

  var revealItems = [];
  var revealObserver = null;

  function initializeReveals() {
    revealItems = Array.from(document.querySelectorAll(
      ".content-section, .archive-main > .section-kicker, .archive-main > .section-heading, .archive-intro, .archive-grid .project-card"
    ));

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    document.body.classList.add("motion-enhanced");
    var archiveCards = Array.from(document.querySelectorAll(".archive-grid .project-card"));
    archiveCards.forEach(function (card, index) {
      card.style.setProperty("--reveal-delay", Math.min(index * 45, 270) + "ms");
    });

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach(function (item) {
      item.classList.add("scroll-reveal");
      revealObserver.observe(item);
    });
  }

  initializeReveals();
  reduceMotion.addEventListener("change", function () {
    if (reduceMotion.matches) {
      if (revealObserver) revealObserver.disconnect();
      document.body.classList.remove("motion-enhanced");
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.remove("is-visible");
      });
      initializeReveals();
    }
  });

  if (canvas && hero) {
    var context = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var particles = [];
    var frame = 0;
    var visible = true;
    var pointer = { x: null, y: null };

    function resizeCanvas() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.min(115, Math.max(50, Math.floor((width * height) / 11000)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          radius: Math.random() * 1.3 + 0.6,
          opacity: Math.random() * 0.4 + 0.25
        };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      var connectionDistance = 135;
      var connectionDistanceSquared = connectionDistance * connectionDistance;

      particles.forEach(function (particle, index) {
        if (!reduceMotion.matches) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;

          if (pointer.x !== null && pointer.y !== null) {
            var dx = particle.x - pointer.x;
            var dy = particle.y - pointer.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 145 && distance > 1) {
              var force = (145 - distance) / 145;
              particle.x += (dx / distance) * force * 0.8;
              particle.y += (dy / distance) * force * 0.8;
            }
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255,255,255," + particle.opacity.toFixed(2) + ")";
        context.fill();

        for (var next = index + 1; next < particles.length; next += 1) {
          var other = particles[next];
          var offsetX = particle.x - other.x;
          var offsetY = particle.y - other.y;
          var distanceSquared = offsetX * offsetX + offsetY * offsetY;
          if (distanceSquared < connectionDistanceSquared) {
            var alpha = (1 - distanceSquared / connectionDistanceSquared) * 0.2;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
            context.lineWidth = 0.75;
            context.stroke();
          }
        }
      });

      if (visible && !reduceMotion.matches) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    function updatePointer(event) {
      var bounds = hero.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    }

    function clearPointer() {
      pointer.x = null;
      pointer.y = null;
    }

    function observeVisibility(entries) {
      visible = entries[0].isIntersecting;
      if (visible && !reduceMotion.matches && !frame) {
        frame = window.requestAnimationFrame(draw);
      } else if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
    hero.addEventListener("pointermove", updatePointer);
    hero.addEventListener("pointerleave", clearPointer);
    new IntersectionObserver(observeVisibility, { threshold: 0.05 }).observe(hero);
    reduceMotion.addEventListener("change", function () {
      if (reduceMotion.matches && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        draw();
      } else if (!reduceMotion.matches && visible && !frame) {
        frame = window.requestAnimationFrame(draw);
      }
    });
  }

  var experienceTabList = document.querySelector('[role="tablist"]');

  function updateTabHighlight(activeTab) {
    if (!experienceTabList) return;
    var tab = activeTab || experienceTabList.querySelector('.experience-tab[aria-selected="true"]');
    if (!tab) return;
    experienceTabList.style.setProperty("--tab-offset-y", tab.offsetTop + "px");
    experienceTabList.style.setProperty("--tab-height", tab.offsetHeight + "px");
    experienceTabList.style.setProperty("--tab-offset-x", tab.offsetLeft + "px");
    experienceTabList.style.setProperty("--tab-width", tab.offsetWidth + "px");
  }

  function setActiveTab(tab) {
    var tabs = Array.from(document.querySelectorAll(".experience-tab"));
    var panels = Array.from(document.querySelectorAll(".experience-panel"));
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
    updateTabHighlight(tab);
  }

  document.querySelectorAll(".experience-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      setActiveTab(tab);
    });
    tab.addEventListener("keydown", function (event) {
      var tabs = Array.from(document.querySelectorAll(".experience-tab"));
      var index = tabs.indexOf(tab);
      var nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      tabs[nextIndex].focus();
      setActiveTab(tabs[nextIndex]);
    });
  });

  if (experienceTabList) {
    function updateTabOrientation() {
      experienceTabList.setAttribute(
        "aria-orientation",
        window.matchMedia("(max-width: 900px)").matches ? "horizontal" : "vertical"
      );
      updateTabHighlight();
    }
    updateTabOrientation();
    window.addEventListener("resize", updateTabOrientation);
  }

  if (header) {
    var lastScrollY = window.scrollY;
    function updateHeader() {
      var currentScrollY = window.scrollY;
      var scrolled = currentScrollY > 24;
      header.classList.toggle("is-scrolled", scrolled);

      if (currentScrollY <= 70 || header.classList.contains("menu-open")) {
        header.classList.remove("is-hidden");
      } else if (currentScrollY > lastScrollY + 6) {
        header.classList.add("is-hidden");
      } else if (currentScrollY < lastScrollY - 6) {
        header.classList.remove("is-hidden");
      }
      lastScrollY = currentScrollY;
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  var navSectionLinks = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  if (navSectionLinks.length && "IntersectionObserver" in window) {
    var sectionMap = new Map();
    navSectionLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = id && document.getElementById(id);
      if (section) sectionMap.set(section, link);
    });

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = sectionMap.get(entry.target);
        if (link && entry.isIntersecting) {
          navSectionLinks.forEach(function (item) {
            item.classList.toggle("is-active", item === link);
          });
        }
      });
    }, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });

    sectionMap.forEach(function (_, section) {
      spyObserver.observe(section);
    });
  }

  document.querySelectorAll(".project-card").forEach(function (card) {
    var links = card.querySelectorAll("a[href]");
    if (links.length !== 1) return;
    var primaryLink = links[0];
    card.classList.add("has-primary-link");
    card.addEventListener("click", function (event) {
      if (event.target.closest("a, button")) return;
      var selection = window.getSelection && window.getSelection();
      if (selection && selection.toString().length > 0) return;
      primaryLink.click();
    });
  });

  var copyButton = document.querySelector("[data-copy-email]");
  var copyStatus = document.getElementById("copy-status");
  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", function () {
      var email = copyButton.dataset.user + "@" + copyButton.dataset.domain;
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        copyStatus.textContent = "Email: " + copyButton.dataset.user + " [at] " + copyButton.dataset.domain;
        return;
      }
      navigator.clipboard.writeText(email).then(function () {
        copyStatus.textContent = "Email address copied.";
      }).catch(function () {
        copyStatus.textContent = "Copy unavailable. Connect via LinkedIn instead.";
      });
    });
  }
}());
