export const name = "server";
export const description = "Show information about this server";

export async function execute(message) {
  const g = message.guild;
  if (!g) return message.reply("This command can only be used in a server.");
  const owner = await g.fetchOwner();
  const lines = [
    `**Name:** ${g.name}`,
    `**ID:** ${g.id}`,
    `**Members:** ${g.memberCount}`,
    `**Owner:** ${owner.user.tag}`,
    `**Created:** <t:${Math.floor(g.createdTimestamp/1000)}:R>`,
  ];
  await message.channel.send(lines.join('\n'));
}
