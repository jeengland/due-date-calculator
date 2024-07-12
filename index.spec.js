const {
  CalculateDueDate,
  isWorkingHour,
  isWorkingDay,
  advanceToNextWorkingDay,
} = require("./index");

describe("CalculateDueDate Function", () => {
  test("Calculates due date within the same day", () => {
    const submitDate = new Date(2024, 6, 9, 10); // Tuesday, July 9, 10 AM
    const turnaround = 4;
    const expectedDueDate = new Date(2024, 6, 9, 14); // Tuesday, July 9, 2 PM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Calculates due date spanning multiple days", () => {
    const submitDate = new Date(2024, 6, 11, 15); // Thursday, July 11, 3 PM
    const turnaround = 10;
    const expectedDueDate = new Date(2024, 6, 12, 17); // Friday, July 12, 5 PM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Calculates due date including weekends", () => {
    const submitDate = new Date(2024, 6, 12, 13); // Friday, July 12, 1 PM
    const turnaround = 20;
    const expectedDueDate = new Date(2024, 6, 16, 17); // Tuesday, July 16, 11 AM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Handles submit time at the end of the workday", () => {
    const submitDate = new Date(2024, 6, 12, 16, 59); // Friday, July 12, 4:59 PM
    const turnaround = 2;
    const expectedDueDate = new Date(2024, 6, 15, 10, 59); // Monday, July 15, 10:59 AM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Handles turnaround time of 8 hours", () => {
    const submitDate = new Date(2024, 6, 8, 9); // Monday, July 8, 9 AM
    const turnaround = 8;
    const expectedDueDate = new Date(2024, 6, 8, 17); // Monday, July 8, 5 PM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Handles turnaround time exceeding a workweek", () => {
    const submitDate = new Date(2024, 6, 8, 9); // Monday, July 8, 9 AM
    const turnaround = 56; // More than one work week
    const expectedDueDate = new Date(2024, 6, 16, 17); // Wednesday, July 17, 5 PM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Handles zero turnaround time", () => {
    const submitDate = new Date(2024, 6, 10, 14);
    const turnaround = 0;
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(submitDate);
  });

  test("Handles turnaround exactly multiple of workdays", () => {
    const submitDate = new Date(2024, 6, 8, 9); // Monday, 9 AM
    const turnaround = 40; // Exactly 5 workdays
    const expectedDueDate = new Date(2024, 6, 12, 17); // Friday, 5 PM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Handles submit time at the end of the week", () => {
    const submitDate = new Date(2024, 6, 12, 17); // Friday, 5 PM
    const turnaround = 1;
    const expectedDueDate = new Date(2024, 6, 15, 10); // Monday, 10 AM
    expect(CalculateDueDate(submitDate, turnaround)).toEqual(expectedDueDate);
  });

  test("Throws an error for submit time outside working hours", () => {
    const submitDate = new Date(2024, 6, 8, 8); // Monday, July 8, 8 AM (invalid)
    const turnaround = 10;
    expect(() => CalculateDueDate(submitDate, turnaround)).toThrow(
      "Invalid submit time. Submissions must be made between 9 AM and 5 PM on weekdays."
    );
  });
});

// isWorkingHour
describe("isWorkingHour", () => {
  test("returns true for valid working hour", () => {
    const date = new Date(2024, 6, 10, 14); // Wednesday, July 10th, 2 PM
    expect(isWorkingHour(date)).toBe(true);
  });

  test("returns false for time before working hours", () => {
    const date = new Date(2024, 6, 10, 8); // Wednesday, July 10th, 8 AM
    expect(isWorkingHour(date)).toBe(false);
  });

  test("returns false for time after working hours", () => {
    const date = new Date(2024, 6, 10, 18); // Wednesday, July 10th, 6 PM
    expect(isWorkingHour(date)).toBe(false);
  });

  test("returns false for weekend", () => {
    const date = new Date(2024, 6, 13, 14); // Saturday, July 13th, 2 PM
    expect(isWorkingHour(date)).toBe(false);
  });
});

// isWorkingDay
describe("isWorkingDay", () => {
  test("returns true for weekday", () => {
    const date = new Date(2024, 6, 10); // Wednesday, July 10th
    expect(isWorkingDay(date)).toBe(true);
  });

  test("returns false for Saturday", () => {
    const date = new Date(2024, 6, 13); // Saturday, July 13th
    expect(isWorkingDay(date)).toBe(false);
  });

  test("returns false for Sunday", () => {
    const date = new Date(2024, 6, 14); // Sunday, July 14th
    expect(isWorkingDay(date)).toBe(false);
  });
});

// advanceToNextWorkingDay
describe("advanceToNextWorkingDay", () => {
  test("advances to next weekday if on a weekend", () => {
    const weekendDate = new Date(2024, 6, 13, 10, 30); // Saturday, July 13th, 10:30 AM
    const expectedDate = new Date(2024, 6, 15, 9, 30); // Monday, July 15th, 9:30 AM
    expect(advanceToNextWorkingDay(weekendDate, 30)).toEqual(expectedDate);
  });

  test("advances to next week if on Friday", () => {
    const fridayDate = new Date(2024, 6, 12, 16, 45); // Friday, July 12th, 4:45 PM
    const expectedDate = new Date(2024, 6, 15, 9, 45); // Monday, July 15th, 9:45 AM
    expect(advanceToNextWorkingDay(fridayDate, 45)).toEqual(expectedDate);
  });

  test("preserves original minutes", () => {
    const date = new Date(2024, 6, 8, 15, 22); // Monday, July 8th, 3:22 PM
    const expectedDate = new Date(2024, 6, 9, 9, 22); // Tuesday, July 9th, 9:22 AM
    expect(advanceToNextWorkingDay(date, 22)).toEqual(expectedDate);
  });
});
