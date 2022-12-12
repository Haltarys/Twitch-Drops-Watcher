import dotenv from 'dotenv';
import TwitchAPIClient from './TwitchAPIClient';

// Import env variables from .env file
dotenv.config();

function printHelp(): void {
  console.log(
    [
      'USAGE: node . [OPTION]... GAMES...',
      '\t -d, --drops\n\t\tOnly show streams with Twitch Drops enabled',
      '\t -h, --help\n\t\tShow this help and exit',
    ].join('\n')
  );
}

async function main(): Promise<void> {
  if (process.argv.some((arg) => arg === '-h' || arg === '--help')) {
    printHelp();
  } else {
    const dropsEnabled = process.argv.some((arg) => arg === '-d' || arg === '--drops');
    const gameNames = process.argv.slice(2).filter((arg) => arg[0] != '-');

    if (gameNames.length === 0) {
      console.error('Please pass at least one game name as a command line argument.');
      return;
    }

    const clientId = process.env.TWITCH_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
    const client = await TwitchAPIClient.create(clientId, clientSecret);

    const liveStreams = await client
      .getGameIds(gameNames)
      .then((gameIds) => client.getLiveStreams(gameIds, dropsEnabled));
    if (liveStreams.length > 0) {
      liveStreams.forEach((stream) => {
        console.log(
          `${stream.user_name} is playing ${stream.game_name} live at ${TwitchAPIClient.buildTwitchURL(stream)}!`
        );
      });
    } else {
      console.log(
        [
          `No one is live for the following games: ${gameNames}.`,
          "Check the game names, disable the 'Drops Enabled' tag, or come back later.",
        ].join('\n')
      );
    }
  }
}

main();
