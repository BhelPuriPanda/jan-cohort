from langchain_community.llms import Ollama

ollama_llm = Ollama(model="llama2-uncensored")

def run_llm(prompt: str) -> str:
    return ollama_llm.invoke(prompt)
