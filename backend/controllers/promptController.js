import { generatePromptPayload } from '../services/promptService.js';

/**
 * Controller to trigger system prompt generation for an incoming message
 */
export const handleBuildPrompt = async (req, res, next) => {
  try {
    const { filename, newIncomingMessage } = req.body;

    if (!filename || !newIncomingMessage) {
      const error = new Error('Invalid request: "filename" and "newIncomingMessage" are required in the body.');
      error.statusCode = 400;
      throw error;
    }

    const payload = await generatePromptPayload(filename, newIncomingMessage);

    res.status(200).json({
      success: true,
      systemPrompt: payload.systemPrompt,
      messages: payload.messages
    });
  } catch (err) {
    next(err);
  }
};
