let io = null;
module.exports = {
    init: (httpserver) => {
        io = require('socket.io')(httpserver);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.IO Not initialized');
        }
        return io;
    },
};
