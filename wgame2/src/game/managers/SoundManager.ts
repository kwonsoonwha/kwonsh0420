export class SoundManager {
    private sounds: Map<string, HTMLAudioElement>;
    private volume: number = 0.5;
    private muted: boolean = false;

    constructor() {
        this.sounds = new Map();
        this.loadSounds();
    }

    private loadSounds(): void {
        // 임시 사운드 효과 (짧은 비프음)
        const attackSound = new Audio();
        attackSound.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA';
        
        const hitSound = new Audio();
        hitSound.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA';
        
        const deathSound = new Audio();
        deathSound.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA';

        this.sounds.set('marine_attack', attackSound);
        this.sounds.set('marine_hit', hitSound);
        this.sounds.set('marine_death', deathSound);
    }

    play(name: string): void {
        if (this.muted) return;

        const sound = this.sounds.get(name);
        if (sound) {
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = this.volume;
            clone.play().catch(error => console.log('Sound play error:', error));
        }
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.volume;
        });
    }

    getVolume(): number {
        return this.volume;
    }

    toggleMute(): void {
        this.muted = !this.muted;
        this.sounds.forEach(sound => {
            sound.muted = this.muted;
        });
    }

    isMuted(): boolean {
        return this.muted;
    }
} 