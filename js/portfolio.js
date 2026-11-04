(function () {
  "use strict";

  var canvas = document.getElementById("particle-canvas");
  var hero = document.getElementById("hero");
  var header = document.querySelector(".site-header");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  var experienceTabList = document.querySelector('[role="tablist"]');
  if (experienceTabList) {
    function updateTabOrientation() {
      experienceTabList.setAttribute(
        "aria-orientation",
        window.matchMedia("(max-width: 700px)").matches ? "horizontal" : "vertical"
      );
    }
    updateTabOrientation();
    window.addEventListener("resize", updateTabOrientation);
  }

  if (header) {
    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

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
