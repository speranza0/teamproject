var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require("mysql2");
var crypto = require('crypto');
var Web3 = require('web3');
const { createConnection } = require("net");
var web3 = new Web3('http://localhost:8545');
// var BigNumber = require('bignumber.js');

var conn_info = {
    host: "localhost",
    port: 3306,
    user: "user",
    password: "1234",
    database: "CobwebDB",
    multipleStatements: true
}

module.exports = function (app) {

    app.get('/', function (req, res) {
        console.log(req.session.name);
        if (typeof req.session.name == 'undefined') {
            res.redirect('/index');
        }
        else {
            res.redirect('/login');
        }
    });

    app.post("/login", urlencodedParser, function (req, res) {
        var user_id = req.body.user_id;
        var user_pwd = req.body.user_pwd;
        var conn = mysql.createConnection(conn_info);
        var sql = 'SELECT * FROM db_member WHERE user_id=? and user_pwd=?';
        conn.query(sql, [user_id, user_pwd], function (err, results) {
            if (err) {
                console.log(err);
            } else if (!results[0]) {
                res.render('login');
            }

            req.session.user_num = results[0].user_num;
            req.session.user_id = user_id;
            req.session.user_pwd = user_pwd;


            res.redirect("main");

        });
    });

    app.get("/main", function (req, res) {
        var user_id = req.session.user_id;
        var user_pwd = req.session.user_pwd;
        var user_num = req.session.user_num;
        var conn = mysql.createConnection(conn_info);
        var sql = 'select * from db_member where user_id=? and user_pwd=? and user_num=?';
        var account_data = [user_id, user_pwd, user_num];
        conn.query(sql, account_data, function (err, result) {
            var render_data = {
                id: result[0].user_id,
                pwd: result[0].user_pwd,
                num: result[0].user_num
            }
            if (err) {
                console.log(err);
            }

            res.render("user_profile", render_data);
        });
    });

    app.get("/trade", function (req, res) {
        var user_id = req.session.user_id;
        var user_pwd = req.session.user_pwd;
        var user_num = req.session.user_num;
        var conn = mysql.createConnection(conn_info);
        var sql = "select * from db_wallet where user_num=?";
        conn.query(sql, user_num, function (err, result) {
            var render_data = {
                id: user_id,
                pwd: user_pwd,
                num: user_num
            }
            if (err) {
                console.log(err);
            }
            req.session.wallet_address = result[0].wallet_address;
            res.render("user_trade", render_data);
        });
    });
    // 매수 부분
    app.post("/buy_button", urlencodedParser, function(req, res){
        var buy_price = req.body.my_input1;
        var buy_total = req.body.my_input2;
        var buy_count = req.body.my_result;
        var real = buy_count * 1000000000000000000;
        var user_num = req.session.user_num;
        var conn = mysql.createConnection(conn_info);
        var sql = "insert into db_buy(user_num, " + " buy_price, " + " buy_total, " + " buy_count) values(? , ? , ? , ?)";
        var input_data = [user_num, buy_price, buy_total, buy_count];
        console.log(sql);
        console.log(input_data);
        conn.query(sql, input_data, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/trade");
        });

        web3.eth.personal.unlockAccount("0xaf166b1c69a570142e3c556c8d83c597d848f895", "pass", 600)
            .then(result => console.log('Account unlocked! :' + result))
            .catch(err => console.log('err :' + err));
        var txobject = {
            from: "0xaf166b1c69a570142e3c556c8d83c597d848f895",
            to: "0xb099da2a82a8d7017797c93d13e811d2080b1729",
            value: real
        };
        web3.eth.sendTransaction(txobject)
            .then(function (receipt) {
                console.log(receipt);
            });
    });
    // 매도 부분
    app.post("/sell_button", urlencodedParser, function(req, res){
        var sell_price = req.body.you_input1;
        var sell_total = req.body.you_input2;
        var sell_count = req.body.you_result;
        var real = sell_count * 1000000000000000000;
        var user_num = req.session.user_num;
        var conn = mysql.createConnection(conn_info);
        var sql = "insert into db_sell(user_num, " + " sell_price, " + " sell_total, " + " sell_count) values(? , ? , ? , ?)";
        var input_data = [user_num, sell_price, sell_total, sell_count];
        console.log(sql);
        console.log(input_data);
        conn.query(sql, input_data, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/trade");
        });

        web3.eth.personal.unlockAccount("0xb099da2a82a8d7017797c93d13e811d2080b1729", "pass", 600)
            .then(result => console.log('Account unlocked! :' + result))
            .catch(err => console.log('err :' + err));
        var txobject = {
            from: "0xb099da2a82a8d7017797c93d13e811d2080b1729",
            to: "0xaf166b1c69a570142e3c556c8d83c597d848f895",
            value: real
        };
        web3.eth.sendTransaction(txobject)
            .then(function (receipt) {
                console.log(receipt);
            });
    })

    app.get("/wallet", async function (req, res) {
        var user_id = req.session.user_id;
        var user_num = req.session.user_num;
        var wallet_address = req.session.wallet_address;
        var conn = mysql.createConnection(conn_info);
        var sql = "select * from db_wallet where user_num=? and wallet_address=?";
        var wallet_data = [user_num, wallet_address];
        conn.query(sql, wallet_data, function (err, result) {
            var wallet_render_data = {
                num: user_num,
                address: result[0].wallet_address
            }
            req.session.wallet_address = wallet_address;
        });

        await web3.eth.getBalance(wallet_address)
            .then(function (result) {
                let x = web3.utils.fromWei(result);
                var render_data = {
                    ethereum: x.substring(0,10)
                }
                res.render("user_wallet.ejs", render_data);
            })
    });

    app.get("/deposit", function (req, res) {
        var user_num = req.session.user_num;
        var wallet_address = req.session.wallet_address;
        var conn = mysql.createConnection(conn_info);
        var sql = "select * from db_wallet where user_num=? and wallet_address=?";
        var wallet_data = [user_num, wallet_address];
        conn.query(sql, wallet_data, function (err, result) {
            var render_data = {
                num: result[0].user_num,
                address: result[0].wallet_address
            }
            if (err) {
                console.log(err);
            }
            req.session.user_num = user_num;
            req.session.wallet_address = wallet_address;

            res.render("user_deposit", render_data);
        });
    });

    app.get("/withdrawals", function (req, res) {
        var user_num = req.session.user_num;
        var wallet_address = req.session.wallet_address;
        var conn = mysql.createConnection(conn_info);
        var sql = "select * from db_wallet where user_num=? and wallet_address=?";
        var wallet_data = [user_num, wallet_address];
        conn.query(sql, wallet_data, function (err, result) {
            var render_data = {
                num: result[0].user_num,
                address: result[0].wallet_address
            }
            if (err) {
                console.log(err);
            }
            req.session.user_num = user_num;
            req.session.wallet_address = wallet_address;
            res.render("user_withdrawals", render_data);
        });
    });

    app.get('/login', function (req, res) {
        if (!req.session.name)
            res.render('user_login.ejs');
        else
            res.redirect('/index');
    });
    app.get('/index', function (req, res) {
        res.render('user_index.ejs', { name: req.session.name });
    });
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.render("user_login.ejs")
            // res.redirect('/');
        });
    });

    app.get("/dashboard", function (req, res) {
        res.render("user_dashboard.ejs");
    });
    app.get("/register", function (req, res) {
        res.render("user_register.ejs");
    });

    app.post("/register", urlencodedParser, function (req, res) {
        var user_name = req.body.user_name;
        var user_id = req.body.user_id;
        var user_pwd = req.body.user_pwd;

        var conn = mysql.createConnection(conn_info);
        var sql = "insert into db_member(user_name, " + " user_id, " + " user_pwd) values(? , ? , ?)";
        var input_data = [user_name, user_id, user_pwd];
        console.log(sql);
        console.log(input_data);

        conn.query(sql, input_data, function (err) {
            if (err) {
                console.log(err);
            }
            conn.end();
            res.redirect("login");
        });
    });
}