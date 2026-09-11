const { GoogleGenerativeAI } = require('@google/generative-ai');
const Book = require('../models/Book');

class ChatbotService {
  async askQuestion(question) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      const error = new Error(
        'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.'
      );
      // Return 503 Service Unavailable so client UI knows the service is unconfigured rather than failing internally
      error.statusCode = 503;
      throw error;
    }

    // Query inventory with .lean() to build a lightweight context payload for the prompt without Mongoose hydration overhead
    const books = await Book.find().lean();
    const bookContext = books.map((b) => ({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies,
    }));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Selected lightweight instruction-tuned model for fast inference and cost efficiency
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a helpful library assistant for a Library Management System. Here is the current library inventory:

${JSON.stringify(bookContext, null, 2)}

Total books in library: ${books.length}
Total available copies: ${bookContext.reduce((sum, b) => sum + b.availableCopies, 0)}
Total copies: ${bookContext.reduce((sum, b) => sum + b.totalCopies, 0)}

User question: ${question}

Provide a helpful, concise answer based on the library data above. If the data is empty, let the user know the library has no books yet. If the question is not related to the library, politely redirect the user to ask library-related questions.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (apiError) {
      console.error('Gemini API error:', apiError.message);
      // Categorize upstream LLM API failures as 502 Bad Gateway to separate third-party downtime from internal server exceptions
      const error = new Error('Failed to get response from AI assistant. Please try again later.');
      error.statusCode = 502;
      throw error;
    }

  }
}

module.exports = new ChatbotService();
