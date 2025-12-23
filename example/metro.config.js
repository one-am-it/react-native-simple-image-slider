const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');
const modules = Object.keys({ ...pak.peerDependencies });

const defaultConfig = getDefaultConfig(__dirname);

// Simple regex escape function to replace escape-string-regexp
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    ...defaultConfig,

    projectRoot: __dirname,
    watchFolders: [root],

    // We need to make sure that only one version is loaded for peerDependencies
    // So we block them at the root, and alias them to the versions in example's node_modules
    resolver: {
        ...defaultConfig.resolver,

        blockList: modules
            .map((m) => new RegExp(`^${escapeRegExp(path.join(root, 'node_modules', m))}\\/.*$`))
            .concat(defaultConfig.resolver.blockList),

        extraNodeModules: modules.reduce((acc, name) => {
            acc[name] = path.join(__dirname, 'node_modules', name);
            return acc;
        }, {}),
    },
};

module.exports = config;
