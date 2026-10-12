"use strict";

// ======================================================
// SELECTED ELEMENTS
// ======================================================

// HEADER
const toggleButton = document.querySelector(".toggle-button");
const navLinks = document.querySelectorAll(".nav-link");
const accountDropdownButton = document.querySelector(
  ".account-dropdown-button",
);

// STATS
const monthlySpendValue = document.getElementById("monthlySpendValue");
const monthlySpendPercentageValue = document.getElementById(
  "monthlySpendPercentageValue",
);

const yearlySpendValue = document.getElementById("yearlySpendValue");
const yearlySpendPercentageValue = document.getElementById(
  "yearlySpendPercentageValue",
);

const activeSubscriptionsValue = document.getElementById(
  "activeSubscriptionsValue",
);

const activeSubscriptionsPercentageValue = document.getElementById(
  "activeSubscriptionsPercentageValue",
);

const upcomingPaymentsValue = document.getElementById("upcomingPaymentsValue");

// SUBSCRIPTIONS
const addSubscriptionBtn = document.getElementById("addSubscriptionBtn");

const subscriptionSearchInput = document.getElementById(
  "subscriptionSearchInput",
);

const categoryFilter = document.getElementById("categoryFilter");
const billingCycleFilter = document.getElementById("billingCycleFilter");
const subscriptionSort = document.getElementById("subscriptionSort");

const subscriptionsTableBody = document.getElementById(
  "subscriptionsTableBody",
);

// RECENT ACTIVITY
const recentActivityList = document.querySelector(".recent-activity-list");

// UPCOMING RENEWALS
const upcomingRenewalsList = document.querySelector(".upcoming-renewals-list");

// CATEGORY BREAKDOWN
const categoryBreakdownPeriod = document.getElementById(
  "categoryBreakdownPeriod",
);

const categoryBreakdownChart = document.getElementById(
  "categoryBreakdownChart",
);

const categoryBreakdownTotal = document.getElementById(
  "categoryBreakdownTotal",
);

const categoryBreakdownList = document.querySelector(
  ".category-breakdown-list",
);

// MONTHLY SPENDING
const monthlySpendingPeriod = document.getElementById("monthlySpendingPeriod");

const monthlySpendingChart = document.getElementById("monthlySpendingChart");

// ADD SUBSCRIPTION MODAL
const subscriptionModal = document.getElementById("subscriptionModal");

const closeSubscriptionModalBtn = document.getElementById(
  "closeSubscriptionModalBtn",
);

const cancelSubscriptionBtn = document.getElementById("cancelSubscriptionBtn");

const subscriptionForm = document.getElementById("subscriptionForm");

const subscriptionName = document.getElementById("subscriptionName");

const subscriptionDescription = document.getElementById(
  "subscriptionDescription",
);

const subscriptionCategory = document.getElementById("subscriptionCategory");

const subscriptionBillingCycle = document.getElementById(
  "subscriptionBillingCycle",
);

const subscriptionPrice = document.getElementById("subscriptionPrice");

const subscriptionNextBillingDate = document.getElementById(
  "subscriptionNextBillingDate",
);

const subscriptionIcon = document.getElementById("subscriptionIcon");

const subscriptionModalTitle = document.getElementById(
  "subscriptionModalTitle",
);

const subscriptionModalDescription = document.getElementById(
  "subscriptionModalDescription",
);

const saveSubscriptionButton = document.getElementById(
  "saveSubscriptionButton",
);

// ======================================================
// STATE
// ======================================================

let subscriptions = [];
let activities = [];

let activeCategoryFilter = "all";
let activeBillingFilter = "all";
let activeSort = "next-payment";

let editingId = null;

let categoryChartInstance = null;
let monthlyChartInstance = null;

let currentTheme = "dark";

// ======================================================
// DEFAULT DATA
// ======================================================

