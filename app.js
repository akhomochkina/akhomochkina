const data = {
  revenueTarget: 24000,
  revenueChange: 12,
  invoices: [
    {
      id: "INV-204",
      client: "Northwind Labs",
      status: "Paid",
      due: "2026-02-03",
      amount: 8200,
    },
    {
      id: "INV-205",
      client: "Nimbus Platform",
      status: "Sent",
      due: "2026-02-12",
      amount: 5400,
    },
    {
      id: "INV-206",
      client: "Solaris Health",
      status: "Overdue",
      due: "2026-01-28",
      amount: 3100,
    },
    {
      id: "INV-207",
      client: "Harbor Analytics",
      status: "Paid",
      due: "2026-02-01",
      amount: 4100,
    },
  ],
  projects: [
    {
      name: "Nimbus API Reliability",
      client: "Nimbus Platform",
      status: "Active",
      progress: 72,
      dueDate: "2026-02-18",
      hoursPlanned: 86,
      hoursLogged: 64,
      tags: ["Backend", "SLA", "Critical"],
      risk: "Medium",
    },
    {
      name: "Solaris Mobile Onboarding",
      client: "Solaris Health",
      status: "Active",
      progress: 44,
      dueDate: "2026-02-25",
      hoursPlanned: 64,
      hoursLogged: 28,
      tags: ["Mobile", "UX", "HIPAA"],
      risk: "Low",
    },
    {
      name: "Harbor Data Lake",
      client: "Harbor Analytics",
      status: "Discovery",
      progress: 18,
      dueDate: "2026-03-12",
      hoursPlanned: 40,
      hoursLogged: 9,
      tags: ["Data", "Architecture"],
      risk: "Low",
    },
  ],
  clients: [
    {
      name: "Northwind Labs",
      health: "Strong",
      nextAction: "Quarterly roadmap sync",
      mrr: 7800,
    },
    {
      name: "Nimbus Platform",
      health: "Watch",
      nextAction: "Stability report review",
      mrr: 5400,
    },
    {
      name: "Solaris Health",
      health: "Stable",
      nextAction: "HIPAA security checklist",
      mrr: 3200,
    },
    {
      name: "Harbor Analytics",
      health: "Growth",
      nextAction: "Scope backlog workshop",
      mrr: 4600,
    },
  ],
  contracts: [
    {
      name: "Retainer v2",
      client: "Northwind Labs",
      renewal: "2026-03-05",
      value: 48000,
    },
    {
      name: "SOW - Nimbus API",
      client: "Nimbus Platform",
      renewal: "2026-04-15",
      value: 36000,
    },
    {
      name: "Security Addendum",
      client: "Solaris Health",
      renewal: "2026-02-22",
      value: 14000,
    },
  ],
  incomeSources: [
    { name: "Retainers", amount: 15600 },
    { name: "Milestones", amount: 9100 },
    { name: "Support", amount: 2200 },
  ],
  expenses: [
    { category: "Cloud & DevOps", amount: 2100 },
    { category: "Contractors", amount: 3200 },
    { category: "Software", amount: 780 },
    { category: "Operations", amount: 540 },
  ],
  timeEntries: [
    {
      task: "API latency audit",
      project: "Nimbus API Reliability",
      range: "09:00 - 11:15",
      duration: "2h 15m",
      billable: true,
    },
    {
      task: "Onboarding UX workshop",
      project: "Solaris Mobile Onboarding",
      range: "12:30 - 14:10",
      duration: "1h 40m",
      billable: true,
    },
    {
      task: "Client updates + proposals",
      project: "Operations",
      range: "15:00 - 16:05",
      duration: "1h 05m",
      billable: false,
    },
  ],
  workload: {
    capacityWeekly: 40,
    allocations: [
      { label: "Deep work", hours: 18 },
      { label: "Meetings", hours: 6 },
      { label: "Ops + admin", hours: 5 },
      { label: "Client support", hours: 4 },
    ],
  },
  activeTimer: {
    task: "Edge cache refactor",
    elapsedSeconds: 38 * 60 + 12,
  },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currency.format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs]
    .map((chunk) => String(chunk).padStart(2, "0"))
    .join(":");
};

const setText = (id, value) => {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
};

