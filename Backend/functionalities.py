
import docx
import fitz 

def extract_text_from_docx(file_stream):
    document = docx.Document(file_stream)
    text = '\n'.join([paragraph.text for paragraph in document.paragraphs])
    return text

def extract_text_from_pdf(file_stream):
    text = ""
    with fitz.open(stream=file_stream, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text