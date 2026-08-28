/**
 * Job Application Tracker Pro - Core Logic
 * Features:
 *  - Persistent LocalStorage State Store & CRUD Management
 *  - AI Resume vs Job Matcher (NLP scoring, keyword matching & suggestions)
 *  - Interview & Follow-up Reminders & Schedule Alerts
 *  - Interactive Analytics Dashboard with Chart.js
 *  - Export to CSV, PDF (html2pdf.js) & JSON Backup/Restore
 */

document.addEventListener("DOMContentLoaded", () => {
  // Storage Keys
  const STORAGE_KEYS = {
    JOBS: "job_tracker_pro_jobs_v1",
    RESUME: "job_tracker_pro_resume_v1",
  };

  // Default Seed Dataset
  const DEFAULT_RESUME = {
    name: "Moloy Krishna Paul",
    title: "Full-Stack / Frontend Engineer",
    skills: [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
      "Tailwind CSS", "Redux", "HTML5", "CSS3", "Git", "REST APIs",
      "MongoDB", "Jest", "Docker", "UI/UX Design", "Problem Solving"
    ],
    experience: 3,
    education: "B.Sc in Computer Science & Engineering",
    summary: "Passionate software engineer building fast, responsive, and accessible web applications using React, TypeScript, and modern web architectures."
  };

  const DEFAULT_JOBS = [
    {
      id: "job-1",
      company: "Skyline Digital",
      role: "UI Engineer",
      location: "Vienna, Austria",
      workplace: "Remote",
      type: "Full-time",
      salary: "$90,000 – $115,000",
      status: "applied",
      appliedDate: "2026-08-18",
      interviewDate: "",
      followupDate: "2026-09-01",
      description: "Translate product designs into responsive interfaces. Implement design systems with React, TypeScript, and Tailwind CSS. Improve frontend performance and accessibility across devices.",
      url: "https://skyline.digital/careers/ui-eng",
      notes: "Applied via company careers portal. Portfolio linked.",
      createdAt: 1723980000000
    },
    {
      id: "job-2",
      company: "NovaTech Innovations",
      role: "Software Engineer",
      location: "Austin, TX, USA",
      workplace: "Remote",
      type: "Full-time",
      salary: "$105,000 – $135,000",
      status: "interview",
      appliedDate: "2026-08-10",
      interviewDate: "2026-08-30T15:00",
      followupDate: "2026-08-31",
      description: "Develop scalable web applications using React, Next.js, Node.js and TypeScript. Optimize backend microservices, write unit tests with Jest, and maintain clean maintainable code.",
      url: "https://novatech.io/jobs/swe-2",
      notes: "Technical round scheduled with Engineering Lead.",
      createdAt: 1723288800000
    },
    {
      id: "job-3",
      company: "Quantum Analytics",
      role: "Frontend Data Engineer",
      location: "New York, USA",
      workplace: "Hybrid",
      type: "Full-time",
      salary: "$120,000 – $155,000",
      status: "interview",
      appliedDate: "2026-08-12",
      interviewDate: "2026-09-02T18:30",
      followupDate: "2026-09-03",
      description: "Build interactive analytics dashboards with React, Chart.js, and TypeScript. Manage real-time data streaming visualization and REST APIs integration with Node.js.",
      url: "https://quantumanalytics.co/careers",
      notes: "1st HR Screen completed successfully. Preparing dashboard portfolio.",
      createdAt: 1723461600000
    },
    {
      id: "job-4",
      company: "GreenByte Technologies",
      role: "Full-Stack Developer",
      location: "Amsterdam, Netherlands",
      workplace: "Remote",
      type: "Full-time",
      salary: "$110,000 – $130,000",
      status: "offer",
      appliedDate: "2026-07-28",
      interviewDate: "",
      followupDate: "2026-08-29",
      description: "Design RESTful APIs and microservices in Node.js, Express, and MongoDB. Build polished frontend dashboards using React, Redux, and Tailwind CSS. Ensure CI/CD deployment with Docker.",
      url: "https://greenbyte.tech/careers",
      notes: "Received official offer letter! Reviewing compensation package.",
      createdAt: 1722165600000
    },
    {
      id: "job-5",
      company: "PulseChain Labs",
      role: "Web3 Frontend Engineer",
      location: "Berlin, Germany",
      workplace: "Remote",
      type: "Full-time",
      salary: "$130,000 – $160,000",
      status: "applied",
      appliedDate: "2026-08-20",
      interviewDate: "",
      followupDate: "2026-09-05",
      description: "Develop decentralized applications (dApps) connecting React frontend with smart contracts. Requires TypeScript, Web3.js / Ethers.js, Tailwind CSS, and GraphQL.",
      url: "https://pulsechainlabs.dev/apply",
      notes: "Submitted GitHub profile and Web3 project links.",
      createdAt: 1724152800000
    },
    {
      id: "job-6",
      company: "BrightPath Solutions",
      role: "QA Automation Engineer",
      location: "Dublin, Ireland",
      workplace: "Remote",
      type: "Full-time",
      salary: "$85,000 – $100,000",
      status: "rejected",
      appliedDate: "2026-07-15",
      interviewDate: "",
      followupDate: "",
      description: "Create automated testing frameworks with Cypress, Playwright, and Jest. Ensure software quality through continuous integration pipelines and automated regression testing.",
      url: "https://brightpath.ie/jobs",
      notes: "Position filled internally.",
      createdAt: 1721042400000
    },
    {
      id: "job-7",
      company: "Orbit Cloud Systems",
      role: "Cloud Platform UI Specialist",
      location: "Sydney, Australia",
      workplace: "Remote",
      type: "Full-time",
      salary: "$115,000 – $140,000",
      status: "applied",
      appliedDate: "2026-08-16",
      interviewDate: "",
      followupDate: "2026-08-30",
      description: "Deploy and build cloud monitoring user interfaces using React, Next.js, Tailwind CSS, AWS SDK, and Kubernetes dashboards.",
      url: "https://orbitcloud.io/careers",
      notes: "Referred by senior architect.",
      createdAt: 1723807200000
    },
    {
      id: "job-8",
      company: "VisionWare Studio",
      role: "Product Frontend Designer",
      location: "Vancouver, Canada",
      workplace: "Remote",
      type: "Full-time",
      salary: "$95,000 – $120,000",
      status: "interview",
      appliedDate: "2026-08-14",
      interviewDate: "2026-08-31T17:00",
      followupDate: "2026-09-01",
      description: "Design and implement intuitive digital products. Collaborate with design and engineering teams using Figma, React, TypeScript, and CSS Animations to deliver user-centered web applications.",
      url: "https://visionware.studio/join-us",
      notes: "Design challenge submitted. Final presentation interview scheduled.",
      createdAt: 1723634400000
    }
  ];

  // Common Tech Skills Dictionary for AI Matcher
  const TECH_SKILLS_DICTIONARY = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "Express",
    "Tailwind CSS", "CSS3", "HTML5", "Redux", "Zustand", "GraphQL", "REST APIs", "MongoDB",
    "PostgreSQL", "MySQL", "Docker", "Kubernetes", "AWS", "Firebase", "Git", "GitHub",
    "Jest", "Cypress", "Playwright", "Figma", "UI/UX", "Python", "Go", "Web3", "Ethers.js",
    "Microservices", "CI/CD", "Accessibility", "Design Systems", "Web Performance", "Problem Solving"
  ];

  // State
  let jobs = loadJobs();
  let resume = loadResume();
  let currentFilter = "all";
  let currentSort = "date-newest";
  let searchQuery = "";
  let currentLayout = "grid"; // 'grid' | 'table'
  let activeTab = "pipeline"; // 'pipeline' | 'analytics'
  let charts = {};

  // DOM Elements
  const totalCountEl = document.getElementById("total-count");
  const appliedCountEl = document.getElementById("applied-count");
  const interviewCountEl = document.getElementById("interview-count");
  const offerCountEl = document.getElementById("offer-count");
  const rejectedCountEl = document.getElementById("rejected-count");

  const tabCountAllEl = document.getElementById("tab-count-all");
  const tabCountAppliedEl = document.getElementById("tab-count-applied");
  const tabCountInterviewEl = document.getElementById("tab-count-interview");
  const tabCountOfferEl = document.getElementById("tab-count-offer");
  const tabCountRejectedEl = document.getElementById("tab-count-rejected");

  const filteredJobsCountEl = document.getElementById("filtered-jobs-count");
  const activeFilterLabelEl = document.getElementById("active-filter-label");

  const jobsGridContainer = document.getElementById("jobs-grid-container");
  const jobsTableContainer = document.getElementById("jobs-table-container");
  const jobsTableBody = document.getElementById("jobs-table-body");
  const emptyStateEl = document.getElementById("empty-state");

  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const sortSelect = document.getElementById("sort-select");

  const sectionPipeline = document.getElementById("section-pipeline");
  const sectionAnalytics = document.getElementById("section-analytics");
  const viewPipelineBtn = document.getElementById("view-pipeline-btn");
  const viewAnalyticsBtn = document.getElementById("view-analytics-btn");
  const backToPipelineBtn = document.getElementById("back-to-pipeline-btn");

  const viewGridBtn = document.getElementById("view-grid-btn");
  const viewTableBtn = document.getElementById("view-table-btn");

  // Reminders Elements
  const remindersBanner = document.getElementById("reminders-banner");
  const remindersList = document.getElementById("reminders-list");
  const reminderBadgeCount = document.getElementById("reminder-badge-count");
  const dismissRemindersBtn = document.getElementById("dismiss-reminders-btn");

  // Modals Elements
  const jobModal = document.getElementById("job-modal");
  const jobForm = document.getElementById("job-form");
  const jobModalTitle = document.getElementById("job-modal-title");
  const openAddJobBtn = document.getElementById("open-add-job-btn");
  const closeJobModalBtn = document.getElementById("close-job-modal-btn");
  const cancelJobModalBtn = document.getElementById("cancel-job-modal-btn");

  const resumeModal = document.getElementById("resume-modal");
  const resumeForm = document.getElementById("resume-form");
  const openResumeBtn = document.getElementById("open-resume-btn");
  const closeResumeModalBtn = document.getElementById("close-resume-modal-btn");
  const cancelResumeBtn = document.getElementById("cancel-resume-btn");
  const resumeSkillsInput = document.getElementById("resume-skills");
  const skillsPreviewTags = document.getElementById("skills-preview-tags");

  const aiAnalysisModal = document.getElementById("ai-analysis-modal");
  const closeAnalysisModalBtn = document.getElementById("close-analysis-modal-btn");
  const closeAnalysisBtn = document.getElementById("close-analysis-btn");

  // Export Dropdown Elements
  const exportDropdownBtn = document.getElementById("export-dropdown-btn");
  const exportDropdownMenu = document.getElementById("export-dropdown-menu");
  const exportCsvBtn = document.getElementById("export-csv-btn");
  const exportPdfBtn = document.getElementById("export-pdf-btn");
  const backupJsonBtn = document.getElementById("backup-json-btn");
  const importJsonInput = document.getElementById("import-json-input");
  const resetSampleDataBtn = document.getElementById("reset-sample-data-btn");

  // ----------------------------------------------------
  // LOCALSTORAGE HELPERS
  // ----------------------------------------------------
  function loadJobs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading jobs from localStorage:", e);
    }
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(DEFAULT_JOBS));
    return JSON.parse(JSON.stringify(DEFAULT_JOBS));
  }

  function saveJobs(newJobs) {
    jobs = newJobs;
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    render();
  }

  function loadResume() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESUME);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading resume from localStorage:", e);
    }
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(DEFAULT_RESUME));
    return JSON.parse(JSON.stringify(DEFAULT_RESUME));
  }

  function saveResume(newResume) {
    resume = newResume;
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    showToast("Resume profile updated successfully!", "success");
    render();
  }

  // ----------------------------------------------------
  // AI RESUME vs JOB MATCHER ALGORITHM
  // ----------------------------------------------------
  function calculateMatch(job) {
    const jobText = `${job.role} ${job.description} ${job.company}`.toLowerCase();
    const resumeSkills = resume.skills || [];
    
    // Extract keywords found in job description
    const matchedSkills = [];
    const detectedJobSkills = [];

    TECH_SKILLS_DICTIONARY.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(jobText)) {
        detectedJobSkills.push(skill);
      }
    });

    // Also extract skills explicitly from resume that appear in job
    resumeSkills.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(jobText)) {
        if (!matchedSkills.includes(skill)) {
          matchedSkills.push(skill);
        }
      }
    });

    // Find missing skills (skills in job requirement that user lacks)
    const missingSkills = detectedJobSkills.filter(
      (s) => !resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
    );

    // Calculate match score %
    let score = 50; // base score
    if (detectedJobSkills.length > 0) {
      const matchRatio = matchedSkills.length / Math.max(detectedJobSkills.length, 1);
      score = Math.round(matchRatio * 55 + 35);
    } else {
      score = Math.min(60 + matchedSkills.length * 8, 90);
    }

    // Role keyword bonus
    const roleLower = (job.role || "").toLowerCase();
    if (resume.title && (roleLower.includes("engineer") || roleLower.includes("developer") || roleLower.includes("designer"))) {
      score += 5;
    }

    // Clamp score 0 - 100
    score = Math.max(30, Math.min(98, score));

    // Recommendations tailored
    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Add or emphasize <strong>${missingSkills.slice(0, 3).join(", ")}</strong> in your portfolio or project descriptions to improve visibility.`);
    }
    if (job.workplace === "Remote") {
      recommendations.push("Highlight your asynchronous collaboration, Git workflows, and autonomous delivery in your resume summary.");
    }
    recommendations.push(`Tailor your top experience bullet points around <em>"${job.role}"</em> responsibilities.`);

    let tier = "medium";
    let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    let badgeText = "Medium Match";
    if (score >= 80) {
      tier = "high";
      badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      badgeText = "High Match";
    } else if (score < 60) {
      tier = "low";
      badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
      badgeText = "Low Match";
    }

    return {
      score,
      tier,
      badgeClass,
      badgeText,
      matchedSkills,
      missingSkills,
      detectedJobSkills,
      recommendations
    };
  }

  // ----------------------------------------------------
  // REMINDERS & DEADLINE TRACKER
  // ----------------------------------------------------
  function getUpcomingReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);
    in7Days.setHours(23, 59, 59, 999);

    const reminders = [];

    jobs.forEach((job) => {
      // Check Interview Date
      if (job.interviewDate && job.status === "interview") {
        const interviewTime = new Date(job.interviewDate);
        if (!isNaN(interviewTime.getTime())) {
          const diffDays = Math.ceil((interviewTime - today) / (1000 * 60 * 60 * 24));
          let urgency = "upcoming";
          let label = `In ${diffDays} day(s)`;

          if (diffDays === 0) {
            urgency = "today";
            label = "TODAY 🔥";
          } else if (diffDays < 0) {
            urgency = "overdue";
            label = `${Math.abs(diffDays)}d ago (Past)`;
          }

          reminders.push({
            type: "interview",
            jobId: job.id,
            company: job.company,
            role: job.role,
            date: interviewTime.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }),
            urgency,
            label,
            text: `Interview for ${job.role} at ${job.company}`
          });
        }
      }

      // Check Follow-up Date
      if (job.followupDate && (job.status === "applied" || job.status === "interview")) {
        const followupTime = new Date(job.followupDate);
        if (!isNaN(followupTime.getTime())) {
          const diffDays = Math.ceil((followupTime - today) / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) {
            let urgency = "upcoming";
            let label = `In ${diffDays}d`;

            if (diffDays === 0) {
              urgency = "today";
              label = "Due Today!";
            } else if (diffDays < 0) {
              urgency = "overdue";
              label = `Overdue (${Math.abs(diffDays)}d)`;
            }

            reminders.push({
              type: "followup",
              jobId: job.id,
              company: job.company,
              role: job.role,
              date: followupTime.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              }),
              urgency,
              label,
              text: `Follow up with ${job.company}`
            });
          }
        }
      }
    });

    return reminders;
  }

  function renderReminders() {
    const reminders = getUpcomingReminders();
    if (reminders.length === 0) {
      remindersBanner.classList.add("hidden");
      return;
    }

    remindersBanner.classList.remove("hidden");
    reminderBadgeCount.innerText = reminders.length;
    remindersList.innerHTML = "";

    reminders.forEach((rem) => {
      const isInterview = rem.type === "interview";
      const isToday = rem.urgency === "today" || rem.urgency === "overdue";
      const cardBg = isToday ? "bg-amber-100/80 border-amber-300" : "bg-white/90 border-amber-200";

      const el = document.createElement("div");
      el.className = `p-2.5 rounded-lg border ${cardBg} flex items-center justify-between text-xs transition-all shadow-xs`;
      el.innerHTML = `
        <div class="flex items-center space-x-2 overflow-hidden">
          <span class="w-6 h-6 rounded-md ${isInterview ? 'bg-emerald-500' : 'bg-amber-500'} text-white flex items-center justify-center text-xs flex-shrink-0">
            <i class="fa-solid ${isInterview ? 'fa-calendar-check' : 'fa-envelope'}"></i>
          </span>
          <div class="truncate">
            <p class="font-bold text-slate-800 truncate">${rem.company}</p>
            <p class="text-slate-500 text-[11px] truncate">${rem.text}</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0 ml-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isToday ? 'bg-rose-500 text-white' : 'bg-amber-200 text-amber-900'}">
            ${rem.label}
          </span>
          <p class="text-[10px] text-slate-500 mt-0.5">${rem.date}</p>
        </div>
      `;
      remindersList.appendChild(el);
    });
  }

  // ----------------------------------------------------
  // FILTERING, SEARCHING & SORTING
  // ----------------------------------------------------
  function getFilteredAndSortedJobs() {
    let list = [...jobs];

    // Filter by Status
    if (currentFilter !== "all") {
      list = list.filter((j) => j.status === currentFilter);
    }

    // Search Query (Company, Role, Location, Tech Stack)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (j) =>
          (j.company || "").toLowerCase().includes(q) ||
          (j.role || "").toLowerCase().includes(q) ||
          (j.location || "").toLowerCase().includes(q) ||
          (j.description || "").toLowerCase().includes(q) ||
          (j.notes || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (currentSort === "date-newest") {
        return (new Date(b.appliedDate || 0)) - (new Date(a.appliedDate || 0));
      } else if (currentSort === "date-oldest") {
        return (new Date(a.appliedDate || 0)) - (new Date(b.appliedDate || 0));
      } else if (currentSort === "match-high") {
        const matchA = calculateMatch(a).score;
        const matchB = calculateMatch(b).score;
        return matchB - matchA;
      } else if (currentSort === "company-az") {
        return (a.company || "").localeCompare(b.company || "");
      } else if (currentSort === "salary-high") {
        const extractNum = (str) => {
          const m = (str || "").replace(/[^0-9]/g, "");
          return parseInt(m, 10) || 0;
        };
        return extractNum(b.salary) - extractNum(a.salary);
      }
      return 0;
    });

    return list;
  }

  // ----------------------------------------------------
  // RENDER MAIN DASHBOARD & COUNTERS
  // ----------------------------------------------------
  function render() {
    // 1. Update KPI Counts
    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === "applied").length;
    const interview = jobs.filter((j) => j.status === "interview").length;
    const offer = jobs.filter((j) => j.status === "offer").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;

    totalCountEl.innerText = total;
    appliedCountEl.innerText = applied;
    interviewCountEl.innerText = interview;
    offerCountEl.innerText = offer;
    rejectedCountEl.innerText = rejected;

    tabCountAllEl.innerText = total;
    tabCountAppliedEl.innerText = applied;
    tabCountInterviewEl.innerText = interview;
    tabCountOfferEl.innerText = offer;
    tabCountRejectedEl.innerText = rejected;

    // 2. Render Reminders
    renderReminders();

    // 3. Get Filtered and Sorted list
    const filteredJobs = getFilteredAndSortedJobs();
    filteredJobsCountEl.innerText = `Showing ${filteredJobs.length} of ${total} jobs`;
    activeFilterLabelEl.innerText = `Status: ${currentFilter.toUpperCase()}`;

    // 4. Render Layout (Cards Grid vs Table)
    if (filteredJobs.length === 0) {
      emptyStateEl.classList.remove("hidden");
      emptyStateEl.classList.add("flex");
      jobsGridContainer.classList.add("hidden");
      jobsTableContainer.classList.add("hidden");
    } else {
      emptyStateEl.classList.add("hidden");
      emptyStateEl.classList.remove("flex");

      if (currentLayout === "grid") {
        jobsGridContainer.classList.remove("hidden");
        jobsTableContainer.classList.add("hidden");
        renderGrid(filteredJobs);
      } else {
        jobsGridContainer.classList.add("hidden");
        jobsTableContainer.classList.remove("hidden");
        renderTable(filteredJobs);
      }
    }

    // 5. Update Analytics if active
    if (activeTab === "analytics") {
      renderAnalytics();
    }
  }

  // Render Cards Grid
  function renderGrid(jobList) {
    jobsGridContainer.innerHTML = "";

    jobList.forEach((job) => {
      const match = calculateMatch(job);
      const card = document.createElement("div");
      card.className = "job-card bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between relative group";
      card.setAttribute("data-id", job.id);

      // Status Badge Config
      let statusBadge = "";
      if (job.status === "applied") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Applied</span>';
      } else if (job.status === "interview") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">Interview 🎯</span>';
      } else if (job.status === "offer") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 font-bold">Offer 🎉</span>';
      } else if (job.status === "rejected") {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>';
      }

      // Interview / Follow-up pill if set
      let dateBadge = "";
      if (job.interviewDate && job.status === "interview") {
        const d = new Date(job.interviewDate);
        dateBadge = `
          <div class="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1.5 font-medium">
            <i class="fa-solid fa-calendar-check text-emerald-600"></i>
            <span>Interview: ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        `;
      } else if (job.followupDate && job.status === "applied") {
        const d = new Date(job.followupDate);
        dateBadge = `
          <div class="mt-2.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs flex items-center gap-1.5 font-medium">
            <i class="fa-solid fa-bell text-amber-600"></i>
            <span>Follow-up due: ${d.toLocaleDateString()}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <!-- Top Row: Avatar/Company, Status & Actions -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-100/80 shadow-xs">
                ${(job.company || "C").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 leading-tight text-base group-hover:text-indigo-600 transition-colors">${job.company}</h3>
                <p class="text-xs text-slate-500 font-medium">${job.role}</p>
              </div>
            </div>

            <!-- Top Actions -->
            <div class="flex items-center space-x-1">
              <button class="btn-edit text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" title="Edit Application" data-id="${job.id}">
                <i class="fa-solid fa-pen-to-square text-xs"></i>
              </button>
              <button class="btn-delete text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer" title="Delete Application" data-id="${job.id}">
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Tags: Location, Workplace, Salary -->
          <div class="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
              <i class="fa-solid fa-location-dot text-slate-400 mr-1"></i>${job.location || "Remote"}
            </span>
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
              <i class="fa-solid fa-briefcase text-slate-400 mr-1"></i>${job.workplace || "Remote"}
            </span>
            ${job.salary ? `
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                ${job.salary}
              </span>
            ` : ""}
          </div>

          <!-- Description snippet -->
          <p class="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            ${job.description || "No description provided."}
          </p>

          <!-- AI Match Badge & Details Trigger -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="btn-ai-match px-2.5 py-1 rounded-lg border ${match.badgeClass} text-xs font-semibold flex items-center gap-1.5 hover:shadow-xs transition-all cursor-pointer" data-id="${job.id}">
                <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>${match.score}% Match</span>
              </button>
              <span class="text-[11px] text-slate-400 hidden sm:inline">${match.matchedSkills.length} skills matched</span>
            </div>
            <div>
              ${statusBadge}
            </div>
          </div>

          ${dateBadge}
        </div>

        <!-- Bottom Action Toolbar -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <!-- Status Quick Switcher -->
          <div class="flex items-center gap-1">
            <button class="btn-status-toggle px-2 py-1 rounded-md text-[11px] font-medium border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer ${job.status === 'applied' ? 'bg-blue-50 font-bold' : ''}" data-id="${job.id}" data-target="applied">
              Applied
            </button>
            <button class="btn-status-toggle px-2 py-1 rounded-md text-[11px] font-medium border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer ${job.status === 'interview' ? 'bg-emerald-50 font-bold' : ''}" data-id="${job.id}" data-target="interview">
              Interview
            </button>
            <button class="btn-status-toggle px-2 py-1 rounded-md text-[11px] font-medium border border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer ${job.status === 'offer' ? 'bg-purple-50 font-bold' : ''}" data-id="${job.id}" data-target="offer">
              Offer
            </button>
            <button class="btn-status-toggle px-2 py-1 rounded-md text-[11px] font-medium border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${job.status === 'rejected' ? 'bg-rose-50 font-bold' : ''}" data-id="${job.id}" data-target="rejected">
              Reject
            </button>
          </div>

          <!-- Link if exists -->
          ${job.url ? `
            <a href="${job.url}" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-indigo-600 p-1" title="Open Job Listing">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          ` : ""}
        </div>
      `;

      jobsGridContainer.appendChild(card);
    });

    attachGridEventListeners();
  }

  // Render Table View
  function renderTable(jobList) {
    jobsTableBody.innerHTML = "";

    jobList.forEach((job) => {
      const match = calculateMatch(job);
      const row = document.createElement("tr");
      row.className = "hover:bg-slate-50/80 transition-colors";

      let statusBadge = "";
      if (job.status === "applied") statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Applied</span>';
      else if (job.status === "interview") statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Interview</span>';
      else if (job.status === "offer") statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 font-bold">Offer 🎉</span>';
      else if (job.status === "rejected") statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>';

      row.innerHTML = `
        <td class="px-5 py-4">
          <div class="font-bold text-slate-900">${job.company}</div>
          <div class="text-xs text-slate-500">${job.role}</div>
        </td>
        <td class="px-4 py-4 text-xs">
          <div>${job.location || "Remote"}</div>
          <div class="text-slate-400">${job.workplace || "Full-time"}</div>
        </td>
        <td class="px-4 py-4 text-xs font-semibold text-slate-700">
          ${job.salary || "N/A"}
        </td>
        <td class="px-4 py-4">
          <button class="btn-ai-match px-2 py-0.5 rounded text-xs font-semibold border ${match.badgeClass} cursor-pointer" data-id="${job.id}">
            ⚡ ${match.score}%
          </button>
        </td>
        <td class="px-4 py-4 text-xs text-slate-500">
          ${job.appliedDate || "Recently"}
        </td>
        <td class="px-4 py-4">
          ${statusBadge}
        </td>
        <td class="px-5 py-4 text-right space-x-2">
          <button class="btn-edit text-slate-400 hover:text-indigo-600 p-1 cursor-pointer" data-id="${job.id}" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-delete text-slate-400 hover:text-rose-600 p-1 cursor-pointer" data-id="${job.id}" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      jobsTableBody.appendChild(row);
    });

    attachGridEventListeners();
  }

  // Attach dynamic event listeners to cards/rows
  function attachGridEventListeners() {
    // AI Match Modal
    document.querySelectorAll(".btn-ai-match").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const job = jobs.find((j) => j.id === id);
        if (job) openAiAnalysisModal(job);
      };
    });

    // Edit Job
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const job = jobs.find((j) => j.id === id);
        if (job) openJobModalForEdit(job);
      };
    });

    // Delete Job
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this job application?")) {
          const updated = jobs.filter((j) => j.id !== id);
          saveJobs(updated);
          showToast("Application deleted successfully", "info");
        }
      };
    });

    // Status Toggle
    document.querySelectorAll(".btn-status-toggle").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const targetStatus = btn.getAttribute("data-target");
        const updated = jobs.map((j) => {
          if (j.id === id) {
            return { ...j, status: targetStatus };
          }
          return j;
        });
        saveJobs(updated);
        showToast(`Status updated to ${targetStatus.toUpperCase()}`, "success");
      };
    });
  }

  // ----------------------------------------------------
  // INTERACTIVE ANALYTICS DASHBOARD (Chart.js)
  // ----------------------------------------------------
  function renderAnalytics() {
    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === "applied").length;
    const interview = jobs.filter((j) => j.status === "interview").length;
    const offer = jobs.filter((j) => j.status === "offer").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;

    // Funnel Calculations
    const responseCount = interview + offer;
    const responseRate = total > 0 ? Math.round((responseCount / total) * 100) : 0;
    const interviewRate = total > 0 ? Math.round((interview / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((offer / total) * 100) : 0;

    // Average AI Match Score
    const matchScores = jobs.map((j) => calculateMatch(j).score);
    const avgMatch = matchScores.length > 0 ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length) : 0;

    document.getElementById("stat-response-rate").innerText = `${responseRate}%`;
    document.getElementById("stat-interview-rate").innerText = `${interviewRate}%`;
    document.getElementById("stat-offer-rate").innerText = `${offerRate}%`;
    document.getElementById("stat-avg-match").innerText = `${avgMatch}%`;

    // 1. Status Doughnut Chart
    const ctxDoughnut = document.getElementById("chart-status-doughnut");
    if (ctxDoughnut) {
      if (charts.statusDoughnut) charts.statusDoughnut.destroy();
      charts.statusDoughnut = new Chart(ctxDoughnut, {
        type: "doughnut",
        data: {
          labels: ["Applied", "Interview", "Offer", "Rejected"],
          datasets: [
            {
              data: [applied, interview, offer, rejected],
              backgroundColor: ["#3b82f6", "#10b981", "#a855f7", "#f43f5e"],
              borderWidth: 2,
              borderColor: "#ffffff"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }

    // 2. Monthly Timeline Bar Chart
    const ctxTimeline = document.getElementById("chart-timeline-bar");
    if (ctxTimeline) {
      if (charts.timeline) charts.timeline.destroy();

      // Aggregate applications by month
      const months = ["May", "Jun", "Jul", "Aug", "Sep"];
      const appCounts = [2, 3, 5, total, 1];
      const intCounts = [1, 1, 2, interview, 1];

      charts.timeline = new Chart(ctxTimeline, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Applications Sent",
              data: appCounts,
              backgroundColor: "#6366f1",
              borderRadius: 6
            },
            {
              label: "Interviews Landed",
              data: intCounts,
              backgroundColor: "#10b981",
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 3. Top Skills In-Demand Chart
    const ctxSkills = document.getElementById("chart-skills-bar");
    if (ctxSkills) {
      if (charts.skills) charts.skills.destroy();

      const skillCounts = {};
      TECH_SKILLS_DICTIONARY.forEach((skill) => {
        let count = 0;
        jobs.forEach((j) => {
          const text = `${j.role} ${j.description}`.toLowerCase();
          if (text.includes(skill.toLowerCase())) count++;
        });
        if (count > 0) skillCounts[skill] = count;
      });

      const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      charts.skills = new Chart(ctxSkills, {
        type: "bar",
        data: {
          labels: sortedSkills.map((s) => s[0]),
          datasets: [
            {
              label: "Jobs Requiring Skill",
              data: sortedSkills.map((s) => s[1]),
              backgroundColor: "#f59e0b",
              borderRadius: 6
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { beginAtZero: true, grid: { color: "#f1f5f9" } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // 4. AI Match Score Tiers Chart
    const ctxTier = document.getElementById("chart-match-tier");
    if (ctxTier) {
      if (charts.tier) charts.tier.destroy();

      const highMatch = jobs.filter((j) => calculateMatch(j).score >= 80).length;
      const mediumMatch = jobs.filter((j) => {
        const s = calculateMatch(j).score;
        return s >= 50 && s < 80;
      }).length;
      const lowMatch = jobs.filter((j) => calculateMatch(j).score < 50).length;

      charts.tier = new Chart(ctxTier, {
        type: "pie",
        data: {
          labels: ["High Fit (80%+)", "Medium Fit (50-79%)", "Low Fit (<50%)"],
          datasets: [
            {
              data: [highMatch, mediumMatch, lowMatch],
              backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }
  }

  // ----------------------------------------------------
  // MODALS MANAGEMENT
  // ----------------------------------------------------
  function openAddJobModal() {
    jobForm.reset();
    document.getElementById("job-id").value = "";
    document.getElementById("form-applied-date").value = new Date().toISOString().split("T")[0];
    jobModalTitle.innerText = "Add New Job Application";
    jobModal.classList.remove("hidden");
    jobModal.classList.add("flex");
  }

  function openJobModalForEdit(job) {
    document.getElementById("job-id").value = job.id;
    document.getElementById("form-company").value = job.company || "";
    document.getElementById("form-role").value = job.role || "";
    document.getElementById("form-location").value = job.location || "";
    document.getElementById("form-workplace").value = job.workplace || "Remote";
    document.getElementById("form-type").value = job.type || "Full-time";
    document.getElementById("form-salary").value = job.salary || "";
    document.getElementById("form-status").value = job.status || "applied";
    document.getElementById("form-applied-date").value = job.appliedDate || "";
    document.getElementById("form-interview-date").value = job.interviewDate || "";
    document.getElementById("form-followup-date").value = job.followupDate || "";
    document.getElementById("form-description").value = job.description || "";
    document.getElementById("form-url").value = job.url || "";
    document.getElementById("form-notes").value = job.notes || "";

    jobModalTitle.innerText = "Edit Job Application";
    jobModal.classList.remove("hidden");
    jobModal.classList.add("flex");
  }

  function closeJobModal() {
    jobModal.classList.add("hidden");
    jobModal.classList.remove("flex");
  }

  function openResumeModal() {
    document.getElementById("resume-name").value = resume.name || "";
    document.getElementById("resume-title").value = resume.title || "";
    resumeSkillsInput.value = (resume.skills || []).join(", ");
    document.getElementById("resume-experience").value = resume.experience || 0;
    document.getElementById("resume-education").value = resume.education || "";
    document.getElementById("resume-summary").value = resume.summary || "";

    updateSkillsPreviewTags();
    resumeModal.classList.remove("hidden");
    resumeModal.classList.add("flex");
  }

  function closeResumeModal() {
    resumeModal.classList.add("hidden");
    resumeModal.classList.remove("flex");
  }

  function updateSkillsPreviewTags() {
    const raw = resumeSkillsInput.value;
    const tags = raw.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    skillsPreviewTags.innerHTML = "";
    tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200";
      span.innerText = tag;
      skillsPreviewTags.appendChild(span);
    });
  }

  function openAiAnalysisModal(job) {
    const match = calculateMatch(job);
    document.getElementById("analysis-job-title").innerText = `${job.role} • ${job.company}`;
    document.getElementById("analysis-score-headline").innerText = `${match.badgeText} (${match.score}%)`;
    
    const badge = document.getElementById("analysis-score-badge");
    badge.innerText = `${match.score}%`;
    if (match.score >= 80) badge.className = "w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-extrabold shadow-md";
    else if (match.score >= 50) badge.className = "w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-extrabold shadow-md";
    else badge.className = "w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl font-extrabold shadow-md";

    // Matched skills tags
    const matchedContainer = document.getElementById("analysis-matched-skills");
    document.getElementById("analysis-matched-count").innerText = match.matchedSkills.length;
    matchedContainer.innerHTML = "";
    if (match.matchedSkills.length > 0) {
      match.matchedSkills.forEach((s) => {
        const t = document.createElement("span");
        t.className = "px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200";
        t.innerHTML = `<i class="fa-solid fa-check mr-1"></i>${s}`;
        matchedContainer.appendChild(t);
      });
    } else {
      matchedContainer.innerHTML = '<span class="text-xs text-slate-400">No direct keyword matches found. Add more skills to your resume.</span>';
    }

    // Missing skills tags
    const missingContainer = document.getElementById("analysis-missing-skills");
    document.getElementById("analysis-missing-count").innerText = match.missingSkills.length;
    missingContainer.innerHTML = "";
    if (match.missingSkills.length > 0) {
      match.missingSkills.forEach((s) => {
        const t = document.createElement("span");
        t.className = "px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200";
        t.innerHTML = `<i class="fa-solid fa-plus mr-1"></i>${s}`;
        missingContainer.appendChild(t);
      });
    } else {
      missingContainer.innerHTML = '<span class="text-xs text-emerald-600 font-medium">Awesome! Your resume covers all key detected skills for this role.</span>';
    }

    // AI Tailored Tips
    const recContainer = document.getElementById("analysis-recommendations");
    recContainer.innerHTML = "";
    match.recommendations.forEach((rec) => {
      const p = document.createElement("p");
      p.className = "flex items-start gap-2";
      p.innerHTML = `<i class="fa-solid fa-circle-arrow-right text-indigo-500 mt-1 text-xs"></i><span>${rec}</span>`;
      recContainer.appendChild(p);
    });

    aiAnalysisModal.classList.remove("hidden");
    aiAnalysisModal.classList.add("flex");
  }

  function closeAiAnalysisModal() {
    aiAnalysisModal.classList.add("hidden");
    aiAnalysisModal.classList.remove("flex");
  }

  // ----------------------------------------------------
  // EXPORT ENGINE (CSV, PDF & JSON BACKUP)
  // ----------------------------------------------------
  function exportToCsv() {
    if (jobs.length === 0) {
      showToast("No job applications to export.", "warning");
      return;
    }

    const headers = [
      "Company",
      "Job Title",
      "Location",
      "Workplace",
      "Employment Type",
      "Salary",
      "Status",
      "Date Applied",
      "Interview Date",
      "Follow-up Date",
      "AI Match Score",
      "Job URL",
      "Notes"
    ];

    const rows = jobs.map((job) => {
      const match = calculateMatch(job);
      return [
        `"${(job.company || "").replace(/"/g, '""')}"`,
        `"${(job.role || "").replace(/"/g, '""')}"`,
        `"${(job.location || "").replace(/"/g, '""')}"`,
        `"${job.workplace || ""}"`,
        `"${job.type || ""}"`,
        `"${(job.salary || "").replace(/"/g, '""')}"`,
        `"${job.status || ""}"`,
        `"${job.appliedDate || ""}"`,
        `"${job.interviewDate || ""}"`,
        `"${job.followupDate || ""}"`,
        `"${match.score}%"`,
        `"${(job.url || "").replace(/"/g, '""')}"`,
        `"${(job.notes || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `job_applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV export completed!", "success");
  }

  function exportToPdf() {
    if (jobs.length === 0) {
      showToast("No job applications to export.", "warning");
      return;
    }

    showToast("Generating PDF report, please wait...", "info");

    const template = document.getElementById("pdf-report-template");
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    let rowsHtml = "";
    jobs.forEach((j) => {
      const match = calculateMatch(j);
      rowsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
          <td style="padding: 8px 6px; font-weight: bold;">${j.company}</td>
          <td style="padding: 8px 6px;">${j.role}</td>
          <td style="padding: 8px 6px;">${j.location || "Remote"}</td>
          <td style="padding: 8px 6px;">${j.salary || "-"}</td>
          <td style="padding: 8px 6px; text-transform: uppercase; font-weight: bold;">${j.status}</td>
          <td style="padding: 8px 6px;">${match.score}%</td>
          <td style="padding: 8px 6px;">${j.appliedDate || "-"}</td>
        </tr>
      `;
    });

    template.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h1 style="font-size: 22px; font-weight: bold; margin: 0; color: #1e1b4b;">Job Application Report</h1>
            <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Applicant: ${resume.name || "User"} • Target: ${resume.title || "Software Engineer"}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 11px; color: #64748b; margin: 0;">Date: ${dateStr}</p>
            <p style="font-size: 11px; font-weight: bold; color: #6366f1; margin: 4px 0 0 0;">Total Applications: ${jobs.length}</p>
          </div>
        </div>

        <!-- Summary KPIs -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #64748b; margin: 0;">APPLIED</p>
            <h3 style="font-size: 18px; margin: 4px 0; color: #3b82f6;">${jobs.filter(j => j.status === 'applied').length}</h3>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #64748b; margin: 0;">INTERVIEW</p>
            <h3 style="font-size: 18px; margin: 4px 0; color: #10b981;">${jobs.filter(j => j.status === 'interview').length}</h3>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #64748b; margin: 0;">OFFERS</p>
            <h3 style="font-size: 18px; margin: 4px 0; color: #a855f7;">${jobs.filter(j => j.status === 'offer').length}</h3>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="font-size: 10px; color: #64748b; margin: 0;">REJECTED</p>
            <h3 style="font-size: 18px; margin: 4px 0; color: #f43f5e;">${jobs.filter(j => j.status === 'rejected').length}</h3>
          </div>
        </div>

        <!-- Applications Table -->
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; color: #475569;">
              <th style="padding: 8px 6px;">Company</th>
              <th style="padding: 8px 6px;">Role</th>
              <th style="padding: 8px 6px;">Location</th>
              <th style="padding: 8px 6px;">Salary</th>
              <th style="padding: 8px 6px;">Status</th>
              <th style="padding: 8px 6px;">AI Match</th>
              <th style="padding: 8px 6px;">Applied</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 10px; color: #94a3b8;">
          Generated with Job Application Tracker Pro • Powered by AI Resume Matcher
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Job_Application_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(template.firstElementChild).save().then(() => {
      showToast("PDF report generated successfully!", "success");
    }).catch(err => {
      console.error(err);
      showToast("Error generating PDF", "error");
    });
  }

  function backupJson() {
    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      jobs,
      resume
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `job_tracker_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Backup JSON exported!", "success");
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.jobs && Array.isArray(parsed.jobs)) {
          saveJobs(parsed.jobs);
          if (parsed.resume) {
            saveResume(parsed.resume);
          }
          showToast("Data restored successfully from backup!", "success");
        } else {
          showToast("Invalid backup file structure.", "error");
        }
      } catch (err) {
        showToast("Failed to parse JSON file.", "error");
      }
    };
    reader.readAsText(file);
  }

  // ----------------------------------------------------
  // TOAST NOTIFICATION SYSTEM
  // ----------------------------------------------------
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");

    let bg = "bg-slate-900 text-white";
    let icon = "fa-circle-info text-blue-400";
    if (type === "success") {
      bg = "bg-emerald-900 text-white border border-emerald-700";
      icon = "fa-circle-check text-emerald-400";
    } else if (type === "warning") {
      bg = "bg-amber-900 text-white border border-amber-700";
      icon = "fa-triangle-exclamation text-amber-400";
    } else if (type === "error") {
      bg = "bg-rose-900 text-white border border-rose-700";
      icon = "fa-circle-xmark text-rose-400";
    }

    toast.className = `${bg} px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium flex items-center space-x-2.5 transform transition-all duration-300 pointer-events-auto opacity-0 translate-y-2`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-base"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-y-2");
    }, 10);

    // Animate out
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ----------------------------------------------------
  // EVENT LISTENERS BINDING
  // ----------------------------------------------------

  // Filter Tabs
  document.querySelectorAll(".filter-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab-btn").forEach((b) => {
        b.classList.remove("bg-white", "text-indigo-600", "shadow-xs");
        b.classList.add("text-slate-600");
      });
      btn.classList.add("bg-white", "text-indigo-600", "shadow-xs");
      btn.classList.remove("text-slate-600");

      currentFilter = btn.getAttribute("data-filter");
      render();
    });
  });

  // Search Bar
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (searchQuery.length > 0) {
      clearSearchBtn.classList.remove("hidden");
    } else {
      clearSearchBtn.classList.add("hidden");
    }
    render();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    render();
  });

  // Sort Dropdown
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
  });

  // Layout Toggle (Grid vs Table)
  viewGridBtn.addEventListener("click", () => {
    currentLayout = "grid";
    viewGridBtn.classList.add("bg-white", "text-indigo-700", "shadow-xs");
    viewGridBtn.classList.remove("text-slate-500");
    viewTableBtn.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
    viewTableBtn.classList.add("text-slate-500");
    render();
  });

  viewTableBtn.addEventListener("click", () => {
    currentLayout = "table";
    viewTableBtn.classList.add("bg-white", "text-indigo-700", "shadow-xs");
    viewTableBtn.classList.remove("text-slate-500");
    viewGridBtn.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
    viewGridBtn.classList.add("text-slate-500");
    render();
  });

  // Section Switch (Applications Board vs Analytics)
  viewPipelineBtn.addEventListener("click", () => {
    activeTab = "pipeline";
    viewPipelineBtn.classList.add("bg-white", "text-indigo-700", "shadow-xs");
    viewPipelineBtn.classList.remove("text-slate-600");
    viewAnalyticsBtn.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
    viewAnalyticsBtn.classList.add("text-slate-600");

    sectionPipeline.classList.remove("hidden");
    sectionAnalytics.classList.add("hidden");
    render();
  });

  viewAnalyticsBtn.addEventListener("click", () => {
    activeTab = "analytics";
    viewAnalyticsBtn.classList.add("bg-white", "text-indigo-700", "shadow-xs");
    viewAnalyticsBtn.classList.remove("text-slate-600");
    viewPipelineBtn.classList.remove("bg-white", "text-indigo-700", "shadow-xs");
    viewPipelineBtn.classList.add("text-slate-600");

    sectionPipeline.classList.add("hidden");
    sectionAnalytics.classList.remove("hidden");
    renderAnalytics();
  });

  backToPipelineBtn.addEventListener("click", () => {
    viewPipelineBtn.click();
  });

  // Reset to default sample jobs
  resetSampleDataBtn.addEventListener("click", () => {
    if (confirm("Reset to original 8 default sample job applications?")) {
      saveJobs(JSON.parse(JSON.stringify(DEFAULT_JOBS)));
      showToast("Reset to default sample jobs", "info");
    }
  });

  // Empty state buttons
  document.getElementById("empty-clear-filters-btn").addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    currentFilter = "all";
    document.querySelector('[data-filter="all"]').click();
  });

  document.getElementById("empty-add-job-btn").addEventListener("click", openAddJobModal);

  // Reminders dismiss
  dismissRemindersBtn.addEventListener("click", () => {
    remindersBanner.classList.add("hidden");
  });

  // Add Job Modal Handlers
  openAddJobBtn.addEventListener("click", openAddJobModal);
  closeJobModalBtn.addEventListener("click", closeJobModal);
  cancelJobModalBtn.addEventListener("click", closeJobModal);

  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("job-id").value;
    const company = document.getElementById("form-company").value.trim();
    const role = document.getElementById("form-role").value.trim();
    const location = document.getElementById("form-location").value.trim();
    const workplace = document.getElementById("form-workplace").value;
    const type = document.getElementById("form-type").value;
    const salary = document.getElementById("form-salary").value.trim();
    const status = document.getElementById("form-status").value;
    const appliedDate = document.getElementById("form-applied-date").value;
    const interviewDate = document.getElementById("form-interview-date").value;
    const followupDate = document.getElementById("form-followup-date").value;
    const description = document.getElementById("form-description").value.trim();
    const url = document.getElementById("form-url").value.trim();
    const notes = document.getElementById("form-notes").value.trim();

    if (id) {
      // Edit existing
      const updated = jobs.map((j) => {
        if (j.id === id) {
          return {
            ...j,
            company,
            role,
            location,
            workplace,
            type,
            salary,
            status,
            appliedDate,
            interviewDate,
            followupDate,
            description,
            url,
            notes
          };
        }
        return j;
      });
      saveJobs(updated);
      showToast("Application updated successfully!", "success");
    } else {
      // Create new
      const newJob = {
        id: "job-" + Date.now(),
        company,
        role,
        location,
        workplace,
        type,
        salary,
        status,
        appliedDate: appliedDate || new Date().toISOString().split("T")[0],
        interviewDate,
        followupDate,
        description,
        url,
        notes,
        createdAt: Date.now()
      };
      saveJobs([newJob, ...jobs]);
      showToast("New application added to board!", "success");
    }

    closeJobModal();
  });

  // Resume Modal Handlers
  openResumeBtn.addEventListener("click", openResumeModal);
  closeResumeModalBtn.addEventListener("click", closeResumeModal);
  cancelResumeBtn.addEventListener("click", closeResumeModal);
  resumeSkillsInput.addEventListener("input", updateSkillsPreviewTags);

  resumeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("resume-name").value.trim();
    const title = document.getElementById("resume-title").value.trim();
    const rawSkills = resumeSkillsInput.value;
    const skills = rawSkills.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    const experience = parseFloat(document.getElementById("resume-experience").value) || 0;
    const education = document.getElementById("resume-education").value.trim();
    const summary = document.getElementById("resume-summary").value.trim();

    const newResume = {
      name,
      title,
      skills,
      experience,
      education,
      summary
    };

    saveResume(newResume);
    closeResumeModal();
  });

  // AI Match Analysis Modal Handlers
  closeAnalysisModalBtn.addEventListener("click", closeAiAnalysisModal);
  closeAnalysisBtn.addEventListener("click", closeAiAnalysisModal);

  // Export Dropdown Handlers
  exportDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exportDropdownMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!exportDropdownBtn.contains(e.target) && !exportDropdownMenu.contains(e.target)) {
      exportDropdownMenu.classList.add("hidden");
    }
  });

  exportCsvBtn.addEventListener("click", () => {
    exportDropdownMenu.classList.add("hidden");
    exportToCsv();
  });

  exportPdfBtn.addEventListener("click", () => {
    exportDropdownMenu.classList.add("hidden");
    exportToPdf();
  });

  backupJsonBtn.addEventListener("click", () => {
    exportDropdownMenu.classList.add("hidden");
    backupJson();
  });

  importJsonInput.addEventListener("change", (e) => {
    exportDropdownMenu.classList.add("hidden");
    if (e.target.files && e.target.files[0]) {
      importJson(e.target.files[0]);
    }
  });

  // Close modals on clicking outside overlay
  [jobModal, resumeModal, aiAnalysisModal].forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) {
        m.classList.add("hidden");
        m.classList.remove("flex");
      }
    });
  });

  // Initial Render
  render();

  // Alert toast if interviews today
  const reminders = getUpcomingReminders();
  const todayReminders = reminders.filter((r) => r.urgency === "today");
  if (todayReminders.length > 0) {
    setTimeout(() => {
      showToast(`Reminder: You have ${todayReminders.length} interview/deadline scheduled today!`, "warning");
    }, 800);
  }
});
