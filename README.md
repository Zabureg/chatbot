# chatbot
chatbot discord by cheesega - новый бот для чата в программе discord на языке nodejs, который будет вам отличным помощником на вашем сервере. Для его установки, перейдите в Wiki, там все команды есть. На случай, если у вас что-то не получится или будет интересно пообщаться с обладателями бота и его создателями, заходите на наш сервер discord https://discord.gg/jwnPHdA
<hr>
 <h1>Install</h1><br>
Для установки бота, используйте команды (Linux Ubuntu 16)<br>
apt-get install sudo zip unzip nano curl<br>
curl --silent --location https://deb.nodesource.com/setup_8.x| bash -<br>
apt-get install --yes nodejs<br>
apt-get install git<br>
git clone https://github.com/cheesegaproj/chatbot.git<br>
cd chatbot<br>
npm install discord.js<br>
npm install fs<br>
npm install ms<br>
npm install mysql<br>
npm install weather-js<br>
npm install pm2<br>
pm2 start index.js<br>
<hr>
 <h1>Commands</h1>
!clear - отчистка сервера от сообщений бота и сообщений с командами<br>
!mute - добавляет человека в мут<br>
!addmat - добавляет матное слово в черный список<br>
!unmute - убирает человека из мута<br>
!muted - показывает список тех, кто на данный момент в муте и сколько осталось<br>
!github - ссылка на гитхаб<br>
!kick - кикнуть человека с сервера<br>
!ban - банит человека на сервере<br>
!unban id - разбанит человека на сервере<br>
!rainbow start/stop - радужные роли (смотрите конфиг)<br>
!coin - кинуть монетку<br>
!exit - выключить/перезагрузить бота<br>
!report - отправить жалобу на человека<br>
