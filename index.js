const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const { prefix, token, serverid, rainbowroles, muterol, reportchannel, generalchatid, defaultrole, defaultroleonoff, welcome, warningcount, bd_h, bd_u, bd_p, bd_d, table} = require('./config.json');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));
var weather = require('weather-js');
var perms = [];
var coins = JSON.parse(fs.readFileSync('coins.json'));
var IsAuth = false;
/* RAINBOW START */
var interval;
let place = 0;
const size    = 85;
const rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = '#'+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? '0'+hex : hex;
}
/* RAINBOW END */

client.login(token);


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`${prefix}info`, { type: 'LISTENING' }).catch(console.error);
    IsAuth = true;
});

checkbd();

/*COINS SYSTEM*/
// client.on("message", async message => {
    
//     if(!coins[message.author.id]){
//         coins[message.author.id] = {
//             coins: 0
//         }
//     };

//     let coinAmt = Math.floor(Math.random() * 1) + 1;
//     let baseAmt = Math.floor(Math.random() * 1) + 1;

//     if(coinAmt === baseAmt){
//         coins[message.author.id] = {
//             coins: coins[message.author.id].coins + coinAmt
//         };
//         fs.writeFile("./coins.json", JSON.stringify(coins), (err) =>{
//             if (err) console.log(err)
//         });
//     }
// });

client.on('guildMemberAdd', member => {
    if(defaultroleonoff == "on"){
        let role = client.guilds.get(serverid).roles.find('name', defaultrole).id;
        member.addRole(role);
    }else if(defaultroleonoff == "off"){
        console.log("addrole new member: off");
    }
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(serverid).roles.find('name', muterol);
        member.addRole(muterol.id);
    }
    var newUsers = '';
    const guild = member.guild;
    //newUsers.set(member.id, member.user);
    const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
    color = 16777215;
    title = '[welcome!]';
    text = `${member}, ${welcome}`;
    defaultChannel.send(infomessage(color, title, text));
})

