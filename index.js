//https://developer.github.com/webhooks/
///usr/local/lib/node_modules/electron-prebuilt/dist

var app = require('app'),
    BrowserWindow = require('browser-window'),
    Tray = require('tray'),
    path = require('path'),
    ipc = require('ipc'),
    Menu = require('menu');

require('crash-reporter').start();

var mainWindow = null;
var tray = null;

var iconIdle = path.join(__dirname, 'iconIdle.png');
var iconActive = path.join(__dirname, 'iconActive.png');

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    if (app.dock) {
        app.dock.hide();
    }



    tray = new Tray(iconIdle);

    tray.on('clicked', function clicked() {
        tray.setImage(iconIdle);
        if (mainWindow && mainWindow.isVisible()) {
            return hide();
        }
        show();
    });

    var show = function() {
        if (mainWindow && !mainWindow.isVisible()) {
            return mainWindow.show();
        }

        var atomScreen = require('screen'),
            size = atomScreen.getPrimaryDisplay(),
            x = size.workArea.width - 1000 - 250,
            y = size.workArea.y

        mainWindow = new BrowserWindow({
            width: 300,
            height: 300,
            show: true,
            frame: true
        });
        mainWindow.setPosition(x, y);

        mainWindow.loadUrl('file://' + __dirname + '/index.html');

        // mainWindow.on('blur', hide);

        mainWindow.on('close', function() {
            mainWindow = null;
        });
    };

    var hide = function() {
        mainWindow.hide();
    };


    show();
    hide();

    ipc.on('newComment', function(event, arg) {
        tray.setImage(iconActive);
    })
});