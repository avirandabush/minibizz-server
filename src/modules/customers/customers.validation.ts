export function validateCustomer(body: any) {
    if (!body.personal?.name || body.personal.name.trim() === '') return 'שם לקוח הוא שדה חובה';

    if (body.personal.name.length > 100) return 'השם ארוך מדי';
    if (body.personal.notes && body.personal.notes.length > 2000) return 'ההערה ארוכה מדי';
    if (body.personal.medicalNotes && body.personal.medicalNotes.length > 2000) return 'הערות רפואיות ארוכות מדי';

    if (body.contact && typeof body.contact !== 'object') return 'פורמט פרטי קשר לא תקין';
    if (body.contact?.phone && body.contact.phone.length > 20) return 'מספר טלפון ארוך מדי';
    if (body.contact?.alternatePhone && body.contact.alternatePhone.length > 20) return 'מספר טלפון חלופי ארוך מדי';
    if (body.contact?.email && body.contact.email.length > 100) return 'אימייל ארוך מדי';
    if (body.contact?.address && body.contact.address.length > 200) return 'כתובת ארוכה מדי';

    return null;
}