const createStatus = (status) => {
  const span = document.createElement("span");
  span.className = "status status--neutral";
  span.textContent = status;
  if (["Paid", "Strong", "Stable", "Growth", "Low"].includes(status)) {
    span.classList.add("status--positive");
  }
  if (["Overdue", "At risk", "High"].includes(status)) {
    span.classList.add("status--danger");
  }
  if (["Sent", "Watch", "Medium"].includes(status)) {
    span.classList.add("status--warning");
  }
  return span;
};

const paidInvoices = data.invoices.filter((invoice) => invoice.status === "Paid");
const revenueTotal = paidInvoices.reduce(
  (sum, invoice) => sum + invoice.amount,
  0
);
const revenueProgress = Math.min(
  100,
  Math.round((revenueTotal / data.revenueTarget) * 100)
);

setText("revenue-amount", formatCurrency(revenueTotal));
setText("revenue-detail", `${paidInvoices.length} invoices settled`);
setText("revenue-change", `+${data.revenueChange}%`);
setText("hero-revenue", formatCurrency(revenueTotal));

const revenueProgressNode = document.getElementById("revenue-progress");
if (revenueProgressNode) {
  revenueProgressNode.style.width = `${revenueProgress}%`;
}

const activeProjects = data.projects.filter((project) =>
  ["Active", "Discovery"].includes(project.status)
);
const dueThisMonth = activeProjects.filter((project) => {
  const due = new Date(project.dueDate);
  const now = new Date();
  return (
    due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear()
  );
});

setText("active-projects", String(activeProjects.length));
setText(
  "active-projects-detail",
  `${dueThisMonth.length} due this month`
);
setText("hero-projects", String(activeProjects.length));

const projectProgressNode = document.getElementById("project-progress");
if (projectProgressNode) {
  const averageProgress = activeProjects.length
    ? Math.round(
        activeProjects.reduce((sum, project) => sum + project.progress, 0) /
          activeProjects.length
      )
    : 0;
  projectProgressNode.style.width = `${averageProgress}%`;
}

const deadlines = data.projects
  .map((project) => ({
    title: project.name,
    client: project.client,
    dueDate: project.dueDate,
    status: project.risk === "High" ? "At risk" : "On track",
  }))
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

const today = new Date();
const upcomingDeadlines = deadlines.filter((deadline) => {
  const due = new Date(deadline.dueDate);
  const daysUntil = (due - today) / (1000 * 60 * 60 * 24);
  return daysUntil >= 0 && daysUntil <= 30;
});

setText("upcoming-deadlines", String(upcomingDeadlines.length));
setText(
  "deadline-detail",
  `${upcomingDeadlines.filter((item) => item.status === "At risk").length} critical milestones`
);

const deadlineProgressNode = document.getElementById("deadline-progress");
if (deadlineProgressNode) {
  const deadlineProgress = Math.min(100, upcomingDeadlines.length * 20);
  deadlineProgressNode.style.width = `${deadlineProgress}%`;
}

const deadlineList = document.getElementById("deadline-list");
if (deadlineList) {
  deadlineList.innerHTML = "";
  if (upcomingDeadlines.length === 0) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = "No deadlines in the next 30 days.";
    deadlineList.appendChild(empty);
  } else {
    upcomingDeadlines.forEach((deadline) => {
      const li = document.createElement("li");
      li.className = "list-item";
      const row = document.createElement("div");
      row.className = "list-row";
      const title = document.createElement("span");
      title.textContent = deadline.title;
      const date = document.createElement("span");
      date.textContent = formatDate(deadline.dueDate);
      row.append(title, date);
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = `${deadline.client} - ${deadline.status}`;
      li.append(row, meta);
      deadlineList.appendChild(li);
    });
  }
}

const allocatedHours = data.workload.allocations.reduce(
  (sum, item) => sum + item.hours,
  0
);
const workloadPercent = Math.round(
  (allocatedHours / data.workload.capacityWeekly) * 100
);

setText("workload-percentage", `${workloadPercent}%`);
setText(
  "workload-detail",
  `${allocatedHours}h allocated of ${data.workload.capacityWeekly}h`
);
setText("workload-ring-value", `${workloadPercent}%`);

const workloadProgressNode = document.getElementById("workload-progress");
if (workloadProgressNode) {
  workloadProgressNode.style.width = `${Math.min(workloadPercent, 100)}%`;
}

