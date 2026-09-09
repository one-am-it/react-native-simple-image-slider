# Changelog

## [1.0.0](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.7...v1.0.0) (2026-09-09)

### ♻️ Refactors

* one component per file in the example, keep the inline slide tree stable ([e275ff8](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e275ff878c89836f522b38316c41d515bef7aa4f))

### 📝 Documentation

* the two pinch callbacks, and the FlashList versions that mispark ([b10f1bc](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/b10f1bcab0a4776523fc88a8df1375433beb7ee1))

### 🐛 Fixes

* report the frame that settles back on rest ([de364ec](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/de364ec2b98578c0c5b6821d2d7a690f51da954d))
* wrap a slide in a Pressable only when a tap has somewhere to go ([da16f82](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/da16f82605d4a25658e93011891761cfa7710da0))

### 🧪 Tests

* **example:** a Carousel and a Gallery that both open a photo full screen ([9992680](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/9992680a672d73ddcfda00e22e3f63fcf3347a7a)), closes [Shopify/flash-list#2307](https://git.oneam.it/Shopify/flash-list/issues/2307)

## [1.0.0-beta.7](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2026-06-11)

### ⚙️ CI/CD

* fix lefthook ([e1cb3a6](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e1cb3a69b62fc537a9b85a213f49847fe83913a7))
* fix tests ([ca7d52b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/ca7d52b417593ebe0983d212bae10d64e91b6e56))

### ✨ Features

* upgrade example project to expo 56 and require react-native >=0.83 ([91305b9](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/91305b962c706605b198b15d705ed8d7c3a93862))

### 🐛 Fixes

* add test stage to CI pipeline for running unit tests ([a896a84](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/a896a840d0f4afc28d517b5b851bbbd714e7e80a))
* avoid rendering all images on non fullscreen sliders ([7f92c7b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/7f92c7b83a5fc48b19d1a8017f63cd14f64ad7f6))
* ensure images width fallback to container width if not strictly positive ([d9cd89c](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/d9cd89cbea7a33f81db2a9e13737918ff5cd4132))
* improve image source handling in useImageAspectRatio hook to handle all expo-image sources ([6afeb53](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/6afeb5370041123cdd08c84de5d438603e48bfcc))
* move image render gate to SliderContent and guard measureWindowSize fallback ([81f9c2c](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/81f9c2c55dfa4200ca9ba081ae4c4666b1bc29f2))
* use useEffectLayout effect to measure slider width ([2514808](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/2514808227140dcfa02970f568f05f7868faa672))

### 🧪 Tests

* add unit tests for burst-load fix and set up test infrastructure ([7ea15aa](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/7ea15aae697a88f053504c33bf247b293b9c37bb))
* add unit tests for SliderContent component to validate rendering logic ([e0f357f](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e0f357fbd306bc1683ff26dccf1200ebe45324e2))

### 🧹 Chores

* setup demo app with remote images ([f78ea2b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/f78ea2b298c0e99358a9cdd3e46cf8fabddc957c))

## [1.0.0-beta.6](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2025-12-23)

### 🐛 Fixes

* add missing source field in package.json ([56a1cb9](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/56a1cb911d271bdf857bf4fcad1af4504570ad48))

### 📝 Documentation

* move FullScreenSlider outside of Slider ([21206f9](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/21206f9fad51667320c91e11c3d8e77182467748))

## [1.0.0-beta.5](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2025-12-23)

### ✨ Features

* separate SliderProvider and Slider for maximum flexibility ([0f77652](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/0f77652177d6130150f588c4029e3e36440dd3f8))

## [1.0.0-beta.4](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2025-12-23)

### ⚙️ CI/CD

* upgrade release-it ([065efc3](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/065efc3b5b0264d5861f8d9159632906af83a1fd))

* ci: update pipeline (596b89e)

## [1.0.0-beta.3](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2025-12-23)

### ⚙️ CI/CD

* update pipeline ([596b89e](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/596b89eba3f7db7874e03bbce1c618809f89b311))

## [1.0.0-beta.2](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2025-12-23)

### ⚙️ CI/CD

* update package.json and pipeline ([b29b1bf](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/b29b1bfd08abb50a093d7e02104411f72f46eecd))

## [1.0.0-beta.1](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v0.16.0...v0.16.1) (2025-12-23)

### ⚙️ CI/CD

* add publish job ([5b93a98](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/5b93a988ab5e53a85419c87398f71e28e720d5c7))
* change release-it config ([13d6b6d](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/13d6b6d676c573daa6495ae0b91154f99c96b9c8))

### 📝 Documentation

* add CLAUDE.md ([3f88d1f](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/3f88d1f87e0e4b9f0952a1ed55fa32b5fa3d25ba))
* add migration steps ([6891332](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/6891332cc3deae81e89b4c9996867103dcf7f087))
* update CLAUDE.md ([5c065d8](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/5c065d8875a711928404259a3bba315e93e5c175))
* update CLAUDE.md ([774c694](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/774c6947e5a7588d44f0826dc5de6ae797f472ad))
* update README.md ([c9dd81b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/c9dd81b44abdf4e050f6b90220f6411455326078))

### ✨ Features

* adapt SliderDescription to new compositional pattern ([fe1c59f](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/fe1c59f052f209c73951bf5e9c1cf97f031adf2a))
* automatic aspect ratio detection ([cb35e80](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/cb35e80285c3ea6b0963b5c24b74534d5afa681b))
* extract public API into useSlider, rename old useSlider to useSliderContext ([00bbac1](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/00bbac1c10c5ab96debc4ad99bb76bb3ad29b30a))
* full screen slider now automatically registers ([6a8687e](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/6a8687e168e7a5310e3a970de750b1d58e355750))
* more customization, some bug fixes ([0a6d271](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/0a6d271bae5f1c5e23bae9631ceb6854db1cc016))
* new composition API ([16c9b39](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/16c9b39e27e77d1a5004b3769732f0d94b5f54fd))
* update packages, eslint, prettier and release-it configurations ([074400e](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/074400eb618c77ce953718618c7cd6b6a0e7cc47))
* upgrade flashlist usages for v2 ([35a385b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/35a385b8cfa1e5824ab175d22aeb43b63b0dd8b6))
* upgrade pinchtozoom to use reanimated v4 ([5e5c0af](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/5e5c0af772196d67c44ef9fb58d44d54f41f2c66))

### 🧹 Chores

* bump version to 1.0.0-beta.1 and specify minimum react, reanimated and flashlist versions ([dcf3715](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/dcf371533577d0effe550fe6e23f4d84aa2dea42))

### 🐛 Fixes

* add placeholder base64 source to avoid loading random files ([b4ce19b](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/b4ce19bc0bf355e461b5fd8ba5b4d16e0ac09673))
* add vertical dead zone to pan gesture when not zoomed ([2b7d620](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/2b7d6200c7523fd2e218376418177cc3d08d3bca))
* fix code smells ([2acdea2](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/2acdea2577c0040ace9830cdf91a855821101662))
* fix example project metro configuration ([e58c798](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e58c7984839bc7ad360397c02b007352197d1518))
* fix example project not running ([6e09b69](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/6e09b69f58dbaf5c8eca3edae3234ee834010414))
* fix full screen pan on android ([bec05f4](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/bec05f4846776e6297c4e0527ff48f9d806e9de1))
* fix full screen style ([1e59563](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/1e595632e1da75fef8e454c661233f65565b11f5))
* fix gestures ([fcac1be](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/fcac1be3347d60898c3b693eb3479cd7908f4aa7))
* fix hot reload resetting index ([17908df](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/17908dfc09177612e323fe347c110668e592840f))
* fix library exports ([6c91089](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/6c91089dce9d8b4a7c09b1994c21066a2fa47928))
* fix programmatic scrolling by removing scrollview ref overwrite ([1b6c08e](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/1b6c08ef4b0b9d4a9e8c38d9b9c291bf306b6cd7))
* fix tsconfig ([c856f46](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/c856f4615fd161aa73367ad9ce92e63713dfd205))
* make SliderEmpty use same aspect ratio ([60bae4e](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/60bae4e8f8b3bd375e499e6000e31087d6a9723b))
* sync background parent slider with active full screen slider ([e484d70](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e484d70a840c742accc267ed079c32aa88415fc3))

### ♻️ Refactors

* handle callbacks in a better way ([bb43626](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/bb436265f8f6793eb0635e560d9c8595c9a5b538))
* improved documentation, typing and naming ([143adbe](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/143adbea1f370c7f07e4408f9324f13a55f9b2a3))
* refactor hooks ([826ba62](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/826ba62b3fb53e16a045dc8c80d722e984d1da2c))
* refactor slider callbacks ([f7e612d](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/f7e612df52214cf5e94c783e72b66926dca78b11))
* refactor slider types ([7127254](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/712725414d13c8a33527a2aa12b25e4758c1a1ed))
* remove positioning logic from SliderPageCounter ([c642949](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/c6429493f529a81b19211080103aa1941acde8ba))
* reorganize exports, remove forwardRef usage ([3ebb9f5](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/3ebb9f5f132acc218a5db3d4cc60e4e22a890453))
## [0.16.1](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/compare/v0.16.0...v0.16.1) (2025-06-26)

### 🧹 Chores

* release 0.16.1 ([84de0fa](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/84de0fa92a02bb13b5f3c19c665ce306e8314cf9))

### 🐛 Fixes

* add .npmrc to choose correct registry ([e6747d4](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/e6747d4ca3524a8c9f508252fe7b32d06e2ba933))
* **BaseSimpleImageSlider:** allow both renderPageCounter and PageCounterComponent to be present ([927ac7a](https://git.oneam.it/one-am/libraries/react-native-simple-image-slider/commit/927ac7a9a24622b75009f62b9869e3f0d672b25c))
