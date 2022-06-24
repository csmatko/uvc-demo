import express from 'express';
import uvcRouter from './src/uvcRouter';

const APP_PORT = '3000';
const APP_HOST = '127.0.0.1';

const app = express();

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile("./index.html");
});
app.use('/', uvcRouter)

app.listen(app.get('port'), app.get('host'), () => {
    console.info(`Server started at http://${app.get('host')}:${app.get('port')}`);
});

export default app;
