#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-undef
const rootPkgPath = path.resolve(__dirname, '../package.json');
// eslint-disable-next-line no-undef
const examplePkgPath = path.resolve(__dirname, '../example', 'package.json');

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
const examplePkg = JSON.parse(fs.readFileSync(examplePkgPath, 'utf-8'));

const peerDeps = rootPkg.peerDependencies || {};
const exampleDeps = examplePkg.dependencies || {};
const devDeps = rootPkg.devDependencies || {};

let updated = false;

const allDeps = new Set([
    ...Object.keys(peerDeps),
    ...Object.keys(exampleDeps),
]);

for (const dep of allDeps) {
    const version = exampleDeps[dep];
    if (!version) {
        console.warn(`⚠ Warning: ${dep} not found in example dependencies`);
        continue;
    }

    const isPeer = dep in peerDeps;
    const existsInDev = dep in devDeps;

    if (isPeer && (!existsInDev || devDeps[dep] !== version)) {
        rootPkg.devDependencies[dep] = version;
        updated = true;
        console.log(`✓ Synced peer ${dep}@${version} into devDependencies`);
    } else if (!isPeer && existsInDev && devDeps[dep] !== version) {
        rootPkg.devDependencies[dep] = version;
        updated = true;
        console.log(`✓ Updated non-peer ${dep}@${version} in devDependencies`);
    }
}

if (updated) {
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 4));
    console.log('✅ devDependencies updated successfully.');
} else {
    console.log('ℹ️ No changes made. Already in sync.');
}
