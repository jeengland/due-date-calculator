# Due Date Calculator

This project provides a JavaScript function to calculate the due date/time of a task, considering working hours (9 AM to 5 PM on weekdays) and excluding weekends.

## Installation

This project will work without any dependencies and only requires node, but in order to test you will need to install jest.

## Usage

#### Parameters

submitDate (Date): The date and time the task was submitted.
turnaroundHours (number): The estimated number of hours to complete the task.

#### Return Value

A Date object representing the calculated due date and time.

#### Example

```js
const { calculateDueDate } = require("due-date-calculator");

// Sample usage:
const submitDate = new Date(2024, 6, 12, 10, 30); // Friday, July 12th, 10:30 AM
const turnaroundHours = 10; // 10 hours to complete the task
const dueDate = calculateDueDate(submitDate, turnaroundHours);

console.log(dueDate.toLocaleString()); // Output: Friday, July 12, 2024, 6:30:00 PM
```

#### Error Handling

The function throws an Error if the submitDate is outside of working hours (9 AM to 5 PM on weekdays).
The function assumes 8 working hours per day.

## Running the tests

1. Ensure you have jest installed

```bash
yarn add jest
# or for npm
npm install jest
```

2. Run the tests using the test script

```bash
yarn test
# or for npm
npm test
```
