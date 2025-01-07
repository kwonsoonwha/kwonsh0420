export class ResourceSystem {
    private minerals: number;
    private gas: number;
    private supply: number;
    private maxSupply: number;

    constructor() {
        this.minerals = 50;
        this.gas = 0;
        this.supply = 0;
        this.maxSupply = 10;
    }

    init(): void {
        console.log('Resource system initialized');
    }

    update(): void {
        // Resource update logic
    }

    canAfford(mineralCost: number, gasCost: number): boolean {
        return this.minerals >= mineralCost && this.gas >= gasCost;
    }

    spend(minerals: number, gas: number): void {
        this.minerals -= minerals;
        this.gas -= gas;
    }
}
