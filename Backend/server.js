
var express = require('express');
var app = express();
//var cors = require('cors')
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    next();
});
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// app.use(function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     next();
    //   });
    
    var mongoose = require('mongoose').set('debug', true);;
    var ObjectId = require('mongodb').ObjectID;
    var promise = mongoose.connect('mongodb://shop-sport:xenoxes1494@ds042677.mlab.com:42677/sport_shop', {
        useMongoClient: true,
    });
    var Schema = mongoose.Schema;
    
    var ProductTasks = new Schema({
        name: String,
        imageSrc: String,
        description: String,
        price: Number,
        categories: [String],
        sale: String
    });
    
    var ItemCategoryTasks = new Schema({
        name: String
    });
    
    var OrderTasks = new Schema({
        customerName: String,
        customerAddress: {
            street: String,
            buildingNumber: String,
            flatNumber: String,
            city: String,
            postalCode: String,
            country: String
        },
        completed: Boolean,
        positions: [
            {
                id: String,
                shopItemId: String,
                shopItemName: String,
                quantity: Number,
                price: Number
            }
        ]
    });
    
    var UserTasks = new Schema({
        login: String,
        password: String,
        isAdmin: Boolean,
        lastUsedAddress: {
            street: String,
            buildingNumber: String,
            flatNumber: String,
            city: String,
            postalCode: String,
            country: String
        }
    });
    
    var ProductModel = mongoose.model('shop_items', ProductTasks);
    var ItemCategoryModel = mongoose.model('item_categories', ItemCategoryTasks);
    var OrderModel = mongoose.model('orders', OrderTasks);
    var UserModel = mongoose.model('users', UserTasks);
    
    var bCrypt = require('bcryptjs');
    var jwt = require('jsonwebtoken');
    const secretMessage = "tojestmojsklepzakcesoriamisportowymi";
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    var encryptPassword = function(password) {
        var salt = bCrypt.genSaltSync(10);
        return bCrypt.hashSync(password, salt);
    }
    var validateSimpleUserToken = function(token) {
        try {
        var verificationResult = jwt.verify(token, secretMessage);
        return { result: true, message: null, login: verificationResult.login };
    }
    catch(err) {
        console.log("Eror: " + err);
        return {result: false, message: err, login: null};
    }
}
var validateAdminUserToken = function(token) {
    try {
        console.log(token);
        var verificationResult = jwt.verify(token, secretMessage);

        if(verificationResult.isAdmin) {
            return { result: true, message: null, login: verificationResult.login };
        } else {
            return {result: false, message: "Nie masz uprawnien do przeglądania tej części strony", login: null };
        }
    }
    catch(err) {
        return {result: false, message: err, login: null};
    }
}

app.get('/shopitems', function (req, res) {
    ProductModel.find().exec(function (err, products){
        if (err) console.log(err);

        products.forEach(elem => {
            console.log("Produkt: " + JSON.stringify(elem));            
            if (elem) {
                if (typeof sales !== 'undefined') {
                    var sale = sales.filter(p => p.item === elem._id.toString());
                    if (sale.length > 0) {
                        console.log('Promo: ' + JSON.stringify(sale[0].nrOfPercentage));
                        elem["sale"] = sale[0].nrOfPercentage;
                    }
                }
            }
        });
        console.log("Produkty: " + JSON.stringify(products));
        res.end(JSON.stringify(products));
    });
})

app.get('/shopitem/:id', function (req, res) {
    ProductModel.findById( req.params.id, function (err, product){
        console.log(req.params.id);

        if (err) console.log(err);

        console.log(JSON.stringify(product));
        res.end(JSON.stringify(product));
    });
})

app.delete('/shopitem/:id', function (req, res) {
    if(req.headers.authorization) {
        var valResult = validateAdminUserToken(req.body.authorization);

        if(valResult.result) {
            console.log("Request delete");
            ProductModel.findById( req.params.id ).remove().exec(function (err, product){
                console.log(req.params.id);

                if (err) console.log(err);

                console.log(JSON.stringify(product));
                res.end("true");
            });
        }
    }
});

app.get('/itemCategories', function (req, res) {
    ItemCategoryModel.find().exec(function (err, categories){
        if (err) console.log(err);

        console.log("Kategorie: " + categories.length);
        res.end(JSON.stringify(categories));
    });
})

app.post('/log-in', function (req, res) {
    console.log(JSON.stringify(req.body));
    UserModel.findOne({login: req.body.login}, function(err, user) {
        if (!user) {
            res.end( JSON.stringify({result: false, message: "Błędny login", token: null}));
        } else if (isValidPassword(user, req.body.password)) {
            const payload = {
                isAdmin: user.isAdmin,
                login: user.login
              };

            var token = jwt.sign(payload, secretMessage, {
                expiresIn: 300 // expires in 24 hours
            });

            res.end( JSON.stringify({result: true, message: null, user: 
                { 
                    login: user.login, 
                    id: user._id, 
                    token: token 
                }
            }) );
        } else {
            res.end( JSON.stringify({result: false, message: "Błędne hasło", token: null}));
        }
        console.log("Zakoczono zapytanie o logowanie");
    })
})

