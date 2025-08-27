import NodeCache from 'node-cache';

class CacheService {
    private cache: NodeCache;

    constructor() {
        // Cache por 5 minutos (300 segundos)
        this.cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
    }

    get(key: string): any {
        return this.cache.get(key);
    }

    set(key: string, value: any, ttl?: number): boolean {
        return this.cache.set(key, value, ttl);
    }

    del(key: string): number {
        return this.cache.del(key);
    }

    flush(): void {
        this.cache.flushAll();
    }

    // Limpa cache relacionado a veículos
    clearVehicleCache(): void {
        const keys = this.cache.keys();
        const vehicleKeys = keys.filter(key => key.startsWith('vehicles:'));
        this.cache.del(vehicleKeys);
    }
}

export default new CacheService();