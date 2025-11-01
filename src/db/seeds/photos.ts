import { db } from '@/db';
import { photos } from '@/db/schema';

async function main() {
    const samplePhotos = [
        {
            userId: 'user_001',
            imageUrl: '/uploads/photos/selfie-001.jpg',
            shareToken: 'abc123def',
            filters: JSON.stringify({
                brightness: 1.2,
                contrast: 1.0,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([
                { type: 'sticker', id: 'heart', x: 120, y: 180 }
            ]),
            createdAt: new Date('2024-12-15T10:30:00').toISOString(),
        },
        {
            userId: 'user_002',
            imageUrl: '/uploads/photos/group-photo-002.jpg',
            shareToken: 'xyz789ghi',
            filters: JSON.stringify({
                brightness: 1.0,
                contrast: 1.0,
                grayscale: false,
                sepia: true
            }),
            overlays: JSON.stringify([]),
            createdAt: new Date('2024-12-18T14:45:00').toISOString(),
        },
        {
            userId: 'user_001',
            imageUrl: '/uploads/photos/couple-photo-003.jpg',
            shareToken: 'qwe456rty',
            filters: JSON.stringify({
                brightness: 1.1,
                contrast: 1.2,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([]),
            createdAt: new Date('2024-12-20T16:20:00').toISOString(),
        },
        {
            userId: 'user_003',
            imageUrl: '/uploads/photos/portrait-004.jpg',
            shareToken: 'mno789pqr',
            filters: JSON.stringify({
                brightness: 0.9,
                contrast: 1.0,
                grayscale: true,
                sepia: false
            }),
            overlays: JSON.stringify([
                { type: 'sticker', id: 'star', x: 200, y: 100 }
            ]),
            createdAt: new Date('2024-12-22T09:15:00').toISOString(),
        },
        {
            userId: 'user_002',
            imageUrl: '/uploads/photos/friends-005.jpg',
            shareToken: 'stu123vwx',
            filters: JSON.stringify({
                brightness: 1.1,
                contrast: 1.05,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([
                { type: 'sticker', id: 'heart', x: 150, y: 200 },
                { type: 'sticker', id: 'smiley', x: 300, y: 180 }
            ]),
            createdAt: new Date('2024-12-25T18:30:00').toISOString(),
        },
        {
            userId: 'user_003',
            imageUrl: '/uploads/photos/selfie-006.jpg',
            shareToken: 'def456ghi',
            filters: JSON.stringify({
                brightness: 1.0,
                contrast: 1.0,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([
                { type: 'text', id: 'caption', x: 50, y: 400, content: 'Happy Holidays!' }
            ]),
            createdAt: new Date('2024-12-28T12:00:00').toISOString(),
        },
        {
            userId: 'user_001',
            imageUrl: '/uploads/photos/party-007.jpg',
            shareToken: 'jkl789mno',
            filters: JSON.stringify({
                brightness: 1.3,
                contrast: 1.1,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([
                { type: 'sticker', id: 'confetti', x: 100, y: 50 },
                { type: 'sticker', id: 'confetti', x: 350, y: 80 }
            ]),
            createdAt: new Date('2025-01-01T23:45:00').toISOString(),
        },
        {
            userId: 'user_002',
            imageUrl: '/uploads/photos/headshot-008.jpg',
            shareToken: 'pqr012stu',
            filters: JSON.stringify({
                brightness: 1.0,
                contrast: 1.15,
                grayscale: false,
                sepia: false
            }),
            overlays: JSON.stringify([]),
            createdAt: new Date('2025-01-05T11:30:00').toISOString(),
        }
    ];

    await db.insert(photos).values(samplePhotos);
    
    console.log('✅ Photos seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});