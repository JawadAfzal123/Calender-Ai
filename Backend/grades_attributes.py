import openai


def ChatGPT_Query_For_Grades_Extraction(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content":"""
For each subject or course section identified in the syllabus document, extract the following information and format it as specified:

    e.g:
             
    {"title": 'Subject Name', "professor": 'Professor Name', mode: 'Office Location', time: 'Day of Class-Start Time-End Time', grade: 'Grading Policy', test1: '95%', test4: '95%', test2: '90%', test3: '98%', project: '92%', attendance: '100%' , percentageWeight: "98%",
    assignmentName: "The Operations Function,No Class9/6,Labor Day",
    deadline: "Deadline of the Assignment"},

    {"title": 'Subject Name', "professor": 'Professor Name', mode: 'Office Location', time: 'Day of Class-Start Time-End Time', grade: 'Grading Policy', test1: '95%', test4: '95%', test2: '90%', test3: '98%', project: '92%', attendance: '100%' , percentageWeight: "98%",
    assignmentName: "The Operations Function,No Class9/6,Labor Day",
    deadline: "Deadline of the Assignment"},            
    
    and so on, for each subject make new lines of same professnor name et. but if one subject have multiple deadline and different assignment name then print it in one format like the below:
    
     {
      "title": 'POM 446- Process Management',
      "professor": 'Brian Plummer; MBA, BSEE',
      "mode": 'In-Person',
      "time": 'Mon & Wed 2:00 - 3:15',
          "gradingPolicy": {
        "Test 1": '20%',
        "Test 2": '20%',
        "Test 3": '20%',
        "Project": '20%',
      },
      "assignments": [
        {
          "assignmentName": "Introduction, Housekeeping items, Course Overview",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/7"
        },
        {
          "assignmentName": "The Operations Function, No Class 9/6, Labor Day",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/12"
        },
        // Add the rest of your assignments here, each as a separate object
      ]
    }

    In text form example:
             
       {
      "title": 'POM 446- Process Management',
      "professor": 'Brian Plummer; MBA, BSEE',
      "mode": 'In-Person',
      "time": 'Mon & Wed 2:00 - 3:15',
        "gradingPolicy": {
        "Test 1": '20%',
        "Project": '20%',
        "Attendance": '20%',
      },
      "assignments": [
        {
          "assignmentName": "Introduction, Housekeeping items, Course Overview",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/7"
        },
        {
          "assignmentName": "The Operations Function, No Class 9/6, Labor Day",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/12"
        },
        // Add the rest of your assignments here, each as a separate object
      ]
    }
             
    {    {
      "title": 'Operations & Supply Chain Strategy',
      "professor": 'Brian Plummer; MBA, BSEE',
      "mode": 'In-Person',
      "time": 'Mon & Wed 2:00 - 3:15',
          "gradingPolicy": {
        "Test 1": '20%',
        "Test 2": '20%',
        "Test 3": '20%',
        "Project": '20%',
        "Attendance": '20%',
      },
      "assignments": [
        {
          "assignmentName": "Introduction, Housekeeping items, Course Overview",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/7"
        },
        {
          "assignmentName": "The Operations Function, No Class 9/6, Labor Day",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/12"
        },
        // Add the rest of your assignments here, each as a separate object
      ]
    }

      {    {
      "title": 'Operations & Supply Chain Strategy',
      "professor": 'Brian Plummer; MBA, BSEE',
      "mode": 'In-Person',
      "time": 'Mon & Wed 2:00 - 3:15',
    "gradingPolicy": {
        "Test 1": '20%',
        "Test 2": '20%',
        "Test 3": '20%',
        "Project": '20%',
        "Attendance": '20%',
      },,
      "assignments": [
        {
          "assignmentName": "Introduction, Housekeeping items, Course Overview",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "9/7"
        },
        {
          "assignmentName": "The Operations Function, No Class 9/6, Labor Day",
          "percentageWeight": "N",
          "grade": "N",
          "deadline": "10/12"
        },
        // Add the rest of your assignments here, each as a separate object
      ]
    }


    if same subject have different name of assignement from one professor and different deadline then show the above format or may be below format         
    {"title": 'POM 446- Process Management', "professor": 'Brian Plummer; MBA, BSEE', "mode": 'In-Person', "time": 'Mon & Wed 2:00 - 3:15', "grade": 'N', "test1": '20%', "test2": '20%', "test3": '20%', "project": '20%', "attendance": '20%' , "percentageWeight": "N",
    "assignmentName": "Introduction, Housekeeping items, Course Overview",
    "deadline": "9/7","percentageWeight": "N","assignmentName": "Product Design","deadline": "9/7", 
    "percentageWeight": "N","assignmentName": "Operations & Supply Chain Strategy","deadline": "12/7"}, 

    {"title": 'POM 446- Process Management', "professor": 'Brian Plummer; MBA, BSEE', "mode": 'In-Person', "time": 'Mon & Wed 2:00 - 3:15', "grade": 'N', "test1": '20%', "test2": '20%', "test3": '20%', "project": '20%', "attendance": '20%' , "percentageWeight": "N",
    "assignmentName": "Introduction, Housekeeping items, Course Overview",
    "deadline": "9/7","percentageWeight": "N","assignmentName": "Product Design","deadline": "9/7", 
    "percentageWeight": "N","assignmentName": "Operations & Supply Chain Strategy","deadline": "12/7"},  

             
                 
Note that if any attribute is missing, replace it with 'N'. The output should clearly number each subject or course section and present the information in a structured and concise manner as shown in the examples provided. Ensure that the details such as day and time, assignment grades, and deadlines are accurately captured.
"""

},
            {"role": "user", "content": query2}
        ],
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput

