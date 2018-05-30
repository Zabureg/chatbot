const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const permissions = require('./permissions.js');
const { prefix, token, serverid, rainbowroles, muterol, reportchannel, generalchatid, defaultrole, defaultroleonoff, welcome, warningcount} = require('./config.json');
const send = require('quick.hook');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));
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
        console.log("добавление роли выключено");
    }
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(serverid).roles.find('name', muterol);
        member.addRole(muterol.id);
    }
    var newUsers = '';
    const guild = member.guild;
    //newUsers.set(member.id, member.user);
    const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
    defaultChannel.send(`${member}, ${welcome}`);});

client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)) return checkForMatWords(message);
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "info") {
		if(!args.length) {
			color = 16777215;
        	title = "[!info]";
        	text = "список моих команд(чтобы узнать информацию о команде, пиши, например, `!info 1`):\n**1. `!clear`**\n**2. `!mute`**\n**3. `!addmat`**\n**4. `!unmute`**\n**5. `!muted`**\n**6. `!github`**\n**7. `!kick`**\n**8. `!ban`**\n**9. `!unban`**\n**10. `!rainbow`**\n**11. `!coin`**\n**12. `!exit`**\n**13. `!report`**";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
		} else if(args[0] == "1") {
			color = 16777215;
        	title = "[!info 1]";
        	text = "!clear число - чистит чат от команд и сообщений бота.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "2"){
        	color = 16777215;
        	title = "[!info 2]";
        	text = "добавляет пользователя в мут. Пример: !mute @user 1h [причина мута].";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "3"){
        	color = 16777215;
        	title = "[!info 3]";
            text = "добавляет слово в черный список !addmat [слово]";
            send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "4"){
        	color = 16777215;
        	title = "[!info 4]";
        	text = "убирает человека из мута. Пример: !unmute @user";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "5"){
        	color = 16777215;
        	title = "[!info 5]";
        	text = "показывает пользователей, которые находятся в муте и сколько им осталось сидеть.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "6"){
        	color = 16777215;
        	title = "[!info 6]";
        	text = "ссылка на исходный код бота.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "7"){
        	color = 16777215;
        	title = "[!info 7]";
        	text = "!kick @user - выгоняет пользователя с сервера.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "8"){
        	color = 16777215;
        	title = "[!info 8]";
        	text = "!ban @user - банит пользователя на сервере.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "9"){
        	color = 16777215;
        	title = "[!info 9]";
        	text = "!unban ID - разбанит пользователя на сервере.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "10"){//!rainbow start/stop - радужная роль. Команда !rainbow stop срабатывает не сразу, через какое-то время!
			color = 16777215;
        	title = "[!info 10]";
        	text = "!rainbow start/stop - радужная роль. Команда !rainbow stop срабатывает не сразу, через какое-то время!";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "11"){
        	color = 16777215;
        	title = "[!info 11]";
        	text = "!coin - Монетка. Либо вы победите, либо проиграете.";
        	send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
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
			title = "[!info 12]";
			text = "!exit - выключает/перезагружает бота.";
			send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        }
        if(args[0] == "13"){
        	color = 16777215;
			title = "[!info 13]";
			text = "!report @user [Текст] - отправлет жалобу на пользователя администратору.";
			send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
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
    if(commandName == "clean"){
        if(permissions['clear'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");    
        async function clear() {
            if(!args[0]){
                color = 16711680;
				title = "[!clean]";
				text = `Введи число сообщений, которое хочешь удалить (0-100) !clean 100`;
				send(message.channel, infomessage(color, title, text), {
                    name:'Error!',
                    icon:'https://i.imgur.com/XpvART0.jpg'
                })
                return
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]}); //Захватывает последнее число (args) сообщений в канале.
            console.log(fetched.size + ' сообщений(е,я) найдено и удалено...');
            message.channel.bulkDelete(fetched).then(() => {
                color = 16777215;
				title = "[!clean]";
				text = `Было удалено **${fetched.size}** сообщений(e/я)!`;
				send(message.channel, infomessage(color, title, text), {
                    name:'Warning!',
                    icon:'https://i.imgur.com/dMp8E6P.jpg'
                })
            }) 
        }clear(); //Чтобы работала команда
    return;
};
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
        	color = 16734464;
			title = "[!unmute]";
			text = `Используйте !unmute @user!`;
			send(message.channel, infomessage(color, title, text), {
                name:'Warning!',
                icon:'https://i.imgur.com/dMp8E6P.jpg'
            })
			return
        }else{
        	color = 16734464;
			title = "[!unmute]";
			text = `${member} вышел из мута!`;
			send(message.channel, infomessage(color, title, text), {
                name:'Warning!',
                icon:'https://i.imgur.com/dMp8E6P.jpg'
            })
			let role = client.guilds.get(serverid).roles.find('name', muterol).id;
			member.removeRole(role);
			delete mutedlist[member.id];
        }
        return;
    }
    
    if(commandName == "muted") {
        var text = '';
        for (var key in mutedlist) {
            text += `\nПользователь <@${key}> сидит ещё ${ms(mutedlist[key])}`;
        }
        if(text == ""){
        	color = 5504768;
			title = "[!muted]";
			text = `Пользователей в муте нет!`;
			send(message.channel, infomessage(color, title, text), {
                name:'Warning!',
                icon:'https://i.imgur.com/dMp8E6P.jpg'
            })
        } else {
        	color = 5504768;
			title = "[!muted]";
			text = `${text}`;
			send(message.channel, infomessage(color, title, text), {
                name:'Warning!',
                icon:'https://i.imgur.com/dMp8E6P.jpg'
            })
		}
        return;
    }
    if(commandName == "github"){
    	color = 5504768;
		title = "[!github]";
		text = `\nМой github - [жми](https://github.com/cheesegaproj/chatbot)`;
		send(message.channel, infomessage(color, title, text), {
            name:'info!',
            icon:'https://i.imgur.com/YVLRXb7.jpg'
        })
    	return;
    }
	
	if(commandName == "kick"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
		    title = "[!kick]";
		    text = `Используйте !kick @user`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'
            })
            return
        }
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
		color = 16734464;
		title = "[!kick]";
		text = `${member} кикнут с сервера!`;
		send(message.channel, infomessage(color, title, text), {
            name:'Warning!',
            icon:'https://i.imgur.com/dMp8E6P.jpg'
        })
        return;
	}

	if(commandName == "ban"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
		    title = "[!ban]";
		    text = `Используйте !ban @user`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'
            })
            return
        }
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
        color = 16734464;
		title = "[!ban]";
		text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
		send(message.channel, infomessage(color, title, text), {
            name:'Warning!',
            icon:'https://i.imgur.com/dMp8E6P.jpg'
        })
        return;
	}

	if (commandName == "unban") {
        if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
	    const user = args[0];
	    if(!args[0]){
            color = 16711680;
		    title = "[!ban]";
		    text = `Используйте !ban @user`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'
            })
            return
        }
	    message.guild.unban(user);
        console.log(`Unbanned ${user}`);
        color = 16734464;
		title = "[!unban]";
		text = `${user} разбанен на сервере!`;
		send(message.channel, infomessage(color, title, text), {
            name:'Warning!',
            icon:'https://i.imgur.com/dMp8E6P.jpg'
        })
        return;  
	}
    if(commandName == "rainbow"){
    	if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        if(args[0] == "start") {
            if(interval == undefined) interval = setInterval(() => { discoRole(message); }, 250);
            color = 16711867;
			title = "[!rainbow start]";
			text = `Радуга началась!`;
			send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        } else if(args[0] == "stop") {
            clearInterval(interval); 
            interval = undefined;
            color = 24575;
			title = "[!rainbow stop]";
			text = `Радуга останавливается!`;
			send(message.channel, infomessage(color, title, text), {
                name:'info!',
                icon:'https://i.imgur.com/YVLRXb7.jpg'
            })
			return;
        } else {
            color = 16711680;
			title = "[!rainbow]";
			text = `Используйте !rainbow start или !rainbow stop`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'//https://i.imgur.com/upmlFaM.jpg
            })
            return
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
                send(message.channel, embed, {
                    name:'Game!',
                    icon:'https://i.imgur.com/upmlFaM.jpg'
                })
        }else{
			const embed = new Discord.RichEmbed()
				.setColor(14286592)
				.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
				.setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
				.addField("Coin", "\nВы выиграли")
            send(message.channel, embed, {
                    name:'Game!',
                    icon:'https://i.imgur.com/upmlFaM.jpg'
            })
        }
        return
    }

	if(commandName == "report"){
        let user = message.guild.member(message.mentions.users.first());
        if(!user){
            color = 16711680;
			title = "[!report]";
			text = `Вы не упомянули пользователя и не написали причину !report @user [reason]`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'
            })
            return
        }
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser){
            color = 16711680;
			title = "[!report]";
			text = `Вы не написали причину !report @user [reason]`;
            send(message.channel, infomessage(color, title, text), {
                name:'Error!',
                icon:'https://i.imgur.com/XpvART0.jpg'
            })
            return
        }
        const embed = new Discord.RichEmbed()
			.setColor(13632027)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            send(message.guild.channels.find('name', reportchannel), embed, {
                name:'Report!',
                icon:'https://i.imgur.com/dMp8E6P.jpg'
            });
            message.reply("ваша жалоба на пользователя отправлена! Ваше сообщение с командой !report было удалено.");
            message.delete(message.author.id);
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

    message.reply("такой команды не существует! Напишите !info чтобы посмотреть список команд.");
    
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
    //!mute @челик 1s/m/h/d
    let tomute;
    if(!auto) tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(auto) tomute = message.guild.members.get(args[0]);
    if(!tomute){
		const embed = new Discord.RichEmbed()
			.setColor(16734464)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")
			.addField("[!mute]", `Используйте !mute @user 1s/m/h/d!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
		send(message.channel, embed, {
            name: 'Error!',
            icon: 'https://i.imgur.com/XpvART0.jpg'
        })
        return
    }
    let mutetime = args[1];
    if(!mutetime){
		const embed = new Discord.RichEmbed()
			.setColor(16734464)
			.setFooter("Coder - cheesega.", "https://cdn.discordapp.com/avatars/247102468331274240/7e640d45adaab729b27edb5d26437cfd.png")			.addField("[!mute]", `Вы не указали время!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            send(message.channel, embed, {
                name: 'Error!',
                icon: 'https://i.imgur.com/XpvART0.jpg'
            })
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
            send(message.channel, embed, {
                name: 'Warning!',
                icon: 'https://i.imgur.com/dMp8E6P.jpg'
            })
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
        //infobanlist[tomute.id].push(1);
        infobanlist[tomute.id] += 1;
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
		title = "[!ban]";
		text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
		send(client.guilds.get(channel).channels.find('id', generalchatid), infomessage(color, title, text), {
            name:'Warning!',
            icon:'https://i.imgur.com/dMp8E6P.jpg'
        });
        delete infobanlist[member.id];
        return true;
    }
    color = 16734464;
    title = "[!ban]";
    text = `Пользователь убран из мута(<@${id}>)!\nУ него ${infobanlist[id]} предупреждений(я)! Бан даётся при ${warningcount} предупреждениях!`;
    send(client.guilds.get(channel).channels.find('id', generalchatid), infomessage(color, title, text),{
        name: 'Warning!',
        icon: 'https://i.imgur.com/dMp8E6P.jpg'
    });
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