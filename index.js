const form = document.getElementById("weather-form");
const input = document.getElementById("state-input");
const submitBtn = document.getElementById("submit-btn");
const alertsDisplay = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");
const loading = document.getElementById("loading");

// Step 1: fetch alerts for a state
function fetchWeatherAlerts(state) {
  const STATE_ABBR = state.trim();

  // Input validation: two capital letters
  if (!STATE_ABBR) {
    return Promise.reject(new Error("Please enter a state abbreviation."));
  }
  if (!/^[A-Z]{2}$/.test(STATE_ABBR)) {
    return Promise.reject(
      new Error("State must be two capital letters, like TX.")
    );
  }

  return fetch(`https://api.weather.gov/alerts/active?area=${STATE_ABBR}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Could not get alerts for "${STATE_ABBR}" (status ${response.status}). Check the state code.`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // for testing
      return data;
    });
}

// Step 2: show alerts on the page
function displayAlerts(data) {
  alertsDisplay.innerHTML = ""; // remove previous data

  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement("ul");
  data.features.forEach((alert) => {
    const item = document.createElement("li");
    item.textContent = alert.properties.headline;
    list.appendChild(item);
  });
  alertsDisplay.appendChild(list);
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  submitBtn.disabled = isLoading;
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const state = input.value;
  input.value = ""; // clear the input field on every fetch

  setLoading(true);
  fetchWeatherAlerts(state)
    .then((data) => {
      clearError(); // hide and clear error after a successful request
      displayAlerts(data);
    })
    .catch((errorObject) => {
      console.log(errorObject.message);
      alertsDisplay.innerHTML = "";
      showError(
        errorObject instanceof TypeError
          ? "Network error. Please check your connection and try again."
          : errorObject.message
      );
    })
    .finally(() => setLoading(false));
});