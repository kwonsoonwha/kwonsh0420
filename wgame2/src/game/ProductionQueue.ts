export class ProductionQueue {
    private queue: Array<{
        type: string;
        remainingTime: number;
        totalTime: number;
    }> = [];
    private maxSize: number = 5;

    update(): string | null {
        if (this.queue.length === 0) return null;

        const current = this.queue[0];
        current.remainingTime -= 16.67;  // 약 60fps

        if (current.remainingTime <= 0) {
            this.queue.shift();  // 첫 번째 항목 제거
            return current.type;
        }

        return null;
    }

    addToQueue(type: string, productionTime: number): boolean {
        if (this.queue.length < this.maxSize) {
            this.queue.push({
                type,
                remainingTime: productionTime,
                totalTime: productionTime
            });
            return true;
        }
        return false;
    }

    isFull(): boolean {
        return this.queue.length >= this.maxSize;
    }

    getProgress(): number {
        if (this.queue.length === 0) return 0;
        const current = this.queue[0];
        return 1 - (current.remainingTime / current.totalTime);
    }
} 