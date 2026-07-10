export const mockPersonas = [
  {
    id: "clone",
    name: "My Digital Clone (AI)",
    avatar: "🤖",
    status: "online",
    lastSeen: "Online",
    unreadCount: 0,
    styleProfile: {
      matchScore: 94,
      tone: "Casual, enthusiastic, slight technical lean",
      punctuation: "Uses minimal punctuation, rarely uses capital letters for starts of sentences",
      avgResponseTime: "1.8 minutes (mimicked)",
      emojiUsage: "High (prefers 🚀, 👍, 😂, 🔥)",
      vocabulary: ["literally", "awesome", "let's go", "solid", "make sense", "deploy", "setup"],
      messageLength: "Short-to-medium (average 9 words per message)"
    },
    chatHistory: [
      { id: 1, sender: "me", text: "Hey! Are you ready to start testing my digital clone?", timestamp: "10:00 AM", status: "read" },
      { id: 2, sender: "them", text: "literally born ready 🚀 let's see how well I can copy your style", timestamp: "10:01 AM", status: "read" },
      { id: 3, sender: "me", text: "Haha that's actually pretty spot on. Do you usually write like this?", timestamp: "10:02 AM", status: "read" },
      { id: 4, sender: "them", text: "yeah i mean you never capitalize your sentences in chat and you use way too many emojis lol", timestamp: "10:02 AM", status: "read" },
      { id: 5, sender: "me", text: "Hey wait, I don't use *that* many emojis...", timestamp: "10:03 AM", status: "read" },
      { id: 6, sender: "them", text: "brother you literally sent 3 thumbs up in our last thread 😂 it's a solid pattern", timestamp: "10:04 AM", status: "read" }
    ]
  },
  {
    id: "sarah",
    name: "Sarah (Design Lead)",
    avatar: "🎨",
    status: "offline",
    lastSeen: "Last seen yesterday at 6:45 PM",
    unreadCount: 2,
    styleProfile: {
      matchScore: 82,
      tone: "Professional, structured, detail-oriented",
      punctuation: "Strict grammar, uses correct capitalization and punctuation",
      avgResponseTime: "15 minutes",
      emojiUsage: "Low (occasionally uses ✨, 🙏, 😊)",
      vocabulary: ["alignment", "spacing", "high-fidelity", "feedback", "prototype", "user testing"],
      messageLength: "Medium-to-long (average 16 words per message)"
    },
    chatHistory: [
      { id: 1, sender: "them", text: "Hi Sumit, did you look over the new mockups for the landing page?", timestamp: "Yesterday, 4:15 PM", status: "read" },
      { id: 2, sender: "me", text: "Yes! They look amazing. Love the clean layouts", timestamp: "Yesterday, 4:20 PM", status: "read" },
      { id: 3, sender: "them", text: "Great. We need to make sure the font size is legible on mobile devices.", timestamp: "Yesterday, 4:22 PM", status: "read" },
      { id: 4, sender: "them", text: "Please review the spacing constraints I added to the Figma file.", timestamp: "Yesterday, 9:30 AM", status: "read" },
      { id: 5, sender: "them", text: "Let's touch base tomorrow morning to finalize this.", timestamp: "Yesterday, 9:31 AM", status: "read" }
    ]
  },
  {
    id: "mom",
    name: "Mom",
    avatar: "❤️",
    status: "offline",
    lastSeen: "Last seen today at 8:12 AM",
    unreadCount: 0,
    styleProfile: {
      matchScore: 45,
      tone: "Caring, enthusiastic, repetitive formatting",
      punctuation: "Excessive exclamation marks, multiple question marks",
      avgResponseTime: "45 minutes",
      emojiUsage: "Extremely high (🌸, ❤️, 😘, 🍕)",
      vocabulary: ["dear", "dinner", "take care", "home", "eat", "call me"],
      messageLength: "Short sentences (average 6 words)"
    },
    chatHistory: [
      { id: 1, sender: "them", text: "Hello dear!! Are you coming home for dinner tonight?? ❤️❤️", timestamp: "8:05 AM", status: "read" },
      { id: 2, sender: "me", text: "Hey Mom! Yes, I should be home by 7:30.", timestamp: "8:07 AM", status: "read" },
      { id: 3, sender: "them", text: "Ok good! I am making pasta! Eat some fruits before that 😘🌸", timestamp: "8:10 AM", status: "read" }
    ]
  },
  {
    id: "alex",
    name: "Alex (Colleague)",
    avatar: "💻",
    status: "online",
    lastSeen: "Online",
    unreadCount: 0,
    styleProfile: {
      matchScore: 78,
      tone: "Concise, developer-jargon heavy",
      punctuation: "Inconsistent, heavy use of abbreviations",
      avgResponseTime: "5 minutes",
      emojiUsage: "Moderate (prefers 👍, 💻, 🤦‍♂️, 📦)",
      vocabulary: ["lgtm", "PR", "merge", "rebase", "infra", "docker", "local build"],
      messageLength: "Very short (average 4 words)"
    },
    chatHistory: [
      { id: 1, sender: "me", text: "Hey Alex, is the main branch updated?", timestamp: "11:10 AM", status: "read" },
      { id: 2, sender: "them", text: "yeah merged the PR 👍", timestamp: "11:11 AM", status: "read" },
      { id: 3, sender: "me", text: "Awesome, pulling it now.", timestamp: "11:12 AM", status: "read" },
      { id: 4, sender: "them", text: "lmk if compile fails", timestamp: "11:12 AM", status: "read" }
    ]
  }
];
