import {Singleton} from "typescript-ioc";
import {CommonControllerComponent} from "../../common/controller/common-controller.component";
import {KeyEvent} from "../../common/controller/controller.model";
import {EventStatus} from "../../common/event.model";

@Singleton
export class MainControllerComponent extends CommonControllerComponent {
   constructor() {
      super();
      MainControllerComponent.addEventListener(window, 'resize', () => {
         this.resizeObject.x = window.innerWidth;
         this.resizeObject.y = window.innerHeight;
         this.resizeSubject.next(this.resizeObject);
      });
      MainControllerComponent.addEventListener(window, 'keydown', (event: KeyboardEvent) => {
         this.keySubject.next({
            status: EventStatus.ON,
            key: event.code
         } as KeyEvent);
      });
      MainControllerComponent.addEventListener(window, 'keyup', (event: KeyboardEvent) => {
         this.keySubject.next({
            status: EventStatus.OFF,
            key: event.code
         } as KeyEvent);
      });
   }

   init(canvas: HTMLElement, guiLayer: HTMLDivElement) {
      MainControllerComponent.addEventListener<MouseEvent>(canvas, 'mousemove', event => {
         this.mouseMoveObject.x = event.movementX;
         this.mouseMoveObject.y = event.movementY;
         this.mouseMoveSubject.next(this.mouseMoveObject);
      });
      MainControllerComponent.addEventListener(document, 'pointerlockchange', () => {
         const locked = (document.pointerLockElement === canvas ||
            // @ts-ignore
            document.mozPointerLockElement === canvas);
         this.pointerLockSubject.next(locked ? EventStatus.ON : EventStatus.OFF);
      });
      MainControllerComponent.addEventListener<MouseEvent>(guiLayer, 'mousedown', event => {
         canvas.requestPointerLock();
      });
   }

   private static addEventListener<T>(target: GlobalEventHandlers, type: string, listener: (event: T) => void) {
      // @ts-ignore
      target.addEventListener(type, listener, {passive: true});
   }
}
