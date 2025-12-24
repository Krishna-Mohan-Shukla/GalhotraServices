document.addEventListener("DOMContentLoaded", () => {

  // ======================= MENU ==========================
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ======================= AOS ==========================
  if (window.AOS) {
    AOS.init({ once: true, duration: 800 });
  }

  // ======================= SPLIDE ==========================
  const slider = document.getElementById("logo-carousel");
  if (slider && window.Splide) {
    new Splide("#logo-carousel", {
      type: "loop",
      perPage: 5,
      autoplay: true,
      interval: 2000,
      speed: 1000,
      easing: "ease-in-out",
      pauseOnHover: false,
      arrows: false,
      pagination: false,
      breakpoints: {
        1024: { perPage: 4 },
        768: { perPage: 3 },
        640: { perPage: 2 },
      }
    }).mount();
  }

  // ======================= ANIMATIONS ==========================
  const revealEls = document.querySelectorAll(".animate-fadeInUp, .animate-scaleIn");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.style.opacity = 1;
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = 0;
    observer.observe(el);
  });

  // ======================= CONTACT FORM ==========================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim(),
      };

      try {
        const res = await fetch("https://galhotrservice.com/api/contact/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        alert(data.message || "Message Sent!");
        contactForm.reset();

      } catch (err) {
        alert("Error sending message!");
      }
    });
  }

  // ======================= QUERY FORM ==========================
  const queryForm = document.getElementById("query-form");
  const queriesContainer = document.getElementById("queries-container");

  const API_BASE = "https://galhotrservice.com/api/query";

  const fetchQueries = async () => {
    if (!queriesContainer) return;
    const res = await fetch(`${API_BASE}/get`);
    const data = await res.json();

    queriesContainer.innerHTML = data
      .map(q => `<div style="padding:6px;">${q.query} - <strong>${q.status}</strong></div>`)
      .join("");
  };

  if (queryForm) {
    queryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = { query: queryForm.query.value };

      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message || "Query Submitted!");
      queryForm.reset();
      fetchQueries();
    });
  }

  fetchQueries();

  // ======================= FEEDBACK FORM ==========================
  const feedbackForm = document.getElementById("feedback-form");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        rating: feedbackForm.rating.value,
        feedback: feedbackForm.feedback.value,
      };

      const res = await fetch("https://galhotrservice.com/api/feedback/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message || "Feedback Submitted!");
      feedbackForm.reset();
    });
  }

  // ======================= SERVICE FORM ==========================
  const serviceForm = document.getElementById("service-form");

  if (serviceForm) {
    serviceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: serviceForm.name.value,
        email: serviceForm.email.value,
        phone: serviceForm.phone.value,
        service: serviceForm.service.value,
        message: serviceForm.message.value,
      };

      try {
        const res = await fetch("https://galhotrservice.com/api/service/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        alert(data.message || "Request submitted!");
        serviceForm.reset();

      } catch (error) {
        alert("Something went wrong!");
      }
    });
  }

  // ======================= CAREER FORM (FILE UPLOAD) ==========================
  const careerForm = document.getElementById("career-form");

  if (careerForm) {
    careerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(careerForm);

      try {
        const res = await fetch("https://galhotrservice.com/api/apply/post", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert("Application submission failed ❌");
          return;
        }

        alert("Your Application ID: " + data.applicationId);
        careerForm.reset();

      } catch (err) {
        alert("Server Error!");
      }
    });
  }

  // ======================= MAIN FORM ==========================
  const mainForm = document.getElementById("main-form");

  if (mainForm) {
    mainForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const form = new FormData(mainForm);
      form.append("jobRole", document.getElementById("department").value);

      try {
        const res = await fetch("https://galhotrservice.com/api/application/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(form)),
        });

        const result = await res.json();

        if (result.success) {
          alert("Application submitted successfully!");
        } else {
          alert("Failed: " + result.error);
        }
      } catch (err) {
        alert("Something went wrong!");
      }
    });
  }

});


  const topicButtons = document.querySelectorAll('[data-topic]');
  const topicContents = document.querySelectorAll('.topic-content');

  topicButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      // hide all
      topicContents.forEach(content => {
        content.classList.add('hidden');
      });

      // show selected
      const targetId = btn.getAttribute('data-topic');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.remove('hidden');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

