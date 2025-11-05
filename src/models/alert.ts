import { db } from '../config/database';

export interface AlertPayload {
  lat: number;
  lng: number;
  message?: string;
  timestamp?: string;
  battery_level?: number;
  [key: string]: unknown;
}

export interface Alert {
  updated_at: Date;
  id: string;
  user_id: string;
  type: 'SOS' | 'LOW_BATTERY' | 'MANUAL';
  payload: AlertPayload;
  status: 'pending' | 'sent' | 'failed';
  delivery_method?: string | null;
  error_message?: string | null;
  created_at: Date;
  sent_at?: Date | null;
}

export interface CreateAlertData {
  user_id: string;
  type: 'SOS' | 'LOW_BATTERY' | 'MANUAL';
  payload: AlertPayload;
  delivery_method?: string;
}

export async function createAlert(data: CreateAlertData): Promise<Alert> {
  const [alert] = await db('alerts')
    .insert({
      ...data,
      status: 'pending',
    })
    .returning('*');
  return alert;
}

export async function findAlertById(id: string): Promise<Alert | undefined> {
  return db('alerts').where({ id }).first();
}

export async function findPendingAlerts(limit: number = 100): Promise<Alert[]> {
  return db('alerts')
    .where({ status: 'pending' })
    .orderBy('created_at', 'asc')
    .limit(limit);
}

export async function updateAlertStatus(
  id: string,
  status: 'pending' | 'sent' | 'failed',
  errorMessage?: string
): Promise<Alert | undefined> {
  const updateData: Partial<Alert> = {
    status,
    updated_at: db.fn.now() as unknown as Date,
  };

  if (status === 'sent') {
    updateData.sent_at = db.fn.now() as unknown as Date;
  }

  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  const [alert] = await db('alerts').where({ id }).update(updateData).returning('*');
  return alert;
}

export async function findAlertsByUserId(userId: string, limit: number = 50): Promise<Alert[]> {
  return db('alerts')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit);
}

