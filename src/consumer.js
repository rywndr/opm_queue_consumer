require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./services/PlaylistsService');
const MailSender = require('./mail/MailSender');
const CollaborationsService = require('./services/CollaborationsService');
const config = require('./utils/config');

const init = async () => {
  try {
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const mailSender = new MailSender();

    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlist', {
      durable: true,
    });

    console.log('Consumer is running and waiting for messages...');

    channel.consume('export:playlist', async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(message.content.toString());
        console.log(`Processing export request for playlist: ${playlistId}, email: ${targetEmail}`);

        const playlist = await playlistsService.getPlaylistForExport(playlistId);
        const result = await mailSender.sendEmail(targetEmail, JSON.stringify(playlist, null, 2));

        console.log('Email sent successfully:', result);
        channel.ack(message);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(message, false, false);
      }
    });
  } catch (error) {
    console.error('Failed to start consumer:', error);
    process.exit(1);
  }
};

init();
