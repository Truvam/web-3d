import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/PointerLockControls.js';

const controlTypes = {
    POINTERLOCK: "PointerLockControls",
    ORBIT: "OrbitControls"
};
export { controlTypes };

export default class Controls {
    constructor(type = controlTypes.POINTERLOCK, camera, domElement = document.body) {
        this.type = type;
        this.camera = camera;
        this.domElement = domElement;
        this.controls = NaN;

        this.creatControl();
    }

    creatControl() {
        if (this.type == controlTypes.POINTERLOCK) {
            this.controls = new PointerLockControls(this.camera, this.domElement);
            this.camera.position.set(0, 100, 300);

            this.setEvents();
        }
        else if (this.type == controlTypes.ORBIT) {
            this.controls = new OrbitControls(this.camera, this.domElement);
            this.controls.target.set(0, 100, 0);
            this.controls.update();
        }
    }

    handleEvents = e => {
        console.log(e)
        switch (e.type) {
            case 'click':
                this.controls.lock();
                break;
        }
    }

    setEvents() {
        document.body.addEventListener("click", this.handleEvents);
    }
}