client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)) return checkForMatWords(message);
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "info") {
        if(!args.length) {
            color = 16777215;
            title = `[${prefix}info]`;
            text = `список моих команд(чтобы узнать информацию о команде, пиши, например, **${prefix}info 1**):\n**1. ${prefix}radmin**\n**2. ${prefix}mute**\n**3. ${prefix}addmat**\n**4. ${prefix}unmute**\n**5. ${prefix}muted**\n**6. ${prefix}github**\n**7. ${prefix}kick**\n**8. ${prefix}ban**\n**9. ${prefix}unban**\n**10. ${prefix}rainbow**\n**11. ${prefix}coin**\n**12. ${prefix}exit**\n**13. ${prefix}report**\n**14. ${prefix}warnings**\n**15. ${prefix}rwarnings**\n**16. ${prefix}admin**\n**17. ${prefix}weather**`;
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        } else if(args[0] == "1") {
            color = 16777215;
            title = `[${prefix}info]`;
            text = `${prefix}radmin @user - удалить пользователя из админов.`;
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        }
        if(args[0] == "2"){
            color = 16777215;
            title = `[${prefix}info 2]`;
            text = `добавляет пользователя в мут. Пример: ${prefix}mute @user 1h [причина мута].`;
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        }
        if(args[0] == "3"){
            color = 16777215;
            title = `[${prefix}info 3]`;
            text = "добавляет слово в черный список !addmat [слово]";
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "4"){
            color = 16777215;
            title = `[${prefix}info 4]`;
            text = "убирает человека из мута. Пример: !unmute @user";
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "5"){
            color = 16777215;
            title = `[${prefix}info 5]`;
            text = "показывает пользователей, которые находятся в муте и сколько им осталось сидеть.";
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "6"){
            color = 16777215;
            title = `[${prefix}info 6]`;
            text = "ссылка на исходный код бота.";
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        }
        if(args[0] == "7"){
            color = 16777215;
            title = `[${prefix}info 7]`;
            text = `${prefix}kick @user - выгоняет пользователя с сервера.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "8"){
            color = 16777215;
            title = `[${prefix}info 8]`;
            text = `${prefix}ban @user - банит пользователя на сервере.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "9"){
            color = 16777215;
            title = `[${prefix}info 9]`;
            text = `${prefix}unban ID - разбанит пользователя на сервере.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "10"){//!rainbow start/stop - радужная роль. Команда !rainbow stop срабатывает не сразу, через какое-то время!
            color = 16777215;
            title = `[${prefix}info 10]`;
            text = `${prefix}rainbow start/stop - радужная роль. Команда ${prefix}rainbow stop срабатывает не сразу, через какое-то время!`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "11"){
            color = 16777215;
            title = `[${prefix}info 11]`;
            text = `${prefix}coin - Монетка. Либо вы победите, либо проиграете.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
            /*const embed = new Discord.RichEmbed()
                .setColor(16777215)
                .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
                .addField("[!info 11]", "!coin - Монетка. Либо вы победите, либо проиграете.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
            */
        }
        if(args[0] == "12"){
            color = 16777215;
            title = `[${prefix}info 12]`;
            text = `${prefix}exit - выключает/перезагружает бота.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "13"){
            color = 16777215;
            title = `[${prefix}info 13]`;
            text = `${prefix}report @user [Текст] - отправлет жалобу на пользователя администратору.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "14"){
            color = 16777215;
            title = `[${prefix}info 14]`;
            text = `${prefix}warnings или ${prefix}warnings @user - посмотреть количество предупреждений у себя и у пользователя.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "15"){
            color = 16777215;
            title = `[${prefix}info 15]`;
            text = `${prefix}rwarnings и ${prefix}rwarnings @user - удалить все предупреждения у себя или пользователя.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "16"){
            color = 16777215;
            title = `[${prefix}info 16]`;
            text = `${prefix}admin @user - добавить пользователя в админы для бота.`;
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
    }
    if(commandName == "exit") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
            client.destroy().then(process.exit);
            return;
        }
    if(commandName == "clean"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }    
        async function clear() {
            if(!args[0]){
                color = 16711680;
                title = `[${prefix}clean]`;
                text = `Введи число сообщений, которое хочешь удалить (0-100) ${prefix}clean 100`;
                message.channel.send(infomessage(color, title, text));
                return
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]}); //Захватывает последнее число (args) сообщений в канале.
            console.log(fetched.size + ' сообщений(е,я) найдено и удалено...');
            message.channel.bulkDelete(fetched).then(() => {
                color = 16777215;
                title = `[${prefix}clean]`;
                text = `Было удалено **${fetched.size}** сообщений(e/я)!`;
                message.channel.send(infomessage(color, title, text));
            }) 
        }clear(); //Чтобы работала команда
    return;
};
    if(commandName == "mute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        Mute(message, args);
        return;
    }

    if(commandName == "rwarnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}rwarnings]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            color = 16777215;
            title = `[${prefix}rwarnings]`;
            text = `У вас удалены все предупреждения!`;
            message.channel.send(infomessage(color, title, text));
            delete infobanlist[message.author.id];
            return;
        }
        delete infobanlist[member.id];
        color = 16734464;
        title = `[${prefix}rwarnings]`;
        text = `Все предупреждения у пользователя ${member} удалены!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "warnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            if(!infobanlist[message.author.id]){
                color = 16777215;
                title = `[${prefix}warnings]`;
                text = `У вас  **0** предупреждений(я/е)!`;
                message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У вас  **${infobanlist[message.author.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }else{
            if(!infobanlist[member.id]){
                color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У пользователя ${member},  **0** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У пользователя ${member},  **${infobanlist[member.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }

    if(commandName == "admin"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
         if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}admin]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            color = 16734464;
            title = `[${prefix}admin]`;
            text = `Используйте ${prefix}admin @user!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        var zapros = `INSERT INTO bot.${table} (user, role) VALUES (${member.id}, 'root');`;
        mysqlzapros(zapros);
        checkbd();
        color = 16734464;
        title = `[${prefix}admin]`;
        text = `Пользователь ${member} добавлен в админы!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }
//DELETE FROM `bot`.`perms` WHERE  `ID`=00000000014;
        if(commandName == "radmin"){
            console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
             if(perms['root'].indexOf(message.author.id) == -1){
                color = 16711680;
                title = `[${prefix}radmin]`;
                text = `У тебя нет прав для выполнения данной команды!`;
                message.channel.send(infomessage(color, title, text));
                console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
            }
            let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if(!member){
                color = 16734464;
                title = "[!radmin]";
                text = `Используйте ${prefix}radmin @user!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }
            var zapros = `DELETE FROM bot.${table} WHERE user = ${member.id};`;
            mysqlzapros(zapros);
            color = 16734464;
            title = `[${prefix}radmin]`;
            text = `Пользователь ${member} удалён из админов!`;
            message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "addmat") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}addmat]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        var replace = /\[(.*?)\]/ism;
        var matches = replace.exec(message.content); 
        if(!matches){
            color = 16734464;
            title = `[${prefix}addmat]`;
            text = `Используйте ${prefix}addmat [слово]!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(matches[1]) badwordslist.push("^"+matches[1]+"$"); return message.channel.send(`Добавлено новое слово в черный список --> ${matches[1]}`);
        return;
    }
    if(commandName == "unmute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}unmute]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16734464;
            title = `[${prefix}unmute]`;
            text = `Используйте ${prefix}unmute @user!`;
            message.channel.send(infomessage(color, title, text));
            return
        }else{
            color = 16734464;
            title = `[${prefix}unmute]`;
            text = `Пользователь убран из мута (${member})!\nУ него ${infobanlist[member.id]} предупреждений(я)! Бан даётся при ${warningcount} предупреждениях!`;
            message.channel.send(infomessage(color, title, text));
            let role = client.guilds.get(serverid).roles.find('name', muterol).id;
            member.removeRole(role);
            delete mutedlist[member.id];
        }
        return;
    }
    
    if(commandName == "muted") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var text = '';
        for (var key in mutedlist) {
            text += `\nПользователь <@${key}> сидит ещё ${ms(mutedlist[key])}`;
        }
        if(text == ""){
            color = 5504768;
            title = `[${prefix}muted]`;
            text = `Пользователей в муте нет!`;
            message.channel.send(infomessage(color, title, text));
        } else {
            color = 5504768;
            title = `[${prefix}muted]`;
            text = `${text}`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }
    if(commandName == "github"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        color = 5504768;
        title = `[${prefix}github]`;
        text = `\nМой github - [жми](https://github.com/cheesegaproj/chatbot)`;
        message.channel.send(infomessage(color, title, text));
        return;
    }
    
    if(commandName == "kick"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}kick]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${prefix}kick]`;
            text = `Используйте ${prefix}kick @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
        color = 16734464;
        title = `[${prefix}kick]`;
        text = `${member} кикнут с сервера!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "ban"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}ban]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${prefix}ban]`;
            text = `Используйте ${prefix}ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
        color = 16734464;
        title = `[${prefix}ban]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if (commandName == "unban") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}unban]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        const user = args[0];
        if(!args[0]){
            color = 16711680;
            title = `[${prefix}unban]`;
            text = `Используйте !ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        message.guild.unban(user);
        console.log(`Unbanned ${user}`);
        color = 16734464;
        title = `[${prefix}unban]`;
        text = `${user} разбанен на сервере!`;
        message.channel.send(infomessage(color, title, text));
        return;  
    }
    if(commandName == "rainbow"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}rainbow]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(args[0] == "start") {
            if(interval == undefined) interval = setInterval(() => { discoRole(message); }, 250);
            color = 16711867;
            title = `[${prefix}rainbow start]`;
            text = `Радуга началась!`;
            message.channel.send(infomessage(color, title, text));
            return;
        } else if(args[0] == "stop") {
            clearInterval(interval); 
            interval = undefined;
            color = 24575;
            title = `[${prefix}rainbow stop]`;
            text = `Радуга останавливается!`;
            message.channel.send(infomessage(color, title, text));
            return;
        } else {
            color = 16711680;
            title = `[${prefix}rainbow]`;
            text = `Используйте ${prefix}rainbow start или ${prefix}rainbow stop`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        return;
    }
    if(commandName == "coin"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 0;
        if(rand == "0"){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
                .setThumbnail("https://images-ext-1.discordapp.net/external/psw8bjb7MLk5ifrtsyYLtYf_UORozzkQrctGwklKc7U/https/i.imgur.com/ZyCwWuE.png")
                .addField("Coin", "\nВы проиграли")
                message.channel.send(embed);
        }else{
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
                .setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
                .addField("Coin", "\nВы выиграли")
            message.channel.send(embed);
        }
        return
    }

    if(commandName == "report"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let user = message.guild.member(message.mentions.users.first());
        if(!user){
            color = 16711680;
            title = `[${prefix}report]`;
            text = `Вы не упомянули пользователя и не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser){
            color = 16711680;
            title = `[${prefix}report]`;
            text = `Вы не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(infomessage(color, title, text));
            message.reply("ваша жалоба на пользователя отправлена! Ваше сообщение с командой !report было удалено.");
            message.delete(message.author.id);
        return;
    }
    if(commandName == "weather"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(!args[0]){
            color = 16711680;
            title = `[${prefix}weather]`;
            text = `Укажите город! ${prefix}weather Город`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        weather.find({search: args[0], degreeType: 'C'}, function(err, result) { //degreeType - тип градуса(С - цельсий, F - фаренгейт)
        if(err) console.log(err);
        if(!result[0]){
            color = 16711680;
            title = `[${prefix}weather]`;
            text = `Город не был найден!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        // Переменные
        var current = result[0].current;
        var location = result[0].location;
            
        const weather = new Discord.RichEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Погода в ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(16777215)
            .addField('Температура',`${current.temperature} градусов`, true)
            .addField('Ветер',current.winddisplay, true)
            .addField('Влажность', `${current.humidity}%\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`, true)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png");
            message.channel.send(weather);
        });
        return;
    }
    /*
    if(commandName == "coins"){
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            if(coins[message.author.id] == undefined) coins[message.author.id] = {coins: 0};
            let coinembed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setColor("#00FF00")
                .addField("💰", coins[message.author.id].coins);
                message.channel.send(coinembed);
            return;
        } else {
            if(coins[member.id] == undefined) coins[member.id] = {coins: 0};
            let coinembed = new Discord.RichEmbed()
                .setAuthor(member.user.username)
                .setColor("#00FF00")
                .addField("💰", coins[member.id].coins);
                message.channel.send(coinembed);
            return;
        }
    }
    */
    console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot! This command off in bot or undefined`);
    color = 16711680;
    title = `[Error]`;
    text = `Эта комнанда не найдена! Напишите ${prefix}info чтобы узнать список команд`;
    message.channel.send(infomessage(color, title, text));
    
    function discoRole(message) {
        rainbowroles.forEach(async function(element, index, array) {
            let theRole = message.guild.roles.find("name", element);
            if(!theRole) return;
                theRole.edit({color: rainbow[place]}).catch(e => {
                    console.error(e);
                });
            if(place == (size - 1)) {
                place = 0;
            } else {
                place++;
            }
        })
    }
});


function infomessage(color, title, text) {
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        
        return embed;

    }    

function Mute(message, args, auto) {
    console.log(`detected badwordslist for bot and give mute!`);
    let tomute;
    if(!auto) tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(auto) tomute = message.guild.members.get(args[0]);
    if(!tomute){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField(`[${prefix}mute]`, `Используйте ${prefix}mute @user 1s/m/h/d!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    let mutetime = args[1];
    if(!mutetime){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")          
            .addField("[!mute]", `Вы не указали время!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
        return
    }
    let reason = args[2];
    if(ms(mutetime) == 0) mutetime = "∞"; 
    if(!reason) {
        reason = "Unspecified.";
    } else {
        if(!auto) {
            var replace = /\[(.*?)\]/ism;
            var matches = replace.exec(message.content); 
            if(matches[1] != undefined) { reason = matches[1]; } else { reason = "Unspecified."; }
        } else {reason = args[2]}
    }
    let role = client.guilds.get(serverid).roles.find('name', muterol).id;
    if(!auto) { mod = message.author.id; } else { mod = client.user.id; }
    tomute.addRole(role).then(function() {
        let user = client.guilds.get(serverid).members.get(tomute.id).user;
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField("User", `<@${tomute.id}>`, true)
            .addField("Moderator", `<@${mod}>`, true)
            .addField("Reason", `${reason}`, true)
            .addField("Duration", `${mutetime}`, true)
            message.channel.send(embed);
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
        //infobanlist[tomute.id].push(1);
        infobanlist[tomute.id] += 1;
        return;
    });
}

function checkForMatWords(message) {
    content = message.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    arr = content.split(" ");
    for (var key in badwordslist) {
        pattern = new RegExp(badwordslist[key], "gi");
        for (var key in arr) {
            if(arr[key].search(pattern) != -1) {
                data = [message.author.id,'6h', 'Нецензурные выражения'];
                Mute(message, data, true);
                message.delete(5000);
                return;
            }
        }
    }
}

function UnMute(channel, id) {
    console.log(`Update badwordslist remove`);
    if(!IsAuth) return false;
    let role = client.guilds.get(channel).roles.find('name', muterol).id;
    member = client.guilds.get(channel).members.get(id);
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    if(infobanlist[member.id] == warningcount){
        member.ban();
        color = 16734464;
        title = `[${prefix}unmute]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        send(client.guilds.get(channel).channels.find('id', generalchatid), infomessage(color, title, text));
        delete infobanlist[member.id];
        return true;
    }
    color = 16734464;
    title = `[${prefix}unmute]`;
    text = `Пользователь убран из мута(<@${id}>)!\nУ него ${infobanlist[id]} предупреждений(я)! Бан даётся при ${warningcount} предупреждениях!`;
    send(client.guilds.get(channel).channels.find('id', generalchatid), infomessage(color, title, text));
    return true;
}

