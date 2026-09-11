const chatbotService = require('../services/chatbotService');

class ChatbotController {
  async ask(req, res, next) {
    try {
      const { question } = req.body;
      if (!question || !question.trim()) {
        const error = new Error('Question is required');
        error.statusCode = 400;
        throw error;
      }
      const answer = await chatbotService.askQuestion(question.trim());
      res.json({ success: true, data: { answer } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatbotController();
