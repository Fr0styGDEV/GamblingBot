/**
 * Assigns a role to a member based on their level.
 * 
 * @param {GuildMember} member - The Discord member to assign the role to.
 * @param {number} newLevel - The member's new level.
 * @param {Guild} guild - The Discord guild (server) where the roles are managed.
 */
async function assignRole(member, newLevel, guild) {
    const roles = {
        bronze: '1319351132337733713', // Replace with your Bronze role ID
        silver: '1319351242660646955', // Replace with your Silver role ID
        gold: '1319351386248577056', // Replace with your Gold role ID
        emerald: '1319351508319473736', // Replace with your Emerald role ID
    };

    // Determine the role based on the level
    let roleToAdd;
    if (newLevel <= 100) {
        roleToAdd = roles.bronze;
    } else if (newLevel <= 500) {
        roleToAdd = roles.silver;
    } else if (newLevel <= 1000) {
        roleToAdd = roles.gold;
    } else {
        roleToAdd = roles.emerald;
    }

    // Fetch all roles of the guild
    const allRoles = Object.values(roles);

    try {
        // Remove all level-based roles
        await member.roles.remove(allRoles.filter(roleId => guild.roles.cache.has(roleId)));

        // Assign the new role
        if (roleToAdd) {
            await member.roles.add(roleToAdd);
        }
    } catch (err) {
        console.error(`Failed to assign role for member ${member.user.tag}:`, err);
    }
}

module.exports = {
    assignRole,
};
