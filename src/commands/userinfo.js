export const name = "userinfo";
export const description = "Show information about a user";

export async function execute(message) {
  const user = message.mentions.users.first() || message.author;
  const member = message.guild?.members.cache.get(user.id);
  const roles = member ? member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name).join(', ') || 'None' : 'N/A';

  const lines = [
    `**Tag:** ${user.tag}`,
    `**ID:** ${user.id}`,
    `**Created:** <t:${Math.floor(user.createdTimestamp/1000)}:R>`,
    member ? `**Joined:** <t:${Math.floor(member.joinedTimestamp/1000)}:R>` : '',
    member ? `**Roles:** ${roles}` : ''
  ].filter(Boolean);

  await message.channel.send(lines.join('\n'));
}
