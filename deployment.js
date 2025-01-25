import fs from 'fs';

(() => {
    const env = fs.readFileSync('.env', 'utf8');
    fs.writeFileSync('./server/.env', env);
    console.log('env copied to server');
    process.exit();
})();