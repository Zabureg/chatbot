const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const permissions = require('./permissions.js');
const { prefix, token, serverid, rainbowroles, muterol, reportchannel, generalchatid} = require('./config.json');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));
var IsAuth = false;
/* RAINBOW START */
var interval;
let place = 0;
const size    = 100;
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
    client.user.setActivity(`${prefix}инфо`, { type: 'LISTENING' }).catch(console.error);
	IsAuth = true;
});

client.on('guildMemberAdd', member => {
    //member.addRole('427571570991431710');
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(serverid).roles.find('name', muterol);
        member.addRole(muterol.id);
    }
    var newUsers = '';
    const guild = member.guild;
    //newUsers.set(member.id, member.user);
    const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
    defaultChannel.send(`${member}, приветствую тебя на сервере! Пиши **!инфо**, чтобы посмотреть список команд. \nОбязательно посети чат **#faq и #regulations**.`);});

client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)) return checkForMatWords(message);
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "инфо") {
		if(!args.length) {
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо]", "список моих команд(чтобы узнать информацию о команде, пиши, например, `!инфо 1`):\n**1. `!clear`**\n**2. `!mute`**\n**3. `!addmat`**\n**4. `!unmute`**\n**5. `!muted`**\n**6. `!github`**\n**7. `!kick`**\n**8. `!ban`**\n**9. `!unban`**\n**10. `!rainbow`**\n**11. `!coin`**\n**12. `!exit`**\n**13. `!report`**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
		} else if(args[0] == "1") {
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 1]", "!clear число - чистит чат от команд и сообщений бота\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "2"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 2]", "добавляет пользователя в мут. Пример: !mute @user 1h [причина мута].\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "3"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 3]", "добавляет определенное слово в черный список, за которое пользователь будет попадать в мут. Пример: !addmat [пипка].\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "4"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 4]", "убирает человека из мута. Пример: !unmute @user\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
              message.channel.send(embed);            
              return;
        }
        if(args[0] == "5"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 5]", "показывает пользователей, которые находятся в муте и сколько им осталось сидеть.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "6"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 6]", "ссылка на исходный код бота.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
              message.channel.send(embed);
            return;
        }
        if(args[0] == "7"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 7]", "!kick @user - выгоняет пользователя с сервера.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "8"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 8]", "!ban @user - банит пользователя на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "9"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 9]", "!unban ID - разбанит пользователя на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "10"){//!rainbow start/stop - радужная роль. Команда !rainbow stop срабатывает не сразу, через какое-то время!
		const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 10]", "!rainbow start/stop - радужная роль. Команда !rainbow stop срабатывает не сразу, через какое-то время!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "11"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 11]", "!coin - Монетка. Либо вы победите, либо проиграете.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "12"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 12]", "!exit - выключает/перезагружает бота.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
        if(args[0] == "13"){
			const embed = new Discord.RichEmbed()
				.setColor(16777215)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!инфо 13]", "!report @user [Текст] - отправлет жалобу на пользователя администратору.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)")
            return message.channel.send(embed);
        }
    }
    if(commandName == "exit") {
	    if(permissions['mute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");	
	    client.destroy().then(process.exit);
	    return;
    }
     if(commandName == "clear") {
        if(permissions['clear'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        if(!args) return message.reply("Error");
        purge(message, args);
        return;
    }
    if(commandName == "mute"){
        if(permissions['mute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        Mute(message, args);
        return;
    }

    if(commandName == "addmat") {
        if(permissions['addmat'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        var replace = /\[(.*?)\]/ism;
        var matches = replace.exec(message.content); 
        if(!matches) return message.reply("Error! Используйте !addmat [Слово|Сочетание слов]");
        if(matches[1]) badwordslist.push("^"+matches[1]+"$"); return message.channel.send(`Добавлено новое слово в черный список --> ${matches[1]}`);
        return;
    }
    if(commandName == "unmute"){
        if(permissions['unmute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
			const embed = new Discord.RichEmbed()
				.setColor(16734464)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!unmute]", `Используйте !mute @user!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
			message.channel.send(embed);
        }else{
			const embed = new Discord.RichEmbed()
				.setColor(16734464)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!unmute]", `${member} вышел из мута!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
			message.channel.send(embed);
			let role = client.guilds.get(serverid).roles.find('name', muterol).id;
			member.removeRole(role);
			delete mutedlist[member.id];
        }
        return;
    }
    
    if(commandName == "muted") {
        var text = '';
        for (var key in mutedlist) {
            text += `Пользователь <@${key}> сидит ещё ${ms(mutedlist[key])} \n`;
        }
        if(text == ""){
        	message.reply("на данный момент, пользователей в муте нет");
        } else {
			const embed = new Discord.RichEmbed()
				.setColor(5504768)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!muted]", `${text}\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
		}
        return;
    }
    if(commandName == "github"){
		const embed = new Discord.RichEmbed()
			.setColor(5504768)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.addField("[!github]", `\nМой github - [жми](https://github.com/cheesegaproj/chatbot)\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
    	return;
    }
	
	if(commandName == "kick"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("пожалуйста используйте !kick @user");
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
		const embed = new Discord.RichEmbed()
			.setColor(16734464)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.addField("[!kick]", `${member} кикнут с сервера!\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return;
	}

	if(commandName == "ban"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("пожалуйста используйте !ban @user");
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
		const embed = new Discord.RichEmbed()
			.setColor(16711680)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.addField("[!kick]", `${member} забанен на сервере!\nЕго ID: ${member.id}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return;
	}

	if (commandName == "unban") {
        if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
	    const user = args[0];
	    if(!args[0]) return message.reply("используйте !unban member.id");
	    message.guild.unban(user);
        console.log(`Unbanned ${user}`);
		const embed = new Discord.RichEmbed()
			.setColor(16711680)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.addField("[!unban]", `${user} разбанен на сервере!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return;  
	}
    if(commandName == "rainbow"){
    	if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        if(args[0] == "start") {
            if(interval == undefined) interval = setInterval(() => { discoRole(message); }, 150);
			const embed = new Discord.RichEmbed()
				.setColor(16711867)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!rainbow start]", `Радуга началась!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
			message.channel.send(embed);
        } else if(args[0] == "stop") {
            clearInterval(interval); 
            interval = undefined;
			const embed = new Discord.RichEmbed()
				.setColor(24575)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.addField("[!rainbow stop]", `Радуга останавливается!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
			message.channel.send(embed);
        } else {
            message.reply('gg');
        }
        return;
    }
    if(commandName == "coin"){
        var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 0;//https://images-ext-1.discordapp.net/external/psw8bjb7MLk5ifrtsyYLtYf_UORozzkQrctGwklKc7U/https/i.imgur.com/ZyCwWuE.png?width=100&height=100
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
        let user = message.guild.member(message.mentions.users.first());
        if(!user) return message.reply("вы не упомянули пользователя!");
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser) return message.reply("вы не написали текст жалобы!");
        const embed = new Discord.RichEmbed()
			.setColor(13632027)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.guild.channels.find('name', reportchannel).send(embed);
            message.reply("ваша жалоба на пользователя отправлена! Ваше сообщение с командой !report было удалено.");
            message.delete(message.author.id);
        return;
    }

    message.reply("такой команды не существует! Напишите !инфо чтобы посмотреть список команд.");
    
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
    

function Mute(message, args, auto) {
    //!mute @челик 1s/m/h/d
    let tomute;
    if(!auto) tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(auto) tomute = message.guild.members.get(args[0]);
    if(!tomute){
		const embed = new Discord.RichEmbed()
			.setColor(16734464)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
			.addField("[!mute]", `Используйте !mute @user 1s/m/h/d!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
		message.channel.send(embed);
        return
    }
    let mutetime = args[1];
    if(!mutetime){
		const embed = new Discord.RichEmbed()
			.setColor(16734464)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
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
        return;
    });
}

async function purge(message, args) {
    message.delete();
    if(!args[0]) args[0] = 1;
    const fetched = await message.channel.fetchMessages({limit: args[0]});
    var messages = [];
    fetched.forEach(function(element, index, array) {
        if(element.author.id == client.user.id || element.content.startsWith(prefix)) messages.push(element);
    });
    messages.forEach(function(element, index, array) {
        message.channel.fetchMessage(element.id)
            .then(message => message.delete())
            .catch(console.error);
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
	if(!IsAuth) return false;
    let role = client.guilds.get(channel).roles.find('name', muterol).id; //название роли
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    client.guilds.get(channel).channels.find('id', generalchatid).send(`Пользователь убран из мута(<@${id}>)!`);//название чат-канала куда будут писаться оповещения
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
