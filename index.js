const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const permissions = require('./permissions.js');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));

client.login("TOCKEN");

/*
client.on('ready', () => {
    client.user.setPresence({ game: { name: "жду команду..." }});
});*/

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
        message.reply(`Привет! Вот мой FAQ, напиши напиши номер одного из этих вопросов и дам ответ (например !инфо 1):\n
        Вопрос 1. Какая актуальная версия чита?\n
        Вопрос 2. Сколько стоит чит?\n
        Вопрос 3. Сколько стоит переход на другие версии?\n
        Вопрос 4. Меня забанили за DM, что делать?\n
        Вопрос 5. Сколько стоит переход на новую версию чита?\n
        Вопрос 6. Кто админ чита?\n
        Вопрос 7. Как мне узнать ссылку на группу в вк?\n
        Вопрос 8. Как мне узнать официальные страницы продавцов чита?\n
        Вопрос 9. Почему не запускается меню в GTA V из стима?\n
        `);
        return;
        }
        if(args[0] == "1"){
            message.reply("актуальная версия чита: 3.1");
            return;
        }
        if(args[0] == "2"){
            message.reply("чит имеет несколько версий. Премиум версия стоит 490 рублей, VIP версия стоит 890 рублей, вип версия навсегда стоит 1490 рублей.");
            return;
        }
        if(args[0] == "3"){
            message.reply("переход с премиум версии на VIP стоит 350 рублей, переход с VIP на VIP навсегда 700 рублей, переход с премиум на VIP навсегда стоит 1000 рублей.");
            return;
        }
        if(args[0] == "4"){
            message.reply("так как это чит - шанс бана присутствует всегда, поэтому вы играете на свой страх и риск");
            return;
        }
        if(args[0] == "5"){
            message.reply("переход на следующий патч (к примеру с версии чита 2.5 на 3.1) стоит 200 рублей.");
            return;
        }
        if(args[0] == "6"){
            message.reply("администратор чита - Jason");
            return;
        }
        if(args[0] == "7"){
            message.reply("группа чита - https://vk.com/desiremenu");
            return;
        }
        if(args[0] == "8"){
            message.reply(`официальне страницы продавцов:\n
            Николай (Jason) - https://vk.com/jason227\n
            Артём - https://vk.com/desireseller`);
            return;
        }
        if(args[0] == "9"){
            message.reply("если представленый ниже метод решение проблемы бага со стимом не работает. Значит вам надо ждать фикса. Т.к этот метод не у всех работает.\n 1. Запускаем сингл плеер. \n 2. Инжектим чит,но не включаем. \n 3. Запустить онлайн. \n 4. Ждём около 15 минут. \n 5. Запускаем чит. \n 6. Играем. \n P.s Тесты и создание фикса уже ИДУТ. И помните для этого нужно время.");
            return;
        }
    }
    if(commandName == "coder") {
        message.channel.send('Мой бомженька <@274572245651816450> и <@247102468331274240> лучше всех гыыы!!! ЛЮБЛЮ ЕГО!!! :****');
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
        if(matches[1]) badwordslist.push(matches[1]+"$"); return message.channel.send(`Добавлено новое слово в черный список --> ${matches[1]}`);
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
    message.reply("Такой команды не существует!");
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
    for (var key in badwordslist) {
        if(message.content.search(badwordslist[key]) != -1) {
            data = [message.author.id,'6h', 'Нецензурные выражения'];
            Mute(message, data, true);
            message.delete(5000);
            return;
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
