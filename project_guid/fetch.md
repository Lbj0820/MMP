# fetch 통신

서버측에서 get과 post의 데이터파싱 방법이 서로 다르다.

GET요청의 경우 : query를 사용한다.
```javascript
app.get('/api/searchItems', async (req, res) => {
    console.log(req.query);
    ...;
});
```

POST요청의 경우 : body를 사용한다.
```javascript
app.post('/api/update-quantity', async (req, res) => {
    console.log(req.body);
    ...;
});
```