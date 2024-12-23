/**
 * Assigns a role to a member based on their level.
 * 
 * @param {GuildMember} member
 * @param {number} newLevel
 * @param {Guild} guild
 */
async function assignRole(member, newLevel, guild) {
    const roles = {
        bronze: '1319351132337733713',
        silver: '1319351242660646955',
        gold: '1319351386248577056', 
        emerald: '1319351508319473736',
        diamond: '1319390068678463609', 
        godTier: '1319393154344026193',
    };

    // Determine the role based on the level
    let roleToAdd;
    if (newLevel <= 100) {
        roleToAdd = roles.bronze;
    } else if (newLevel <= 500) {
        roleToAdd = roles.silver;
    } else if (newLevel <= 1000) {
        roleToAdd = roles.gold;
    } else if (newLevel <= 2000) {
        roleToAdd = roles.emerald;
    } else if (newLevel <= 5000) {
        roleToAdd = roles.diamond;
    } else {
        roleToAdd = roles.godTier;
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

// add function for managing players nicknames

module.exports = {
    assignRole,
};
