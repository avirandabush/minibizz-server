export function validateCreatePayment(body: any) {
    if (!body.customerId) return 'חובה לבחור לקוח';
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) return 'חובה להוסיף לפחות טיפול אחד';

    for (const item of body.items) {
        if (!item.name || typeof item.price !== 'number' || !item.quantity) {
            return 'נתוני הטיפולים אינם תקינים';
        }
    }

    if (!body.method) return 'חובה לבחור אמצעי תשלום';
    if (!body.summary || typeof body.summary.total !== 'number') return 'חישוב הסכום לא תקין';
    if (!body.date) return 'תאריך הוא שדה חובה';

    return null;
}

export function validateUpdateStatus(body: any) {
    const validStatuses = ['PENDING', 'COMPLETED'];
    if (!body.status || !validStatuses.includes(body.status)) return 'סטטוס לא תקין';
    return null;
}