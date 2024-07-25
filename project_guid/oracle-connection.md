# 서버 - DB 통신 가이드

서버와 데이터베이스 연결 구조는 아래와 같다

1. 서버와 데이터베이스 연결
2. 실행할 쿼리 작성
3. 쿼리에 바인딩할 쿼리 작성
4. 실행할 쿼리의 옵션 설정
5. 연결 종료

예시 코드
try {
        // 데이터 베이스와 서버를 연결하고 ㄷ
        connection = await oracledb.getConnection(dbConfig); // 데이터 베이스 연결
        console.log('Connection to Oracle DB was successful!'); 데이터 베이스 연결 확인
    
       
        // 바인드 변수를 사용한 쿼리
        const sql = `
            UPDATE Inventory
            SET quantity = quantity + :quantity
            WHERE item_id = :id
        `;

        // 쿼리에 바인딩 될 변수
        const binds = req.body.map(
            row => ({ 
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
        
        console.log('Query Results:', result.rowsAffected);
        res.json({ message: `${result.rowsAffected}개의 행 수정완료` });  // 쿼리를 실행한 결과 반환

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