const defaultSubscriptions = [
  {
    id: 1,
    name: "StreamFlix",
    description: "Movies & TV Shows",
    category: "entertainment",
    billingCycle: "monthly",
    price: 15.99,
    nextBillingDate: "2026-10-17",
    icon: "bi-play-fill",
    active: true,
  },

  {
    id: 2,
    name: "Music Plus",
    description: "Music Streaming",
    category: "entertainment",
    billingCycle: "monthly",
    price: 9.99,
    nextBillingDate: "2026-10-23",
    icon: "bi-music-note-beamed",
    active: true,
  },

  {
    id: 3,
    name: "CloudBox",
    description: "Cloud Storage",
    category: "productivity",
    billingCycle: "yearly",
    price: 99.99,
    nextBillingDate: "2026-11-08",
    icon: "bi-cloud-fill",
    active: true,
  },

  {
    id: 4,
    name: "Gym Club",
    description: "Fitness & Health",
    category: "health",
    billingCycle: "monthly",
    price: 24.99,
    nextBillingDate: "2026-10-25",
    icon: "bi-heart-pulse-fill",
    active: true,
  },

  {
    id: 5,
    name: "Design Suite",
    description: "Creative Tools",
    category: "productivity",
    billingCycle: "monthly",
    price: 29.99,
    nextBillingDate: "2026-11-01",
    icon: "bi-palette-fill",
    active: true,
  },

  {
    id: 6,
    name: "AI Tools",
    description: "AI & Technology",
    category: "technology",
    billingCycle: "monthly",
    price: 19.99,
    nextBillingDate: "2026-10-30",
    icon: "bi-stars",
    active: true,
  },
];

const defaultActivities = [
  {
    id: 1,
    type: "payment",
    title: "Payment successful",
    service: "AI Tools",
    description: "$19.99",
    date: "2026-10-10",
    icon: "bi-check-lg",
  },

  {
    id: 2,
    type: "added",
    title: "Subscription added",
    service: "Design Suite",
    description: "$29.99 / month",
    date: "2026-10-08",
    icon: "bi-plus-lg",
  },

  {
    id: 3,
    type: "updated",
    title: "Subscription updated",
    service: "Gym Club",
    description: "Billing date changed",
    date: "2026-10-05",
    icon: "bi-pencil-fill",
  },

  {
    id: 4,
    type: "removed",
    title: "Subscription removed",
    service: "Video Premium",
    description: "$11.99 / month",
    date: "2026-10-02",
    icon: "bi-trash3-fill",
  },
];

// ======================================================
// LOAD / SAVE DATA
// ======================================================

function saveData() {
  const data = {
    subscriptions,
    activities,
  };

  localStorage.setItem("subscriptionTracker", JSON.stringify(data));
}

function loadData() {
  const storedData = localStorage.getItem("subscriptionTracker");

  if (!storedData) {
    subscriptions = structuredClone(defaultSubscriptions);
    activities = structuredClone(defaultActivities);

    return;
  }

  const data = JSON.parse(storedData);

  subscriptions = data.subscriptions;
  activities = data.activities;
}

// ======================================================
// OPEN / CLOSE SUBSCRIPTION MODAL
// ======================================================

function openSubscriptionModal() {
  subscriptionModal.classList.add("active");
}

function closeSubscriptionModal() {
  subscriptionModal.classList.remove("active");
}

function openAddSubscriptionModal() {
  editingId = null;

  subscriptionForm.reset();

  subscriptionModalTitle.textContent = "Add Subscription";

  subscriptionModalDescription.textContent =
    "Add a new service to your subscription tracker.";

  saveSubscriptionButton.innerHTML = `
    <i class="bi bi-plus-lg"></i>
    Add Subscription
  `;

  openSubscriptionModal();
}

// ======================================================
// ADD SUBSCRIPTION
// ======================================================

