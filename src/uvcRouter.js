import { Router } from 'express';
import UVCControl from 'uvc-control';

const uvcRouter = Router();

const connect = () => {
    // Logitec C920
    const productId = 0x082d;
    const vendorId = 0x046d;

    return new UVCControl(vendorId, productId, {
        processingUnitId: 0x011
    });
}
uvcRouter.get('/connect', (req, res) => {
    const camera = connect();
    res.status(camera ? 200 : 405);
    res.send(camera ? 'Camera connected successfully' : 'Camera not found');
});

uvcRouter.get('/autofocus', (req, res) => {
    const camera = connect();
    camera.get('autoFocus', (error, value) => {
        res.status(200);
        res.send('Autofocus current value: ' + value);
    });
});

uvcRouter.get('/autofocus/:value', (req, res) => {
    const camera = connect();
    camera.set('autoFocus', parseInt(req.params.value), error => {
        if (!error) {
            res.status(200);
            res.send('Autofocus has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

uvcRouter.get('/brightness', (req, res) => {
    const camera = connect();
    camera.get('brightness', (error, value) => {
        res.status(200);
        res.send('Brightness current value: ' + value);
    });
});

uvcRouter.get('/brightness/:value', (req, res) => {
    const camera = connect();
    camera.set('brightness', req.params.value, error => {
        if (!error) {
            res.status(200);
            res.send('Brightness has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

uvcRouter.get('/focus', (req, res) => {
    const camera = connect();
    camera.get('absoluteFocus', (error, value) => {
        res.status(200);
        res.send('Autofocus current value: ' + value);
    });
});

uvcRouter.get('/focus/:value', (req, res) => {
    const focus = req.params.value;

    if (focus < -32768 || focus > 32767) {
        res.status(400);
        res.send('Invalid value');
    }
    const camera = connect();
    camera.set('absoluteFocus', parseInt(focus), error => {
        if (!error) {
            res.status(200);
            res.send('Focus has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

uvcRouter.get('/zoom', (req, res) => {
    const camera = connect();
    camera.get('absoluteZoom', (error, value) => {
        res.status(200);
        res.send('Zoom current value: ' + value);
    });
});

uvcRouter.get('/zoom/:value', (req, res) => {
    const zoomLevel = req.params.value;

    if (zoomLevel < 100 || zoomLevel > 500) {
        res.status(400);
        res.send('Invalid value');
    }

    const camera = connect();
    camera.set('absoluteZoom', req.params.value, error => {
        if (!error) {
            res.status(200);
            res.send('Zoom level has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

export default uvcRouter;