import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';

// Import env variables
dotenv.config();

// Request and parse an access token
async function getTwitchCredentials(clientId: string, clientSecret: string): Promise<any> {
  return axios
    .post(
      'https://id.twitch.tv/oauth2/token',
      `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    .then((res) => res.data);
}

// Initialise a Twitch API client
class TwitchAPIClient {
  private client: AxiosInstance;

  constructor(clientId: string, credentials: any) {
    this.client = axios.create({
      baseURL: 'https://api.twitch.tv/helix',
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Client-Id': clientId,
      },
    });
  }

  async getGameIds(gameNames: string[]): Promise<any[]> {
    return this.client
      .get(`/games?name=${gameNames.join('&name=')}`)
      .then((res) => res.data.data.map((game: any) => game.id));
  }

  async getLiveStreams(gameIds: string[]): Promise<any[]> {
    return this.client.get(`/streams?game_id=${gameIds.join('&game_id=')}`).then((res) => res.data);
  }
}

async function main() {
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
  const gameNames = process.env.GAME_NAMES!.split('|');

  const credentials = await getTwitchCredentials(clientId, clientSecret);
  const client = new TwitchAPIClient(clientId, credentials);

  const liveStreams = await client.getLiveStreams(await client.getGameIds(gameNames));
  console.log(liveStreams);
}

main();
