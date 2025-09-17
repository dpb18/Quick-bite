const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dmhr@1301',
    database: 'fooddb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/products/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

app.post('/products', (req, res) => {
    const { name, price, category, imgUrl, description } = req.body;
    console.log(req.body);
    db.query(
        'INSERT INTO products (name, price, category, imgUrl, description) VALUES (?, ?, ?, ?, ?)',
        [name, price, category, imgUrl, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, ...req.body });
        }
    );
});

app.put('/products/:id', (req, res) => {
    const { name, price, category, imgUrl,description } = req.body;
    db.query(
        'UPDATE products SET name=?, price=?, category=?,description=?, imgUrl=? WHERE id=?',
        [name, price, category, description, imgUrl, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: req.params.id, ...req.body });
        }
    );
});

app.delete('/products/:id', (req, res) => {
    db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Deleted' });
    });
});

app.post('/admin/login', (req, res) => {
  const { userName, pass } = req.body;
  db.query('SELECT * FROM admin WHERE username = ? AND pass = ?', [userName, pass], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get('/customers', (req, res) => {
  db.query('SELECT customer_id, customer_name, contact_No, email, location FROM customer', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.delete('/customers/:id', (req, res) => {
  db.query('DELETE FROM customer WHERE customer_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Customer deleted' });
  });
});

app.get('/delivery-partners', (req, res) => {
    db.query('SELECT * FROM delivery_partners', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/delivery-partners', (req, res) => {
    const { name, phone, email, password } = req.body;
    const sql = 'INSERT INTO delivery_partners (name, phone, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phone, email, password], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Delivery partner added', partner_id: result.insertId });
    });
});

app.put('/delivery-partners/:id', (req, res) => {
    const { name, phone, email, password } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE delivery_partners SET name=?, phone=?, email=?, password=? WHERE partner_id=?';
    db.query(sql, [name, phone, email, password, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Delivery partner updated' });
    });
});

app.delete('/delivery-partners/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM delivery_partners WHERE partner_id=?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Delivery partner deleted' });
    });
});

// User Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password, phone, location, role } = req.body;
    console.log('Registration attempt:', req.body);
    
    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        if (role === 'customer') {
            // Insert into customer table
            db.query(
                'INSERT INTO customer (customer_name, contact_No, email, password, location) VALUES (?, ?, ?, ?, ?)',
                [name, phone || '', email, hashedPassword, location || ''],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Registration failed', details: err.message });
                    }
                    res.status(201).json({ 
                        message: 'Customer registered successfully', 
                        user: {
                            id: result.insertId,
                            name: name,
                            email: email,
                            phone: phone || '',
                            location: location || '',
                            role: 'customer'
                        }
                    });
                }
            );
        } else if (role === 'delivery-partner') {
            // Insert into delivery_partners table
            db.query(
                'INSERT INTO delivery_partners (name, phone, email, password) VALUES (?, ?, ?, ?)',
                [name, phone || '', email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Registration failed', details: err.message });
                    }
                    res.status(201).json({ 
                        message: 'Delivery partner registered successfully', 
                        user: {
                            id: result.insertId,
                            name: name,
                            email: email,
                            phone: phone || '',
                            role: 'delivery-partner'
                        }
                    });
                }
            );
        } else if (role === 'admin') {
            // Insert into admin table with correct schema: id, username, pass, email
            console.log('Attempting admin registration for:', name, email);
            db.query(
                'INSERT INTO admin (username, pass, email) VALUES (?, ?, ?)',
                [name, hashedPassword, email],
                (err, result) => {
                    if (err) {
                        console.error('Admin registration database error:', err);
                        return res.status(500).json({ 
                            error: 'Admin registration failed', 
                            details: err.message,
                            sqlState: err.sqlState,
                            code: err.code
                        });
                    } else {
                        res.status(201).json({ 
                            message: 'Admin registered successfully', 
                            user: {
                                id: result.insertId,
                                name: name,
                                email: email,
                                role: 'admin'
                            }
                        });
                    }
                }
            );
        } else {
            res.status(400).json({ error: 'Invalid role specified' });
        }
    } catch (error) {
        console.error('Password hashing error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });
    
    try {
        // Check customer table first
        db.query(
            'SELECT * FROM customer WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Login failed' });
                }
                if (results.length > 0) {
                    const isMatch = await bcrypt.compare(password, results[0].password);
                    if (isMatch) {
                        return res.status(200).json({ 
                            message: 'Login successful', 
                            user: {
                                id: results[0].customer_id,
                                name: results[0].customer_name,
                                email: results[0].email,
                                phone: results[0].contact_No,
                                location: results[0].location,
                                role: 'customer'
                            }
                        });
                    }
                }
                
                // Check delivery_partners table
                db.query(
                    'SELECT * FROM delivery_partners WHERE email = ?',
                    [email],
                    async (err, results) => {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Login failed' });
                        }
                        if (results.length > 0) {
                            const isMatch = await bcrypt.compare(password, results[0].password);
                            if (isMatch) {
                                return res.status(200).json({ 
                                    message: 'Login successful', 
                                    user: {
                                        id: results[0].partner_id,
                                        name: results[0].name,
                                        email: results[0].email,
                                        phone: results[0].phone,
                                        role: 'delivery-partner'
                                    }
                                });
                            }
                        }
                        
                        // Check admin table
                        db.query(
                            'SELECT * FROM admin WHERE email = ?',
                            [email],
                            async (err, results) => {
                                if (err) {
                                    console.error('Database error:', err);
                                    return res.status(500).json({ error: 'Login failed' });
                                }
                                if (results.length > 0) {
                                    // Admin table schema: id, username, pass, email
                                    const isMatch = await bcrypt.compare(password, results[0].pass);
                                    if (isMatch) {
                                        return res.status(200).json({ 
                                            message: 'Login successful', 
                                            user: {
                                                id: results[0].id,
                                                name: results[0].username,
                                                email: results[0].email,
                                                role: 'admin'
                                            }
                                        });
                                    }
                                }
                                return res.status(401).json({ message: 'Invalid credentials' });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Debug endpoint to check table structures
app.get('/debug/table-structure', (req, res) => {
    const tableChecks = {
        admin: 'DESCRIBE admin',
        customer: 'DESCRIBE customer', 
        delivery_partners: 'DESCRIBE delivery_partners'
    };
    
    const results = {};
    let completed = 0;
    
    Object.keys(tableChecks).forEach(tableName => {
        db.query(tableChecks[tableName], (err, structure) => {
            if (err) {
                results[tableName] = { error: err.message };
            } else {
                results[tableName] = structure;
            }
            completed++;
            
            if (completed === Object.keys(tableChecks).length) {
                res.json(results);
            }
        });
    });
});

// Test admin table connectivity
app.get('/debug/admin-test', (req, res) => {
    db.query('SELECT * FROM admin LIMIT 1', (err, results) => {
        if (err) {
            res.status(500).json({ 
                error: 'Admin table query failed', 
                details: err.message,
                code: err.code,
                sqlState: err.sqlState 
            });
        } else {
            res.json({ 
                message: 'Admin table accessible', 
                sampleData: results.length > 0 ? Object.keys(results[0]) : 'No data',
                count: results.length 
            });
        }
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});