<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b4b,100:2d1b69&height=180&section=header&text=Job%20Application%20Tracker%20Pro&fontSize=32&fontColor=ffffff&fontAlignY=38&desc=AI%20Resume%20Matcher%20%E2%80%A2%20Interview%20Reminders%20%E2%80%A2%20Analytics%20Dashboard%20%E2%80%A2%20Export%20PDF%2FCSV&descAlignY=58&descSize=14&descColor=a78bfa&animation=fadeIn" width="100%" alt="Job Application Tracker Pro banner" />

  [![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-View%20Site-7c3aed?style=for-the-badge&logo=github&logoColor=white)](https://imoloy.github.io/B13-A4)
  [![GitHub](https://img.shields.io/badge/GitHub-iMoloy%2FB13--A4-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iMoloy/B13-A4)

</div>

---

## 📖 Overview

**Job Application Tracker Pro** is a modern, client-side web application designed to help software engineers and professionals organize, analyze, and optimize their job hunt pipeline.

With built-in **AI Resume vs Job Matching**, **Interview & Deadline Reminders**, **Interactive Chart.js Analytics**, and **Export to CSV / PDF**, it provides a complete command center for career management — all stored persistently in `localStorage`.

---

## ✨ Features

### 1. 🤖 AI Resume vs Job Matcher
- **Custom Resume Profile**: Configure your target job title, technical & soft skills, years of experience, and summary.
- **Intelligent Keyword Extractor**: Scans job descriptions to detect required tech stacks and libraries.
- **Dynamic Match Score %**: Generates instant fit scores (High / Medium / Low match) on each job card.
- **Detailed Breakdown Modal**: Inspect matched skills, missing in-demand skills, and AI tailored suggestions to customize your resume.

### 2. ⏰ Interview & Follow-up Reminders
- **Upcoming Schedule Banner**: Real-time alerts for interviews scheduled today, this week, and overdue follow-up deadlines.
- **In-App Toast Alerts**: Instant audio-visual toasts warning of urgent interview deadlines upon opening the app.
- **Date & Time Logging**: Schedule exact interview timestamps and set target follow-up dates.

### 3. 📊 Interactive Analytics Dashboard
- Powered by **Chart.js**:
  - **Status Pipeline Distribution** (Doughnut Chart: Applied, Interview, Offer, Rejected).
  - **Monthly Velocity & Response Tracking** (Bar & Line Chart).
  - **Most In-Demand Skills** across your tracked positions (Horizontal Bar Chart).
  - **AI Match Score Tiers** distribution.
- **Key Conversion Funnel Metrics**: Response Rate %, Interview Conversion Rate %, Offer Rate %, and Average Fit Score.

### 4. 📁 Data Export & Portability
- **Export to CSV**: Instant spreadsheet generation with all application details, dates, and notes.
- **Export to PDF Report**: Formatted, print-ready PDF summary document with metrics and scheduled interviews via `html2pdf.js`.
- **JSON Backup & Restore**: One-click complete state backup and JSON import.

### 5. 🛠️ Complete Application Pipeline Management
- Add, edit, delete, and quick-toggle status (`Applied` ➔ `Interview` ➔ `Offer` / `Rejected`).
- Full-text instant search across companies, roles, locations, keywords, and notes.
- Multi-filter status tabs and multi-field sorting (Date, Match Score, Salary, Company).
- Switch between **Grid Cards View** and **Compact Table View**.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Modern accessible application layout and modals |
| **Tailwind CSS v4** | Utility-first responsive styling and typography |
| **JavaScript (ES6+)** | State management, AI matching engine, DOM manipulation |
| **Chart.js** | Interactive charts for pipeline and skill demand analytics |
| **html2pdf.js** | Client-side styled PDF generation |
| **FontAwesome 6** | Modern UI iconography |
| **localStorage** | Persistent offline browser storage |

---

## 🚀 Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/iMoloy/B13-A4.git
   cd B13-A4
   ```

2. **Open in browser**
   ```bash
   # Direct file
   open index.html
   
   # Or with any static server
   npx serve .
   # or
   python3 -m http.server 3000
   ```

Zero npm installation or build steps required.

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2d1b69,50:1a1b4b,100:0d1117&height=80&section=footer&animation=fadeIn" width="100%" alt="Footer" />
  <sub>Crafted with ❤️ by <strong>Moloy Krishna Paul</strong></sub>
</div>
