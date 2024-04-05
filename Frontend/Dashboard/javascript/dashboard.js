function updateButtonText(dropdownItem) {
  var dropdownButton = document.getElementById('dropdownMenuButton');
  var itemText = dropdownItem.textContent || dropdownItem.innerText;

  dropdownButton.textContent = itemText;

  var dropdownElement = bootstrap.Dropdown.getInstance(dropdownButton);
  dropdownElement.hide();
}
async function handleFiles(files) {
  const loader = document.getElementById('loader');

  if (files.length === 0) {
    console.log('No files selected.');
    return;
  }

  loader.style.display = 'block';

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  console.log('Sending files to server...');
  try {
    const response = await fetch('http://localhost:8000/ExtractCalendarData/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const result = await response.json();

    if (!result.hasOwnProperty('results')) {
      throw new Error('No results in response');
    }
    console.log('Results:', result.results);

    const eventsFromDoc = parseAllExtractedData(result.results);
    events = [...eventsFromDoc];
    generateCalendar(currentMonth.value, currentYear.value);


    updateCalendarWithEvents(eventsFromDoc);
    alert('Data is stored, please check the calendar.');
    handleFiles_for_grades(files)


  } catch (error) {
    console.error('Error during file upload or data extraction:', error);
  } finally {
    loader.style.display = 'none';
  }
}


async function handleFiles_for_grades(files) {
  console.log("Grading in Dashboard.js is called ")
  const loader = document.getElementById('loader');

  if (files.length === 0) {
    console.log('No files selected.');
    return;
  }

  loader.style.display = 'block';

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  console.log('Sending files to server...');
  
  try {
    const response = await fetch('http://localhost:8000/Grades_Extraction/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const result = await response.json();
    if (!result.hasOwnProperty('results')) {
      throw new Error('No results in response');
    }
 
    localStorage.setItem('gradesData', JSON.stringify(result.results));
    console.log('Results stored in localStorage:', result.results);


  } catch (error) {
    console.error('Error during file upload or data extraction:', error);
  } finally {
    loader.style.display = 'none';
  }
}




function updateCalendarWithEvents(events) {
  const calendarDays = document.querySelectorAll('.calendar-day-item');
  calendarDays.forEach(dayElement => {
    const day = parseInt(dayElement.textContent, 10);
    const month = currentMonth.value;
    const year = currentYear.value;

    const eventForDay = events.find(event => event.day === day && event.month === month && event.year === year);
    if (eventForDay) {
      dayElement.classList.add('special-date');
    }
  });
}
function parseAllExtractedData(results) {
  const allEvents = [];

  // Loop through each result object
  results.forEach(resultItem => {
    const dataString = resultItem.response;

    // Check if dataString is actually a string
    if (typeof dataString === 'string') {
      // Now parse this string to extract events
      const events = parseExtractedData(dataString);
      allEvents.push(...events);
    } else {
      // Handle the case where dataString is not a string
      console.error('Expected a string but got:', dataString);
    }
  });

  return allEvents;
}

function parseExtractedData(dataString) {
  const events = [];
  console.log(dataString);

  const cleanDataString = dataString.replace(/.*the class schedules are as follows:/i, '');

  const pattern = /(\d+)\.\s+(\d+)\s+(\w+)\s+(\d{4})\s+(\d{1,2}):?(\d{0,2})(am|pm)?-(\d{1,2}):?(\d{0,2})(am|pm)?/gi;
  let match;

  while ((match = pattern.exec(cleanDataString)) !== null) {
    const monthName = match[3].toLowerCase();
    const monthIndex = month_names.findIndex(m => m.toLowerCase().startsWith(monthName));

    const startAmPm = match[7] || 'am';
    const endAmPm = match[10] || 'am';

    events.push({
      day: parseInt(match[2], 10),
      month: monthIndex,
      year: parseInt(match[4], 10),
      startTime: match[5] + (match[6] ? ':' + match[6] : '') + startAmPm,
      endTime: match[8] + (match[9] ? ':' + match[9] : '') + endAmPm,
    });
  }

  return events;
}

