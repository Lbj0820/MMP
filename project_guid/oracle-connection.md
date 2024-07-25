# 서버 - DB 통신 가이드

서버와 데이터베이스 연결 구조는 아래와 같다

1. 서버와 데이터베이스 연결
2. 실행할 쿼리 작성
3. 쿼리에 바인딩할 쿼리 작성
4. 실행할 쿼리의 옵션 설정
5. 작성한 데이터를 기반으로 실제 쿼리 실행
6. 데이터베이스연결 종료

실제 코드구조를 간소화 한다면 아래와 같다.

```javascript
try {
    // 디비연결코드
    const connection = ...;

    // 쿼리 작성
    const sql = ...;

    // 쿼리에 바인딩할 변수
    const binds = ...;

    // 쿼리를 실행할때 사용될 옵션
    const options = {...};

    // 위 변수들을 기반으로 실제 쿼리 실행
    const result = await connection...(
        sql,
        binds,
        options
    );
    
} catch {
    // 오류 대응 코드
    console.log(...);
} finally {
    // 디비연결 종료
    connection.close();
}

```

예시 코드
해당코드는 여러개의 데이터를 한번에 변경하는 예제이다.

```javascript

const connection

try {
        // 데이터 베이스와 서버를 연결하고 연결상태를 확인한다.
        connection = await oracledb.getConnection(dbConfig); // 데이터 베이스 연결
        console.log('Connection to Oracle DB was successful!'); //데이터 베이스 연결 확인
    
       
        // 실행할 쿼리를 작성한다.
        const sql = `
            UPDATE Inventory
            SET quantity = quantity + :quantity
            WHERE item_id = :id
        `;

        // 쿼리에 바인딩 될 변수 키
        const binds = req.body.map(
            row => ({                   //  변수는 아래와 같이  쿼리에 바인딩 된다.
                id : row.id ,           //  id ->    :id
                quantity : row.quantity //  quntity -> : quantity
            })
        );
        
        // 쿼리를 실행할때 사용될 옵션
        const options = {
            autoCommit: true, // 자동 저장
            bindDefs: { 
                quantity: { type: oracledb.NUMBER },
                id: { type: oracledb.STRING, maxSize: 30 }
            }
        }

        // 쿼리 실행
        const result = await connection.executeMany(
            sql,       // 실행할 쿼리
            binds,     // 쿼리에 바인딩할 객체
            options    // 옵션
        );
        
        res.json({ message: `${result.rowsAffected}개의 행 수정완료` });  // 쿼리를 실행한 결과 반환

    } catch (err) { // 오류일경우
        console.error('Error connecting to Oracle DB', err);
        res.status(500).json({ error: 'Internal Server Error' });

    } finally { // 항상 마지막에 실행 
        if (connection) { 
            try {
                await connection.close(); // DB 연결 종료
            } catch (err) { // DB 연결 종료에 오류가 있을 경우
                console.error('Error closing the connection', err);
            }
        }
    }
    
```


# Option 객체에 대하여
Option객체는 쿼리를 실행할때 규칙부여가 가능하다.

옵션 설명 
autoCommit : 쿼리를 수정하고 자동으로 Commit을 해주는 여부를 줄 수 있다. true 일경우 자동저장 

bindDefs : 이 객체는 대량의 데이터처리 성능을 최적화 해줍니다. 쿼리를 실행할때 .excuteMany를 쓸때 사용합니다.


# OracleDB 연결 객체에 대하여
아래코드로 OracleDB 연결객체를 만들 수 있다.
connection = await oracledb.getConnection(dbConfig);

connection 객체는 여러 메서드와 멤버변수를 사용해서 연결상태 관리가 가능하다.

execute(sql, [bindParams], [options]) 
: 쿼리를 실행하는 메서드로 아래와 같이 쓰인다. 단일행을 수정할때 쓰인다.

```javascript
// 예시 코드
const result = await connection.execute(
    `SELECT * FROM Inventory WHERE item_id = :id`,
    { id: 'ITEM001' },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
);
```

executeMany(sql, bindParamsArray, [options])
: 쿼리를 실행하는 메서드로 다중행을 처리할때 쓰인다.

```javascript
const sql = `INSERT INTO Inventory (item_id, item_name, quantity) VALUES (:id, :name, :quantity)`;
const binds = [
    { id: 'ITEM001', name: 'Banana', quantity: 100 },
    { id: 'ITEM002', name: 'Apple', quantity: 200 }
];
const options = { autoCommit: true };

const result = await connection.executeMany(sql, binds, options);
```

commit() : 트렌젝션을 커밋
rollback() : 트렌젝션을 롤백
close() : 데이터베이스 연결 닫기


# 주요 멤버변수

action : 데이터베이스 작업의 작업 이름을 설정합니다. 이는 데이터베이스 감사와 추적에 유용합니다.
module : 모듈 이름을 설정합니다. 이는 데이터베이스 감사와 추적에 유용합니다.
clientId : 클라이언트 ID를 설정합니다. 이는 데이터베이스 감사와 추적에 유용합니다.



