export type TimePhase = 'Morning' | 'Afternoon' | 'Night';

export interface TimeData {
    phase: TimePhase;
    hour: number;
    icon: string;
}

export function getCurrentTimeData(): TimeData {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 14) {
        return { phase: 'Morning', hour, icon: 'wb_twilight' };
    } else if (hour >= 14 && hour < 20) {
        return { phase: 'Afternoon', hour, icon: 'light_mode' };
    } else {
        return { phase: 'Night', hour, icon: 'dark_mode' };
    }
}
