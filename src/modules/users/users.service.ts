import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { safeParse } from '../../utils/safeJson';

function parseUserFields(user: any) {
  if (!user) return null;

  return {
    ...user,
    contact: safeParse(user.contact, {}),
    business: safeParse(user.business, {}),
    preferences: safeParse(user.preferences, { language: 'he', darkMode: false }),
  };
}

export async function syncUser(userId: string, data: any) {
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      lastLogin: new Date()
    },
    create: {
      id: userId,
      name: data.name,
      contact: JSON.stringify(data.contact || {}),
      business: JSON.stringify(data.business || {}),
      preferences: JSON.stringify(data.preferences || { language: 'he', darkMode: false }),
      plan: data.plan || 'SILVER',
      status: data.status || 'ACTIVE',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return parseUserFields(user);
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new AppError(404, 'User not found');
  return parseUserFields(user);
}

export async function updateProfile(userId: string, data: any) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      contact: data.contact ? JSON.stringify(data.contact) : undefined,
      business: data.business ? JSON.stringify(data.business) : undefined,
      preferences: data.preferences ? JSON.stringify(data.preferences) : undefined,
      updatedAt: new Date(),
    },
  });
  return parseUserFields(user);
}