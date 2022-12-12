import { program } from 'commander';
import path from 'path';
import GmailSender from './email';
import getEnvVariables from './env';
import TwitchAPIClient from './TwitchAPIClient';

async function main(): Promise<void> {
  program
    .name('twitch-drops-watcher')
    .description('CLI tool to check for Twitch live streams with Drops Enabled for a given game.')
    .version('1.0.0')
    .arguments('<games...>')
    .option('-d, --drops', 'only show live streams with Twitch Drops enabled.', false)
    .option('-e, --env <path>', 'path to the .env file to load', './.env');

  program.parse();

  const options = program.opts(),
    gameNames = program.args;
  const { twitch, google } = getEnvVariables(options.env);

  const client = await TwitchAPIClient.create(twitch.clientId, twitch.clientSecret);

  const liveStreams = await client.getTwitchGames(gameNames).then((games) =>
    client.getLiveStreams(
      games.map(({ id }) => id),
      options.drops
    )
  );

  if (liveStreams.length > 0) {
    liveStreams.forEach((stream) => {
      console.log(
        `${stream.user_name} is playing ${stream.game_name} live at ${TwitchAPIClient.buildTwitchURL(stream)}!`
      );
    });

    const html = liveStreams
      .map((stream) => {
        const url = TwitchAPIClient.buildTwitchURL(stream);
        return `<div>${stream.user_name} is playing ${stream.game_name} live at <a href="${url}">${url}</a>!<div>`;
      })
      .join('\n');

    await new GmailSender(google).sendEmail({
      to: google.gmailAddress,
      subject: `Twitch Drops Watcher: someone${options.drops ? ' with Drops enabled' : ''} is live!`,
      html,
    });
  } else {
    console.log(
      [
        'No one is live for the following games:',
        ...gameNames,
        "Check the game names, remove the 'Drops Enabled' filter, or come back later.",
      ].join('\n')
    );
  }
}

main();
