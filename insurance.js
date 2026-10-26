const pages = [...document.querySelectorAll("[data-page]")];
const pageLinks = [...document.querySelectorAll("[data-page-link]")];
const mainNav = document.querySelector(".main-nav");
const menuButton = document.querySelector(".menu-button");
const signInDialog = document.querySelector("#sign-in-dialog");

function showPage() {
  const requestedPage = window.location.hash.slice(1);
  const pageName = pages.some((page) => page.dataset.page === requestedPage)
    ? requestedPage
    : "home";

  pages.forEach((page) => {
    const isActive = page.dataset.page === pageName;
    page.classList.toggle("active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
  });
  pageLinks.forEach((link) => {
    const isActive = link.dataset.pageLink === pageName;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  mainNav.classList.remove("menu-visible");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showPage);
showPage();

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("menu-visible");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll("[data-sign-in]").forEach((button) => {
  button.addEventListener("click", () => signInDialog.showModal());
});

document.querySelector("#sign-in-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#sign-in-feedback").textContent =
    "Sign-in is a visual prototype; no account service is connected.";
});

document.querySelector("#claim-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const claimId = `MW-DEMO-${String(Date.now()).slice(-5)}`;
  const row = document.createElement("tr");
  row.dataset.search = `${formData.get("name")} ${claimId} ${formData.get("type")}`.toLowerCase();

  const details = [
    [formData.get("name"), `${claimId} · ${formData.get("district")}`],
    [formData.get("type")],
    [`MK ${Number(formData.get("amount")).toLocaleString("en-MW")}`],
    [new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())],
    ["● Pending human review", null, "signal signal-medium"],
    ["New", null, "status status-new"],
  ];

  details.forEach(([primary, secondary, className]) => {
    const cell = document.createElement("td");
    if (secondary) {
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      strong.textContent = primary;
      small.textContent = secondary;
      cell.append(strong, small);
    } else {
      const span = document.createElement("span");
      if (className) span.className = className;
      span.textContent = primary;
      cell.append(span);
    }
    row.append(cell);
  });

  document.querySelector("#claims-table").prepend(row);
  form.reset();
  document.querySelector("#form-feedback").textContent =
    `Claim ${claimId} was added to the demo queue for human review.`;
  window.location.hash = "claims";
});

document.querySelector("#claim-search").addEventListener("input", (event) => {
  const query = event.currentTarget.value.trim().toLowerCase();
  document.querySelectorAll("#claims-table tr").forEach((row) => {
    row.hidden = !row.dataset.search.includes(query);
  });
});
