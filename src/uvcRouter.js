import { Router } from 'express';
import UVCControl from 'uvc-control';

const uvcRouter = Router();
let camera;

uvcRouter.get('/connect', (req, res) => {
    // Logitec C920
    // const productId = 0x082d;
    // const vendorId = 0x046d;

    // CsM's FaceTime HD Camera
    const vendorId = 0x05ac;
    const productId = 0x8514;

    camera = new UVCControl(vendorId, productId);

    res.status(200);
    res.send('Camera connected successfully');
});

uvcRouter.get('/autofocus', (req, res) => {
    camera.get('autoFocus', (error, value) => {
        res.status(200);
        res.send('Autofocus current value: ' + error);
    });
});

uvcRouter.get('/autofocus/:value', (req, res) => {
    camera.set('autoFocus', req.params.value, error => {
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
    camera.get('brightness', (error, value) => {
        res.status(200);
        res.send('Brightness current value: ' + value);
    });
});

uvcRouter.get('/brightness/:value', (req, res) => {
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

export default uvcRouter;