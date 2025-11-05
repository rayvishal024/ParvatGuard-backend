import { Request, Response, NextFunction } from 'express';
import { findUserById, updateUser } from '../models/user';
import { AppError } from '../middleware/errorHandler';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      default_sos_message: user.default_sos_message,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { name, phone, default_sos_message } = req.body;
    const updateData: { name?: string; phone?: string; default_sos_message?: string } = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (default_sos_message !== undefined) updateData.default_sos_message = default_sos_message;

    const updatedUser = await updateUser(req.user.userId, updateData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      default_sos_message: updatedUser.default_sos_message,
    });
  } catch (error) {
    next(error);
  }
}

