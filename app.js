
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const promise = require('bluebird')

app.engine('mustache',mustacheExpress())
app.use(bodyParser.urlencoded({extended:false}))

app.set('views','./views')
app.set('view engine','mustache')

// defined the options for the pg-promise library
var options = {
    promiseLib : promise
}

//configuring the pg-promise database connection
var pgp = require('pg-promise')(options)
var connectionString = 'postgres://localhost:5432/groceries'
var db = pgp(connectionString)

let shoppingListArray = []

app.get('/entergroceries',function(req,res){
    res.render('entergroceries')
})


app.post('/entergroceries',function(req,res){
    let groceryCategory = req.body.groceryCategory
    let groceryItem = req.body.groceryItem
    let quantity = parseInt(req.body.quantity)
    let price = parseFloat(req.body.price)

    db.one('INSERT INTO GroceryCategory(categoryname) values($1) RETURNING categoryid',[groceryCategory]).then(function(data){
        console.log(data.categoryid)
   
    db.none('INSERT INTO GroceryItem(groceryItemName,quantity,price,categoryid) values($1,$2,$3,$4)',[groceryItem,quantity,price,data.categoryid]).then(function(){

    }) 

})

    res.send("Shopping list added") 

})   

app.get('/viewgroceries',function(req,res){
   
    db.any('SELECT categoryname,groceryItemName,quantity,price FROM GroceryCategory JOIN GroceryItem ON GroceryCategory.categoryid =GroceryItem.categoryid').then(function(data){
        console.log(data)
        
        res.render('viewGroceries',{'shoppingList' : data})

    })


})
  
  app.listen(3000, () => console.log('app listening on port 3000!'))
  