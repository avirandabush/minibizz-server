export function safeParse<T>(jsonString: string, fallback: T): T {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return fallback;
    }
}