from bs4 import BeautifulSoup
from markdown import markdown

def convert_md_to_txt(md_file_path, txt_file_path):
    try:
        # Read the markdown file
        with open(md_file_path, 'r', encoding='utf-8') as md_file:
            markdown_content = md_file.read()

        # Convert markdown to HTML
        html_content = markdown(markdown_content)

        # Extract plain text from HTML
        plain_text = ''.join(BeautifulSoup(html_content, 'html.parser').findAll(text=True))

        # Save the plain text to the specified .txt file
        with open(txt_file_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(plain_text)

        print(f"Markdown file converted and saved to {txt_file_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")

# Example usage
md_file_path = "uploaded_files/IR_FinancialReport_77th_3Q_en.md"  # Replace with your markdown file path
txt_file_path = "checking.txt"  # Replace with your desired output file path
convert_md_to_txt(md_file_path, txt_file_path)