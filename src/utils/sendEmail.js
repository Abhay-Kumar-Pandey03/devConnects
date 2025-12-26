const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
    return new SendEmailCommand({
        Destination: {
            CcAddresses: [],
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<h1>${body}</h1>`,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the text format email",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async (toEmailId, subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
        "abhaysiddhu1000@gmail.com",
        "abhaypandey7067@gmail.com",
        subject,
        body
    );

    try {
        const result = await sesClient.send(sendEmailCommand);
        console.log("Email sent successfully", result);
        return result;
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };