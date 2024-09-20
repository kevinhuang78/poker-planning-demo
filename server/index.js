const WebSocket = require('ws');
const url = require('url');

const wss = new WebSocket.Server({ port: 8080 });

let allUsers = [];
let areCardsFlipped = false;

wss.getUniqueID = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
wss.on('connection', function connection(ws, req) {
    const { query: { client_id, default_username } } = url.parse(req.url, true);
    ws.id = wss.getUniqueID();
    ws.clientId = client_id;
    ws.defaultUsername = default_username;

    if (client_id === ws.clientId) {
        allUsers.push({ id: ws.id, clientId: ws.clientId, defaultUsername: ws.defaultUsername });
        allUsers = allUsers.filter((obj1, i, arr) =>
            arr.findIndex(obj2 => (obj2.clientId === obj1.clientId)) === i
        );
    }

    ws.on('close', function onClose() {
        allUsers = allUsers.filter((user) => user.clientId !== ws.clientId)
    });

    ws.on('message', function incoming(data, isBinary) {
        const message = isBinary ? data : data.toString();
        const parsedMessage = JSON.parse(message);

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                if (parsedMessage.type === 'card_info') {
                    areCardsFlipped = parsedMessage.areCardsFlipped;
                    if (parsedMessage.areCardsFlipped === false) {
                        allUsers = allUsers.map((user) => ({ ...user, cardValue: undefined }));
                    }
                    client.send(message);
                    client.send(JSON.stringify({ type: 'info', data: { allUsers } }));
                }

                if (parsedMessage.type === 'card') {
                    const userToReplace = allUsers.find(({ clientId }) => clientId === parsedMessage.clientId);
                    if (userToReplace) Object.assign(userToReplace, {...userToReplace, username: parsedMessage.username, cardValue: parsedMessage.value });
                    client.send(JSON.stringify({ type: 'info', data: { allUsers } }));
                }

                if (client === ws) {
                    if (parsedMessage.type === 'get_data') {
                        client.send(JSON.stringify({ type: 'info', data: { allUsers } }));
                        client.send(JSON.stringify({ type: 'card_info', areCardsFlipped }));
                    }
                }

                // Send to all clients except itself
                if (client !== ws) {
                    if (parsedMessage.type === 'message') {
                        const userToReplace = allUsers.find(({ clientId }) => clientId === parsedMessage.clientId);
                        if (userToReplace) Object.assign(userToReplace, {...userToReplace, username: parsedMessage.username });
                    }

                    if (parsedMessage.type === 'info') {
                        if (!!parsedMessage.data.disconnectedUser) {
                            allUsers = allUsers.filter((user) => user.clientId !== parsedMessage.data.disconnectedUser)
                        }
                    }

                    client.send(message);
                }
            }
        });
    });
});