function addSubscription(event) {
  event.preventDefault();

  const subscriptionNameValue = subscriptionName.value.trim();

  const subscriptionDescriptionValue = subscriptionDescription.value.trim();

  const subscriptionCategoryValue = subscriptionCategory.value;

  const subscriptionBillingCycleValue = subscriptionBillingCycle.value;

  const subscriptionPriceValue = Number(subscriptionPrice.value);

  const subscriptionNextBillingDateValue =
    subscriptionNextBillingDate.value.trim();

  const subscriptionIconValue = subscriptionIcon.value;

  if (
    !subscriptionNameValue ||
    !subscriptionDescriptionValue ||
    !subscriptionCategoryValue ||
    !subscriptionBillingCycleValue ||
    subscriptionPriceValue <= 0 ||
    !subscriptionNextBillingDateValue ||
    !subscriptionIconValue
  ) {
    return;
  }

  if (editingId !== null) {
    const subscription = subscriptions.find(
      (subscription) => subscription.id === editingId,
    );

    if (!subscription) return;

    subscription.name = subscriptionNameValue;
    subscription.description = subscriptionDescriptionValue;
    subscription.category = subscriptionCategoryValue;
    subscription.billingCycle = subscriptionBillingCycleValue;
    subscription.price = subscriptionPriceValue;
    subscription.nextBillingDate = subscriptionNextBillingDateValue;
    subscription.icon = subscriptionIconValue;

    addActivity("updated", subscription);
  } else {
    const newSubscription = {
      id: Date.now(),
      name: subscriptionNameValue,
      description: subscriptionDescriptionValue,
      category: subscriptionCategoryValue,
      billingCycle: subscriptionBillingCycleValue,
      price: subscriptionPriceValue,
      nextBillingDate: subscriptionNextBillingDateValue,
      icon: subscriptionIconValue,
      active: true,
    };

    subscriptions.push(newSubscription);

    addActivity("added", newSubscription);
  }

  saveData();

  updateSubscriptionsView();
  renderRecentActivity();
  renderUpcomingRenewals();
  renderCategoryBreakdown();
  renderMonthlySpendingChart();
  updateStats();

  subscriptionForm.reset();

  editingId = null;

  closeSubscriptionModal();
}

// ======================================================
// EDIT SUBSCRIPTION
// ======================================================

function editSubscription(id) {
  const subscription = subscriptions.find(
    (subscription) => subscription.id === id,
  );

  if (!subscription) return;

  editingId = id;

  subscriptionName.value = subscription.name;
  subscriptionDescription.value = subscription.description;
  subscriptionCategory.value = subscription.category;
  subscriptionBillingCycle.value = subscription.billingCycle;
  subscriptionPrice.value = subscription.price;
  subscriptionNextBillingDate.value = subscription.nextBillingDate;
  subscriptionIcon.value = subscription.icon;

  subscriptionModalTitle.textContent = "Edit Subscription";

  subscriptionModalDescription.textContent =
    "Update your subscription details.";

  saveSubscriptionButton.innerHTML = `
    <i class="bi bi-check-lg"></i>
    Save Changes
  `;

  openSubscriptionModal();
}

// ======================================================
// DELETE SUBSCRIPTION
// ======================================================

function deleteSubscription(id) {
  const deletedSubscription = subscriptions.find(
    (subscription) => subscription.id === id,
  );

  if (!deletedSubscription) return;

  subscriptions = subscriptions.filter(
    (subscription) => subscription.id !== id,
  );

  addActivity("removed", deletedSubscription);

  saveData();

  updateSubscriptionsView();
  renderRecentActivity();
  renderUpcomingRenewals();
  renderCategoryBreakdown();
  renderMonthlySpendingChart();
  updateStats();
}

// ======================================================
// RENDER SUBSCRIPTIONS
// ======================================================

function formatSubscriptionDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysUntilPayment(date) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const paymentDate = new Date(`${date}T00:00:00`);

  const difference = paymentDate - today;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function formatLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderSubscriptions(subscriptionList = subscriptions) {
  subscriptionsTableBody.innerHTML = "";

  if (subscriptionList.length === 0) {
    subscriptionsTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No subscriptions found.
        </td>
      </tr>
    `;

    return;
  }

  subscriptionsTableBody.innerHTML = subscriptionList
    .map((subscription) => {
      const daysUntilPayment = getDaysUntilPayment(
        subscription.nextBillingDate,
      );

      let paymentText = "";

      if (daysUntilPayment === 0) {
        paymentText = "Today";
      } else if (daysUntilPayment === 1) {
        paymentText = "Tomorrow";
      } else if (daysUntilPayment > 1) {
        paymentText = `in ${daysUntilPayment} days`;
      } else {
        paymentText = `${Math.abs(daysUntilPayment)} days overdue`;
      }

      const paymentSoonClass = daysUntilPayment <= 7 ? "payment-soon" : "";

      return `
        <tr class="subscription-row">
          <td>
            <div class="subscription-service">
              <div class="subscription-service-icon ${subscription.category}">
                <i class="bi ${subscription.icon}"></i>
              </div>

              <div>
                <h3>${subscription.name}</h3>
                <p>${subscription.description}</p>
              </div>
            </div>
          </td>

          <td>
            <span class="subscription-category ${subscription.category}">
              ${formatLabel(subscription.category)}
            </span>
          </td>

          <td>
            ${formatLabel(subscription.billingCycle)}
          </td>

          <td>
            <span class="subscription-price">
              $${subscription.price.toFixed(2)}
            </span>
          </td>

          <td>
            <div class="subscription-date">
              <span>
                ${formatSubscriptionDate(subscription.nextBillingDate)}
              </span>

              <p class="${paymentSoonClass}">
                ${paymentText}
              </p>
            </div>
          </td>

          <td>
            <div class="subscription-actions">
              <button
                class="edit-subscription-button"
                type="button"
                data-id="${subscription.id}"
                aria-label="Edit subscription"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>

              <button
                class="delete-subscription-button"
                type="button"
                data-id="${subscription.id}"
                aria-label="Delete subscription"
              >
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  const editButtons = document.querySelectorAll(".edit-subscription-button");

  const deleteButtons = document.querySelectorAll(
    ".delete-subscription-button",
  );

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editSubscription(Number(button.dataset.id));
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      deleteSubscription(Number(button.dataset.id));
    });
  });
}

// ======================================================
// SEARCH SUBSCRIPTIONS
// ======================================================

function updateSubscriptionsView() {
  const searchTerm = subscriptionSearchInput.value.trim().toLowerCase();

  activeCategoryFilter = categoryFilter.value;
  activeBillingFilter = billingCycleFilter.value;
  activeSort = subscriptionSort.value;

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const name = subscription.name.toLowerCase();
    const description = subscription.description.toLowerCase();
    const category = subscription.category.toLowerCase();

    const searchMatches =
      name.includes(searchTerm) ||
      description.includes(searchTerm) ||
      category.includes(searchTerm);

    const categoryMatches =
      activeCategoryFilter === "all" ||
      subscription.category === activeCategoryFilter;

    const billingMatches =
      activeBillingFilter === "all" ||
      subscription.billingCycle === activeBillingFilter;

    return searchMatches && categoryMatches && billingMatches;
  });

  const sortedSubscriptions = [...filteredSubscriptions];

  if (activeSort === "next-payment") {
    sortedSubscriptions.sort(
      (a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate),
    );
  }

  if (activeSort === "price-low") {
    sortedSubscriptions.sort((a, b) => a.price - b.price);
  }

  if (activeSort === "price-high") {
    sortedSubscriptions.sort((a, b) => b.price - a.price);
  }

  if (activeSort === "name") {
    sortedSubscriptions.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderSubscriptions(sortedSubscriptions);
}

function searchSubscriptions() {
  updateSubscriptionsView();
}

// ======================================================
// FILTER SUBSCRIPTIONS
// ======================================================

function filterSubscriptions() {
  updateSubscriptionsView();
}

// ======================================================
// SORT SUBSCRIPTIONS
// ======================================================

function sortSubscription() {
  updateSubscriptionsView();
}

// ======================================================
// UPDATE STATS
// ======================================================

