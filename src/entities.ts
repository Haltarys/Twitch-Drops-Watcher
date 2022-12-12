export class Credentials {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class Game {
  box_art_url: string;
  id: string;
  name: string;
}

export class TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string; // Actually, could be a Date object
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}
