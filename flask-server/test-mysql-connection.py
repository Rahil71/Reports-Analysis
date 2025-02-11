# import mysql.connector

# try:
#     conn = mysql.connector.connect(
#         host="localhost",       # Replace with actual host
#         user="Rahil",       # Your MySQL username
#         password="R@hil71*",  # Your MySQL password
#         database="projectstore"   # Your database name
#     )
#     print("Connection successful") if conn.is_connected() else print("Connection failed")
# except mysql.connector.Error as err:
#     print(f"Error: {err}")
# finally:
#     if 'conn' in locals() and conn.is_connected():
#         conn.close()

# from llama_parse import LlamaParse

# file_path="uploaded_files/IR_FinancialReport_77th_3Q_en.pdf"

# document = LlamaParse(result_type="markdown").load_data(file_path)
# print("Document Content Extracted:")
# print(document)

# from openai import OpenAI
# import os

# client = OpenAI(
#     api_key="",
#     base_url=os.getenv("BASE_URL_2")
# )

# response = client.embeddings.create(
#   input="Your text string goes here",
#   model="text-embedding-ada-002"
# )

# print(response.data[0].embedding)


# import openai
# from dotenv import load_dotenv
# import os

# load_dotenv()

# # Set API key and base URL
# openai.api_key = os.getenv("API_KEY_New")
# openai.base_url = os.getenv("BASE_URL_2")

# # Make a chat completion request
# completion = openai.chat.completions.create(
#     model="gpt-4o",
#     messages=[
#         {
#             "role": "user",
#             "content": "translate \"i love u\" in arabic",
#         },
#     ],
# )
# print(completion.choices[0].message.content)


from openai import OpenAI

client = OpenAI(api_key="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")  # Provide your API key here

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},  # 'system' role is correct
        {
            "role": "user",
            "content": "Write a haiku about recursion in programming."
        }
    ]
)

print(completion.choices[0].message.content)  # Fix: Use `.content` to get the message text
