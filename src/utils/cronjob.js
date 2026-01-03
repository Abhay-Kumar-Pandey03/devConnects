const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

    // console.log("Setting up cron job scheduler");

cron.schedule("0 8 * * *", async () => {
    // Schedule emails to all people who got requests yesterday
    // console.log("Inside cron job scheduler");
    try {
        console.log("Inside try block");
        const yesterday = subDays(new Date(), 1);
        const startOfYesterday = startOfDay(yesterday);
        const endofyesterday = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: startOfYesterday,
                $lt: endofyesterday
                //For more number of users we should use pagination here
            },
        }).populate("fromUserId toUserId");

        const listofAllEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

        for (const emails of listofAllEmails) {
            // Sending emails upto 500 users will work but for more users we should not use this synchronous approach
            // For more users we should use some queuing mechanism like RabbitMQ or AWS SQS or Amazon SES Bulk Emails or bee-queue or bullmq
            try {
                const res = await sendEmail.run(
                    emails,
                    "New connection request pending",
                    "Please respond to the connection requests you received yesterday."
                );
                console.log("Email sent successfully to " + emails);
            }
            catch (err) {
                console.error("Error occured while sending email to " + emails + " : " + err);
                // res.send("Error occured while sending email" + err);
            }
        }
    }
    catch (err) {
        // res.send("Error occured in cron job" + err);
        console.error("Error occured in cron job: " + err);
    }

},
{ timezone: "Asia/Kolkata" });



