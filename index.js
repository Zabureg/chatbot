const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const client = new Discord.Client();
const permissions = require('./permissions.js');
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));

client.login("TOCKEN");//пишите токен бота сюда

/*
client.on('ready', () => {
    client.user.setPresence({ game: { name: "жду команду..." }});
});*/

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

var prefix = "!";
client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    //команда инфо и FAQ
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
            message.reply("если вас забанят именно за софт DM, то будет возврат средств (в 100% размере от стоимости чита). Но не всё так однозначно, администрация проверит ваш аккаунт лично и после, если вы не соврали, то будет возврат средств.");
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
            message.reply(`Официальне страницы продавцов:\n
            Николай (Jason) - https://vk.com/jason227\n
            Артём - https://vk.com/desireseller`);
            return;
        }
        if(args[0] == "9"){
            message.reply("Он не запускается из-за бага. Он работает на версии из SocialClub, но не запускается из стима. \n Сейчас этот баг исправляют!");
            return;
        }
    }
    //exit
    if(commandName == "exit") {
       if(message.author.id == '247102468331274240'){
        client.destroy().then(process.exit);
       }else{
        message.reply("у вас нет прав для выполнения этой команды, её может писать только <@247102468331274240>");
       return;
       }
    }
    //команда mute
    if(commandName == "mute"){
        if(permissions['mute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        Mute(message, args);
        return;
    }
    //команда unmute
    if(commandName == "unmute"){
        if(permissions['unmute'].indexOf(message.author.id) == -1) return message.reply("у вас нет прав для выполнения этой команды!");
        let member = message.mentions.members.first();
        let role = client.guilds.get("348866080019709952").roles.find(`name`, "Mute (Нарушители)").id;
        member.removeRole(role);
        message.reply("пользователь убран из мута!");
        delete mutedlist[member.id];
        return;
    }
    message.reply("Такой команды не существует!");
});
//Функции команд mute и unmute
function Mute(message, args) {
    //!mute @челик 1s/m/h/d
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("Пожалуйста используйте !mute @user 1s/m/h/d");
    let muterole = message.guild.roles.find(`name`, "Mute (Нарушители)");
    let mutetime = args[1];
    if(!mutetime) return message.reply("Вы не указали время!");

    tomute.addRole(muterole.id).then(function() {
        if(mutetime == 0) { 
            message.reply(`<@${tomute.id}> выдан мут на ∞`);
        } else {
            message.reply(`<@${tomute.id}> выдан мут на ${ms(ms(mutetime))}`);
        }
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        return;
    });
}

function UnMute(channel, id) {
    let role = client.guilds.get(channel).roles.find(`name`, "Mute (Нарушители)").id;
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    client.guilds.get(channel).channels.find('name', 'general').send('Пользователь убран из мута(<@'+id+'>)!');
    return true;
}

function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute('348866080019709952', key)) delete mutedlist[key];
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
