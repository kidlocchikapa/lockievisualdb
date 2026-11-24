import * as crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derived}`;
}

export async function comparePassword(password: string, stored: string): Promise<boolean> {
    if (!stored || !stored.includes(':')) return false;
    const [salt, hash] = stored.split(':');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
    } catch {
        return false;
    }
}