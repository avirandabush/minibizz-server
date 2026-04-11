import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { safeParse } from '../../utils/safeJson';

function parseTreatmentFields(treatment: any) {
  if (!treatment) return null;
  return {
    ...treatment,
    specs: safeParse(treatment.specs, { price: 0, durationMinutes: 0 }),
  };
}

export async function getTreatments(userId: string) {
  const treatments = await prisma.treatment.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  return treatments.map(parseTreatmentFields);
}

export async function createTreatment(userId: string, data: any) {
  const newTreatment = await prisma.treatment.create({
    data: {
      userId,
      name: data.name,
      description: data.description || '',
      isFavorite: data.isFavorite ?? false,
      isActive: data.isActive ?? true,
      specs: JSON.stringify({
        price: data.specs.price,
        durationMinutes: data.specs.durationMinutes,
        bufferMinutes: data.specs.bufferMinutes || 0
      }),
      color: data.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return parseTreatmentFields(newTreatment);
}

export async function updateTreatment(userId: string, id: string, data: any) {
  const result = await prisma.treatment.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      description: data.description,
      isFavorite: data.isFavorite,
      isActive: data.isActive,
      specs: data.specs ? JSON.stringify(data.specs) : undefined,
      color: data.color,
      updatedAt: new Date(),
    },
  });

  if (result.count === 0) throw new AppError(404, 'Treatment not found');

  const updated = await prisma.treatment.findUnique({ where: { id } });
  return parseTreatmentFields(updated);
}

export async function deleteTreatment(userId: string, id: string) {
  const result = await prisma.treatment.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) throw new AppError(404, 'Treatment not found');
}