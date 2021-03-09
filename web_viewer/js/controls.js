import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/PointerLockControls.js';

const controlTypes = {
    POINTERLOCK: "PointerLockControls",
    ORBIT: "OrbitControls"
};
export { controlTypes };

export default class Controls {
    constructor(type = controlTypes.POINTERLOCK, camera, domElement) {
        this.type = type;
        this.camera = camera;
        this.domElement = domElement;
        this.controls = null;

        this.creatControl();
    }

    creatControl() {
        if (this.type == controlTypes.POINTERLOCK) {
            this.controls = new PointerLockControls(this.camera, this.domElement);
            this.setEvents();
        }
        else if (this.type == controlTypes.ORBIT) {
            this.controls = new OrbitControls(this.camera, this.domElement);
            this.controls.target.set(0, 100, 0);
            this.controls.rotateSpeed = 1;
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
        this.domElement.addEventListener("click", this.handleEvents);
    }

    clearEvents() {
        this.domElement.removeEventListener("click", this.handleEvents);
        this.controls.disconnect();
    }
}


