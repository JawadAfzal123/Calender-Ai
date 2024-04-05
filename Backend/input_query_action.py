import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = openai_api_key

def CheckAction(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
            "role": "system", "content": """
                Your task is to analyze a query and return a string indicating if it pertains to "Delete," "Update," or "Create."
            """},
            {"role": "user", "content": query2}
        ],
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput



def DeleteCreateData(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
            "role": "system", "content": """
                Your task is to Generate a string by analyzing queries for dates, months, years, and times. Multiple instances of these elements may exist. Provide output in the following format:

                1. 9 February 2024 6pm-8pm
                2. 10 February 2024 3pm-5pm
                so on
            """},
            {"role": "user", "content": query2}
        ],
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput


def UpdateData(query):
    query2 = str(query)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
            "role": "system", "content": """
                Your task is to Analyze the query to differentiate between deletion and creation entries, focusing on dates, months, years, and times.

                Output format:

                Delete: 9 February 2024 6pm-8pm
                Create: 10 February 2024 3pm-5pm
            """},
            {"role": "user", "content": query2}
        ],
        temperature=0.1
    )
    if response and 'choices' in response and len(response['choices']) > 0:
        RangesOutput = response['choices'][0]['message']['content']
    return RangesOutput


