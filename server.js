const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

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
