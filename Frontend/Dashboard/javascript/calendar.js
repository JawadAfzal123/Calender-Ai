let events = [];
//  1. 9 February 2024 6pm-8pm 2. 10 February 2024 3pm-5pm  format it accept


document.addEventListener('DOMContentLoaded', function () {
  const inputField = document.querySelector('.input-field');
  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleQuery(e.target.value);
      e.target.value = '';
    }
  });
});

async function handleQuery(query) {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';

  try {
    // const response = await fetch('http://localhost:8000/ActionAnalyser/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ query: query })
    // });
    response= "1. 9 February 2024 6pm-8pm 2. 10 February 2024 3pm-5pm"
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Received result:', result); // Log the entire result

    if (result.Action && typeof result.Action === 'string') {
      const action = result.Action.toLowerCase();
      console.log(`Action is a string: ${action}`); // Confirm that action is a string

      if (action === 'delete') {
        console.log('Remove called for dates:', result.Return_Data);
        removeDateEvent(result.Return_Data);
      } else if (action === 'create') {
        console.log('New entry called for dates:', result.Return_Data);
        Add_a_new_date_event(result.Return_Data);
      } else {
        console.log('Update or other action called');
      }
    } else {
      // Handle cases where 'Action' is undefined or not a string
      console.error('Action property is not a string or is undefined:', result);
    }

  } catch (error) {
    console.error('Error during fetch or processing:', error);
  } finally {
    loader.style.display = 'none';
  }
}




function Add_a_new_date_event(inputText) {
  const newEvents = parseInput(inputText);
  events = events.concat(newEvents);
  generateCalendar(currentMonth.value, currentYear.value);
}
function removeDateEvent(dateString) {
  const pattern = /(\d+)\s+(\w+)\s+(\d{4})/;
  const match = dateString.match(pattern);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2];
    const month = month_names.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
    const year = parseInt(match[3], 10);

    events = events.filter(event => !(event.day === day && event.month === month && event.year === year));

    generateCalendar(currentMonth.value, currentYear.value);
  } else {
    console.error('Invalid date format for removal');
  }
}

function parseInput(inputText) {
  const pattern = /(\d+\.\s+)?(\d+)\s+(\w+)\s+(\d{4})\s+(\d{1,2}(:\d{2})?(am|pm|AM|PM))-(\d{1,2}(:\d{2})?(am|pm|AM|PM))/g;
  const events = [];

  let match;
  while ((match = pattern.exec(inputText)) !== null) {
    const day = parseInt(match[2], 10);
    const monthName = match[3];
    const month = month_names.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
    const year = parseInt(match[4], 10);
    const startTime = match[5].toLowerCase();
    const endTime = match[8].toLowerCase();
    events.push({ day, month, year, startTime, endTime });

  }

  return events;
}


function showEventTimes(event) {
  const modal = document.getElementById('event-modal');
  document.getElementById('event-start-time').textContent = `Start Time: ${event.startTime}`;
  document.getElementById('event-end-time').textContent = `End Time: ${event.endTime}`;

  modal.style.display = "block";

  const closeButton = document.querySelector('.close-button');
  closeButton.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  const modal = document.getElementById('event-modal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};
let calendar = document.querySelector('.calendar');
const month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');

month_picker.onclick = () => {
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');
  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
  dateFormate.classList.remove('showtime');
  dateFormate.classList.add('hideTime');
};

const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector('.calendar-days');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();

  month_picker.innerHTML = month_names[month];

  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);


  for (let i = 0; i < days_of_month[month] + first_day.getDay(); i++) {
    let day = document.createElement('div');
    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;
      day.classList.add('calendar-day-item');
      let date = new Date(year, month, day.innerHTML);

      let eventForDay = events.find(e => e.day == date.getDate() && e.month == date.getMonth() && e.year == date.getFullYear());
      if (eventForDay) {
        day.classList.add('special-date');
        day.addEventListener('click', () => showEventTimes(eventForDay));

      }

      if (i - first_day.getDay() + 1 === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        day.classList.add('current-date');
      }
    }
    calendar_days.appendChild(day);
  }
};

let month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
  let month = document.createElement('div');
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace('show', 'hide');
    dayTextFormate.classList.remove('hideTime');
    dayTextFormate.classList.add('showtime');
    timeFormate.classList.remove('hideTime');
    timeFormate.classList.add('showtime');
    dateFormate.classList.remove('hideTime');
    dateFormate.classList.add('showtime');
  };
});

(function () {
  month_list.classList.add('hideonce');
})();
document.querySelector('#pre-year').onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
};
const currentDateFormate = new Intl.DateTimeFormat(
  'en-US',
  showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;
setInterval(() => {
  const timer = new Date();
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
    2,
    '0'
  )}:${`${timer.getMinutes()}`.padStart(
    2,
    '0'
  )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
  todayShowTime.textContent = formateTimer;
}, 1000);
function showEventDetails(event) {
  const message = `Event on ${event.day} ${month_names[event.month]} ${event.year} from ${event.startTime} to ${event.endTime}`;
  alert(message);
}




// Button of weeekly and monthly to display 
function showWeeklyCalendar() {
  document.getElementById('weeklyCalendarContainer').style.display = 'block';
  document.getElementById('monthlyCalendarContainer').style.display = 'none';
  document.getElementById('dropdownMenuButton').textContent = 'Weekly';
}

