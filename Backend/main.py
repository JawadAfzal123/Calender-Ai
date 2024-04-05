from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from input_query_action import CheckAction, DeleteCreateData, UpdateData 
from extract_calender_data import Complete_Data, TotalNumbers
from grades_attributes import ChatGPT_Query_For_Grades_Extraction
from functionalities import extract_text_from_docx, extract_text_from_pdf

from io import BytesIO
import openai
import os
from dotenv import load_dotenv
from typing import List


load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = openai_api_key


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ActionAnalyser")
async def process_query(query: str):
    action = CheckAction(query)
    action = action.lower()

    if action == "delete" or action == "create":
        return_data = DeleteCreateData(query)
    elif action == "update":
        return_data = UpdateData(query)
    else:
        return_data = "Query is not inserted properly"
    
    return {"Action": action, "Return_Data": return_data}



@app.post("/ExtractCalendarData/")
async def process_documents(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        if not file.filename.endswith(('.docx', '.pdf')):
            raise HTTPException(status_code=400, detail="Only .docx and .pdf files are supported.")
        
        contents = await file.read()

        if file.filename.endswith('.docx'):
            text = extract_text_from_docx(BytesIO(contents))
        else:  
            text = extract_text_from_pdf(BytesIO(contents))
        
        response = Complete_Data(text)
        total = TotalNumbers(text)
        print(text)
        results.append({"file": file.filename, "response": response, "total": total})
    
    return {"results": results}


@app.post("/Grades_Extraction/")
async def upload_files(files: List[UploadFile] = File(...)):
    extracted_texts = []
    
    for file in files:
        if not file.filename.endswith(('.docx', '.pdf')):
            raise HTTPException(status_code=400, detail="Only .docx and .pdf files are supported.")
        
        contents = await file.read()
        
        if file.filename.endswith('.docx'):
            text = extract_text_from_docx(BytesIO(contents))
        else:  
            text = extract_text_from_pdf(BytesIO(contents))
        
        response = ChatGPT_Query_For_Grades_Extraction(text)
        print(response)
        extracted_texts.append({"file": file.filename, "extracted_data": response})
    
    return {"results": extracted_texts}
