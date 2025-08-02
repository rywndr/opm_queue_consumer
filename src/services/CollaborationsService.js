const { Pool } = require('pg');
const config = require('../utils/config');

class CollaborationsService {
  constructor() {
    this._pool = new Pool(config.database);
  }

  // Minimal implementation - only methods needed by consumer if any
  // For now, this is just a placeholder since PlaylistsService expects it
}

module.exports = CollaborationsService;
