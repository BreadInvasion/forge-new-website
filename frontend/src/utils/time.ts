export function convHM(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
}

export function formatTime(time: Date): string {
    return time.toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}

export function getTimeOffset(time: Date, offsetMs: number): Date {
    return new Date(time.getTime() + offsetMs * 1000);
}

export function getProgress(startTime: Date | undefined, usageDuration: number | undefined): number {
    if (!startTime || !usageDuration) return 0;
    const start = startTime.getTime(); 
    const end = getTimeOffset(startTime, usageDuration).getTime();
    const now = new Date().getTime();
    const progress = (now - start) / (end - start);
    return Math.min(100, Math.max(0, progress * 100));
}