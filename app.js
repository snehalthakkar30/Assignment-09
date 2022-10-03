const express = require('express')
const app = express()
const port = 3000



app.get('/', (req, res) => {
  res.send('Hello World! I am Snehal Manish Thakkar. This is a simple NodeJS Server Application!')
})

app.listen(port, () => {
  console.log(`Application is listening on port ${port}`)
})