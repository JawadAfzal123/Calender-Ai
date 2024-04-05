import openai


def Complete_Data(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
          messages=[
            {"role": "system", "content": """             
             Identify if the document specifies event times at the start or throughout the text and Professor name , email address, office location, Meeting Times. Then, accurately find and format event schedules, observing these guidelines:
                - find the explicit date and the full spelling of the month for each event session or significant event.
                - Identify the start time and end time for each class/job/meeting session or event. 
                - Format the Find schedule information as a numbered list, like this:

                    1. [Day] [Full Month Name] [Year] [Start Time]-[End Time] [Professor name] [email] [office location] [Meeting Times]
                    2. [Day] [Full Month Name] [Year] [Start Time]-[End Time] [Professor name] [email] [office location] [Meeting Times]
                    ...

                Example output:
                    1. 7 September 2022 2:00pm-3:15pm John Allens John12@gmail.com CCB-303 02:00pm-4:00pm
                    2. 12 September 2022 2:00pm-3:15pm Jame Bond jamesali@outlook.com AB-01 02pm-4pm
                    3. 12 September 2024 2:00pm-3:15pm Jame Bond bplummer@umassd.edu AB-01 02pm-4pm
                    and so on 
             
                I repeat, the format must should like this
             
             
                    1. [Day] [Full Month Name] [Year] [Start Time]-[End Time] [Professor name] [email] [office location] [Meeting Times]
                    2. [Day] [Full Month Name] [Year] [Start Time]-[End Time] [Professor name] [email] [office location] [Meeting Times]

                      so on
             
                If something is missing just write 'N' instead of the format so the format must be completed without missing any entity
                    """},
            {"role": "user", "content": query2}
        ],
      
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput



def TotalNumbers(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
          messages=[
            {"role": "system", "content": """             
            Your task is to calculate the Total number of Tasks, Assignments and Homework.
            You should return a string in this format:
             Task = [Total Tasks]  Assignments = [Total Assignemnts]  Homework = [Total Homeworks]
             You have to do the calculation to count all these.
             Tasks, Assignments or homeowrks can be mention by anyway for example there might be some deadlines so you have to find is it a task assignment or homework and then you have to increment the count of that type.
             It can be mention by another name as well,  for example Activity or case study etc.
             you have to identify the tasks, assigments and homework properly.
             I repeat You should return a string in this format:
             Task = [Total Tasks]  Assignments = [Total Assignemnts]  Homework = [Total Homeworks]
                    """},
            {"role": "user", "content": query2}
        ],
      
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput





