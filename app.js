'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();


app.post('/api/messages', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});


function handleEvent(event) {
    // only deal with text and image, ignore other events
    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
                case 'image':
                    return handleImage(message, event.replyToken);
                default:
                    return Promise.resolve(null);
            }
        default:
            return Promise.resolve(null);
    }
}


function handleText(message, replyToken, source) {
    return client.replyMessage(
        replyToken, {
            type: 'text',
            text: message.text
        }
    );
}

function handleImage(message, replyToken) {
    return client.replyMessage(
        replyToken, {
            type: 'text',
            text: 'image get!'
        }
    );
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});