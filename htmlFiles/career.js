// ---------------- BASIC CONFIG ----------------
const API_BASE = "https://galhotrservice.com";
const vacancyList = document.getElementById("vacancy-list");

let jobsData = [];
let formSubmitted = false; // Prevent multiple submissions

// ----------------------------------------------------
// FETCH & SHOW JOBS
// ----------------------------------------------------
async function fetchJobs() {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/get`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    jobsData = await res.json();
    renderVacancies(jobsData);
  } catch (err) {
    vacancyList.innerHTML = `<p class="text-center text-red-500">Unable to load jobs</p>`;
  }
}

function renderVacancies(list) {
  vacancyList.innerHTML = "";
  if (list.length === 0) {
    vacancyList.innerHTML = `<p class="text-center text-white">No jobs found 🚫</p>`;
    return;
  }

  list.forEach(job => {
    const card = document.createElement("div");
    card.className = "bg-gradient-to-r from-blue-700 to-blue-600 p-6 rounded-lg shadow-lg hover:scale-105 transition";

    card.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold">${job.title}</h3>
        <span class="text-sm text-blue-200">Apply-Before: ${job.posted || "-"}</span>
      </div>
      <p class="text-blue-200 mb-2"><strong>Location:</strong> ${job.location}</p>
      <p class="text-blue-100 mb-4">${job.description || ""}</p>
      <button class="apply-btn bg-white text-blue-900 px-4 py-2 rounded hover:bg-blue-200 transition"
        data-title="${job.title}">
        Apply
      </button>
    `;
    vacancyList.appendChild(card);
  });
}

// ----------------------------------------------------
// OPEN APPLY MODAL
// ----------------------------------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("apply-btn")) {
    const jobTitle = e.target.dataset.title;
    document.getElementById("jobTitle").value = jobTitle;
    document.getElementById("form-modal").classList.remove("hidden");
    formSubmitted = false; // Reset flag on opening modal
  }
});

// Close Modal
document.getElementById("close-form").addEventListener("click", () => {
  document.getElementById("form-modal").classList.add("hidden");
});

// ----------------------------------------------------
// SUBMIT CAREER FORM
// ----------------------------------------------------
// const careerForm = document.getElementById("career-form");

// if (careerForm) {
//   careerForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
    
//     if (formSubmitted) return alert("Application already submitted!");

//     const formData = new FormData(careerForm);

//     try {
//       const res = await fetch(`${API_BASE}/api/apply/post`, {
//         method: "POST",
//         body: formData
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         alert("Application submission failed ❌");
//         return;
//       }

//       formSubmitted = true; // Prevent double submission
//       careerForm.reset();
//       document.getElementById("form-modal").classList.add("hidden");
//       showPopup(data.applicationId);

//     } catch (err) {
//       console.error(err);
//       alert("Server Error!");
//     }
//   });
// }

// ----------------------------------------------------
// TRACK APPLICATION STATUS
// ----------------------------------------------------
document.getElementById("trackBtn").addEventListener("click", async () => {
  const appId = document.getElementById("trackInput").value.trim();
  if (!appId) return alert("Please enter your Application ID");

  try {
    const res = await fetch(`${API_BASE}/api/apply/status/${appId}`);
    const data = await res.json();

    if (!data.success) {
      document.getElementById("statusResult").innerHTML =
        `<p class="text-red-500">❌ Application not found</p>`;
      return;
    }

    document.getElementById("statusResult").innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Applied For:</strong> ${data.appliedFor}</p>
      <p><strong>Status:</strong> <span class="text-blue-700">${data.status}</span></p>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("statusResult").innerHTML =
      `<p class="text-red-500">Server Error</p>`;
  }
});

// ----------------------------------------------------
// SHOW APPLICATION POPUP
// ----------------------------------------------------
function showPopup(appId) {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";

  const popup = document.createElement("div");
  popup.className = "bg-white text-blue-900 p-6 rounded-lg w-80 text-center shadow-lg";

  popup.innerHTML = `
    <h2 class="text-xl font-bold mb-2">Application Submitted 🎉</h2>
    <p class="mb-2">Your Application ID:</p>
    <div class="bg-gray-200 p-2 rounded mb-4 break-all">${appId}</div>
    <button id="copyBtn" class="bg-blue-700 text-white px-4 py-2 rounded mb-2">Copy ID</button>
    <br>
    <button id="closeBtn" class="bg-red-600 text-white px-4 py-2 rounded">Close</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(appId);
    alert("Copied to Clipboard!");
  };

  document.getElementById("closeBtn").onclick = () => overlay.remove();
}

// ----------------------------------------------------
// INIT
// ----------------------------------------------------
fetchJobs();
