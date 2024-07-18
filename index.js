const express = require('express');
const app = express();
const port = 3000;

// 정적 파일 제공
app.use(express.static('public'));

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// /api/hello 라우트 설정
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, API!' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
