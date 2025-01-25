import fs from 'fs';


(() => {

    //print all files in the current directory
    fs.readdirSync(process.cwd()).forEach(file => {
        console.log(file);
    });
    // print working directory
    console.log(process.cwd());

    const env = fs.readFileSync(`${process.cwd()}/.env`, 'utf8');
    fs.writeFileSync('./server/.env', env);
    console.log('env copied to server');
        
    process.exit();
})();