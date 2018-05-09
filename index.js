const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const permissions = require('./permissions.js');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));

client.login("TOCKEN");


client.on('ready', () => {
    client.user.setPresence({ game: { name: "say !инфо" }});
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    //member.addRole('427571570991431710');
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get("348866080019709952").roles.find('name', 'Mute (Нарушители)');
        member.addRole(muterole.id);
    }
});

var prefix = "!";
client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)) return checkForMatWords(message);
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "инфо") {
        if (!args.length) {
        message.reply("список моих команд(чтобы узнать информацию о команде, пиши, например, `!инфо 1`): \n**1. `!connect`** \n**2. `!clear`**\n**3. `!mute`**\n**4. `!addmat`**\n**5. `!unmute`**\n**6. `!muted`**\n**7. `!github`**\n**8. `!kick`**\n**9. `!ban`**");
        return;
        }
        if(args[0] == "1"){
            message.reply("выдает информацию, при помощи которой вы сможете подключить бота к себе на сервер.");
            return;
        }
        if(args[0] == "2"){
            message.reply("удаляет сообщения бота и написанные ему команды. Пример: !clear 10");
            return;
        }
        if(args[0] == "3"){
            message.reply("добавляет пользователя в мут. Пример: !mute @user 1h [причина мута].");
            return;
        }
        if(args[0] == "4"){
            message.reply("добавляет определенное слово в черный список, за которое пользователь будет попадать в мут. Пример: !addmat [пипка].");
            return;
        }
        if(args[0] == "5"){
            message.reply("убирает человека из мута. Пример: !unmute @user");
            return;
        }
        if(args[0] == "6"){
            message.reply("показывает пользователей, которые находятся в муте и сколько им осталось сидеть.");
            return;
        }
        if(args[0] == "7"){
            message.reply("ссылка на исходный код бота.");
            return;
        }
        if(args[0] == "8"){
            message.reply("!kick @user - выгоняет пользователя с сервера.");
            return;
        }
        if(args[0] == "9"){
            message.reply("!ban @user - банит пользователя на сервере.");
            return;
        }
    }
    if(commandName == "connect") {
        message.channel.send('чтобы подключить бота к себе на сервер, напишите на почту CblPGamer@yandex.ru или в Discord <@247102468331274240>');
        return;
    }
    if(commandName == "exit") {
       if(message.author.id == '247102468331274240'){
        client.destroy().then(process.exit);
       }else{
        message.reply("у вас нет прав для выполнения этой команды, её может писать только <@247102468331274240>");
       return;
       }
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
        if(!tounmute) return message.reply("Пожалуйста используйте !unmute @user");
        member.removeRole("382780524382650379");
        message.reply("пользователь убран из мута!");
        delete mutedlist[member.id];
        return;
    }
    if(commandName == "unmute"){
        if(permissions['unmute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("Пожалуйста используйте !unmute @user");
        member.removeRole("382780524382650379");
        message.reply("пользователь убран из мута!");
        delete mutedlist[member.id];
        return;
    }
    
    if(commandName == "muted") {
        var text = '';
        for (var key in mutedlist) {
            text += `Пользователь <@${key}> сидит ещё ${ms(mutedlist[key])} \n`;
        }
        if(text == ""){
        	message.reply("на данный момент, пользователей в муте нет");
        }else{
        message.channel.send(text);
    }
        return;
    }
    if(commandName == "github"){
    	message.reply("https://github.com/cheesegaproj/chatbot");
    	return;
    }
	
	if(commandName == "kick"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("пожалуйста используйте !kick @user");
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
        message.reply(`${member} выпнули из нашего бара!`);
	}

	if(commandName == "ban"){
		if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("пожалуйста используйте !ban @user");
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
        message.channel.send(`Прощайте, бездорь ${member}. Его ID для разбана: ${member.id}`);
	}

	if (commandName == "unban") {
		/*
		if(permissions['unmute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute) return message.reply("пожалуйста используйте !unban @user");
        member.id.unban();
        */
        if(permissions['ban'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
	    const user = args[0];
	    if(!args[0]) return message.reply("используйте !unban member.id");
	    message.guild.unban(user);
	    message.reply(`Успешно разбанен <@${user}>`)
	    console.log(`Unbanned ${user}`);
	}

});

function Mute(message, args, auto) {
    //!mute @челик 1s/m/h/d
    let tomute;
    if(!auto) tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(auto) tomute = message.guild.members.get(args[0]);
    if(!tomute) return message.reply("Пожалуйста используйте !mute @user 1s/m/h/d");
    let muterole = message.guild.roles.find(`name`, "Mute (Нарушители)");
    let mutetime = args[1];
    if(!mutetime) return message.reply("Вы не указали время!");
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
    if(!auto) { mod = message.author.id; } else { mod = client.user.id; }
    tomute.addRole(muterole.id).then(function() {
        let user = client.guilds.get('348866080019709952').members.get(tomute.id).user;
        message.channel.send({
            embed: {
                color: 13632027,
                author: {
                    name: `[MUTED] ${user.username}#${user.discriminator}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                },
                fields: [
                    {
                        "name": "User",
                        "value": `<@${tomute.id}>`,
                        "inline": true
                    },
                    {
                        "name": "Moderator",
                        "value": `<@${mod}>`,
                        "inline": true
                    },
                    {
                        "name": "Reason",
                        "value": `${reason}`,
                        "inline": true
                    },
                    {
                        "name": "Duration",
                        "value": `${mutetime}`
                    }
                ]
            }
        });
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
    let role = client.guilds.get(channel).roles.find(`name`, "Mute (Нарушители)").id; //название роли
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    client.guilds.get(channel).channels.find('name', 'general').send('Пользователь убран из мута(<@'+id+'>)!');//название чат-канала куда будут писаться оповещения
    return true;
}

function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute('348866080019709952', key)) delete mutedlist[key];//ID сервера
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
