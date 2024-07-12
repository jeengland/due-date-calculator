function CalculateDueDate(submitDate, turnaroundHours) {
  validateSubmitTime(submitDate);

  let dueDate = new Date(submitDate);
  const originalMinutes = dueDate.getMinutes();
  let remainingHours = turnaroundHours;

  while (remainingHours > 0) {
    const hoursRemainingToday = Math.max(0, 17 - dueDate.getHours());
    const hoursToProcess = Math.min(remainingHours, hoursRemainingToday);

    dueDate.setHours(dueDate.getHours() + hoursToProcess);
    remainingHours -= hoursToProcess;

    if (remainingHours > 0) {
      dueDate = advanceToNextWorkingDay(dueDate, originalMinutes);
    }
  }

  return dueDate;
}

function validateSubmitTime(date) {
  if (!isWorkingHour(date)) {
    throw new Error(
      "Invalid submit time. Submissions must be made between 9 AM and 5 PM on weekdays."
    );
  }
}

function isWorkingHour(date) {
  const day = date.getDay();
  const hour = date.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 17; // Mon-Fri, 9 AM - 5 PM
}

function isWorkingDay(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Mon-Fri
}

function advanceToNextWorkingDay(date, originalMinutes) {
  do {
    date.setDate(date.getDate() + 1);
    date.setHours(9, originalMinutes, 0, 0);
  } while (!isWorkingDay(date));
  return date;
}

module.exports = {
  CalculateDueDate,
  isWorkingDay,
  isWorkingHour,
  advanceToNextWorkingDay,
};
