import { buildLlamaPrompt } from '../services/promptService.js';

/**
 * Controller to compile Llama system prompts and return few-shot messages arrays
 */
export const handleBuildPrompt = async (req, res, next) => {
  try {
    const { filename, newIncomingMessage } = req.body;

    if (!filename || !newIncomingMessage) {
      const error = new Error(
        'Missing body parameters: Both "filename" and "newIncomingMessage" are required.'
      );
      error.statusCode = 400;
      throw error;
    }

    const promptData = await buildLlamaPrompt(filename, newIncomingMessage);

    res.status(200).json({
      success: true,
      systemPrompt: promptData.systemPrompt,
      messages: promptData.messages
    });
  } catch (err) {
    next(err);
  }
};
