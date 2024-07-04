const replacer = (key: string, value: any) => {
  if (key === 'type' && typeof value !== 'string') return value.displayName;
  return value;
};

export const sendToDeviceAndReceive = <R>(message: E2EMessage) =>
  new Promise<R>((resolve) => {
    global.client.send(JSON.stringify(message, replacer));
    global.client.once('message', (message) => {
      const parsedMessage: E2EMessage = JSON.parse(message.toString('utf-8'));
      resolve(parsedMessage as R);
    });
  });