const workloadRing = document.getElementById("workload-ring");
if (workloadRing) {
  workloadRing.style.setProperty("--workload", `${workloadPercent * 3.6}deg`);
}

const workloadList = document.getElementById("workload-list");
if (workloadList) {
  workloadList.innerHTML = "";
  data.workload.allocations.forEach((item) => {
    const row = document.createElement("div");
    row.className = "workload-item";
    const label = document.createElement("span");
    label.textContent = item.label;
    const hours = document.createElement("span");
    hours.textContent = `${item.hours}h`;
    row.append(label, hours);
    workloadList.appendChild(row);
  });
}

const clientList = document.getElementById("client-list");
if (clientList) {
  clientList.innerHTML = "";
  data.clients.forEach((client) => {
    const row = document.createElement("div");
    row.className = "table-row";
    const name = document.createElement("span");
    name.textContent = client.name;
    const health = createStatus(client.health);
    const action = document.createElement("span");
    action.textContent = client.nextAction;
    const mrr = document.createElement("span");
    mrr.textContent = formatCurrency(client.mrr);
    row.append(name, health, action, mrr);
    clientList.appendChild(row);
  });
}

const projectList = document.getElementById("project-list");
if (projectList) {
  projectList.innerHTML = "";
  data.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card project-card";
    const header = document.createElement("div");
    header.className = "stat-header";
    const title = document.createElement("h3");
    title.textContent = project.name;
    const status = createStatus(project.status);
    header.append(title, status);

    const sub = document.createElement("p");
    sub.className = "muted";
    sub.textContent = `${project.client} - Due ${formatDate(project.dueDate)}`;

    const progress = document.createElement("div");
    progress.className = "progress";
    const bar = document.createElement("span");
    bar.style.width = `${project.progress}%`;
    progress.appendChild(bar);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    project.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      meta.appendChild(chip);
    });

    const hours = document.createElement("p");
    hours.className = "muted";
    hours.textContent = `${project.hoursLogged}h logged of ${project.hoursPlanned}h`;

    card.append(header, sub, progress, meta, hours);
    projectList.appendChild(card);
  });
}

const contractList = document.getElementById("contract-list");
if (contractList) {
  contractList.innerHTML = "";
  data.contracts.forEach((contract) => {
    const row = document.createElement("div");
    row.className = "table-row";
    const name = document.createElement("span");
    name.textContent = contract.name;
    const client = document.createElement("span");
    client.textContent = contract.client;
    const renewal = document.createElement("span");
    renewal.textContent = formatDate(contract.renewal);
    const value = document.createElement("span");
    value.textContent = formatCurrency(contract.value);
    row.append(name, client, renewal, value);
    contractList.appendChild(row);
  });
}

const invoiceList = document.getElementById("invoice-list");
if (invoiceList) {
  invoiceList.innerHTML = "";
  data.invoices.forEach((invoice) => {
    const row = document.createElement("div");
    row.className = "table-row";
    const name = document.createElement("span");
    name.textContent = `${invoice.id} - ${invoice.client}`;
    const status = createStatus(invoice.status);
    const due = document.createElement("span");
    due.textContent = formatDate(invoice.due);
    const amount = document.createElement("span");
    amount.textContent = formatCurrency(invoice.amount);
    row.append(name, status, due, amount);
    invoiceList.appendChild(row);
  });
}

const incomeTotal = data.incomeSources.reduce(
  (sum, item) => sum + item.amount,
  0
);
const expenseTotal = data.expenses.reduce(
  (sum, item) => sum + item.amount,
  0
);
const cashflow = incomeTotal - expenseTotal;

setText("income-total", formatCurrency(incomeTotal));
setText("income-detail", `${data.incomeSources.length} sources`);
setText("expense-total", formatCurrency(expenseTotal));
setText("expense-detail", `${data.expenses.length} categories`);
setText("cashflow-total", formatCurrency(cashflow));
setText(
  "cashflow-detail",
  cashflow >= 0 ? "Positive month" : "Needs attention"
);

