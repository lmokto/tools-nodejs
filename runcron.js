var cron = require('cron');
//http://stackoverflow.com/questions/20499225/i-need-a-nodejs-scheduler-that-allows-for-tasks-at-different-intervals
var every_second = '* * * * * *', //- runs every second
	every_5_seconds = '*/5 * * * * *', // - runs every 5 seconds
	every_minute = '0 * * * * *', //- runs every minute
	every hour  = '0 0 * * * *', // - runs every hour (at 0 minutes and 0 seconds)
	other = '10,20,30 * * * * *'; // - run at 10th, 20th and 30th second of every minute
//
var cronJob = cron.job('*/5 * * * * *', function(){
	console.log('cron job complete')
});
//
cronJob.start();