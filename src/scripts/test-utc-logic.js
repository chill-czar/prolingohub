// Mocking the logic to verify correctness
function checkAvailability(dateParam) {
  console.log(`Checking date: ${dateParam}`);

  // 1. Parsing targetDate (as done in route.js)
  const targetDate = new Date(dateParam + "T00:00:00.000Z");
  console.log(`Target Date (UTC Object): ${targetDate.toISOString()}`);

  // 2. Calculating todayUTC (as done in route.js)
  const now = new Date(); // Simulating Server Time
  console.log(`Server Wall Time: ${now.toString()}`);

  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  console.log(`Today Midnight (strict UTC): ${todayUTC.toISOString()}`);

  // 3. Comparison
  if (targetDate < todayUTC) {
    console.log("RESULT: PAST DATE (Empty Array)");
  } else {
    console.log("RESULT: VALID DATE (Return slots)");
  }
  console.log("---");
}

// Test cases
const now = new Date();
const y = now.getUTCFullYear();
const m = String(now.getUTCMonth() + 1).padStart(2, "0");
const d = String(now.getUTCDate()).padStart(2, "0");

// Case 1: Today (UTC)
checkAvailability(`${y}-${m}-${d}`);

// Case 2: Yesterday (UTC) - Should be past
const yesterday = new Date(
  Date.UTC(y, now.getUTCMonth(), now.getUTCDate() - 1)
);
const y_y = yesterday.getUTCFullYear();
const y_m = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
const y_d = String(yesterday.getUTCDate()).padStart(2, "0");
checkAvailability(`${y_y}-${y_m}-${y_d}`);

// Case 3: Tomorrow (UTC) - Should be valid
const tomorrow = new Date(Date.UTC(y, now.getUTCMonth(), now.getUTCDate() + 1));
const t_y = tomorrow.getUTCFullYear();
const t_m = String(tomorrow.getUTCMonth() + 1).padStart(2, "0");
const t_d = String(tomorrow.getUTCDate()).padStart(2, "0");
checkAvailability(`${t_y}-${t_m}-${t_d}`);
