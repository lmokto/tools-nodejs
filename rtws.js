var Tw = require('twit')
	, async = require('async')
	, host = 'mongodb://localhost:27017/tws';
	, mongoose = require('mongoose').connect(host);

var TwitSave = new mongoose.Schema({
    hashtag: String,
    username: String,
    twit: String,
    fecha: String,
});

var twsave = mongoose.model('recolectados', TwitSave);

var T = new Tw({
    consumer_key: '',
    consumer_secret: '',
    access_token: ''  ,
    access_token_secret: ''
});

var hashtags = ["#hashtag1", "#hashtag2", "#hashtagN"],
	len = hashtags.length,
	count = 0;

console.log("###############################################");
console.log("###############################################");

setInterval(function() {
    if (count === len) {
        count = 0
    }
    console.log("###############################################");
    console.log("hashtag query search: " + hashtags[count]);
    T.get('search/tweets', {
        q: hashtags[count],
        count: 200
    }, function(err, reply) {
        if (err) {
            console.dir(err);
        } else {
            for (var i = 0; i < reply.statuses.length; i++) {
                var status = reply.statuses[i];
                console.log(hashtags[count]);
                console.log('*************************');
                console.log('  username: ' + status.user.name);
                console.log('   ' + status.text);
                console.log('  time/date: ' + status.created_at);
                console.log('*************************');
                twtsave = new twsave({
                    "hashtag": hashtags[count],
                    "username": status.user.name,
                    "twit": status.text,
                    "fecha": status.created_at
                }).save()
            }
            count += 1
        }
    })
}, 55000);