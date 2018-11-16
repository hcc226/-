var ws = require("nodejs-websocket")
var clientCount = 0
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    clientCount++
    conn.nickname = 'user' + clientCount
    var mes = {}
    mes.type = "enter"
    mes.data = conn.nickname + 'comes in'
    broadcast(JSON.stringify(mes))
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        mes.type = "message"
        mes.data = conn.nickname + ' says: ' + str
        broadcast(JSON.stringify(mes))
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        mes.type='left'
        mes.data = conn.nickname+'left'
        broadcast(JSON.stringify(mes))
    })
    conn.on("error",function (err) {
        console.log(err)
    })
}).listen(8001)

function broadcast(str) {
    server.connections.forEach(function (t) {
        t.sendText(str)
    })
}
