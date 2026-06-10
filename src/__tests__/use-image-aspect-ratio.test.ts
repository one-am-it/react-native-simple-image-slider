import { toUseImageSource } from '../hooks/use-image-aspect-ratio';

jest.mock('expo-image', () => ({ useImage: jest.fn(() => null) }));

describe('toUseImageSource', () => {
    it('returns undefined for null', () => {
        expect(toUseImageSource(null)).toBeUndefined();
    });

    it('returns undefined for undefined', () => {
        expect(toUseImageSource(undefined)).toBeUndefined();
    });

    it('returns undefined for an array source', () => {
        expect(toUseImageSource([{ uri: 'https://example.com/a.jpg' }])).toBeUndefined();
    });

    it('returns undefined for a SharedRef (nativeRefType present)', () => {
        const sharedRef = { nativeRefType: 'image' } as never;
        expect(toUseImageSource(sharedRef)).toBeUndefined();
    });

    it('returns the source unchanged for a plain URI object', () => {
        const source = { uri: 'https://example.com/a.jpg' };
        expect(toUseImageSource(source)).toBe(source);
    });

    it('returns the source unchanged for a numeric local asset', () => {
        expect(toUseImageSource(42)).toBe(42);
    });

    it('returns the source unchanged for a string URI', () => {
        expect(toUseImageSource('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
    });
});
