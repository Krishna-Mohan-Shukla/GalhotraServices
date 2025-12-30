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
  const feedbackContainer = document.getElementById("feedback-container");
  const stars = document.querySelectorAll(".rating-stars .star");
  const ratingInput = document.getElementById("rating");

  // ⭐ Star rating click selection
  stars.forEach(star => {
    star.addEventListener("click", () => {
      ratingInput.value = star.dataset.rate;
      stars.forEach(s => s.classList.remove("text-yellow-400"));
      for (let i = 0; i < star.dataset.rate; i++) {
        stars[i].classList.add("text-yellow-400");
      }
    });
  });

  // 🧾 Load Feedback on Page Load
  async function loadFeedback() {
    const res = await fetch("https://galhotrservice.com/api/feedback/get");
    const data = await res.json();
    renderFeedback(data);
  }

  // 🎭 Display Cards
  function renderFeedback(list) {
    feedbackContainer.innerHTML = "";
    if (!list.length) {
      feedbackContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full">No feedback yet ✍</p>`;
      return;
    }

    list.reverse().forEach(item => {
      feedbackContainer.innerHTML += `
        <div class="bg-white border border-blue-100 shadow rounded-xl p-4 hover:-translate-y-1 transition">
          <div class="flex items-center justify-between">
            <span class="text-yellow-400 text-lg">${"★".repeat(item.rating || 5)}</span>
          </div>
          <p class="text-blue-800 mt-3">${item.feedback}</p>
        </div>`;
    });
  }

  // 🚀 Submit Feedback
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        rating: ratingInput.value,
        feedback: feedbackForm.feedback.value,
      };

      await fetch("https://galhotrservice.com/api/feedback/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      feedbackForm.reset();
      ratingInput.value = "";
      stars.forEach(s => s.classList.remove("text-yellow-400"));
      loadFeedback();
      alert("🎉 Feedback submitted successfully!");
    });
  }

  loadFeedback();

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

      const formData = new FormData(mainForm);
      formData.append("department", document.getElementById("department").value);

      const payload = Object.fromEntries(formData);

      try {
        const res = await fetch("https://galhotrservice.com/api/application/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (result.success) {
          alert("Application submitted successfully!");
          mainForm.reset();
        } else {
          alert("Failed: " + result.error);
        }
      } catch (err) {
        console.error(err);
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