function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute(serverid, key)) delete mutedlist[key];//ID сервера
        } else {
            mutedlist[key] = mutedlist[key] - 1;
        }
    }
}

setInterval(minusMutedList, 1);

function saveMutedList() {
    fs.writeFile('muted.json', JSON.stringify(mutedlist), function() {/*console.log(whitelist);*/});
}
setInterval(saveMutedList, 1000);

function saveBadWordsList() {
    fs.writeFile('words.json', JSON.stringify(badwordslist), function() {/*console.log(badwordslist);*/});
}
setInterval(saveBadWordsList, 1000);

function saveinfobanlist() {
    fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(badwordslist);*/});
}
setInterval(saveinfobanlist, 1000);

function mysqlzapros(zapros){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : bd_h,
      user     : bd_u,
      password : bd_p,
      database : bd_d
    });

    connection.connect();
            connection.query(zapros);
    connection.end();
}

function checkbd(){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : bd_h,
      user     : bd_u,
      password : bd_p,
      database : bd_d
    });
    connection.connect();
    var zapros = `SELECT * FROM ${table} WHERE role = "root"`;
            connection.query(zapros, function(err, rows, fields) {
            console.log('Checking database...');
            rows.forEach(function(element, index, array) {
                if(!perms[element.role]) perms[element.role] = [];
                perms[element.role].push(element.user);
                })
            })
    connection.end();
}

setInterval(checkbd, 300000);