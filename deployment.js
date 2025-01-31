import fsPromise from 'fs/promises';


(async () => {
    try {
        const envFilePath = `${process.cwd()}/.env`;


        if(!(await fsPromise.stat(envFilePath)).isFile()) {
            console.error('No .env file found');
            process.exit(1);
        }

        const env = await fsPromise.readFile(envFilePath, 'utf8');
        await fsPromise.writeFile('./server/.env', env);
        
        console.log('Env file copied successfully');
    } catch (error) {
        console.error('Error copying env file', error);
        process.exit(1);
    }
})();