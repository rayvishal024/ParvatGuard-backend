import { Request, Response, NextFunction } from 'express';
import { createUser, findUserByEmail, verifyPassword } from '../models/user';
import { generateAccessToken, generateRefreshToken } from '../config/jwt';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create user
    const user = await createUser({ email, password, name });

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info({ userId: user.id, email: user.email }, 'User registered');

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    logger.info({ userId: user.id, email: user.email }, 'User logged in');

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Import verifyRefreshToken dynamically to avoid circular dependency issues
    const { verifyRefreshToken, generateAccessToken: generateNewAccessToken } = await import(
      '../config/jwt'
    );

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateNewAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

