const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https")

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eMail;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
          //https://us19.admin.mailchimp.com/lists/settings/merge-tags?id=325374
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data); // this is to make the above js file to a json format flat file.
  const url = "https://us19.api.mailchimp.com/3.0/lists/10eb5d2863";
  const options = {
    method: "POST",
    auth: "xx"
    //check the auth method in both mail chimp and https to understand how the auth was added

  }
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
});
// process.env.PORT is for heroku to assign a port when launched and 3000 is for local.


