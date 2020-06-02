const Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require("ytdl-core");

const token = 'NzE2MjgzNjEwMDgwMjE1MTIy.XtJjug.aTVa9Jt-smZKDNOdo1Rphy4fvn8';

const PREFIX = 'evo '

var servers = {};

bot.on('ready', () =>{
    console.log('This bot is online!')
})



bot.on('message', msg=>{
    if(msg.content.includes('robux' || 'ROBUX' || 'Robux')){
        msg.reply('no go away');
    }

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'subscribe':
            msg.channel.send('Subscribe! https://bit.ly/3cnMn6M')
            break;

        case 'play':


            function play(connection, msg){
                var server = servers[msg.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, msg);
                    }else {
                        connection.disconnect();
                    }
                });
            }


            if(!args[1]){
                msg.channel.send("Provide a link silly!");
                return;
            }

            if(!msg.member.voiceChannel){
                msg.channel.send("Get in a voice channel! I'm not playing for nothing!");
                return;
            }

            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];

            server.queue.push(args[1]);

            if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
                play(connection, msg);
            })

        break;

        case 'skip':
            var server = servers[msg.guild.id];
            msg.channel.send("Skipped!")
            if(server.dispatcher) server.dispatcher.end();
        break;

        case 'leave':
            var server = servers[msg.guild.id];
            if(msg.guild.voiceConnection){
                for(var i = server.queue.lenght -1; 1 >=0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                console.log('Left channel')
            }

            if(msg.guild.connection) msg.guild.voiceConnection.disconnect();
        break;
    }
})

bot.login(token);