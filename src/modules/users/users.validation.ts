export function validateUpdateProfile(body: any) {
    if (!body.name || body.name.trim() === '') return 'שם מלא הוא שדה חובה';
    if (body.name.length > 100) return 'השם ארוך מדי';

    if (!body.contact?.email) return 'אימייל הוא שדה חובה';
    if (body.contact?.phone && body.contact.phone.length > 20) return 'מספר טלפון לא תקין';

    if (body.business) {
        if (!body.business.name || body.business.name.trim() === '') return 'שם העסק הוא שדה חובה';
        if (body.business.name.length > 100) return 'שם העסק ארוך מדי';
    }

    return null;
}