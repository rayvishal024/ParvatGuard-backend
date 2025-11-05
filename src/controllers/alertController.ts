import { Request, Response, NextFunction } from 'express';
import { createAlert, findAlertsByUserId } from '../models/alert';
import { findUserById } from '../models/user';
import { findEmergencyContactsByUserId } from '../models/emergencyContact';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

// Optional Twilio integration - only if credentials are provided
let twilioClient: any = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    logger.info('Twilio client initialized');
  }
} catch (error) {
  logger.warn('Twilio not configured, SMS sending will be disabled');
}

/**
 * Log an alert to the database.
 * This endpoint receives alerts from the mobile app (via store-and-forward queue when offline).
 * The app also opens the SMS composer locally, but this API call ensures alerts are logged server-side
 * and can be retried via Twilio if configured.
 */
export async function logAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { type, payload, delivery_method } = req.body;

    if (!type || !payload || !payload.lat || !payload.lng) {
      throw new AppError('Type and payload with lat/lng are required', 400);
    }

    // Create alert record
    const alert = await createAlert({
      user_id: req.user.userId,
      type: type as 'SOS' | 'LOW_BATTERY' | 'MANUAL',
      payload,
      delivery_method,
    });

    // Optionally send via Twilio if configured
    // Note: The mobile app primarily uses SMS composer, but server-side Twilio can serve as backup
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await sendAlertViaTwilio(req.user.userId, alert, payload);
      } catch (twilioError) {
        logger.error({ error: twilioError, alertId: alert.id }, 'Failed to send alert via Twilio');
        // Don't fail the request - alert is still logged
      }
    }

    logger.info({ alertId: alert.id, userId: req.user.userId, type }, 'Alert logged');

    res.status(201).json({
      message: 'Alert logged successfully',
      alert: {
        id: alert.id,
        type: alert.type,
        status: alert.status,
        created_at: alert.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's alert history
 */
export async function getAlertHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const alerts = await findAlertsByUserId(req.user.userId);
    res.json({ alerts });
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to send alert via Twilio (if configured)
 */
async function sendAlertViaTwilio(userId: string, alert: any, payload: any): Promise<void> {
  const user = await findUserById(userId);
  if (!user) return;

  // Get primary emergency contact
  const contacts = await findEmergencyContactsByUserId(userId);
  const primaryContact = contacts.find((c) => c.is_primary) || contacts[0];
  if (!primaryContact) {
    logger.warn({ userId }, 'No emergency contact found for Twilio SMS');
    return;
  }

  // Build message
  const sosMessage = user.default_sos_message || 'Emergency SOS alert';
  const locationMsg = `Location: ${payload.lat}, ${payload.lng}`;
  const message = `${sosMessage}\n${locationMsg}\nTime: ${new Date().toISOString()}`;

  // Send via Twilio
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: primaryContact.phone,
  });

  logger.info({ alertId: alert.id, to: primaryContact.phone }, 'Alert sent via Twilio');
}

