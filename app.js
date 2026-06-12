const STORAGE_KEY = "graduateApplicationCrm";

const statuses = [
  "Submitted",
  "Incomplete",
  "Under Review",
  "Admitted",
  "Denied",
  "Waitlisted"
];

const requiredDocuments = [
  "Transcript",
  "Statement of Purpose",
  "Recommendation Letters",
  "Resume/CV",
  "English Proficiency",
  "Application Fee"
];

const sampleApplicants = [
  {
    id: crypto.randomUUID(),
    fullName: "Amina Rahman",
    email: "amina.rahman@example.edu",
    program: "Computer Science PhD",
    term: "Fall 2026",
    status: "Under Review",
    reviewer: "Dr. Sara",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: "Ready for faculty review. Strong software engineering background."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Daniel Carter",
    email: "daniel.carter@example.edu",
    program: "Data Science MS",
    term: "Fall 2026",
    status: "Incomplete",
    reviewer: "Graduate School Staff",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": false,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: "Needs one remaining recommendation letter."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Mei Chen",
    email: "mei.chen@example.edu",
    program: "Cybersecurity MS",
    term: "Spring 2027",
    status: "Submitted",
    reviewer: "Unassigned",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": false,
      "Application Fee": true
    },
    notes: "English proficiency score pending verification."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Carlos Rivera",
    email: "carlos.rivera@example.edu",
    program: "Computer Science PhD",
    term: "Fall 2026",
    status: "Admitted",
    reviewer: "Dr. Raju",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: "Admitted with funding recommendation."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Fatima Noor",
    email: "fatima.noor@example.edu",
    program: "Information Systems MS",
    term: "Fall 2026",
    status: "Waitlisted",
    reviewer: "Program Committee",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: "Waitlisted pending capacity review."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Noah Williams",
    email: "noah.williams@example.edu",
    program: "Data Science MS",
    term: "Spring 2027",
    status: "Denied",
    reviewer: "Program Committee",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: "Decision completed."
  },
  {
    id: crypto.randomUUID(),
    fullName: "Sobhana Jahan",
    email: "sjahan2@example.edu",
    program: "Computer Science, PhD",
    term: "Fall 2026",
    status: "Submitted",
    reviewer: "Unassigned",
    documents: {
      "Transcript": true,
      "Statement of Purpose": true,
      "Recommendation Letters": true,
      "Resume/CV": true,
      "English Proficiency": true,
      "Application Fee": true
    },
    notes: ""
  }
];

const sampleTickets = [
  {
    id: crypto.randomUUID(),
    title: "Applicant cannot upload transcript PDF",
    userType: "Applicant",
    priority: "High",
    status: "Open",
    resolutionNotes: "Need to verify file type, file size, and browser compatibility."
  },
  {
    id: crypto.randomUUID(),
    title: "Reviewer needs application list by program",
    userType: "Faculty Reviewer",
    priority: "Medium",
    status: "In Progress",
    resolutionNotes: "Create filtered export for Computer Science PhD applicants."
  },
  {
    id: crypto.randomUUID(),
    title: "Staff request: update decision status report",
    userType: "Graduate School Staff",
    priority: "Low",
    status: "Resolved",
    resolutionNotes: "Report filters were updated and tested successfully."
  }
];

const defaultState = () => ({
  applicants: structuredClone(sampleApplicants),
  tickets: structuredClone(sampleTickets),
  lastUpdated: new Date().toISOString()
});

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    return JSON.parse(saved);
  } catch {
    return defaultState();
  }
}

function saveState() {
  state.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unspecified";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function getMissingDocuments(applicant) {
  return requiredDocuments.filter(doc => !applicant.documents?.[doc]);
}

function cssSafe(value) {
  return String(value).replaceAll(" ", "\\ ");
}

function statusPill(value) {
  return `<span class="status-pill status-${cssSafe(value)}">${value}</span>`;
}

function setActiveSection(sectionId) {
  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active-screen", screen.id === sectionId);
  });
}

