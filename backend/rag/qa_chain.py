from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage
from .loader import load_faiss

class FiqhQAChain:
    """Islamic Fiqh QA Chain with streaming support and structured prompt."""

    def __init__(self):
        # Load the retriever (FAISS index)
        self.retriever = load_faiss()

        # Initialize the LLM (GPT-4)
        self.llm = ChatOpenAI(model_name="gpt-4o")

        # Chat history storage
        self.chat_history = []

        # Define the custom system prompt
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system",
             "You are a kind and knowledgeable Islamic Fiqh assistant. Your goal is to provide clear, respectful, and easy-to-read answers based on authentic sources. "
             "Always structure your responses with proper indentation for better readability. When addressing a question, ensure to present the opinion of all four schools of thought (Hanafi, Maliki, Shafi'i, and Hanbali) where applicable, highlighting their views with clarity. "
             "Provide references to the sources used in **bold** to emphasize their importance. If you're uncertain about an issue, kindly acknowledge it and offer to assist the user in finding accurate information. "
             "Always conclude your response with a warm, encouraging statement to ensure the user feels supported in their quest for knowledge. "
             "Use **bold** for headings, school names (e.g., **Hanafi School**), and keywords like **Reference** or **Source**. "
             "At the end of the answer, provide a source for the answer. "
             "Use the following context to answer: {context}"),
            MessagesPlaceholder("chat_history"),
            ("human", "{question}")
        ])

    def invoke(self, inputs):
        """Main method to process questions."""
        if isinstance(inputs, dict):
            question = inputs.get("question", inputs.get("query", ""))
        else:
            question = str(inputs)

        return self._ask_question(question)

    def _ask_question(self, question: str) -> str:
        """Non-streamed response method."""
        # Retrieve relevant documents
        docs = self.retriever.invoke(question)
        context = "\n\n".join([doc.page_content for doc in docs])

        # Build prompt
        messages = self.prompt_template.format_messages(
            context=context,
            question=question,
            chat_history=self.chat_history
        )

        # Get single response
        response = self.llm.invoke(messages)

        # Update history
        self.chat_history.extend([
            HumanMessage(content=question),
            AIMessage(content=response.content)
        ])

        # Truncate history if needed
        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

        return response.content

    def stream(self, question: str):
        """Stream response token-by-token from the model."""
        docs = self.retriever.invoke(question)
        context = "\n\n".join([doc.page_content for doc in docs])

        messages = self.prompt_template.format_messages(
            context=context,
            question=question,
            chat_history=self.chat_history
        )

        self.chat_history.append(HumanMessage(content=question))

        for chunk in self.llm.stream(messages):
            if chunk.content:
                yield chunk.content
                self.chat_history.append(AIMessage(content=chunk.content))

        if len(self.chat_history) > 20:
            self.chat_history = self.chat_history[-20:]

    def clear_memory(self):
        """Clear the chat memory."""
        self.chat_history = []


# Instantiate the QA chain
qa_chain = FiqhQAChain()
