const app = require('./app')
const port = process.env.PORT;

//fire up serv
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
