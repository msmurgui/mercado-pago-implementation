var express  = require('express');
var app      = express();                               
var morgan = require('morgan');            
var bodyParser = require('body-parser');    
var cors = require('cors');
 
app.use(morgan('dev'));                                        
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(cors());
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
app.use(express.static('platforms/browser/www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

app.post("/webhooks", (req, res)=>{
  var message = '';
  var preMesagge = 'Notificacion de '
  switch( req.body.action ){
    case 'payment.created':
      message = 'creacion de pago'
    break;
    
    case 'payment.updated':
      message = 'actualizacion de pago';
    break;

    case 'application.deauthorized':
      message = 'desvinculacion de una cuenta';
    break;

    case 'application.authorized':
      message = 'vinculacion de una cuenta';
    break;
    default:
      preMesagge = 'Notificacion';
  }

  res.status(201).json({ message : preMesagge + message + ' recibida!'});
})