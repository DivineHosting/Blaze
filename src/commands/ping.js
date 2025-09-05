export const name = "ping";
export const description = "Show bot latency";
export async function execute(message) {
  const sent = await message.channel.send("Pinging...");
  const latency = sent.createdTimestamp - message.createdTimestamp;
  await sent.edit(`Pong! Latency: ${latency}ms`);
}
