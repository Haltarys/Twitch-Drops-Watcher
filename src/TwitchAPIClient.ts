import axios, { AxiosInstance } from 'axios';
import type { TwitchCredentials, TwitchGame, TwitchStream } from './entities';

export default class TwitchAPIClient {
  private client: AxiosInstance;

  /**
   * Constructs a TwitchAPIClient instance from a client ID and credentials.
   * @param clientId The client ID from the Twitch API.
   * @param credentials An object returned by the Twitch API containing an access token.
   */
  private constructor(clientId: string, credentials: TwitchCredentials) {
    this.client = axios.create({
      baseURL: 'https://api.twitch.tv/helix',
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Client-Id': clientId,
      },
    });
  }

  /**
   * Asynchronously creates a TwitchAPIClient with a client ID and a secret from the Twitch API.
   * @param clientId The client ID from the Twitch API.
   * @param clientSecret The client secret from the Twitch API.
   * @returns An asynchronously created TwitchAPIClient instance.
   */
  static async create(clientId: string, clientSecret: string): Promise<TwitchAPIClient> {
    return axios
      .post(
        'https://id.twitch.tv/oauth2/token',
        `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .then((res) => new TwitchAPIClient(clientId, res.data));
  }

  /**
   * Retrieves the Twitch IDs of an array of videogame names.
   * @param gameNames An array of videogame names.
   * @returns An array of videogame Twitch IDs.
   */
  async getTwitchGames(gameNames: string[]): Promise<TwitchGame[]> {
    return this.client.get(`/games?name=${gameNames.join('&name=')}`).then((res) => res.data.data);
  }

  /**
   * Retrieve an array of live streams for a given array of videogame IDs, optionally, only those with Twitch Drops enabled.
   * @returns An array of videogame Twitch IDs.
   * @param dropsEnabled Whether to only return streams with Twitch Drops enabled.
   * @returns An array of live streams on Twitch.
   */
  async getLiveStreams(gameIds: string[], dropsEnabled = false): Promise<TwitchStream[]> {
    const dropsEnabledTagId = 'c2542d6d-cd10-4532-919b-3d19f30a768b';

    return this.client
      .get(`/streams?game_id=${gameIds.join('&game_id=')}`)
      .then((res) => res.data.data)
      .then((streams) =>
        dropsEnabled ? streams.filter((stream: TwitchStream) => stream.tag_ids.includes(dropsEnabledTagId)) : streams
      );
  }

  /**
   * Builds and returns the URL for a given stream.
   * @param stream A Twitch stream from the Twitch API.
   * @returns The URL to the livestream.
   */
  static buildTwitchURL(stream: TwitchStream): string {
    return `https://www.twitch.tv/${stream.user_login}`;
  }
}
