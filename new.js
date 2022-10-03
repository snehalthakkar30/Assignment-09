const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'mydb.com', 
     user:'myUser', 
     password: 'myPassword',
     connectionLimit: 5
});
async function asyncFunction(sqlQuery) {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query(sqlQuery);
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

app.get('/company', (req, res) => {
    try{
        const sqlQuery = 'SELECT * FROM company';
        const rows = pool.query(sqlQuery);
        res.status(200).json(rows);
    }
    catch(error){
        res.status(400).send(error.message);
    }
  });


