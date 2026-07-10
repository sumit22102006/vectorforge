import { parseUploadedFile } from './parserService.js';
import { getChatOwner } from './ownerService.js';

/**
 * Service to generate training pairs from parsed chats for AI model fine-tuning
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<Array<Object>>} Structured list of { input, output, date, time }
 */
export const generateTrainingPairs = async (filename) => {
  // 1. Verify owner selection exists
  const ownerName = await getChatOwner(filename);

  if (!ownerName) {
    const error = new Error(
      `No owner selected for file "${filename}". Please select a participant to represent "Me" first.`
    );
    error.statusCode = 400;
    throw error;
  }

  // 2. Fetch parsed chats
  const rawMessages = await parseUploadedFile(filename);

  // 3. Filter out system warnings, media, and deleted notices
  const filteredMessages = rawMessages.filter(
    (msg) =>
      msg.message &&
      msg.message !== '<Media omitted>' &&
      msg.message !== 'This message was deleted'
  );

  if (filteredMessages.length === 0) {
    return [];
  }

  // 4. Segment messages into consecutive blocks of User ("Me") and Friends ("Others")
  const segments = [];
  let currentSegment = null;

  for (const msg of filteredMessages) {
    const isUser = msg.sender === ownerName;

    if (currentSegment && currentSegment.isUser === isUser) {
      currentSegment.messages.push(msg);
    } else {
      currentSegment = {
        isUser,
        messages: [msg]
      };
      segments.push(currentSegment);
    }
  }

  // 5. Match consecutive Friend messages (input) with subsequent User replies (output)
  const trainingPairs = [];

  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1];

    // If a Friend segment is immediately followed by a User reply segment
    if (!current.isUser && next.isUser) {
      const input = current.messages.map((m) => m.message).join('\n');
      const output = next.messages.map((m) => m.message).join('\n');
      
      // Preserve date and time from the start of the User's reply segment
      const date = next.messages[0].date;
      const time = next.messages[0].time;

      trainingPairs.push({
        input,
        output,
        date,
        time
      });
    }
  }

  return trainingPairs;
};
