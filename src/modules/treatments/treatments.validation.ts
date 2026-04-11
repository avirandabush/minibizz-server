const VALID_COLORS = ['BLUE', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'YELLOW', 'GRAY', 'PINK'];

export function validateTreatment(body: any) {
    if (!body.name || body.name.trim() === '') return 'שם טיפול הוא שדה חובה';
    if (body.name.length > 50) return 'שם הטיפול ארוך מדי';

    if (!body.specs || typeof body.specs.price !== 'number' || body.specs.price < 0) {
        return 'מחיר תקין הוא שדה חובה';
    }

    if (typeof body.specs.durationMinutes !== 'number' || body.specs.durationMinutes <= 0) {
        return 'משך טיפול תקין הוא שדה חובה';
    }

    if (!body.color || !VALID_COLORS.includes(body.color)) {
        return 'צבע לא תקין';
    }

    return null;
}