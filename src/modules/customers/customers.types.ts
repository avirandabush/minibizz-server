export type CustomerDTO = {
    id: string
    userId: string

    personal: {
        name: string
        birthDate?: string
        notes?: string
        medicalNotes?: string
    }

    contact: {
        phone?: string
        alternatePhone?: string
        email?: string
        address?: string
    }

    stats: {
        lastVisit?: string
        totalVisits: number
        totalSpent: number
        averageTicket: number
    }

    leadSource: string
    isActive: boolean

    createdAt: string
    updatedAt: string
}