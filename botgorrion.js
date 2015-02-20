/*
    Bot documentacion
    class for performing various twitter actions
    http://www.apcoder.com/2013/10/15/targeted-twitter-bots-next-20-minutes/

    sumar redis para que cada funcion pueda compartir informacion
    sumar mongodb para guardar los datos de analisis que resulten relevantes

    https://dev.twitter.com/rest/reference/get/geo/search
    https://dev.twitter.com/rest/reference/get/statuses/show/%3Aid
    https://dev.twitter.com/rest/reference/get/friendships/incoming
    https://dev.twitter.com/rest/reference/get/lists/subscriptions
    https://dev.twitter.com/rest/reference/get/friendships/show
    https://dev.twitter.com/rest/public/search-by-place
    https://dev.twitter.com/rest/reference/get/search/tweets
*/

var Twit = require('twit');

var Bot = module.exports = function(config) {
    this.twit = new Twit(config);
};

//
//  post a tweet
//
Bot.prototype.tweet = function(status, callback) {
    if (typeof status !== 'string') {
        return callback(new Error('tweet must be of type String'));
    } else if (status.length > 140) {
        return callback(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', {
        status: status
    }, callback);
};

//
//  choose a random friend of one of your followers, and follow that user
//
Bot.prototype.mingle = function(callback) {
    var self = this;
    this.twit.get('followers/ids', function(err, reply) {
        if (err) {
            return callback(err);
        }

        var followers = reply.ids,
            randFollower = randIndex(followers);
        ////
        self.twit.get('friends/ids', {
            user_id: randFollower
        }, function(err, reply) {
            if (err) {
                return callback(err);
            }

            var friends = reply.ids,
                target = randIndex(friends);

            self.twit.post('friendships/create', {
                id: target
            }, callback);
        })
        ////
    })
};

//
//  prune your followers list; unfollow a friend that hasn't followed you back
//
Bot.prototype.prune = function(callback) {
    var self = this;

    this.twit.get('followers/ids', function(err, reply) {
        if (err) return callback(err);

        var followers = reply.ids;
        console.log(reply.statuses);
        self.twit.get('friends/ids', function(err, reply) {
            if (err) return callback(err);

            var friends = reply.ids,
                pruned = false;

            while (!pruned) {
                var target = randIndex(friends);

                if (!~followers.indexOf(target)) {
                    pruned = true;
                    self.twit.post('friendships/destroy', {
                        id: target
                    }, callback);
                }
            }
        });
    });
};
//
//

Bot.prototype.searchFollow = function(params, callback) {
    var self = this;

    self.twit.get('search/tweets', params, function(err, reply) {
        if (err) return callback(err);
        console.log(reply.statuses);
        var tweets = reply.statuses;
        var target = randIndex(tweets).user.id_str;

        self.twit.post('friendships/create', {
            id: target
        }, callback);
    });
};

//
// retweet
//
Bot.prototype.retweet = function(params, callback) {
    var self = this;

    self.twit.get('search/tweets', params, function(err, reply) {
        if (err) return callback(err);
        console.log(reply.statuses);
        var tweets = reply.statuses;
        var randomTweet = randIndex(tweets);

        self.twit.post('statuses/retweet/:id', {
            id: randomTweet.id_str
        }, callback);
    });
};

//
// favorite a tweet
//
Bot.prototype.favorite = function(params, callback) {
    var self = this;

    self.twit.get('search/tweets', params, function(err, reply) {
        if (err) return callback(err);
        console.log(reply.statuses);
        var tweets = reply.statuses;
        var randomTweet = randIndex(tweets);

        self.twit.post('favorites/create', {
            id: randomTweet.id_str
        }, callback);
    });
};
//
//
// analisar cada twitt, contar cauntos fueron retweet, favorite, cosas asi .. 
// 
//
Bot.prototype.infocounts = function(params, callback){
    var self = this;
    var result = {"COUNTTWEETS":"", "COUNTFOLLOWING":"", "COUNTFOLLOWERS":"", 
    "COUNTFAVORITES":"", "COUNTLISTS":"", "INFLUENCE":false}

    self.twit.get('users/show', params,  function(err, reply) {
        if (err) return callback(err);
        
        result["USER"] = reply["screen_name:"]
        result["COUNTTWEETS"] = reply["statuses_count"]
        result["COUNTFOLLOWING"] = reply["friends_count"]
        result["COUNTFOLLOWERS"] = reply["followers_count"]
        result["COUNTFAVORITES"] = reply["favourites_count"]
        result["COUNTLISTS"] = reply["listed_count"]
        result["INFLUENCE"] = reply["followers_count"] > reply["friends_count"]

        callback(result) 
    });
};
//
// params = {source_screen_name:"labgcba", target_screen_name:"ArielEdiciones"}
//
Bot.prototype.relation = function(params, callback){
    var self = this;

    self.twit.get("friendships/show", params, function(err, reply) {
        if (err) return callback(err);
        // some code 
        callback()
    });

};
//
Bot.prototype.getID = function(ids, params, callback){
    var self = this;
    var listfollwers = [];
    self.twit.get(ids, params, function(err, data, response) {
        if (err){
            console.log(err)
        } else {
            if(data.hasOwnProperty('ids')){
                data.ids.forEach(function(elem, index, array){
                    listfollwers.push(elem);
                });
            }
        }
        callback(listfollwers)
    });
}
//{lat:"37.7821120598956", long:"-122.400612831116"}
Bot.prototype.geo = function(ids, params, callback){
    var self = this;  
    self.twit.get("geo/search", params, function(err, data, res){
        if (err) console.log(err);
        callback(data['result']['places'])
    });
}
//
Bot.prototype.perfil = function(insert, callback){
    // darle perfil al gorrion
    /*

    */
}
//

Bot.prototype.metadatos = function(id, params, callback) {
    var self = this;  
    self.twit.get('statuses/show/:id', {
        id: id, //user id o twit id
        trim_user: true,
        include_my_retweet: true,
        include_entities: true
    }, function(err, data, response) {
        if (err) {
            callback(err)
        } else {
            callback(data)
        }
    })
}

function randIndex(arr) {
    var index = Math.floor(arr.length * Math.random());
    return arr[index];
};