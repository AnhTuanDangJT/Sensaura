export async function parseError(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as { error?: string };
        return data.error || res.statusText;
    } catch {
        return res.statusText;
    }
}