function updateStats() {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.active,
  );

  const monthlySpend = activeSubscriptions.reduce((total, subscription) => {
    if (subscription.billingCycle === "monthly") {
      return total + subscription.price;
    }

    if (subscription.billingCycle === "yearly") {
      return total + subscription.price / 12;
    }

    return total;
  }, 0);

  const yearlySpend = activeSubscriptions.reduce((total, subscription) => {
    if (subscription.billingCycle === "monthly") {
      return total + subscription.price * 12;
    }

    if (subscription.billingCycle === "yearly") {
      return total + subscription.price;
    }

    return total;
  }, 0);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcomingPayments = activeSubscriptions.filter((subscription) => {
    const paymentDate = new Date(`${subscription.nextBillingDate}T00:00:00`);

    const difference = paymentDate - today;

    const daysUntilPayment = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysUntilPayment >= 0 && daysUntilPayment <= 30;
  }).length;

  monthlySpendValue.textContent = `$${monthlySpend.toFixed(2)}`;

  yearlySpendValue.textContent = `$${yearlySpend.toFixed(2)}`;

  activeSubscriptionsValue.textContent = activeSubscriptions.length;

  upcomingPaymentsValue.textContent = upcomingPayments;
}

// ======================================================
// RECENT ACTIVITY
// ======================================================

function addActivity(type, subscription) {
  let title = "";
  let description = "";
  let icon = "";

  if (type === "added") {
    title = "Subscription added";

    description = `$${subscription.price.toFixed(
      2,
    )} / ${subscription.billingCycle}`;

    icon = "bi-plus-lg";
  }

  if (type === "updated") {
    title = "Subscription updated";

    description = "Subscription details changed";

    icon = "bi-pencil-fill";
  }

  if (type === "removed") {
    title = "Subscription removed";

    description = `$${subscription.price.toFixed(
      2,
    )} / ${subscription.billingCycle}`;

    icon = "bi-trash3-fill";
  }

  const newActivity = {
    id: Date.now(),
    type,
    title,
    service: subscription.name,
    description,
    date: new Date().toISOString().split("T")[0],
    icon,
  };

  activities.unshift(newActivity);
}

// ======================================================
// RENDER RECENT ACTIVITY
// ======================================================

function renderRecentActivity() {
  recentActivityList.innerHTML = "";

  if (activities.length === 0) {
    recentActivityList.innerHTML = `
      <p>No Recent Activity.</p>
    `;

    return;
  }

  recentActivityList.innerHTML = activities
    .slice(0, 4)
    .map((activity) => {
      let statusClass = "";

      if (activity.type === "payment") {
        statusClass = "success";
      }

      if (activity.type === "added") {
        statusClass = "info";
      }

      if (activity.type === "updated") {
        statusClass = "warning";
      }

      if (activity.type === "removed") {
        statusClass = "danger";
      }

      const activityDate = formatSubscriptionDate(activity.date);

      return `
        <div class="activity-item">
          <div class="activity-icon ${activity.type}">
            <i class="bi ${activity.icon}"></i>
          </div>

          <div class="activity-content">
            <h3>${activity.title}</h3>

            <p>
              ${activity.service}
              <span>•</span>
              ${activity.description}
            </p>
          </div>

          <div class="activity-meta">
            <span>${activityDate}</span>
          </div>

          <div class="activity-status ${statusClass}">
            <i class="bi ${
              activity.type === "removed" ? "bi-x-lg" : activity.icon
            }"></i>
          </div>
        </div>
      `;
    })
    .join("");
}

// ======================================================
// UPCOMING RENEWALS
// ======================================================

function getUpcomingRenewals() {
  return subscriptions
    .filter((subscription) => {
      const daysUntilPayment = getDaysUntilPayment(
        subscription.nextBillingDate,
      );

      return (
        subscription.active && daysUntilPayment >= 0 && daysUntilPayment <= 30
      );
    })
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate))
    .slice(0, 3);
}

// ======================================================
// RENDER UPCOMING RENEWALS
// ======================================================

