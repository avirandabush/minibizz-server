import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { safeParse } from '../../utils/safeJson';

function parsePaymentFields(payment: any) {
  if (!payment) return null;
  return {
    ...payment,
    items: safeParse(payment.items, []),
    summary: safeParse(payment.summary, { subtotal: 0, discount: 0, total: 0 }),
  };
}

function generateReferenceNumber() {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PAY-${datePart}-${randomPart}`;
}

export async function getPayments(userId: string) {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
  return payments.map(parsePaymentFields);
}

export async function getPaymentById(userId: string, id: string) {
  const payment = await prisma.payment.findFirst({
    where: { id, userId },
  });
  return parsePaymentFields(payment);
}

export async function createPayment(userId: string, data: any) {
  const newPayment = await prisma.payment.create({
    data: {
      userId,
      customerId: data.customerId,
      items: JSON.stringify(data.items || []),
      summary: JSON.stringify(data.summary || { subtotal: 0, discount: 0, total: 0 }),
      method: data.method,
      status: data.status || 'PENDING',
      date: new Date(data.date),
      referenceNumber: generateReferenceNumber(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return parsePaymentFields(newPayment);
}

export async function updatePayment(userId: string, id: string, data: any) {
  const result = await prisma.payment.updateMany({
    where: { id, userId },
    data: {
      customerId: data.customerId,
      items: data.items ? JSON.stringify(data.items) : undefined,
      summary: data.summary ? JSON.stringify(data.summary) : undefined,
      method: data.method,
      status: data.status,
      date: data.date ? new Date(data.date) : undefined,
      updatedAt: new Date(),
    },
  });

  if (result.count === 0) throw new AppError(404, 'Payment not found');
  const updated = await prisma.payment.findUnique({ where: { id } });
  return parsePaymentFields(updated);
}

export async function updatePaymentStatus(userId: string, id: string, status: string) {
  const result = await prisma.payment.updateMany({
    where: { id, userId },
    data: {
      status,
      updatedAt: new Date()
    },
  });

  if (result.count === 0) throw new AppError(404, 'Payment not found');

  const updated = await prisma.payment.findUnique({ where: { id } });
  return parsePaymentFields(updated);
}