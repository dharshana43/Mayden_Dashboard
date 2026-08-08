require('dotenv').config();
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

function verifyToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

const server = http.createServer(async (req, res) => {

    if (req.method === 'OPTIONS') {
        return sendJSON(res, 200, {});
    }

    if (req.method === 'POST' && req.url === '/api/signup') {
        try {
            const { name, email, password } = await getRequestBody(req);

            if (!name || !email || !password) {
                return sendJSON(res, 400, { error: 'Name, email and password are required' });
            }

            const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return sendJSON(res, 409, { error: 'Email already registered' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const [result] = await pool.query(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                [name, email, passwordHash]
            );

            return sendJSON(res, 201, { message: 'Signup successful', userId: result.insertId });

        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { error: 'Server error during signup' });
        }
    }

    if (req.method === 'POST' && req.url === '/api/login') {
        try {
            const { email, password } = await getRequestBody(req);

            if (!email || !password) {
                return sendJSON(res, 400, { error: 'Email and password are required' });
            }

            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) {
                return sendJSON(res, 401, { error: 'Invalid email or password' });
            }

            const user = rows[0];
            const passwordMatches = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatches) {
                return sendJSON(res, 401, { error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            return sendJSON(res, 200, {
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });

        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { error: 'Server error during login' });
        }
    }

    if (req.method === 'GET' && req.url === '/api/dashboard') {
        const decoded = verifyToken(req);
        if (!decoded) {
            return sendJSON(res, 401, { error: 'Unauthorized - please log in' });
        }

        try {
            const [rows] = await pool.query(
                'SELECT * FROM dashboard_data WHERE user_id = ? ORDER BY entry_date DESC',
                [decoded.userId]
            );
            return sendJSON(res, 200, { data: rows });

        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { error: 'Server error fetching dashboard data' });
        }
    }

    sendJSON(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
