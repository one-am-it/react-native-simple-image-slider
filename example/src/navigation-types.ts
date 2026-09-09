import type { PhotoSource } from './photos';

type RootStackParamList = {
    Home: undefined;
    Photo: { index: number; count: number; source: PhotoSource };
};

export type { RootStackParamList };
