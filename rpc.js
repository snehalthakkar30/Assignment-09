const express = require('express')
const { exec } = require("child_process");
const app = express()
const port = 3000



app.get('/', (req, res) => {
    exec('open .', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    }); 
  })

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`)
})