function renderUpcomingRenewals() {
  const upcomingRenewals = getUpcomingRenewals();

  upcomingRenewalsList.innerHTML = "";

  if (upcomingRenewals.length === 0) {
    upcomingRenewalsList.innerHTML = `
      <p>No upcoming renewals.</p>
    `;

    return;
  }

  upcomingRenewalsList.innerHTML = upcomingRenewals
    .map((subscription) => {
      const daysUntilPayment = getDaysUntilPayment(
        subscription.nextBillingDate,
      );

      const formattedDate = formatSubscriptionDate(
        subscription.nextBillingDate,
      );

      const daysClass = daysUntilPayment <= 7 ? "danger" : "";

      let daysText = "";

      if (daysUntilPayment === 0) {
        daysText = "Today";
      } else if (daysUntilPayment === 1) {
        daysText = "1 day";
      } else {
        daysText = `${daysUntilPayment} days`;
      }

      return `
          <div class="renewal-item">
            <div class="renewal-service">
              <div class="renewal-service-icon ${subscription.category}">
                <i class="bi ${subscription.icon}"></i>
              </div>

              <div>
                <h3>${subscription.name}</h3>
              </div>
            </div>

            <span class="renewal-price">
              $${subscription.price.toFixed(2)}
            </span>

            <span class="renewal-date">
              ${formattedDate}
            </span>

            <span class="renewal-days ${daysClass}">
              ${daysText}
            </span>
          </div>
        `;
    })
    .join("");
}

// ======================================================
// CATEGORY BREAKDOWN
// ======================================================

function getCategoryBreakdown() {
  const period = categoryBreakdownPeriod.value;

  const categories = ["entertainment", "productivity", "health", "technology"];

  const categoryData = categories.map((category) => {
    const amount = subscriptions
      .filter(
        (subscription) =>
          subscription.active && subscription.category === category,
      )
      .reduce((total, subscription) => {
        if (period === "month") {
          if (subscription.billingCycle === "monthly") {
            return total + subscription.price;
          }

          if (subscription.billingCycle === "yearly") {
            return total + subscription.price / 12;
          }
        }

        if (period === "year") {
          if (subscription.billingCycle === "monthly") {
            return total + subscription.price * 12;
          }

          if (subscription.billingCycle === "yearly") {
            return total + subscription.price;
          }
        }

        return total;
      }, 0);

    return {
      category,
      amount,
    };
  });

  const total = categoryData.reduce(
    (sum, category) => sum + category.amount,
    0,
  );

  return {
    categoryData,
    total,
  };
}

function renderCategoryBreakdown() {
  const { categoryData, total } = getCategoryBreakdown();

  categoryBreakdownTotal.textContent = `$${total.toFixed(2)}`;

  categoryBreakdownTotal.nextElementSibling.textContent =
    categoryBreakdownPeriod.value === "month" ? "per month" : "per year";

  categoryBreakdownList.innerHTML = categoryData
    .map((item) => {
      const percentage = total > 0 ? (item.amount / total) * 100 : 0;

      return `
          <div class="category-breakdown-item">
            <div class="category-breakdown-info">
              <span class="category-color ${item.category}"></span>

              <p>${formatLabel(item.category)}</p>
            </div>

            <div class="category-breakdown-values">
              <span>${percentage.toFixed(0)}%</span>

              <strong>$${item.amount.toFixed(2)}</strong>
            </div>
          </div>
        `;
    })
    .join("");

  renderCategoryBreakdownChart(categoryData);
}

// ======================================================
// CATEGORY BREAKDOWN CHART
// ======================================================

