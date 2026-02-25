import os
import fitz

def extract_pdfs():
    with open('extract.txt', 'w', encoding='utf-8') as out:
        for f in os.listdir('.'):
            if f.endswith('.pdf'):
                out.write(f'\\n--- {f} ---\\n')
                try:
                    doc = fitz.open(f)
                    for page in doc:
                        out.write(page.get_text())
                except Exception as e:
                    out.write(f"Error reading {f}: {e}\\n")

if __name__ == '__main__':
    extract_pdfs()
