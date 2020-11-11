var mongoose = require("mongoose");
var Topic    = require("./models/topic");
var Comment  = require("./models/comment");

var data = [
    {
        name: "Music Theory Field Manual",
        image: "https://images-na.ssl-images-amazon.com/images/I/41mOx3F1dzL._SX260_.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
    },
    {
        name: "Rockstars",
        image: "http://www.romancerehab.com/uploads/7/2/0/3/72036153/rockstar-list-2_orig.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
    },
    {
        name: "Buckethead",
        image: "http://www.metalsucks.net/wp-content/uploads/2011/05/buckethead-modern-metal-guitarists.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
    },
];

function seedDB(){
    //Remove all Topics
  Topic.remove({}, function(err){
        if(err){
            console.log(err);
        }
      console.log("Removed All Topics from the DB!"); 
      //remove });and } below and uncomment before "Add a few Topics if you want to seed the db" 
  });
}
      // Add a few Topics
    //     data.forEach(function(seed){
    //       Topic.create(seed, function(err, topic){
    //           if(err){
    //               console.log(err);
    //           } else {
    //               console.log("Added Topic!");
    //               //Create a Comment
    //               Comment.create(
    //                   {
    //                       text: "This is the best stuff ever!",
    //                       author: "Chris"
    //                   }, function(err, comment){
    //                         if(err){
    //                             console.log(err);
    //                         } else {
    //                             topic.comments.push(comment);
    //                             topic.save();
    //                             console.log("Created New Comment");
    //                         }
    //                     });
    //               }
    //           });
    //     });
    // });  
    
    
    //Add a few comments
//}

module.exports = seedDB;