function renderDashboard() {
  const applicants = state.applicants;
  const incomplete = applicants.filter(applicant => getMissingDocuments(applicant).length > 0).length;
  const underReview = applicants.filter(applicant => applicant.status === "Under Review").length;
  const admitted = applicants.filter(applicant => applicant.status === "Admitted").length;

  const kpis = [
    { label: "Total Applicants", value: applicants.length, note: "All application records" },
    { label: "Incomplete", value: incomplete, note: "Missing required documents" },
    { label: "Under Review", value: underReview, note: "Awaiting reviewer decision" },
    { label: "Admitted", value: admitted, note: "Successful decisions" }
  ];

  document.getElementById("kpiGrid").innerHTML = kpis.map(kpi => `
    <div class="kpi-card">
      <p class="label">${kpi.label}</p>
      <p class="number">${kpi.value}</p>
      <p class="label">${kpi.note}</p>
    </div>
  `).join("");

  const byStatus = countBy(applicants, "status");
  const max = Math.max(...Object.values(byStatus), 1);
  document.getElementById("statusBars").innerHTML = statuses.map(status => {
    const count = byStatus[status] || 0;
    const width = (count / max) * 100;
    return `
      <div class="bar-item">
        <div class="bar-meta"><span>${status}</span><span>${count}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
      </div>
    `;
  }).join("");

  const alerts = [];
  const highPriorityTickets = state.tickets.filter(ticket => ticket.priority === "High" && ticket.status !== "Resolved").length;
  const unassigned = applicants.filter(applicant => !applicant.reviewer || applicant.reviewer === "Unassigned").length;

  if (incomplete > 0) alerts.push(`${incomplete} applicant(s) have missing documents and may require follow-up.`);
  if (highPriorityTickets > 0) alerts.push(`${highPriorityTickets} high-priority Help Desk ticket(s) need attention.`);
  if (unassigned > 0) alerts.push(`${unassigned} applicant(s) are currently unassigned to a reviewer.`);
  if (alerts.length === 0) alerts.push("No urgent operational alerts at this time.");

  document.getElementById("alertsList").innerHTML = alerts.map(alert => `<li>${alert}</li>`).join("");
  document.getElementById("lastUpdated").textContent = `Last updated: ${new Date(state.lastUpdated).toLocaleString()}`;
}

function renderFilters() {
  const programs = [...new Set(state.applicants.map(applicant => applicant.program))].sort();
  const programFilter = document.getElementById("programFilter");
  const selectedProgram = programFilter.value || "all";
  programFilter.innerHTML = `<option value="all">All Programs</option>` + programs.map(program => `<option value="${program}">${program}</option>`).join("");
  programFilter.value = programs.includes(selectedProgram) ? selectedProgram : "all";

  const statusFilter = document.getElementById("statusFilter");
  const selectedStatus = statusFilter.value || "all";
  statusFilter.innerHTML = `<option value="all">All Statuses</option>` + statuses.map(status => `<option value="${status}">${status}</option>`).join("");
  statusFilter.value = statuses.includes(selectedStatus) ? selectedStatus : "all";

  const statusSelect = document.getElementById("applicationStatus");
  statusSelect.innerHTML = statuses.map(status => `<option value="${status}">${status}</option>`).join("");
}

function getFilteredApplicants() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const program = document.getElementById("programFilter").value;
  const status = document.getElementById("statusFilter").value;

  return state.applicants.filter(applicant => {
    const matchesSearch = !search || [applicant.fullName, applicant.email, applicant.program, applicant.term, applicant.reviewer]
      .some(value => String(value).toLowerCase().includes(search));
    const matchesProgram = program === "all" || applicant.program === program;
    const matchesStatus = status === "all" || applicant.status === status;
    return matchesSearch && matchesProgram && matchesStatus;
  });
}

