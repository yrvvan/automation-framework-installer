#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define framework repositories
const frameworkRepos = {
    cypress: 'https://github.com/yrvvan/automation-web-cypress-ci.git',
    playwright: 'https://github.com/yrvvan/automation-web-playwright.git',
    mocha: 'https://github.com/yrvvan/automation-api-mocha-ci.git',
    cucumber: 'https://github.com/yrvvan/automation-api-cucumber-ci.git',
    selenium: 'https://github.com/yrvvan/automation-web-selenium-cucumber-ci.git',
    godog: 'https://github.com/yrvvan/automation-api-godog.git',
    webdriverio: 'https://github.com/yrvvan/automation-apps-appium-webdriverIO.git',
    pytest: 'https://github.com/yrvvan/automation-api-pytest-ci.git',
    behave: 'https://github.com/yrvvan/automation-web-api-behave.git'
};

// Define optional reporting dependencies

async function runInstaller() {
    const { framework } = await inquirer.prompt([
        {
            type: 'list',
            name: 'framework',
            message: 'Choose one framework to clone and install:',
            choices: Object.keys(frameworkRepos),
        }
    ]);

    const repoUrl = frameworkRepos[framework];
    const targetDir = `./${framework}`;

    // Clone the selected framework repo
    if (fs.existsSync(targetDir)) {
        console.log(`Directory ${targetDir} already exists. Remove it or choose a different name.`);
        process.exit(1);
    }

    console.log(`Cloning ${framework} project from ${repoUrl}...`);
    execSync(`git clone ${repoUrl} ${targetDir}`, { stdio: 'inherit' });

    // Install dependencies
    if (framework === 'pytest' || framework === 'behave') {
        console.log(`Installing dependencies for ${framework}...`);
        execSync(`cd ${targetDir} && pip install -r requirements.txt`, { stdio: 'inherit', shell: true });
    } else if (framework === 'godog'){
        console.log(`Installing dependencies for ${framework}...`);
        execSync(`cd ${targetDir} && go mod init godog && go mod tidy`, { stdio: 'inherit', shell: true });
    } else {
        console.log(`Installing dependencies for ${framework}...`);
        execSync(`cd ${targetDir} && npm install`, { stdio: 'inherit', shell: true });
    }

    // Extra: Playwright binary install
    if (framework === 'playwright') {
        console.log('Installing Playwright browsers...');
        execSync(`cd ${targetDir} && npx playwright install`, { stdio: 'inherit', shell: true });
    }

    console.log('\n✅ Setup complete!');
    console.log(`➡ Navigate to your project: cd ${targetDir}`);
    console.log('➡ Run your tests as per the project README.');
}

runInstaller();
