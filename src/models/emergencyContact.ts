import { db } from '../config/database';

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship?: string | null;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmergencyContactData {
  user_id: string;
  name: string;
  phone: string;
  relationship?: string;
  is_primary?: boolean;
}

export interface UpdateEmergencyContactData {
  name?: string;
  phone?: string;
  relationship?: string;
  is_primary?: boolean;
}

export async function createEmergencyContact(
  data: CreateEmergencyContactData
): Promise<EmergencyContact> {
  // If setting as primary, unset other primary contacts
  if (data.is_primary) {
    await db('emergency_contacts')
      .where({ user_id: data.user_id })
      .update({ is_primary: false });
  }

  const [contact] = await db('emergency_contacts')
    .insert({
      ...data,
      is_primary: data.is_primary || false,
    })
    .returning('*');
  return contact;
}

export async function findEmergencyContactsByUserId(userId: string): Promise<EmergencyContact[]> {
  return db('emergency_contacts')
    .where({ user_id: userId })
    .orderBy('is_primary', 'desc')
    .orderBy('created_at', 'asc');
}

export async function findEmergencyContactById(id: string): Promise<EmergencyContact | undefined> {
  return db('emergency_contacts').where({ id }).first();
}

export async function updateEmergencyContact(
  id: string,
  userId: string,
  data: UpdateEmergencyContactData
): Promise<EmergencyContact | undefined> {
  // If setting as primary, unset other primary contacts
  if (data.is_primary) {
    await db('emergency_contacts')
      .where({ user_id: userId })
      .whereNot({ id })
      .update({ is_primary: false });
  }

  const [contact] = await db('emergency_contacts')
    .where({ id, user_id: userId })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return contact;
}

export async function deleteEmergencyContact(id: string, userId: string): Promise<boolean> {
  const deleted = await db('emergency_contacts').where({ id, user_id: userId }).delete();
  return deleted > 0;
}