function renderApplicants() {
  const applicants = getFilteredApplicants();
  const body = document.getElementById("applicantTableBody");

  body.innerHTML = applicants.map(applicant => {
    const missing = getMissingDocuments(applicant);
    return `
      <tr>
        <td><strong>${applicant.fullName}</strong><br><span class="muted">${applicant.email}</span><br><span class="muted">${applicant.term}</span></td>
        <td>${applicant.program}</td>
        <td>${statusPill(applicant.status)}</td>
        <td>${missing.length ? missing.join(", ") : "Complete"}</td>
        <td>${applicant.reviewer || "Unassigned"}</td>
        <td>
          <div class="action-row">
            <button class="small-btn" data-edit-applicant="${applicant.id}">Edit</button>
            <button class="small-btn" data-delete-applicant="${applicant.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6">No matching applicants found.</td></tr>`;
}

function renderReports() {
  const programCounts = countBy(state.applicants, "program");
  const statusCounts = countBy(state.applicants, "status");

  document.getElementById("programReport").innerHTML = renderSummaryTable("Program", programCounts);
  document.getElementById("statusReport").innerHTML = renderSummaryTable("Status", statusCounts);

  const incomplete = state.applicants.filter(applicant => getMissingDocuments(applicant).length > 0);
  document.getElementById("incompleteTableBody").innerHTML = incomplete.map(applicant => `
    <tr>
      <td>${applicant.fullName}</td>
      <td>${applicant.email}</td>
      <td>${applicant.program}</td>
      <td>${getMissingDocuments(applicant).join(", ")}</td>
      <td>${statusPill(applicant.status)}</td>
    </tr>
  `).join("") || `<tr><td colspan="5">No incomplete applications.</td></tr>`;
}

function renderSummaryTable(label, counts) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => `
    <tr><td>${name}</td><td>${count}</td></tr>
  `).join("");

  return `
    <div class="table-wrap compact">
      <table>
        <thead><tr><th>${label}</th><th>Count</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderTickets() {
  document.getElementById("ticketTableBody").innerHTML = state.tickets.map(ticket => `
    <tr>
      <td><strong>${ticket.title}</strong></td>
      <td>${ticket.userType}</td>
      <td>${statusPill(ticket.priority)}</td>
      <td>${statusPill(ticket.status)}</td>
      <td>${ticket.resolutionNotes || "--"}</td>
      <td>
        <div class="action-row">
          <button class="small-btn" data-edit-ticket="${ticket.id}">Edit</button>
          <button class="small-btn" data-delete-ticket="${ticket.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="6">No Help Desk tickets found.</td></tr>`;
}

function renderDocumentChecklist(documents = {}) {
  document.getElementById("documentChecklist").innerHTML = requiredDocuments.map(doc => `
    <label><input type="checkbox" name="documents" value="${doc}" ${documents[doc] ? "checked" : ""}> ${doc}</label>
  `).join("");
}

function renderAll() {
  renderFilters();
  renderDashboard();
  renderApplicants();
  renderReports();
  renderTickets();
}

function openApplicantForm(applicant = null) {
  document.getElementById("applicantModalTitle").textContent = applicant ? "Edit Applicant" : "Add Applicant";
  document.getElementById("applicantId").value = applicant?.id || "";
  document.getElementById("fullName").value = applicant?.fullName || "";
  document.getElementById("email").value = applicant?.email || "";
  document.getElementById("program").value = applicant?.program || "";
  document.getElementById("term").value = applicant?.term || "Fall 2026";
  document.getElementById("applicationStatus").value = applicant?.status || "Submitted";
  document.getElementById("reviewer").value = applicant?.reviewer || "Unassigned";
  document.getElementById("notes").value = applicant?.notes || "";
  renderDocumentChecklist(applicant?.documents || {});
  document.getElementById("applicantDialog").showModal();
}

function openTicketForm(ticket = null) {
  document.getElementById("ticketModalTitle").textContent = ticket ? "Edit Help Desk Ticket" : "Add Help Desk Ticket";
  document.getElementById("ticketId").value = ticket?.id || "";
  document.getElementById("ticketTitle").value = ticket?.title || "";
  document.getElementById("userType").value = ticket?.userType || "Applicant";
  document.getElementById("priority").value = ticket?.priority || "Medium";
  document.getElementById("ticketStatus").value = ticket?.status || "Open";
  document.getElementById("resolutionNotes").value = ticket?.resolutionNotes || "";
  document.getElementById("ticketDialog").showModal();
}

function collectDocumentsFromForm() {
  const docs = {};
  requiredDocuments.forEach(doc => docs[doc] = false);
  document.querySelectorAll("input[name='documents']:checked").forEach(input => docs[input.value] = true);
  return docs;
}

