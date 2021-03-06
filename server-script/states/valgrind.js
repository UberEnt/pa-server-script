var main = require('main');
var utils = require('utils');
var _ = require('thirdparty/lodash');

function fixupConfig(gameConfig) {
    gameConfig.armies = gameConfig.armies || [];
}

function loadConfig(gameConfig) {
    fixupConfig(gameConfig);

    var systemConfig = gameConfig.system;
    sim.systemName = systemConfig.name;
    sim.planets = systemConfig.planets;
    sim.paused = true;
    sim.create();
}

exports.url = 'coui://ui/main/game/live_game/live_game.html';
exports.enter = function() {
    server.maxClients = 0;
    server.beacon = undefined;

    var valgrindConfig = require('valgrind_config').config;
    loadConfig(valgrindConfig);

    var playingState = main.loadState('valgrind_playing');
    if (sim.ready)
        main.setState(playingState, valgrindConfig);
    else {
        utils.pushCallback(sim, 'onReady', function (onReady) {
            sim.onReady.pop();
            main.setState(playingState, valgrindConfig);
            return onReady;
        });
    }
};
