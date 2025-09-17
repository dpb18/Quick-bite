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

// Update delivery partner availability
app.put('/delivery-partners/:id/availability', (req, res) => {
    const { id } = req.params;
    const { available } = req.body;
    
    const sql = 'UPDATE delivery_partners SET available=? WHERE partner_id=?';
    db.query(sql, [available, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Delivery partner availability updated', available: available });
    });
});

// Get delivery partner availability
app.get('/delivery-partners/:id/availability', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT available FROM delivery_partners WHERE partner_id=?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) {
            return res.status(404).send({ message: 'Delivery partner not found' });
        }
        res.send({ available: result[0].available });
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

// ==============================================================
// ORDER ENDPOINTS
// ==============================================================

// Place a new order
app.post('/api/orders', (req, res) => {
    const { 
        total_qty, 
        total_price, 
        otp_order, 
        status = 'Food Processing', 
        customer_id, // Remove default value to ensure we use the actual customer_id from frontend
        delivery_info,
        items 
    } = req.body;

    // Validate that customer_id is provided
    if (!customer_id) {
        return res.status(400).json({ error: 'Customer ID is required to place an order' });
    }

    // Insert order into database
    db.query(
        'INSERT INTO orders (total_qty, total_price, otp_order, status, customer_id) VALUES (?, ?, ?, ?, ?)',
        [total_qty, total_price, otp_order, status, customer_id],
        (err, result) => {
            if (err) {
                console.error('Error inserting order:', err);
                return res.status(500).json({ error: 'Failed to place order', details: err.message });
            }

            const orderId = result.insertId;

            // For now, we'll store delivery_info and items as JSON in a separate table or return success
            // You might want to create separate tables for order_items and delivery_info
            
            res.json({ 
                success: true, 
                order: {
                    order_id: orderId,
                    total_qty,
                    total_price,
                    otp_order,
                    status,
                    customer_id,
                    order_date: new Date().toISOString(),
                    delivery_info,
                    items
                }
            });
        }
    );
});

// Get orders for a specific customer
app.get('/api/orders/customer/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    
    db.query(
        'SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC',
        [customerId],
        (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
            }
            res.json(results);
        }
    );
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    
    db.query(
        'SELECT * FROM orders WHERE order_id = ?',
        [orderId],
        (err, results) => {
            if (err) {
                console.error('Error fetching order:', err);
                return res.status(500).json({ error: 'Failed to fetch order', details: err.message });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            
            res.json(results[0]);
        }
    );
});

// Update order status
app.put('/api/orders/:orderId/status', (req, res) => {
    const orderId = req.params.orderId;
    const { status, delivery_partner_id } = req.body;
    
    let query = 'UPDATE orders SET status = ?';
    let params = [status];
    
    if (delivery_partner_id) {
        query += ', delivery_partner_id = ?';
        params.push(delivery_partner_id);
    }
    
    query += ' WHERE order_id = ?';
    params.push(orderId);
    
    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Failed to update order status', details: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ success: true, message: 'Order status updated successfully' });
    });
});

// Assign delivery partner to order
app.put('/api/orders/:orderId/assign', (req, res) => {
    const orderId = req.params.orderId;
    const { delivery_partner_id } = req.body;
    
    db.query(
        'UPDATE orders SET delivery_partner_id = ?, status = ? WHERE order_id = ?',
        [delivery_partner_id, 'Out for Delivery', orderId],
        (err, result) => {
            if (err) {
                console.error('Error assigning delivery partner:', err);
                return res.status(500).json({ error: 'Failed to assign delivery partner', details: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            
            res.json({ success: true, message: 'Delivery partner assigned successfully' });
        }
    );
});

// Get all orders (for admin)
app.get('/api/orders', (req, res) => {
    db.query(
        `SELECT o.*, c.customer_name, dp.name as delivery_partner_name 
         FROM orders o 
         LEFT JOIN customer c ON o.customer_id = c.customer_id 
         LEFT JOIN delivery_partners dp ON o.delivery_partner_id = dp.partner_id 
         ORDER BY o.order_date DESC`,
        (err, results) => {
            if (err) {
                console.error('Error fetching all orders:', err);
                return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
            }
            res.json(results);
        }
    );
});

// Get orders for a specific delivery partner
app.get('/api/orders/delivery-partner/:partnerId', (req, res) => {
    const partnerId = req.params.partnerId;
    
    db.query(
        `SELECT o.*, c.customer_name, c.contact_No as customer_phone, c.location as customer_address
         FROM orders o 
         LEFT JOIN customer c ON o.customer_id = c.customer_id 
         WHERE o.delivery_partner_id = ? 
         ORDER BY o.order_date DESC`,
        [partnerId],
        (err, results) => {
            if (err) {
                console.error('Error fetching delivery partner orders:', err);
                return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
            }
            res.json(results);
        }
    );
});

// Accept order by delivery partner
app.put('/api/orders/:orderId/accept', (req, res) => {
    const orderId = req.params.orderId;
    const { delivery_partner_id } = req.body;
    
    db.query(
        'UPDATE orders SET status = ?, accepted_by_partner = ? WHERE order_id = ? AND delivery_partner_id = ?',
        ['Out for Delivery', true, orderId, delivery_partner_id],
        (err, result) => {
            if (err) {
                console.error('Error accepting order:', err);
                return res.status(500).json({ error: 'Failed to accept order', details: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found or not assigned to you' });
            }
            
            res.json({ success: true, message: 'Order accepted and marked as Out for Delivery' });
        }
    );
});

// Reject order by delivery partner
app.put('/api/orders/:orderId/reject', (req, res) => {
    const orderId = req.params.orderId;
    const { delivery_partner_id } = req.body;
    
    db.query(
        'UPDATE orders SET status = ?, delivery_partner_id = NULL, accepted_by_partner = ? WHERE order_id = ? AND delivery_partner_id = ?',
        ['Order Cancelled', false, orderId, delivery_partner_id],
        (err, result) => {
            if (err) {
                console.error('Error rejecting order:', err);
                return res.status(500).json({ error: 'Failed to reject order', details: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found or not assigned to you' });
            }
            
            res.json({ success: true, message: 'Order rejected and marked as cancelled' });
        }
    );
});

// Mark order as delivered by delivery partner
app.put('/api/orders/:orderId/delivered', (req, res) => {
    const orderId = req.params.orderId;
    const { delivery_partner_id } = req.body;
    
    db.query(
        'UPDATE orders SET status = ? WHERE order_id = ? AND delivery_partner_id = ?',
        ['Delivered', orderId, delivery_partner_id],
        (err, result) => {
            if (err) {
                console.error('Error marking order as delivered:', err);
                return res.status(500).json({ error: 'Failed to update order status', details: err.message });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found or not assigned to you' });
            }
            
            res.json({ success: true, message: 'Order marked as delivered successfully' });
        }
    );
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});