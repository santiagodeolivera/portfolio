const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');

// TODO: Set favicon.ico

const app = express();
const hbs = expressHandlebars.create();
const port = 3000;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const Product = require('./product').default;
app.get('/', (req, res) => {
	res.render('hello', {title: "Hello world page", product: new Product("1", "Item", 30, null)});
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
	res.status(500);
	console.error(err);
	res.send("Internal server error");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
