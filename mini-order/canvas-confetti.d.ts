declare module 'canvas-confetti' {
    interface ConfettiOptions {
        angle?: number;
        spread?: number;
        startVelocity?: number;
        elementCount?: number;
        decay?: number;
        gravity?: number;
        ticks?: number;
        origin?: { x?: number; y?: number };
        colors?: string[];
        scalar?: number;
        disableForReducedMotion?: boolean;
        zIndex?: number;
        particleCount: number;
    }
    export default function confetti(options?: ConfettiOptions): void
}