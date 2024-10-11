let express = require('express')
let mysql = require('mysql')
let bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.get("/",(req,res)=>{
	res.send("Hello world!")
})

// POST route to add a new element
app.post("/add", async (req, res) => {
    const { type, name, price } = req.body;
    console.log(req.body)
    // Validate that required fields are provided
    if (!type || !name || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Add element using your custom function (presumably saving to DB or array)
        await addAnElem({ type, name, price});

        // Send success response
        res.status(200).json({
            message: 'Element added successfully',
        });
    } catch (error) {
        // Handle any errors (like database errors)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET route to retrieve all elements of a specific type
app.get("/getAll/:type", async (req, res) => {
	console.log("ping")
    try {
    	console.log(req.params.type)
        // Retrieve elements by type using your custom function
        const results = await getAllElems(req.params.type);

        // Send results as JSON
        res.status(200).json({ results });
    } catch (error) {
        // Handle any errors (like if type doesn't exist)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get("/get/:id", async (req, res) => {
    try {
    	
        // Retrieve elements by type using your custom function
        const results = await getById(req.params.id);
        // Send results as JSON
        res.status(200).json({ results });
    } catch (error) {
        // Handle any errors (like if type doesn't exist)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'password',
  database : 'sahil_db'
});

connection.connect();

var addAnElem = (elem) => {
    return new Promise((resolve, reject) => {
        var query = connection.query('INSERT INTO elems SET ?', elem, function (error, results, fields) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

// Function to retrieve all elements of a specific type from the database
var getAllElems = (type) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM elems WHERE type = ?';
        connection.query(query, [type], function (error, results, fields) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

var getById = (id) => {
	console.log(id)
	return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM elems WHERE id = ?';
        connection.query(query, [id], function (error, results, fields) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}


app.listen(3000,()=>{
	console.log("listening at 3000")
})