function showMonthlyCalendar() {
  document.getElementById('weeklyCalendarContainer').style.display = 'none';
  document.getElementById('monthlyCalendarContainer').style.display = 'block';
  document.getElementById('dropdownMenuButton').textContent = 'Monthly';
}






// WEEKLY CALENDER VIEW START FROM HEREs





const state = {
  currentDate: new Date(),
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth(),
  events: [] // Array to store the added events
};

window.addEventListener('DOMContentLoaded', (event) => {
  populateYearSelect();
  populateMonthSelect();
  renderWeekdays();
  attachEventListeners();
});

function populateYearSelect() {
  const yearSelect = document.getElementById('year-select');
  const currentYear = state.selectedYear;
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.innerText = i;
    yearSelect.appendChild(option);
  }
  yearSelect.value = currentYear;
}

function populateMonthSelect() {
  const monthSelect = document.getElementById('month-select');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = month;
    monthSelect.appendChild(option);
  });
  monthSelect.value = state.selectedMonth;
}

function attachEventListeners() {
  document.getElementById('event-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addEventFromInput();
      e.preventDefault(); // This prevents the default action of the enter key which might cause unexpected behavior
    }
  });
    
  document.getElementById('prev-week').addEventListener('click', () => navigateWeeks(-1));
  document.getElementById('next-week').addEventListener('click', () => navigateWeeks(1));
  document.getElementById('year-select').addEventListener('change', (e) => {
    state.selectedYear = parseInt(e.target.value);
    resetToFirstWeekOfMonth(state.selectedYear, state.selectedMonth);
  });
  document.getElementById('month-select').addEventListener('change', (e) => {
    state.selectedMonth = parseInt(e.target.value);
    resetToFirstWeekOfMonth(state.selectedYear, state.selectedMonth);
  });
}

function addEventFromInput() {
  const input = document.getElementById('event-input').value;
  const regex = /(\d{1,2}) (\w+) (\d{4}) at (\d{1,2})(am|pm)/;
  const match = input.match(regex);

  if (match) {
    const [_, day, month, year, hour, ampm] = match;
    const date = new Date(`${month} ${day}, ${year} ${hour}:00 ${ampm.toUpperCase()}`);
    const time = `${date.getHours()}:00`;
    const dateNumber = date.getDate();

    state.events.push({ date: dateNumber, month: state.selectedMonth, year: state.selectedYear, time });

    updateSelectInputs(date.getFullYear(), date.getMonth());
    renderWeekdays();
  } else {
    alert('Invalid format. Please use "add class on DD Month YYYY at HH(am/pm)".');
  }
}

function navigateWeeks(direction) {
  const startOfWeek = getWeekStart(state.currentDate);
  startOfWeek.setDate(startOfWeek.getDate() + direction * 7);
  if (isWeekWithinSelectedMonthAndYear(startOfWeek, state.selectedYear, state.selectedMonth)) {
    state.currentDate = startOfWeek;
    renderWeekdays();
  }
}

function resetToFirstWeekOfMonth(year, month) {
  state.currentDate = new Date(year, month, 1);
  renderWeekdays();
}

function renderWeekdays() {
  const weekdaysContainer = document.getElementById('weekdays-container');
  weekdaysContainer.innerHTML = '';
  const weekStart = getWeekStart(state.currentDate);

  for (let i = 0; i < 6; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dayElement = document.createElement('div');
    dayElement.className = 'weekday';
    dayElement.innerHTML = `<div class='day-name'>${date.toLocaleString('default', { weekday: 'short' })}</div>
                            <div class='date-number'>${date.getDate()}</div>`;
    weekdaysContainer.appendChild(dayElement);
  }

  renderEvents();
}

function renderEvents() {
  clearClassButtons();
  state.events.forEach(event => {
    if (eventFallsWithinWeek(event)) {
      placeButton(event.date, event.time);
    }
  });
}

function getWeekStart(date) {
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Adjusted to start from Monday
  return weekStart;
}

function clearClassButtons() {
  document.querySelectorAll('.class-button').forEach(button => button.remove());
}

function placeButton(date, time) {
  const weekdays = document.querySelectorAll('.weekday');
  let targetDayElement;

  weekdays.forEach((dayElement, index) => {
    const day = dayElement.querySelector('.date-number');
    if (day && parseInt(day.textContent) === date) {
      targetDayElement = dayElement;
    }
  });

  if (targetDayElement) {
    const timeContainer = document.querySelector(`.time-slot[data-time="${time}"]`);
    if (timeContainer) {
      const button = document.createElement('button');
      button.innerText = 'Class';
      button.className = 'btn_color class-button';
      timeContainer.appendChild(button);
      button.style.position = 'absolute';
      button.style.left = `${targetDayElement.offsetLeft + targetDayElement.offsetWidth / 2 - button.offsetWidth / 2}px`;
    }
  }
}

function updateSelectInputs(year, month) {
  document.getElementById('year-select').value = year;
  document.getElementById('month-select').value = month;
}

function eventFallsWithinWeek(event) {
  const weekStart = getWeekStart(state.currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const eventDate = new Date(event.year, event.month, event.date);
  return eventDate >= weekStart && eventDate <= weekEnd;
}

function isWeekWithinSelectedMonthAndYear(weekStart, year, month) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return (weekStart.getFullYear() === year && weekStart.getMonth() === month) ||
    (weekEnd.getFullYear() === year && weekEnd.getMonth() === month);
}
