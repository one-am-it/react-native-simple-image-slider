import type { SliderItem } from '@one-am/react-native-simple-image-slider';

type PhotoSource = 'bundled' | 'remote';

// Metro resolves `require` statically, so the paths cannot be built in a loop.
const bundledSources = [
    require('../assets/photos/1.jpg'),
    require('../assets/photos/2.jpg'),
    require('../assets/photos/3.jpg'),
    require('../assets/photos/4.jpg'),
    require('../assets/photos/5.jpg'),
    require('../assets/photos/6.jpg'),
    require('../assets/photos/7.jpg'),
    require('../assets/photos/8.jpg'),
    require('../assets/photos/9.jpg'),
    require('../assets/photos/10.jpg'),
    require('../assets/photos/11.jpg'),
    require('../assets/photos/12.jpg'),
    require('../assets/photos/13.jpg'),
    require('../assets/photos/14.jpg'),
    require('../assets/photos/15.jpg'),
];

/**
 * A set of `count` photos.
 *
 * The bundled photos cycle to fill a longer set, so a repeat says nothing about where the pager
 * landed — the grid's index badge is what tells one from another.
 */
function photoSet(count: number, source: PhotoSource): SliderItem[] {
    return Array.from({ length: count }, (_, index) =>
        source === 'remote'
            ? {
                  key: `remote-${index + 1}`,
                  source: { uri: `https://picsum.photos/seed/${index + 1}/800/600` },
              }
            : {
                  key: `bundled-${index + 1}`,
                  source: bundledSources[index % bundledSources.length],
              }
    );
}

const bundledPhotos = photoSet(bundledSources.length, 'bundled');
const remotePhotos = photoSet(30, 'remote');

export type { PhotoSource };
export { bundledPhotos, photoSet, remotePhotos };
