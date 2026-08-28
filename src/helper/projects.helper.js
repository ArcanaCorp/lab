export async function parseResponse(response) {

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            error: text,
        };
    }
}