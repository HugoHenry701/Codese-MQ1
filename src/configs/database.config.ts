import mysql from 'mysql2'

export const dbConfig = {
    timezone: 'Asia/Ho_Chi_Minh',
    limitConnection: 5,
};

export const dbName = {
    marketDb: 'marketDb'
}

export const codesePool = mysql.createPool({
    connectionLimit: dbConfig.limitConnection,
    host: 'localhost',
    port: 3310,
    user: 'root',
    password: 'password',
    database: 'marketDb'
})

export const query = async (
    pool: mysql.Pool,
    sql: string,
    params?: any,
): Promise<any> =>
    new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) {
                return reject(error);
            }

            return resolve(results);
        });
    });