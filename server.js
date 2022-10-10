const express = require('express')
const app = express()
const port = 3001
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    connectionLimit: 100
});
const url = "https://s1zg1hvmnf.execute-api.us-east-2.amazonaws.com/prod/say?keyword=";


const options = {
    swaggerDefinition: {
      info: {
        title: 'SWAGGERRESTAPI_MariaDB',
        version: '1.0.0',
        description: 'Demonstrate REST APIs with SWAGGER and MariaDb'
      },
      host: '198.199.68.18:3001',
      basePath: '/'
    },
    apis: ['./server.js'],
  };
  const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(express.urlencoded()); 
app.use(upload.array());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello! Please extend this with /agents or /company or /customer')

  })

  app.get('/say',(req, res) => {
    axios.get(url + req.query.keyword)
    .then(function (response) {
      // If Successful
      res.end(JSON.stringify(response.data));
    })
    .catch(function (error) {
      // Handle the  errors
      console.log(error);
    })
    .then(function () {
      // Execute anyways
    });
  });

  async function main() {
    let conn;

    try {
       conn = await fetchConn();
    } catch (err) {
       // Manage Errors
       console.log(err);
    } finally {
       // Close Connection
       if (conn) conn.end();
    }
 }
 // Fetch Connection
async function fetchConn() {
    let conn = await pool.getConnection();
    return conn;
 }

/**
 * @swagger
 * /orders:
 *    get:
 *      summary: Return all agents
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all agents
 */
 app.get('/agents', async function(req,res){
    try {
        const sqlQuery = 'SELECT * from agents a where a.AGENT_CODE = \'A007  \'';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }

});

/**
 * @swagger
 * /company:
 *    get:
 *      summary: Return all companies
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all companies
 */
app.get('/company', async function(req,res){
    try {
        const sqlQuery = 'SELECT * from company';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }

});

/**
 * @swagger
 * /customers:
 *    get:
 *      summary: Get all customers
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Array of objects containing all customer records
 */
app.get('/customers', async function(req,res){
    try {
        const sqlQuery = 'SELECT * from customer';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }

});


/**
 * @swagger
 * /agent:
 *    put:
 *      summary: Updates a existing record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: WORKING_AREA
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COMMISSION
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: PHONE_NO
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COUNTRY
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully updated the record
 *          500:
 *              description: Internal Server Error, Could not update the record.
 */
 app.put('/agent', function(req,res){
    pool.getConnection()
    .then(conn => {
      let sql ="UPDATE agents a SET  a.AGENT_NAME = ?, a.WORKING_AREA = ?, a.COMMISSION = ?, a.PHONE_NO = ?, a.COUNTRY = ? WHERE a.AGENT_CODE = ?";
      let values = [req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY, req.body.AGENT_CODE];
      conn.query(sql, values)
        .then(result => {
          res.json({
            status: 200,
            message: "Successfully updated the record."
          });
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
          if (err) {
            res.json({
              status: 500,
              message: "Could not update the record. Error Code:" + err.code
            });
          }
        });
    })
    .catch(err => {
    });
  });


  /**
 * @swagger
 * /agent:
 *    post:
 *      summary: Insert a new record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: WORKING_AREA
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COMMISSION
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: PHONE_NO
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: COUNTRY
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully new agent is inserted!!
 *          500:
 *              description: Internal Server Error, Could not insert new record.
 */
app.post('/agent', function(req,res){
   
    pool.getConnection()
      .then(conn => {
        let sql ="insert into agents a (a.AGENT_CODE, a.AGENT_NAME, a. WORKING_AREA, a.COMMISSION, a.PHONE_NO, a.COUNTRY) values (?)";
        let values = [req.body.AGENT_CODE, req.body.AGENT_NAME, req.body.WORKING_AREA,req.body.COMMISSION,req.body.PHONE_NO,req.body.COUNTRY];
        conn.query(sql, [values])
        .then(result => {
          res.json({
            status: 200,
            message: "Successfully inserted new record."
          });
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
          if (err) {
            res.json({
              status: 500,
              message: "Could not insert new record. Error Code:" + err.code
            });
          }
        });
      })
      .catch(err => {
      });
    });



    /**
 * @swagger
 * /agent:
 *    patch:
 *      summary: Patches a existing record for agent
 *      parameters:
 *        - in: formData
 *          name: AGENT_CODE
 *          schema:
 *            type: string
 *          required: true
 *        - in: formData
 *          name: AGENT_NAME
 *          schema:
 *            type: string
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully patched the record
 *          500:
 *              description: Internal Server Error, Could not patch the record.
 */
 app.patch('/agent', function(req,res){
    pool.getConnection()
    .then(conn => {
      let sql ="UPDATE agents ag SET ag.AGENT_NAME = ? WHERE AGENT_CODE = ?";
      let values = [req.body.AGENT_NAME, req.body.AGENT_CODE];
      conn.query(sql, values)
        .then(result => {
          res.json({
            status: 200,
            message: "Successfully updated the agent data."
          });
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
          if (err) {
            res.json({
              status: 500,
              message: "Could not update the agent data. Error Code:" + err.code
            });
          }
        });
    })
    .catch(err => {
    });
  });


/**
 * @swagger
 * /agent/{id}:
 *    delete:
 *      summary: Deletes an agent record for matching id
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully deleted the record
 *          500:
 *              description: Internal Server Error, Could not delete the record.
 */
 app.delete('/agent/:id', function (req, res) {
    pool.getConnection()
      .then(conn => {
        let sql = "DELETE FROM agents a WHERE a.AGENT_CODE = ?";
        conn.query(sql, req.params.id)
          .then(result => {
            res.json({
              status: 200,
              message: "Successfully deleted the record."
            });
            conn.end();
          })
          .catch(err => {
            console.log(err);
            conn.end();
            if (err) {
              res.json({
                status: 500,
                message: "Could not delete the record. Error Code:" + err.code
              });
            }
          });
      })
      .catch(err => {
      });
  });


  app.listen(port, () => {
    main();
    console.log(`Application is listening on port ${port}`)
  })


