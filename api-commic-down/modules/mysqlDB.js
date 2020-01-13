var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'nas.raincat.xin',
    user: 'root',
    password: 'Lyk@3315177',
    database: 'erp4.0_100002'
});
// var pool = mysql.createPool({
//     host: 'rm-m5ey45e39bn0mc6oyzo.mysql.rds.aliyuncs.com',
//     user: 'root',
//     password: 'Damuzhikj2015',
//     database: 'erp4.0_100002'
// });
var getConnection = async () => {
    let connection = await new Promise((su, sj) => {
        pool.getConnection((err, conn) => {
            su(conn)
        })
    })
    return connection
}

var query = async (sql, params,connection) => {

    let data = await new Promise((su, sj) => {
        connection.query(sql,params, (err, rows) => {
            su(rows)
        })
    })
   
    return data
}
module.exports = {
    getConnection,query
}