export class ProductionQueue {
    private queue: { type: string; timeRemaining: number }[] = [];
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    addToQueue(unitType: string, productionTime: number): boolean {
        if (this.queue.length >= this.maxSize) {
            return false;
        }

        this.queue.push({
            type: unitType,
            timeRemaining: productionTime
        });
        
        console.log(`Added ${unitType} to production queue`);  // 디버그 로그
        return true;
    }

    update(): string | null {
        if (this.queue.length === 0) {
            return null;
        }

        const currentItem = this.queue[0];
        currentItem.timeRemaining--;

        if (currentItem.timeRemaining <= 0) {
            this.queue.shift();  // 첫 번째 아이템 제거
            console.log(`${currentItem.type} production completed`);  // 디버그 로그
            return currentItem.type;
        }

        return null;
    }

    getQueue(): { type: string; timeRemaining: number }[] {
        return [...this.queue];  // 큐의 복사본 반환
    }

    clear(): void {
        this.queue = [];
    }

    isFull(): boolean {
        return this.queue.length >= this.maxSize;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
} 