app.post('/sign-in', function(req, res) {
    if (req.body.login && req.body.password) {
        var user = new UserModel();
        user.login = req.body.login;
        user.password = encryptPassword(req.body.password);
        user.isAdmin = false;
        user.save(function(err) {
            if (err) throw err;
            
            const payload = {
                isAdmin: false,
                login: user.login
            };
    
            var token = jwt.sign(payload, secretMessage, {
                expiresIn: 300 // expires in 24 hours
            });
    
            res.end( JSON.stringify({result: true, message: null, user: 
                { 
                    login: user.login, 
                    id: user._id, 
                    token: token 
                } 
            }));
        });
    }
})

app.post('/shopitems', function (req, res) {
    console.log('Wszedłem');
    console.log(req.headers.authorization);
    if(req.headers.authorization) {
        var valResult = validateAdminUserToken(req.headers.authorization);

        if(valResult.result) {
            console.log("Przysżło zapytanie z towarem: " + JSON.stringify(req.body));
            var model = new ProductModel();
            model.name = req.body.name;
            model.imageSrc = req.body.imageSrc;
            model.description = req.body.description;
            model.price = req.body.price;
            model.categories = req.body.categories;

            model.save(function(err) {
                if (err) throw err;
                console.log('Produkt został zapisany.');
                res.end('Dane zostały zapisane!');
            });
            res.end("true");
        }
    }
})

app.put('/shopitems', function (req, res) {
    console.log('Wszedłem');
    console.log(req.headers.authorization);
    console.log("Przysżło zapytanie z towarem: " + JSON.stringify(req.body));
    if(req.headers.authorization) {
        var valResult = validateAdminUserToken(req.headers.authorization);
        console.log(JSON.stringify(valResult));
        if(valResult.result) {
            ProductModel.findById( req.body._id, function (err, product){
                product.name = req.body.name;
                product.imageSrc = req.body.imageSrc;
                product.description = req.body.description;
                product.price = req.body.price;
                product.categories = req.body.categories;

                product.save(function(err) {
                    if (err) throw err;
                    console.log('Produkt został zapisany.');
                });
                res.end("true");
            });
        }
    }
})

app.put('/orderCompletation/:orderId', function(req, res) {
    var orderId = req.params.orderId;
    var completationState = req.body.state;
    console.log('Dostałem żąanie');
    OrderModel.findById( orderId, function (err, order){
        order.completed = completationState;

        order.save(function(err) {
            if (err) throw err;
            console.log('Zamówienie zostało oznaczone jako zrealizowane.');
            res.end("true");
        });
    });
})

app.get('/orders', function (req, res) {
    var completed = req.query.completed;
    OrderModel.find({ completed: completed }).exec(function (err, orders){
        if (err) console.log(err);

        console.log("Zamówienia: " + orders.length);
        console.log(JSON.stringify(orders));
        res.send(JSON.stringify(orders));
    });
})

app.post('/orders', function (req, res) {
    console.log(req.body);
    var model = new OrderModel();
    model.customerName = req.body.customerName;
    model.customerAddress = req.body.customerAddress;
    model.positions = req.body.positions;
    model.completed = false;

    console.log(JSON.stringify(model));

    model.save(function(err) {
        if (err) throw err;
        
        console.log(JSON.stringify(req.headers.authorization));
        if(req.headers.authorization) {
            var valResult = validateSimpleUserToken(req.headers.authorization);
            if (valResult.result) {
                UserModel.findOne({ login: valResult.login}, function(err, user) {
                    if (user) {
                        user.lastUsedAddress = req.body.customerAddress;
                        user.save(function(err) {
                            if (err) throw err;
                        });
                    }
                });
            }
        }

        console.log('Zakonczono dodawanie zlecenia');
        res.end(JSON.stringify({ response: 'Dane zostały zapisane!'}));
    });
})

app.get('/userAddress/:id', function (req, res) {
    var userId = req.params.id;

    UserModel.findById(userId, function(err, user) {
        if (user) {
            res.end(JSON.stringify(user.lastUsedAddress));
        }
    });
})

app.delete('/tmpShoppingCard', function (req, res) {
    res.end("true");
})

app.post('/sales', function (req, res) {
    const sale = req.body;
    sales.push( { item: sale.item, nrOfPercentage: sale.nrOfPercentage, nrOfMinutes: sale.nrOfMinutes });
    console.log(JSON.stringify(req.body));
    let minutes = sale.nrOfMinutes * 60000;
    console.log("Czas: " + minutes);
    setTimeout(notifyAboutSaleEnding, minutes, sale.item);

    io.sockets.send({ type: "sale-start", itemId: sale.item, nrOfPercentage: sale.nrOfPercentage });
    res.end("true");
})

var sales = [];
io.on('connection' , function(client) {
    console.log('Client connected...' );
});

function notifyAboutSaleEnding(itemId) {
    console.log('Skonczyła się promocja dla ' + itemId);
    sales = sales.filter(elem => elem.item !== itemId);
    io.sockets.emit('message', {type: "sale-end", itemId: itemId, nrOfPercentage: 0});
}

var server = http.listen(5300, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Przykładowa aplikacja nasłuchuje na http://%s:%s", host, port)
});
