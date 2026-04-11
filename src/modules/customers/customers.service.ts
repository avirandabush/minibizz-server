import { prisma } from '../../config/prisma'
import { AppError } from '../../utils/appError'
import { safeParse } from '../../utils/safeJson'

function parseCustomerFields(customer: any) {
    if (!customer) return null;

    return {
        ...customer,
        personal: safeParse(customer.personal, { name: '' }),
        contact: safeParse(customer.contact, {}),
        stats: safeParse(customer.stats, {
            totalVisits: 0,
            totalSpent: 0,
            averageTicket: 0,
        }),
    }
}

export async function getCustomers(userId: string) {
    const customers = await prisma.customer.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    return customers.map(parseCustomerFields)
}

export async function getCustomer(userId: string, id: string) {
    const customer = await prisma.customer.findFirst({
        where: { id, userId },
    })

    if (!customer) throw new AppError(404, 'Customer not found')

    return parseCustomerFields(customer)
}

export async function createCustomer(userId: string, data: any) {
    const newCustomer = await prisma.customer.create({
        data: {
            userId,
            personal: JSON.stringify(data.personal || {}),
            contact: JSON.stringify(data.contact || {}),
            stats: JSON.stringify(data.stats || {
                totalVisits: 0,
                totalSpent: 0,
                averageTicket: 0,
            }),
            leadSource: data.leadSource,
            isActive: data.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    return parseCustomerFields(newCustomer)
}

export async function updateCustomer(userId: string, id: string, data: any) {
    const result = await prisma.customer.updateMany({
        where: { id, userId },
        data: {
            personal: data.personal ? JSON.stringify(data.personal) : undefined,
            contact: data.contact ? JSON.stringify(data.contact) : undefined,
            stats: data.stats ? JSON.stringify(data.stats) : undefined,
            leadSource: data.leadSource,
            isActive: data.isActive,
            updatedAt: new Date(),
        },
    })

    if (result.count === 0) throw new AppError(404, 'Customer not found')

    const updated = await prisma.customer.findUnique({ where: { id } })
    return parseCustomerFields(updated)
}

export async function deleteCustomer(userId: string, id: string) {
    const result = await prisma.customer.deleteMany({
        where: { id, userId },
    })

    if (result.count === 0) throw new AppError(404, 'Customer not found')
}