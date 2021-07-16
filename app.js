const { App } = require('@slack/bolt');
let fetch = require('node-fetch');
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

// Listens to incoming messages that contain "hello"
app.message('meow', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `puurrrrr <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me for a Cat"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});
/*
app.message('catpic', async ({ message, say }) => {
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": 'test reply'
                },
            }
        ]
    })
});*/

// Pre: Action triggered when the "Click Me for a Cat" button is pressed
// Post: Pulls a cat image from the specified URL and display it in the current Slack channel
app.action('button_click', async ({ body, ack, say }) => {
    await ack();
    let URL = 'https://api.pexels.com/v1/search?query=cat&per_page=1&page=' + Math.floor((Math.random() * 20) + 1);
    let photo_response = await fetch(URL, {
        headers: { 'Authorization': process.env.API_KEY }
    });

    let photo = (await photo_response.json()).photos[0];

    await say({
        blocks: [
            {
                "type": "divider"
            },
            {
                "type": "image",
                "image_url": photo.src.medium,
                "alt_text": "cat photo"
            }
        ]
    });
});

(async () => {
  // Starts the app on the specified port
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();