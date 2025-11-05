import { db } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string | null;
  default_sos_message?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  default_sos_message?: string;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const [user] = await db('users')
    .insert({
      email: data.email,
      password_hash: passwordHash,
      name: data.name,
    })
    .returning('*');
  return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db('users').where({ email }).first();
}

export async function findUserById(id: string): Promise<User | undefined> {
  return db('users').where({ id }).first();
}

export async function updateUser(id: string, data: UpdateUserData): Promise<User | undefined> {
  const [user] = await db('users')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}

