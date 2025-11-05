import { Request, Response, NextFunction } from 'express';
import {
  createEmergencyContact,
  findEmergencyContactsByUserId,
  findEmergencyContactById,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../models/emergencyContact';
import { AppError } from '../middleware/errorHandler';

export async function getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const contacts = await findEmergencyContactsByUserId(req.user.userId);
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { name, phone, relationship, is_primary } = req.body;

    if (!name || !phone) {
      throw new AppError('Name and phone are required', 400);
    }

    const contact = await createEmergencyContact({
      user_id: req.user.userId,
      name,
      phone,
      relationship,
      is_primary: is_primary || false,
    });

    res.status(201).json({ contact });
  } catch (error) {
    next(error);
  }
}

export async function updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;
    const { name, phone, relationship, is_primary } = req.body;

    const contact = await findEmergencyContactById(id);
    if (!contact || contact.user_id !== req.user.userId) {
      throw new AppError('Contact not found', 404);
    }

    const updatedContact = await updateEmergencyContact(id, req.user.userId, {
      name,
      phone,
      relationship,
      is_primary,
    });

    if (!updatedContact) {
      throw new AppError('Failed to update contact', 500);
    }

    res.json({ contact: updatedContact });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;

    const contact = await findEmergencyContactById(id);
    if (!contact || contact.user_id !== req.user.userId) {
      throw new AppError('Contact not found', 404);
    }

    const deleted = await deleteEmergencyContact(id, req.user.userId);
    if (!deleted) {
      throw new AppError('Failed to delete contact', 500);
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
}

