interface CacheItem {
    value: any;
    expiry: number;
}

class SimpleCacheService {
    private cache: Map<string, CacheItem> = new Map();
    private defaultTTL: number = 300000; // 5 minutos em ms

    get(key: string): any {
        const item = this.cache.get(key);
        
        if (!item) {
            return undefined;
        }
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return undefined;
        }
        
        return item.value;
    }

    set(key: string, value: any, ttl?: number): boolean {
        const expiry = Date.now() + (ttl ? ttl * 1000 : this.defaultTTL);
        this.cache.set(key, { value, expiry });
        return true;
    }

    del(key: string): number {
        return this.cache.delete(key) ? 1 : 0;
    }

    flush(): void {
        this.cache.clear();
    }

    clearVehicleCache(): void {
        const keys = Array.from(this.cache.keys());
        const vehicleKeys = keys.filter(key => key.startsWith('vehicles:'));
        vehicleKeys.forEach(key => this.cache.delete(key));
    }

    // Limpeza automática de itens expirados
    private cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }

    constructor() {
        // Executa limpeza a cada 2 minutos
        setInterval(() => this.cleanup(), 120000);
    }
}

export default new SimpleCacheService();