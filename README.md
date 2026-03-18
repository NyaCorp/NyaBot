<h1 align="center">NyaBot</h1>

### Technologies Used
- **Language:** JavaScript (Node.js)
- **Main Library:** discord.js (v14)
- **Environment and Configuration:** dotenv
- **Development:** nodemon

### Prerequisites
To run this project locally, make sure you have:
- [Node.js](https://nodejs.org/)
- An application and bot registered in the [Discord Developer Portal](https://discord.com/developers/applications).

### Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory and install dependencies by running:

```bash
npm install
```

### Environment Setup

Create a file named .env at the project root. You can use the provided .env.example file as a reference. Configure the following variables so the bot can authenticate and register commands:

```env
DISCORD_TOKEN=your_bot_authentication_token
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id
```

### Usage and Execution

This project includes several scripts to streamline the development workflow:

#### Development Environment

Start the bot using nodemon. This keeps the process running and automatically reloads the application whenever you save a code change:

```bash
npm run dev
```

#### Production Environment

To start the bot normally without file watchers, run:

```bash
npm start
```

#### Command Synchronization

If you add a new command or modify an existing command’s visual structure (such as name, description, or options), you must register those changes in the Discord API by running the following script in a separate terminal:

```bash
npm run deploy
```

### Project Structure

The project architecture is modularized to separate command declarations from event logic:

```
/
├── src/
│   ├── commands/          # Slash command definitions and execution
│   ├── events/            # Event interceptors and handlers
│   └── utils/             # Global constants, status dictionaries, and utilities
├── index.js               # Main entry point and dynamic module loading
├── deploy-commands.js     # Registration script for the Discord API
├── package.json           # Dependency declarations and execution scripts
└── .env                   # Local environment variables (ignored by git)
```