function renderCategoryBreakdownChart(categoryData) {
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(categoryBreakdownChart, {
    type: "doughnut",

    data: {
      labels: categoryData.map((item) => formatLabel(item.category)),

      datasets: [
        {
          data: categoryData.map((item) => item.amount),

          backgroundColor: ["#8b5cf6", "#3b82f6", "#22c55e", "#22d3ee"],

          borderWidth: 0,

          hoverOffset: 4,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      cutout: "72%",

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: $${context.raw.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

// ======================================================
// MONTHLY SPENDING DATA
// ======================================================

function getMonthlySpendingData() {
  const monthsCount = Number(monthlySpendingPeriod.value);

  const today = new Date();

  const monthlyData = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);

    let total = 0;

    subscriptions
      .filter((subscription) => subscription.active)
      .forEach((subscription) => {
        if (subscription.billingCycle === "monthly") {
          total += subscription.price;
        }

        if (subscription.billingCycle === "yearly") {
          const billingDate = new Date(
            `${subscription.nextBillingDate}T00:00:00`,
          );

          if (billingDate.getMonth() === monthDate.getMonth()) {
            total += subscription.price;
          }
        }
      });

    const label = monthDate.toLocaleDateString("en-US", {
      month: "short",
    });

    monthlyData.push({
      label,
      amount: total,
    });
  }

  return monthlyData;
}

// ======================================================
// MONTHLY SPENDING CHART
// ======================================================

function renderMonthlySpendingChart() {
  const monthlyData = getMonthlySpendingData();

  if (monthlyChartInstance) {
    monthlyChartInstance.destroy();
  }

  const styles = getComputedStyle(document.documentElement);

  const textColor = styles.getPropertyValue("--text-secondary").trim();

  const gridColor = styles.getPropertyValue("--border-light").trim();

  const context = monthlySpendingChart.getContext("2d");

  const gradient = context.createLinearGradient(
    0,
    0,
    0,
    monthlySpendingChart.height,
  );

  gradient.addColorStop(0, "rgba(59, 130, 246, 0.95)");

  gradient.addColorStop(1, "rgba(139, 92, 246, 0.55)");

  monthlyChartInstance = new Chart(monthlySpendingChart, {
    type: "bar",

    data: {
      labels: monthlyData.map((item) => item.label),

      datasets: [
        {
          data: monthlyData.map((item) => item.amount),

          backgroundColor: gradient,

          borderRadius: 7,

          borderSkipped: false,

          barPercentage: 0.65,

          categoryPercentage: 0.75,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label(context) {
              return `Spending: $${context.raw.toFixed(2)}`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: textColor,

            font: {
              size: 11,
            },
          },
        },

        y: {
          beginAtZero: true,

          border: {
            display: false,
          },

          grid: {
            color: gridColor,
          },

          ticks: {
            color: textColor,

            font: {
              size: 10,
            },

            callback(value) {
              return `$${value}`;
            },
          },
        },
      },
    },
  });
}

// ======================================================
// THEME
// ======================================================

function loadTheme() {
  const storedTheme = localStorage.getItem("subscriptionTrackerTheme");

  if (storedTheme) {
    currentTheme = storedTheme;
  }

  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme();

  localStorage.setItem("subscriptionTrackerTheme", currentTheme);

  renderCategoryBreakdown();
  renderMonthlySpendingChart();
}

// ======================================================
// NAVIGATION
// ======================================================

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    navLinks.forEach((navLink) => {
      navLink.classList.remove("active");
    });

    link.classList.add("active");
  });
});

// ======================================================
// EVENT LISTENERS
// ======================================================

addSubscriptionBtn.addEventListener("click", openAddSubscriptionModal);

closeSubscriptionModalBtn.addEventListener("click", closeSubscriptionModal);

cancelSubscriptionBtn.addEventListener("click", closeSubscriptionModal);

subscriptionForm.addEventListener("submit", addSubscription);

subscriptionSearchInput.addEventListener("input", searchSubscriptions);

categoryFilter.addEventListener("change", filterSubscriptions);

billingCycleFilter.addEventListener("change", filterSubscriptions);

subscriptionSort.addEventListener("change", sortSubscription);

categoryBreakdownPeriod.addEventListener("change", renderCategoryBreakdown);

monthlySpendingPeriod.addEventListener("change", renderMonthlySpendingChart);

toggleButton.addEventListener("click", toggleTheme);

// ======================================================
// INIT APP
// ======================================================

function initApp() {
  loadTheme();
  loadData();

  updateSubscriptionsView();
  renderRecentActivity();
  renderUpcomingRenewals();
  renderCategoryBreakdown();
  renderMonthlySpendingChart();
  updateStats();
}

initApp();
