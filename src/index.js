const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", async (message) => {
    const msg = message.body.trim();

    if (msg === "!ping" || msg === "ping" || msg === "p") {
        message.reply(
            "pong 👋 \n\n\n\n_Pesan ini dikirim secara otomatis dengan bot_"
        );
    }

    //
    else if (msg === "!meme") {
        try {
            const response = await axios(
                "https://candaan-api.vercel.app/api/image/random"
            ).then((res) => res.data);

            if (response.status !== 200) {
                throw new Error("Failed to get data with status ", res.status);
            }

            const meme = response.data;

            const pesan = await client.sendMessage(
                message.from,
                await MessageMedia.fromUrl(meme.url)
            );
            pesan.reply("_pesan ini dikirim menggunakan bot_");
        } catch (error) {
            console.log(
                "\n\n #################    ERROR   ################### \n\n"
            );
            console.log(error);

            console.log(
                "\n\n ################################################ \n\n"
            );
        }
    }
});

client.initialize();
