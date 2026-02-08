from fastapi import HTTPException
import pdfkit

import io
from xhtml2pdf import pisa

from utils.s3.s3 import generate_s3_presigned_url, save_object_to_s3


def html_file_to_pdf(html_content, topic):
    """
    Convert an HTML file to a PDF file.
    Returns True on success, False on failure.
    """

    pdf_buffer = io.BytesIO()

    # 3. Convert HTML to PDF using pisa
    pisa_status = pisa.CreatePDF(
        src=html_content,  # HTML content to convert
        dest=pdf_buffer,  # destination buffer
    )

    if pisa_status.err:
        raise HTTPException(status_code=500, detail="PDF generation failed")

    pdf_buffer.seek(0)

    file_path = save_object_to_s3(pdf_buffer,"roadmap","pdf", topic)

    pre_signed_url = generate_s3_presigned_url("media/" + file_path)

    return pre_signed_url

# Path to wkhtmltopdf binary (Windows-specific path)
# PDFKIT_CONFIG = pdfkit.configuration(wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")

# def html_to_pdf(html_content: str, output_path: str) -> bool:
#     try:
#         pdfkit.from_string(html_content, output_path, configuration=PDFKIT_CONFIG)
#         return True
#     except Exception as e:
#         print("[PDF Generation Error]", e)
#         return False
