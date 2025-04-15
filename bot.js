const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

// Replace this with your bot token
const token = "7352737770:AAGDoYgktVFFPlZDiK6qW5gAoKMDXwIFH7U";

// Enable polling so the bot starts automatically
const bot = new TelegramBot(token, { polling: true });

console.log("Solohitechbot is running...");

// Load existing users from file
let users = [];
const usersFile = "users.json";

if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile));
}

// Function to save users
const saveUsers = () => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// When a user sends a message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (!users.includes(chatId)) {
    users.push(chatId);
    saveUsers(); // Save to file
    console.log(`New user added: ${chatId}`);
  }

  bot.sendMessage(chatId, "Hello! You are now subscribed to receive messages anytime.");
});

// Function to send messages to all users
const sendMessageToAll = async (message) => {
  users.forEach((chatId) => {
    bot.sendMessage(chatId, message);
  });
};

// Example: Send a message to all users every hour
setInterval(() => {
  sendMessageToAll("This is an automated message from Solohitechbot.");
}, 3600000); // Every 1 hour

