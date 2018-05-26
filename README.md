# chatbot
chatbot discord by cheesega - новый бот для чата в программе discord на языке nodejs, который будет вам отличным помощником на вашем сервере. Для его установки, перейдите в Wiki, там все команды есть. На случай, если у вас что-то не получится или будет интересно пообщаться с обладателями бота и его создателями, заходите на наш сервер discord https://discord.gg/jwnPHdA
<hr>
# Install
Для установки бота, используйте команды (Linux Ubuntu 16)
apt-get install sudo zip unzip nano curl
curl --silent --location https://deb.nodesource.com/setup_8.x| bash -
apt-get install --yes nodejs
apt-get install git
git clone https://github.com/cheesegaproj/chatbot.git
cd chatbot
npm install discord.js
npm install fs
npm install ms
npm i quick.hook
npm install pm2 pm2 start index.js
<hr>
# Commands
!clear - отчистка сервера от сообщений бота и сообщений с командами
!mute - добавляет человека в мут
!addmat - добавляет матное слово в черный список
!unmute - убирает человека из мута
!muted - показывает список тех, кто на данный момент в муте и сколько осталось
!github - ссылка на гитхаб
!kick - кикнуть человека с сервера
!ban - банит человека на сервере
!unban id - разбанит человека на сервере
!rainbow start/stop - радужные роли (смотрите конфиг)
!coin - кинуть монетку
!exit - выключить/перезагрузить бота
!report - отправить жалобу на человека
