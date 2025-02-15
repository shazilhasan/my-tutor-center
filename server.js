var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var Helpers = require('./helpers');

var { teacherModel, packageModel, clientModel, subjectModel, scheduleModel, paymentModel } = require('./models');
var paymentRoutes = require('./routes/payment_routes'),
    scheduleRoutes = require('./routes/schedule_routes');

var DB_URL = process.env.DB_URL || 'mongodb://technologics-server:KqqX0z2Wue4rSeJEKEyydDNMEIJ7gVlcPSrH6mRKFJz0GwnHg6NrsB8UQ7mBHa5UoS5PyVyC8rK9ACDbw5pmvw==@technologics-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@technologics-server@';
mongoose.connect(DB_URL);

var app = express();

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());

app.use((req, res, next) => {
    const auth = {login: 'technologics-server', password: 'KqqX0z2Wue4rSeJEKEyydDNMEIJ7gVlcPSrH6mRKFJz0GwnHg6NrsB8UQ7mBHa5UoS5PyVyC8rK9ACDbw5pmvw=='}
  
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
  
    if (!login || !password || login !== auth.login || password !== auth.password) {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication required.')
      return
    }
    next()  
  })

app.use('/favicon.ico', express.static(path.join(__dirname, 'src/logo.ico')));
app.use('/api/clients', Helpers.createRoutes(clientModel));
app.use('/api/packages', Helpers.createRoutes(packageModel));
app.use('/api/teachers', Helpers.createRoutes(teacherModel));
app.use('/api/subjects', Helpers.createRoutes(subjectModel));
app.use('/api/schedules', Helpers.createRoutes(scheduleModel));
app.use('/api/payments', Helpers.createRoutes(paymentModel));
app.use('/api/payments', paymentRoutes);
app.use('/api/find_student_schedule', scheduleRoutes);

app.all('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(process.env.PORT ||10255, function() { console.log('express server started')});
