import dotenv from 'dotenv';
import TwitchAPIClient from './TwitchAPIClient';

// Import env variables from .env file
dotenv.config();

async function main() {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
  const gameNames = process.env.GAME_NAMES!.split('|');

  const client = await TwitchAPIClient.create(clientId, clientSecret);

  const liveStreams = await client.getGameIds(gameNames).then((gameIds) => client.getLiveStreams(gameIds, true));
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

main();
