const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const config = require('../utils/config');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool(config.database);
    this._collaborationService = collaborationService;
  }

  async getPlaylistForExport(playlistId) {
    const playlistQuery = {
      text: 'SELECT p.id, p.name FROM playlists p WHERE p.id = $1',
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer FROM songs s
             LEFT JOIN playlist_songs ps ON ps.song_id = s.id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      playlist: {
        id: playlistResult.rows[0].id,
        name: playlistResult.rows[0].name,
        songs: songsResult.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
