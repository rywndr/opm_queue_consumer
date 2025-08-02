const config = {
  database: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: String(process.env.PGPASSWORD || ''),
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
};

module.exports = config;
