const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  const services = [
    { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
    { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = "𝐲𝐨 𝐬𝐚 𝐁𝐨𝐨𝐦, 𝐪𝐮𝐞 𝐩𝐮𝐢𝐬-𝐣𝐞 𝐟𝐚𝐢𝐫𝐞 𝐩𝐨𝐮𝐫 𝐯𝐨𝐮𝐬 𝐚𝐮𝐣𝐨𝐮𝐫𝐝'𝐡𝐮𝐢.....💆";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'Arn',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage(`✰.....✰𝗥𝗲𝗗-𝗫𝗼𝘂𝗞𝘂✰🪽.....✰\nPlease provide a question or statement.\n..❶..𝗛𝗔𝗠𝗘𝗗 𝗝𝗨𝗡𝗜𝗢𝗥..❶..❦ `, event.threadID, event.messageID);
      return;
    }

    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
    api.sendMessage(` \n❦..❶..𝗛𝗔𝗠𝗘𝗗 𝗝𝗨𝗡𝗜𝗢𝗥..❶..❦ \n${response}\n
✰.....✰𝗥𝗲𝗗-𝗫𝗼𝘂𝗞𝘂✰🪽.....✰`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      message.reply(`

\n❶....𝗛𝗔𝗠𝗘𝗗 𝗝𝗨𝗡𝗜𝗢𝗥..❶..❦
\n${response}\n
✰.....✰𝗥𝗲𝗗-𝗫𝗼𝘂𝗞𝘂✰🪽.....✰`, messageID);
    }
  }
};
