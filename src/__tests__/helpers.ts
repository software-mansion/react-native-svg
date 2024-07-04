export const sendToDeviceAndReceive = <R>(message: E2EMessage) => new Promise<R>((resolve) => {
    global.client.send(JSON.stringify(message));
    global.server.once('message', (message) => {
        const parsedMessage: E2EMessage = JSON.parse(message);
        resolve(parsedMessage as R);
    })
})
