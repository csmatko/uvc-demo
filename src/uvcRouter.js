import { Router } from 'express';
import UVCControl from 'uvc-control';

const uvcRouter = Router();
let camera;

const connect = () => {
    // Logitec C920
    const productId = 0x082d;
    const vendorId = 0x046d;

    return new UVCControl(vendorId, productId, {
        processingUnitId: 0x011
    });
}

uvcRouter.get('/connect', (req, res) => {
    camera = connect();
    res.status(camera ? 200 : 405);
    res.send(camera ? 'Camera connected successfully' : 'Camera not found');
});

uvcRouter.get('/autofocus', (req, res) => {
    camera.get('autoFocus', (error, value) => {
        res.status(200);
        res.send('Autofocus currently ' + (value ? 'enabled' : 'disabled'));
    });
});

uvcRouter.get('/autofocus/:value', (req, res) => {
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

uvcRouter.get('/exposure', (req, res) => {
    camera.get('absoluteExposureTime', (error, value) => {
        res.status(200);
        res.send('Exposure current value: ' + value);
    });
});

uvcRouter.get('/exposure/:value', (req, res) => {
    const exposure = req.params.value;
    if (exposure < 3 || exposure > 2046) {
        res.status(400);
        res.send('Invalid value');
    }

    camera.set('absoluteExposureTime', exposure, error => {
        if (!error) {
            res.status(200);
            res.send('Exposure has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

uvcRouter.get('/focus', (req, res) => {
    camera.get('absoluteFocus', (error, value) => {
        res.status(200);
        res.send('Focus current value: ' + value);
    });
});

uvcRouter.get('/focus/:value', (req, res) => {
    const focus = req.params.value;

    if (focus < 0 || focus > 250) {
        res.status(400);
        res.send('Invalid value');
    }

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

uvcRouter.get('/move', (req, res) => {
    // http://localhost:3000/move?pan=10&tilt=10
    const pan = req.query.pan;
    const tilt = req.query.tilt;
    console.log(pan)
    console.log(tilt)

    const buffer = new Buffer.alloc(8);
    buffer.writeIntLE(pan, 0, 4);
    buffer.writeIntLE(tilt, 4, 4);
    camera.setRaw('absolutePanTilt', buffer, error => {
        if (!error) {
            res.status(200);
            res.send('Camera position has changed');
        } else {
            res.status(405);
            res.send(error);
        }
    });
});

uvcRouter.get('/zoom', (req, res) => {
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