
// Your code here!
const form = document.getElementById("weather-form");
const stateInput = document.getElementById("state-input");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherAlerts(state) {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Step 1: Log the data for testing.
    console.log(data);

    // Step 2: Display the alerts.
    displayAlerts(data);

  } catch (errorObject) {
    console.log("Error fetching weather alerts:", errorObject.message);

    alertsDisplay.replaceChildren();
    errorMessage.textContent = `Unable to fetch weather alerts: ${errorObject.message}`;
  }
}

function displayAlerts(data) {
  // Remove previous alerts and errors.
  alertsDisplay.replaceChildren();
  errorMessage.textContent = "";

  const alerts = data.features || [];

  // Display the summary.
  const summary = document.createElement("h2");
  summary.textContent = `${data.title}: ${alerts.length}`;
  alertsDisplay.appendChild(summary);

  if (alerts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "There are currently no active weather alerts.";
    alertsDisplay.appendChild(message);
    return;
  }

  // Display each alert headline as a list item.
  const list = document.createElement("ul");

  alerts.forEach((alert) => {
    const item = document.createElement("li");
    item.textContent =
      alert.properties?.headline || "Headline unavailable";
    list.appendChild(item);
  });

  alertsDisplay.appendChild(list);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const state = stateInput.value.trim().toUpperCase();

  // Clear old results before processing a new request.
  alertsDisplay.replaceChildren();
  errorMessage.textContent = "";

  // Validate the input.
  if (!/^[A-Z]{2,20}$/.test(state)) {
    errorMessage.textContent =
      "Please enter a valid two-letter US state abbreviation.";
    return;
  }

  // Clear the input field and fetch fresh data.
  stateInput.value = "";
  fetchWeatherAlerts(state);
});