function downloadCsv(filename, rows) {
  const csv = rows.map(row => row.map(value => {
    const cell = String(value ?? "").replaceAll('"', '""');
    return `"${cell}"`;
  }).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportApplicants() {
  const rows = [["Name", "Email", "Program", "Term", "Status", "Reviewer", "Missing Documents", "Notes"]];
  state.applicants.forEach(applicant => rows.push([
    applicant.fullName,
    applicant.email,
    applicant.program,
    applicant.term,
    applicant.status,
    applicant.reviewer,
    getMissingDocuments(applicant).join("; ") || "Complete",
    applicant.notes
  ]));
  downloadCsv("applicants_export.csv", rows);
}

function exportSummaryReport() {
  const rows = [["Report Type", "Category", "Count"]];
  Object.entries(countBy(state.applicants, "program")).forEach(([program, count]) => rows.push(["Applications by Program", program, count]));
  Object.entries(countBy(state.applicants, "status")).forEach(([status, count]) => rows.push(["Applications by Status", status, count]));
  downloadCsv("admissions_summary_report.csv", rows);
}

function handleApplicantSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("applicantId").value || crypto.randomUUID();
  const applicant = {
    id,
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    program: document.getElementById("program").value.trim(),
    term: document.getElementById("term").value.trim(),
    status: document.getElementById("applicationStatus").value,
    reviewer: document.getElementById("reviewer").value.trim() || "Unassigned",
    documents: collectDocumentsFromForm(),
    notes: document.getElementById("notes").value.trim()
  };

  const index = state.applicants.findIndex(item => item.id === id);
  if (index >= 0) {
    state.applicants[index] = applicant;
  } else {
    state.applicants.push(applicant);
  }

  document.getElementById("applicantDialog").close();
  saveState();
}

function handleTicketSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("ticketId").value || crypto.randomUUID();
  const ticket = {
    id,
    title: document.getElementById("ticketTitle").value.trim(),
    userType: document.getElementById("userType").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("ticketStatus").value,
    resolutionNotes: document.getElementById("resolutionNotes").value.trim()
  };

  const index = state.tickets.findIndex(item => item.id === id);
  if (index >= 0) {
    state.tickets[index] = ticket;
  } else {
    state.tickets.push(ticket);
  }

  document.getElementById("ticketDialog").close();
  saveState();
}

function handleTableActions(event) {
  const applicantEditId = event.target.dataset.editApplicant;
  const applicantDeleteId = event.target.dataset.deleteApplicant;
  const ticketEditId = event.target.dataset.editTicket;
  const ticketDeleteId = event.target.dataset.deleteTicket;

  if (applicantEditId) {
    const applicant = state.applicants.find(item => item.id === applicantEditId);
    openApplicantForm(applicant);
  }

  if (applicantDeleteId && confirm("Delete this applicant record?")) {
    state.applicants = state.applicants.filter(item => item.id !== applicantDeleteId);
    saveState();
  }

  if (ticketEditId) {
    const ticket = state.tickets.find(item => item.id === ticketEditId);
    openTicketForm(ticket);
  }

  if (ticketDeleteId && confirm("Delete this Help Desk ticket?")) {
    state.tickets = state.tickets.filter(item => item.id !== ticketDeleteId);
    saveState();
  }
}

function attachEvents() {
  document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => setActiveSection(button.dataset.section));
  });

  document.getElementById("openApplicantForm").addEventListener("click", () => openApplicantForm());
  document.getElementById("openTicketForm").addEventListener("click", () => openTicketForm());
  document.getElementById("applicantForm").addEventListener("submit", handleApplicantSubmit);
  document.getElementById("ticketForm").addEventListener("submit", handleTicketSubmit);
  document.getElementById("exportApplicantsBtn").addEventListener("click", exportApplicants);
  document.getElementById("exportReportBtn").addEventListener("click", exportSummaryReport);

  document.getElementById("seedBtn").addEventListener("click", () => {
    if (confirm("This will reset all sample CRM data. Continue?")) {
      state = defaultState();
      saveState();
    }
  });

  ["searchInput", "programFilter", "statusFilter"].forEach(id => {
    document.getElementById(id).addEventListener("input", renderApplicants);
  });

  document.body.addEventListener("click", handleTableActions);

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
  });
}

attachEvents();
renderAll();
