/**
 * @param {GuildMember} member
 * @param {number} newLevel
 */

function updateNick(member, newLevel, userName, userId) {
    let roleEmoji = '';
    if (newLevel <= 100) {
        roleEmoji = '🥉 ';
    } else if (newLevel <= 500) {
        roleEmoji = '🥈 ';
    } else if (newLevel <= 1000) {
        roleEmoji = '🥇 ';
    } else if (newLevel <= 2000) {
        roleEmoji = '❇️ ';
    } else if (newLevel <= 5000) {
        roleEmoji = '💎 ';
    } else {
        roleEmoji = '👑 '; 
    }
    let newNickname = `${roleEmoji} Lv. ${newLevel} ${userName}`;
    //if it is me running the command set my nickname to my personal preference
    if (userId === '783036885299626015'){
        newNickname = `${roleEmoji} Lv. ${newLevel} Fr0styy.`;
    }
    try {
        member.setNickname(newNickname);
    } catch (err) {
        console.log('Error setting user nickname: ' + err.message);
    }
}
module.exports = {
    updateNick,
};