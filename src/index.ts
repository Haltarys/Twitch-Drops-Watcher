#!/usr/bin/env node

import { program } from 'commander';
import GmailSender from './email';
import getEnvVariables from './env';
import TwitchAPIClient from './TwitchAPIClient';

async function main(): Promise<void> {
  program
    .name('twitch-drops-watcher')
    .description('CLI tool to check for Twitch live streams with Drops Enabled for a given list of games.')
    .version(require('../package.json').version)
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

    try {
      await new GmailSender(google).sendEmail({
        to: google.gmailAddress,
        subject: `Twitch Drops Watcher: someone${options.drops ? ' with Drops enabled' : ''} is live!`,
        html,
      });
      console.log(`Email sent to ${google.gmailAddress}.`);
    } catch (err) {
      console.error('An error occurred while sending the email. Check your Google credentials.');
      throw err;
    }
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
