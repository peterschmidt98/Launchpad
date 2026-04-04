/**
 * Launchpad API module — simulated AI responses for the demo
 */
window.LaunchpadAPI = {
  RESPONSES: [
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      response: "Hello! Welcome to Launchpad! I'm here to help you learn about AI and digital skills. Feel free to ask me anything — there are no silly questions. What would you like to know?",
    },
    {
      keywords: ['what is ai', 'what\'s ai', 'explain ai', 'define ai', 'artificial intelligence'],
      response: "AI — artificial intelligence — is technology that lets computers spot patterns and make predictions. Think of it like a very smart assistant that learned from reading millions of books and websites. It can write, summarize, answer questions, and more. But it doesn't truly \"think\" — it's a tool, like a calculator. A very powerful one!",
    },
    {
      keywords: ['chatgpt', 'chat gpt', 'openai'],
      response: "ChatGPT is an AI tool made by a company called OpenAI. It launched in late 2022 and became hugely popular almost overnight. You can type questions or requests and it writes back in natural language. It's great for drafting emails, brainstorming ideas, or getting explanations. It's one of many AI tools — they all work in a similar way!",
    },
    {
      keywords: ['claude', 'anthropic'],
      response: "Claude is an AI assistant made by Anthropic. It's known for being thoughtful, careful, and good at handling long documents. It works a lot like ChatGPT — you type something, and it responds helpfully. Different AI tools have different strengths, but learning one makes it easy to use any of them!",
    },
    {
      keywords: ['job', 'work', 'career', 'hire', 'employ', 'resume', 'cv', 'interview'],
      response: "Great question! The job market values digital skills more than ever, but here's the good news: the skills employers want most — communication, reliability, problem-solving — haven't changed. AI and digital tools are just new ways to apply those strengths. Learning the basics (like you're doing now!) puts you ahead of many candidates.",
    },
    {
      keywords: ['scared', 'nervous', 'worried', 'anxious', 'overwhelm', 'hard', 'difficult', 'can\'t'],
      response: "It's completely normal to feel that way. Technology moves fast and it can feel like a lot. But here's what I want you to know: you don't need to learn everything at once. Just one step at a time. The fact that you're here, learning, already puts you ahead. You've got this!",
    },
    {
      keywords: ['excel', 'spreadsheet', 'google sheets', 'sheets'],
      response: "Spreadsheets (like Excel or Google Sheets) are used in almost every workplace. They help you organize information in rows and columns — things like budgets, schedules, or contact lists. The basics are easy to learn: type data into cells, use simple formulas like SUM to add numbers. We'll cover this in a later chapter!",
    },
    {
      keywords: ['email', 'gmail', 'outlook'],
      response: "Email is still the backbone of professional communication. The key skills are: writing clear subject lines, keeping messages brief and friendly, and knowing when to reply vs. reply-all. Tools like Gmail and Outlook also include calendars, contacts, and video calls — all in one place. You'll feel comfortable with these quickly!",
    },
    {
      keywords: ['prompt', 'how to ask', 'how to use ai', 'talk to ai'],
      response: "Talking to AI is easier than you think! A good approach is: be specific about what you want, give some context, and say what format you'd like the answer in. For example, instead of 'Tell me about dogs,' try 'Give me 3 fun facts about golden retrievers in simple language.' The more specific you are, the better the answer!",
    },
    {
      keywords: ['thank', 'thanks', 'helpful', 'great', 'awesome', 'cool'],
      response: "You're welcome! I'm glad I could help. Keep exploring and asking questions — that's exactly how you learn. Every question you ask is a step forward. You're doing great!",
    },
  ],

  DEFAULT_RESPONSE: "That's a great question! While I'm a simulated demo, the real thing works just like this — you type a question, and AI responds in plain language. Try asking me things like 'What is AI?', 'How do I write a good email?', or 'What skills do employers want?' to see more examples.",

  async sendMessage(userMessage) {
    // Simulate a thinking delay (500-1500ms)
    const delay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const lower = userMessage.toLowerCase();

    // Find the first matching response based on keywords
    for (const entry of this.RESPONSES) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        return entry.response;
      }
    }

    return this.DEFAULT_RESPONSE;
  },
};
