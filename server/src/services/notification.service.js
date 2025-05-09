import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import axios from 'axios';

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (HTML)
 * @returns {Promise<void>}
 */
export const sendEmailNotification = async ({ to, subject, message }) => {
  try {
    // If no recipient, log and return
    if (!to) {
      logger.warn('No recipient email provided for notification');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"WebPulse" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: message,
    });

    logger.info(`Email notification sent: ${info.messageId}`, { to, subject });
  } catch (error) {
    logger.error(`Error sending email notification: ${error.message}`, { to, subject, error });
  }
};

/**
 * Send Telegram notification
 * @param {Object} options - Telegram options
 * @param {string} options.message - Message to send
 * @returns {Promise<void>}
 */
export const sendTelegramNotification = async ({ message }) => {
  try {
    // Check if Telegram bot is configured
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      logger.warn('Telegram bot not configured');
      return;
    }

    // Send message
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }
    );

    if (response.data.ok) {
      logger.info('Telegram notification sent', { messageId: response.data.result.message_id });
    } else {
      logger.error('Error sending Telegram notification', { response: response.data });
    }
  } catch (error) {
    logger.error(`Error sending Telegram notification: ${error.message}`, { error });
  }
};
