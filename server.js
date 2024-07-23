const express       = require('express');
const mysql         = require('mysql2');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'MMP'
});

app.use(express.static('public'));
app.use(bodyParser.json());

// 데이터베이스 연결
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});


app.get('/api/getData', (req, res) => {
    res.json({ message: '조회 데이터' });
});


app.post('/api/submitProduct', (req, res) => {
    const { name, quantity } = req.body;
    res.json({ message: `상품명: ${name}, 수량: ${quantity} 저장 완료` });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
