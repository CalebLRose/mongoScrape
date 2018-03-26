var express = require("express");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));

var exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

var routes = require("./routes.js");
app.use(routes);

app.listen(PORT,function() {
	console.log("app running on port " + PORT);
});