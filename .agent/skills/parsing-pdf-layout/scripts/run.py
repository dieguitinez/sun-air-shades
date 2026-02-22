import pdfplumber
import sys

def extract_table(pdf_path):
    text_content = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    text_content.append(" | ".join([str(x) for x in row if x]))
    return "\n".join(text_content)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(extract_table(sys.argv[1]))
