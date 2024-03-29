const express = require("express")
const app =express()
const cors = require("cors")
const db = require("./Models")
const http = require("http");
const { Server } = require("socket.io");

app.use(cors())
app.use(express.json())


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket']
  }
});
const port = 5000

io.on('connection', (socket)=>{
    console.log("backend connected")
    socket.emit("testevent", "This si text data")
})

const driverRouter = require("./routes/Driver")
const vehicleRouter = require("./routes/Vehicle")
const userRouter = require("./routes/User")
const apingRouter = require("./routes/ApingVahaan")
// const apingSaarthiRouter = require("./routes/ApingSaarthi")

app.use("/driver", driverRouter)
app.use("/user", userRouter)
app.use("/vehicle", vehicleRouter)
app.use("/aping", apingRouter)
// app.use("/apingsaarthi", apingSaarthiRouter)

app.get('/', (req, res) => res.send('This is ulip-backend'))

db.sequelize.sync().then(()=>{
    app.listen(5000, ()=>{
        console.log(`App is working at port 5000`)
    })

})
