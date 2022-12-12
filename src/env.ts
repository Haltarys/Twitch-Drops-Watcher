import dotenv from 'dotenv';
import path from 'path';

/**
 * Retrieves and checks for the correct environment variables.
 * @param envPath The path to the .env file to be loaded (current working directory by default.)
 * @returns An object containing the relevant environment variables loaded.
 */
export default function getEnvVariables(envPath: string) {
  // Doesn't throw an error even if the path is incorrect
  dotenv.config({ path: path.resolve(envPath) });

  const vars = {
    TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
    GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
    GOOGLE_OAUTH2_CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
    GOOGLE_OAUTH2_REFRESH_TOKEN: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
  };

  Object.entries(vars).forEach(([key, val]) => {
    if (val === undefined) throw new Error(`Error: ${key} is not defined!`);
  });

  return {
    twitch: {
      clientId: vars.TWITCH_CLIENT_ID!,
      clientSecret: vars.TWITCH_CLIENT_SECRET!,
    },
    google: {
      gmailAddress: vars.GMAIL_ADDRESS!,
      clientId: vars.GOOGLE_OAUTH2_CLIENT_ID!,
      clientSecret: vars.GOOGLE_OAUTH2_CLIENT_SECRET!,
      refreshToken: vars.GOOGLE_OAUTH2_REFRESH_TOKEN!,
    },
  };
}
