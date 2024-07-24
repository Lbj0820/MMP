const express       = require('express');
const oracledb      = require('oracledb');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 3000;  // 웹서버 포트 

// Oracle DB 설정
const dbConfig = {
    user:           'scott',                 // 데이터베이스 사용자 이름
    password:       'tiger',                 // 데이터베이스 비밀번호
    connectString:  'wi.ddns.net:1521/orcl'  // 데이터베이스 연결 문자열
};

app.use(express.static('public'));
app.use(bodyParser.json());

// 데이터베이스 연결 테스트
async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connection to Oracle DB was successful!');
    } catch (err) {
        console.error('Error connecting to Oracle DB', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
}

app.get('/api/getData', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig); // DB 연결
        console.log('Connection to Oracle DB was successful!');

        const result = await connection.execute('SELECT * FROM inventory'); //쿼리로 DB 조회
        res.json(result.rows); // 조회 결과 반환 

    } catch (err) { // 오류일경우
        console.error('Error connecting to Oracle DB', err);
        res.status(500).json({ error: 'Internal Server Error' });

    } finally { // 항상 마지막에 실행 
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
});

app.get('/api/searchItems', async (req, res) => {
    //console.log(req.body);
    //const {id ,name, received_by, quantity } = req.body;

    // 클라이언트에서 받아올 더미 데이터 
    const tmpdict = {
        "id": "",
        "name": "",
        "received_by": "John Doe",
        "quantity": 0
    };
    const {id ,name, received_by, quantity } = tmpdict;

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig); // DB 연결
        console.log('Connection to Oracle DB was successful!');

        // 바인드 변수를 사용한 쿼리
        const sql = `SELECT * FROM Inventory WHERE 1=1`;

        //조건에 따른
        if (id)             sql += `item_id = ${id}`;
        if (name)           sql += `item_name = ${name}`;
        if (received_by)    sql += `received_by = ${received_by}`;
        if (quantity != 0)  sql += `quantity = ${quantity}`;

        const result = await connection.execute(sql);
        
        res.json(result.rows);

    } catch (err) { // 오류일경우
        console.error('Error connecting to Oracle DB', err);
        res.status(500).json({ error: 'Internal Server Error' });

    } finally { // 항상 마지막에 실행 
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
});




app.post('/api/submitProduct', async (req, res) => {
    const {id ,name, quantity } = req.body;

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig); // DB 연결
        console.log('Connection to Oracle DB was successful!');

        // 바인딩 될 변수
        const binds = {
            id:         id,
            name:       name,
            quantity:   quantity
        };

        // 바인드 변수를 사용한 쿼리
        const sql = `
            SELECT CASE
            WHEN EXISTS (SELECT 1 FROM Inventory WHERE item_id = :id) 
                THEN 'TRUE'
                ELSE 'FALSE'
            END AS item_exists
            FROM dual;
        `;

        const result = await connection.execute(
            sql,       // SQL 쿼리
            binds,     // 바인드 변수 객체
            { autoCommit: true } // 데이터 변경 자동변경 허용
        );
        
        res.json({ message: `상품명: ${name}, 수량: ${quantity} 저장 완료` });
        console.log('Query Results:', result.rowsAffected);

    } catch (err) { // 오류일경우
        console.error('Error connecting to Oracle DB', err);
        res.status(500).json({ error: 'Internal Server Error' });

    } finally { // 항상 마지막에 실행 
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing the connection', err);
            }
        }
    }
});

// 테스트 연결
testConnection();

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
