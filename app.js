
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


app.get('/',function(req,res){

    res.render('home')

})

app.post('/shoplists',function(req,res){
     
    res.redirect('shoplists')    
    
 })



app.get('/shoplists',function(req,res){

    db.any('SELECT id,name FROM ShopNames').then(function(data){
        console.log(data)
              
        res.render('shopLists',{'shopNames' : data})

    
    })
})


app.post('/addshop',function(req,res){

    let shopName = req.body.shopName
    db.none('INSERT INTO ShopNames(name) values($1)',[shopName]).then(function(){   

        res.redirect('/shopLists')   
                  
    })
   
})

app.post('/deleteshop',function(req,res){

    let shopId = parseInt(req.body.shopId)

    db.none('DELETE FROM ShopNames WHERE id =$1',[shopId]).then(function(){   

        res.redirect('/shopLists')   
                  
    })
   
})

app.post('/groceryitems',function(req,res){

    res.redirect('groceryItems')
})

app.get('/groceryItems',function(req,res){

    db.any('SELECT id,name FROM ShopNames').then(function(data){
        console.log(data)
              
        res.render('groceryItems',{'shopNames' : data})
 
    })
})

app.post('/addgroceryitems',function(req,res){

    res.redirect('/addGroceryItems')
})



  
app.listen(3000,function(){
    console.log('app listening on port 3000')
})