const cashflowBars = document.getElementById("cashflow-bars");
if (cashflowBars) {
  cashflowBars.innerHTML = "";
  data.incomeSources.forEach((source) => {
    const wrapper = document.createElement("div");
    const label = document.createElement("p");
    label.className = "muted";
    label.textContent = source.name;
    const bar = document.createElement("div");
    bar.className = "bar";
    const span = document.createElement("span");
    span.style.width = `${Math.round(
      (source.amount / incomeTotal) * 100
    )}%`;
    span.style.background = "linear-gradient(90deg, var(--accent), #7ed6ff)";
    bar.appendChild(span);
    wrapper.append(label, bar);
    cashflowBars.appendChild(wrapper);
  });
}

const expenseList = document.getElementById("expense-list");
if (expenseList) {
  expenseList.innerHTML = "";
  data.expenses.forEach((expense) => {
    const row = document.createElement("div");
    row.className = "expense-item";
    const label = document.createElement("span");
    label.textContent = expense.category;
    const amount = document.createElement("span");
    amount.textContent = formatCurrency(expense.amount);
    row.append(label, amount);
    expenseList.appendChild(row);
  });
}

const timeEntryList = document.getElementById("time-entry-list");
if (timeEntryList) {
  timeEntryList.innerHTML = "";
  if (data.timeEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = "No time entries yet. Start a timer to log time.";
    timeEntryList.appendChild(empty);
  } else {
    data.timeEntries.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "list-item";
      const row = document.createElement("div");
      row.className = "list-row";
      const title = document.createElement("span");
      title.textContent = entry.task;
      const duration = document.createElement("span");
      duration.textContent = entry.duration;
      row.append(title, duration);
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = `${entry.project} - ${entry.range}`;
      li.append(row, meta);
      timeEntryList.appendChild(li);
    });
  }
}

const loggedHours = data.timeEntries.reduce((sum, entry) => {
  const parts = entry.duration.split("h ");
  if (parts.length < 2) {
    return sum;
  }
  const hours = Number(parts[0]);
  const mins = Number(parts[1].replace("m", ""));
  return sum + hours + mins / 60;
}, 0);

setText("hero-hours", `${Math.round(loggedHours)}h`);

const timerState = {
  running: false,
  elapsed: data.activeTimer.elapsedSeconds,
  intervalId: null,
};

const timerDisplay = document.getElementById("active-timer");
const timerTask = document.getElementById("active-timer-task");
const timerButton = document.getElementById("timer-toggle");

const updateTimerUI = () => {
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timerState.elapsed);
  }
  if (timerTask) {
    timerTask.textContent = timerState.running
      ? data.activeTimer.task
      : "No task running";
  }
  if (timerButton) {
    timerButton.textContent = timerState.running ? "Pause timer" : "Start timer";
  }
};

const startTimer = () => {
  timerState.running = true;
  timerState.intervalId = window.setInterval(() => {
    timerState.elapsed += 1;
    updateTimerUI();
  }, 1000);
};

const stopTimer = () => {
  timerState.running = false;
  if (timerState.intervalId) {
    window.clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
};

if (timerButton) {
  timerButton.addEventListener("click", () => {
    if (timerState.running) {
      stopTimer();
    } else {
      startTimer();
    }
    updateTimerUI();
  });
}

updateTimerUI();

const workloadStatus = document.getElementById("workload-status");
if (workloadStatus) {
  if (workloadPercent > 90) {
    workloadStatus.textContent = "Overloaded";
    workloadStatus.classList.remove("status--neutral");
    workloadStatus.classList.add("status--danger");
  } else if (workloadPercent > 75) {
    workloadStatus.textContent = "Busy";
    workloadStatus.classList.remove("status--neutral");
    workloadStatus.classList.add("status--warning");
  } else {
    workloadStatus.textContent = "Balanced";
    workloadStatus.classList.remove("status--neutral");
    workloadStatus.classList.add("status--positive");
  }
}

const projectHealth = document.getElementById("project-health");
if (projectHealth) {
  const avgProgress = activeProjects.length
    ? activeProjects.reduce((sum, project) => sum + project.progress, 0) /
      activeProjects.length
    : 0;
  projectHealth.textContent = avgProgress > 60 ? "On track" : "Needs focus";
  projectHealth.classList.remove("status--neutral");
  projectHealth.classList.add(
    avgProgress > 60 ? "status--positive" : "status--warning"
  );
}

const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  document.body.setAttribute("data-theme", storedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.body.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}
