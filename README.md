# Twitch Drops Watcher

Node.js CLI tool to scan for Twitch streams with Drops enabled for a given list of games.

## Options

```bash
Usage: twitch-drops-watcher [options] <games...>

CLI tool to check for Twitch live streams with Drops Enabled for a given list of games.

Options:
  -V, --version     output the version number
  -d, --drops       only show live streams with Twitch Drops enabled. (default: false)
  -e, --env <path>  path to the .env file to load (default: "./.env")
  -h, --help        display help for command
```

## Game names

The exact name of the videogame you want can be found at <https://www.twitch.tv/directory>.

## Installation

### NPM script

You can run it as an NPM script `npx ...` or `yarn ...`. See below for configuration.

### From source

First, clone the [repository](https://github.com/Haltarys/Twitch-Drops-Watcher) from Github, then, install the dependencies with Yarn or NPM, and, finally, compile the code.

```bash
git clone git@github.com:Haltarys/Twitch-Drops-Watcher.git
yarn install # npm install
yarn run build # npm run build
```

Don't forget to add the environment variables to configure the script (see below.)

After installing the dependencies and compiling the code, you can run it with: `node dist/index.js` or simply `node .`.

## Configuration

For the script to work, it needs some environment variables to be set (see `.env.example` for details.)

You can either export them directly into your environment like so:

```bash
export TWITCH_CLIENT_ID=<Your Twitch client ID>
# ... Do so for all necessary environment variables
node . "Game1" "Game2" # run the script

# Or in one line
TWITCH_CLIENT_ID=<Your Twitch client ID> ... node . "Game1" "Game2"
```

Or use an `.env` file like as detailed below (recommended.)

Copy the `.env.example` file and rename it to `.env`.

### Twitch configuration

Go to <https://dev.twitch.tv/console/apps>, log into your Twitch account and create a new app. Generate a client ID and secret and save them to the `.env` file.

### Google configuration

Go to <https://console.cloud.google.com/apis/dashboard>, log into your Google account and create a new Cloud project. From that project, create credentials and paste them into the `.env` file.

Specify the `.env` file's path with the `-e, --env` flag (default is `./.env`.)

Useful links:

- <https://developers.google.com/workspace/guides/create-project>
- <https://developers.google.com/workspace/guides/create-credentials>
- <https://developers.google.com/oauthplayground>
