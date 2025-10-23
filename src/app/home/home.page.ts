import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('loginForm', { static: false }) loginForm!: ElementRef;
  @ViewChild('svgContainer', { static: false }) svgContainer!: ElementRef;

  public isPwd: boolean = false;

  private emailLabel!: HTMLElement;
  private email!: HTMLInputElement;
  private passwordLabel!: HTMLElement;
  private password!: HTMLInputElement;
  private showPasswordCheck!: HTMLInputElement;
  private showPasswordToggle!: HTMLElement;
  private mySVG!: HTMLElement;
  private twoFingers!: HTMLElement;
  private armL!: HTMLElement;
  private armR!: HTMLElement;
  private eyeL!: HTMLElement;
  private eyeR!: HTMLElement;
  private nose!: HTMLElement;
  private mouth!: HTMLElement;
  private mouthBG!: SVGPathElement;
  private mouthSmallBG!: SVGPathElement;
  private mouthMediumBG!: SVGPathElement;
  private mouthLargeBG!: SVGPathElement;
  private mouthMaskPath!: SVGPathElement;
  private mouthOutline!: SVGPathElement;
  private tooth!: SVGPathElement;
  private tongue!: HTMLElement;
  private chin!: SVGPathElement;
  private face!: SVGPathElement;
  private eyebrow!: HTMLElement;
  private outerEarL!: HTMLElement;
  private outerEarR!: HTMLElement;
  private earHairL!: HTMLElement;
  private earHairR!: HTMLElement;
  private hair!: SVGPathElement;
  private bodyBG!: SVGPathElement;
  private bodyBGchanged!: SVGPathElement;

  private activeElement: string | null = null;
  private curEmailIndex: number = 0;
  private screenCenter: number = 0;
  private svgCoords: any;
  private emailCoords: any;
  private emailScrollMax: number = 0;
  private chinMin: number = 0.5;
  private dFromC: number = 0;
  private mouthStatus: string = "small";
  private blinking: any = null;
  private eyeScale: number = 1;
  private eyesCovered: boolean = false;
  private showPasswordClicked: boolean = false;

  private eyeLCoords: any;
  private eyeRCoords: any;
  private noseCoords: any;
  private mouthCoords: any;
  private eyeLAngle: number = 0;
  private eyeLX: number = 0;
  private eyeLY: number = 0;
  private eyeRAngle: number = 0;
  private eyeRX: number = 0;
  private eyeRY: number = 0;
  private noseAngle: number = 0;
  private noseX: number = 0;
  private noseY: number = 0;
  private mouthAngle: number = 0;
  private mouthX: number = 0;
  private mouthY: number = 0;
  private mouthR: number = 0;
  private chinX: number = 0;
  private chinY: number = 0;
  private chinS: number = 0;
  private faceX: number = 0;
  private faceY: number = 0;
  private faceSkew: number = 0;
  private eyebrowSkew: number = 0;
  private outerEarX: number = 0;
  private outerEarY: number = 0;
  private hairX: number = 0;
  private hairS: number = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Add a longer delay to ensure Ionic components are fully rendered
    setTimeout(() => {
      this.initLoginForm();
    }, 500);
  }

  public togglePwd() {
    console.log('togglePwd called, current isPwd:', this.isPwd);
    
    // Toggle the current state
    this.isPwd = !this.isPwd;
    
    console.log('togglePwd after toggle, new isPwd:', this.isPwd);
    
    // Store if password field was focused before toggle
    const wasPasswordFocused = this.password && document.activeElement === this.password;
    
    // Handle ONLY the finger animation - don't interfere with eye covering
    // The eye covering is handled by password focus/blur/input events
    try {
      if (this.isPwd) {
        console.log('Spreading fingers');
        this.spreadFingers();
      } else {
        console.log('Closing fingers');
        this.closeFingers();
      }
      
      // If password was focused and has content, ensure eyes stay covered and refocus
      if (wasPasswordFocused && this.password && this.password.value.length > 0) {
        // Ensure eyes stay covered during toggle
        if (!this.eyesCovered) {
          this.coverEyes();
        }
        // Refocus password field after a brief moment
        setTimeout(() => {
          if (this.password) {
            this.password.focus();
          }
        }, 10);
      }
    } catch (error) {
      console.error('Error in togglePwd animation:', error);
    }
  }

  private calculateFaceMove(e: Event) {
    if (!this.email || !this.eyeL || !this.eyeR || !this.nose || !this.mouth) {
      console.warn('Required face elements not found');
      return;
    }

    const carPos = (this.email as any).selectionEnd;
    const div = document.createElement('div');
    const span = document.createElement('span');
    const copyStyle = getComputedStyle(this.email);
    let caretCoords: any = {};

    if (carPos == null || carPos == 0) {
      this.curEmailIndex = this.email.value.length;
    } else {
      this.curEmailIndex = carPos;
    }

    Array.from(copyStyle).forEach((prop: string) => {
      (div.style as any)[prop] = (copyStyle as any)[prop];
    });
    div.style.position = 'absolute';
    document.body.appendChild(div);
    div.textContent = this.email.value.substr(0, this.curEmailIndex);
    span.textContent = this.email.value.substr(this.curEmailIndex) || '.';
    div.appendChild(span);

    if (this.email.scrollWidth <= this.emailScrollMax) {
      caretCoords = this.getPosition(span);
      this.dFromC = this.screenCenter - (caretCoords.x + this.emailCoords.x);
      this.eyeLAngle = this.getAngle(this.eyeLCoords.x, this.eyeLCoords.y, this.emailCoords.x + caretCoords.x, this.emailCoords.y + 25);
      this.eyeRAngle = this.getAngle(this.eyeRCoords.x, this.eyeRCoords.y, this.emailCoords.x + caretCoords.x, this.emailCoords.y + 25);
      this.noseAngle = this.getAngle(this.noseCoords.x, this.noseCoords.y, this.emailCoords.x + caretCoords.x, this.emailCoords.y + 25);
      this.mouthAngle = this.getAngle(this.mouthCoords.x, this.mouthCoords.y, this.emailCoords.x + caretCoords.x, this.emailCoords.y + 25);
    } else {
      this.eyeLAngle = this.getAngle(this.eyeLCoords.x, this.eyeLCoords.y, this.emailCoords.x + this.emailScrollMax, this.emailCoords.y + 25);
      this.eyeRAngle = this.getAngle(this.eyeRCoords.x, this.eyeRCoords.y, this.emailCoords.x + this.emailScrollMax, this.emailCoords.y + 25);
      this.noseAngle = this.getAngle(this.noseCoords.x, this.noseCoords.y, this.emailCoords.x + this.emailScrollMax, this.emailCoords.y + 25);
      this.mouthAngle = this.getAngle(this.mouthCoords.x, this.mouthCoords.y, this.emailCoords.x + this.emailScrollMax, this.emailCoords.y + 25);
    }

    this.eyeLX = Math.cos(this.eyeLAngle) * 20;
    this.eyeLY = Math.sin(this.eyeLAngle) * 10;
    this.eyeRX = Math.cos(this.eyeRAngle) * 20;
    this.eyeRY = Math.sin(this.eyeRAngle) * 10;
    this.noseX = Math.cos(this.noseAngle) * 23;
    this.noseY = Math.sin(this.noseAngle) * 10;
    this.mouthX = Math.cos(this.mouthAngle) * 23;
    this.mouthY = Math.sin(this.mouthAngle) * 10;
    this.mouthR = Math.cos(this.mouthAngle) * 6;
    this.chinX = this.mouthX * 0.8;
    this.chinY = this.mouthY * 0.5;
    this.chinS = 1 - ((this.dFromC * 0.15) / 100);
    if (this.chinS > 1) {
      this.chinS = 1 - (this.chinS - 1);
      if (this.chinS < this.chinMin) {
        this.chinS = this.chinMin;
      }
    }
    this.faceX = this.mouthX * 0.3;
    this.faceY = this.mouthY * 0.4;
    this.faceSkew = Math.cos(this.mouthAngle) * 5;
    this.eyebrowSkew = Math.cos(this.mouthAngle) * 25;
    this.outerEarX = Math.cos(this.mouthAngle) * 4;
    this.outerEarY = Math.cos(this.mouthAngle) * 5;
    this.hairX = Math.cos(this.mouthAngle) * 6;
    this.hairS = 1.2;

    gsap.to(this.eyeL, { duration: 1, x: -this.eyeLX, y: -this.eyeLY, ease: "power2.out" });
    gsap.to(this.eyeR, { duration: 1, x: -this.eyeRX, y: -this.eyeRY, ease: "power2.out" });
    gsap.to(this.nose, { duration: 1, x: -this.noseX, y: -this.noseY, rotation: this.mouthR, transformOrigin: "center center", ease: "power2.out" });
    gsap.to(this.mouth, { duration: 1, x: -this.mouthX, y: -this.mouthY, rotation: this.mouthR, transformOrigin: "center center", ease: "power2.out" });
    gsap.to(this.chin, { duration: 1, x: -this.chinX, y: -this.chinY, scaleY: this.chinS, ease: "power2.out" });
    gsap.to(this.face, { duration: 1, x: -this.faceX, y: -this.faceY, skewX: -this.faceSkew, transformOrigin: "center top", ease: "power2.out" });
    gsap.to(this.eyebrow, { duration: 1, x: -this.faceX, y: -this.faceY, skewX: -this.eyebrowSkew, transformOrigin: "center top", ease: "power2.out" });
    gsap.to(this.outerEarL, { duration: 1, x: this.outerEarX, y: -this.outerEarY, ease: "power2.out" });
    gsap.to(this.outerEarR, { duration: 1, x: this.outerEarX, y: this.outerEarY, ease: "power2.out" });
    gsap.to(this.earHairL, { duration: 1, x: -this.outerEarX, y: -this.outerEarY, ease: "power2.out" });
    gsap.to(this.earHairR, { duration: 1, x: -this.outerEarX, y: this.outerEarY, ease: "power2.out" });
    gsap.to(this.hair, { duration: 1, x: this.hairX, scaleY: this.hairS, transformOrigin: "center bottom", ease: "power2.out" });

    document.body.removeChild(div);
  }

  private onEmailInput = (e: Event) => {
    this.calculateFaceMove(e);
    const value = this.email.value;
    this.curEmailIndex = value.length;

    if (this.curEmailIndex > 0) {
      if (this.mouthStatus == "small") {
        this.mouthStatus = "medium";
        this.switchMouthShape('medium');
        gsap.to(this.tooth, { duration: 1, x: 0, y: 0, ease: "power2.out" });
        gsap.to(this.tongue, { duration: 1, x: 0, y: 1, ease: "power2.out" });
        gsap.to([this.eyeL, this.eyeR], { duration: 1, scaleX: 0.85, scaleY: 0.85, ease: "power2.out" });
        this.eyeScale = 0.85;
      }
      if (value.includes("@")) {
        this.mouthStatus = "large";
        this.switchMouthShape('large');
        gsap.to(this.tooth, { duration: 1, x: 3, y: -2, ease: "power2.out" });
        gsap.to(this.tongue, { duration: 1, y: 2, ease: "power2.out" });
        gsap.to([this.eyeL, this.eyeR], { duration: 1, scaleX: 0.65, scaleY: 0.65, ease: "power2.out", transformOrigin: "center center" });
        this.eyeScale = 0.65;
      } else {
        this.mouthStatus = "medium";
        this.switchMouthShape('medium');
        gsap.to(this.tooth, { duration: 1, x: 0, y: 0, ease: "power2.out" });
        gsap.to(this.tongue, { duration: 1, x: 0, y: 1, ease: "power2.out" });
        gsap.to([this.eyeL, this.eyeR], { duration: 1, scaleX: 0.85, scaleY: 0.85, ease: "power2.out" });
        this.eyeScale = 0.85;
      }
    } else {
      this.mouthStatus = "small";
      this.switchMouthShape('small');
      gsap.to(this.tooth, { duration: 1, x: 0, y: 0, ease: "power2.out" });
      gsap.to(this.tongue, { duration: 1, y: 0, ease: "power2.out" });
      gsap.to([this.eyeL, this.eyeR], { duration: 1, scaleX: 1, scaleY: 1, ease: "power2.out" });
      this.eyeScale = 1;
    }
  }

  private onEmailFocus = (e: FocusEvent) => {
    this.activeElement = "email";
    // Uncover eyes when switching to email field
    if (this.eyesCovered) {
      this.uncoverEyes();
    }
    this.onEmailInput(e);
  }

  private onEmailBlur = (e: FocusEvent) => {
    this.activeElement = null;
    setTimeout(() => {
      if (this.activeElement != "email") {
        this.resetFace();
      }
    }, 100);
  }

  private onEmailLabelClick = (e: MouseEvent) => {
    this.activeElement = "email";
  }

  private onPasswordFocus = (e: FocusEvent) => {
    this.activeElement = "password";
    if (!this.eyesCovered) {
      this.coverEyes();
    }
  }

  private onPasswordBlur = (e: FocusEvent) => {
    this.activeElement = null;
    setTimeout(() => {
      // Only uncover eyes if we're not interacting with password-related elements
      // Check if the new focused element is still the password field or toggle
      if (document.activeElement !== this.password && 
          !document.activeElement?.closest('ion-toggle')) {
        this.uncoverEyes();
      }
    }, 100);
  }

  private onPasswordInput = (e: Event) => {
    // Eyes are already covered by onPasswordFocus
    // No need to do anything here - just let the user type
  }

  private onPasswordToggleFocus = (e: FocusEvent) => {
    this.activeElement = "toggle";
    if (!this.eyesCovered) {
      this.coverEyes();
    }
  }

  private onPasswordToggleBlur = (e: FocusEvent) => {
    this.activeElement = null;
    setTimeout(() => {
      if (this.activeElement == "password" || this.activeElement == "toggle") {
        // Keep eyes covered if still interacting with password or toggle
      } else {
        // Only uncover eyes if not interacting with password/toggle
        this.uncoverEyes();
      }
    }, 100);
  }

  private onPasswordToggleMouseDown = (e: MouseEvent) => {
    this.showPasswordClicked = true;
  }

  private onPasswordToggleMouseUp = (e: MouseEvent) => {
    this.showPasswordClicked = false;
  }

  private onPasswordToggleChange = (e: Event) => {
    setTimeout(() => {
      if ((e.target as HTMLInputElement).checked) {
        this.password.type = "text";
        this.spreadFingers();
      } else {
        this.password.type = "password";
        this.closeFingers();
      }
    }, 100);
  }

  private onPasswordToggleClick = (e: MouseEvent) => {
    (e.target as HTMLElement).focus();
  }

  private spreadFingers() {
    console.log('spreadFingers called, twoFingers element:', this.twoFingers);
    if (!this.twoFingers) {
      console.warn('twoFingers element not found, cannot spread fingers');
      return;
    }
    console.log('Animating twoFingers to spread position');
    gsap.to(this.twoFingers, { duration: 0.35, transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: "power2.inOut" });
  }

  private closeFingers() {
    console.log('closeFingers called, twoFingers element:', this.twoFingers);
    if (!this.twoFingers) {
      console.warn('twoFingers element not found, cannot close fingers');
      return;
    }
    console.log('Animating twoFingers to close position');
    gsap.to(this.twoFingers, { duration: 0.35, transformOrigin: "bottom left", rotation: 0, x: 0, y: 0, ease: "power2.inOut" });
  }

  private switchMouthShape(shape: string) {
    // Check if elements exist before animating
    if (!this.mouthSmallBG || !this.mouthMediumBG || !this.mouthLargeBG) {
      console.warn('Mouth shape elements not found');
      return;
    }

    // Hide all mouth shapes first
    gsap.set([this.mouthSmallBG, this.mouthMediumBG, this.mouthLargeBG], { display: "none" });
    
    // Show the appropriate mouth shape
    switch(shape) {
      case 'small':
        gsap.set(this.mouthSmallBG, { display: "block" });
        break;
      case 'medium':
        gsap.set(this.mouthMediumBG, { display: "block" });
        break;
      case 'large':
        gsap.set(this.mouthLargeBG, { display: "block" });
        break;
    }
  }

  private coverEyes() {
    if (!this.armL || !this.armR) {
      console.warn('Arm elements not found');
      return;
    }
    
    gsap.killTweensOf([this.armL, this.armR]);
    gsap.set([this.armL, this.armR], { visibility: "visible" });
    gsap.to(this.armL, { duration: 0.45, x: -93, y: 10, rotation: 0, ease: "power2.out" });
    gsap.to(this.armR, { duration: 0.45, x: -93, y: 10, rotation: 0, ease: "power2.out", delay: 0.1 });
    this.switchBodyShape('changed');
    this.eyesCovered = true;
  }

  private uncoverEyes() {
    if (!this.armL || !this.armR) {
      console.warn('Arm elements not found');
      return;
    }
    
    gsap.killTweensOf([this.armL, this.armR]);
    gsap.to(this.armL, { duration: 1.35, y: 220, ease: "power2.out" });
    gsap.to(this.armL, { duration: 1.35, rotation: 105, ease: "power2.out", delay: 0.1 });
    gsap.to(this.armR, { duration: 1.35, y: 220, ease: "power2.out" });
    gsap.to(this.armR, { duration: 1.35, rotation: -105, ease: "power2.out", delay: 0.1, onComplete: () => {
      gsap.set([this.armL, this.armR], { visibility: "hidden" });
    }});
    this.switchBodyShape('normal');
    this.eyesCovered = false;
  }

  private switchBodyShape(shape: string) {
    if (shape === 'changed') {
      gsap.set(this.bodyBG, { display: "none" });
      gsap.set(this.bodyBGchanged, { display: "block" });
    } else {
      gsap.set(this.bodyBGchanged, { display: "none" });
      gsap.set(this.bodyBG, { display: "block" });
    }
  }


  private resetFace() {
    gsap.to([this.eyeL, this.eyeR], { duration: 1, x: 0, y: 0, ease: "power2.out" });
    gsap.to(this.nose, { duration: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, ease: "power2.out" });
    gsap.to(this.mouth, { duration: 1, x: 0, y: 0, rotation: 0, ease: "power2.out" });
    gsap.to(this.chin, { duration: 1, x: 0, y: 0, scaleY: 1, ease: "power2.out" });
    gsap.to([this.face, this.eyebrow], { duration: 1, x: 0, y: 0, skewX: 0, ease: "power2.out" });
    gsap.to([this.outerEarL, this.outerEarR, this.earHairL, this.earHairR, this.hair], { duration: 1, x: 0, y: 0, scaleY: 1, ease: "power2.out" });
  }

  private startBlinking(delay?: number) {
    if (delay) {
      delay = this.getRandomInt(delay);
    } else {
      delay = 1;
    }
    this.blinking = gsap.to([this.eyeL, this.eyeR], { duration: 0.1, delay: delay, scaleY: 0, yoyo: true, repeat: 1, transformOrigin: "center center", onComplete: () => {
      this.startBlinking(12);
    }});
  }

  private stopBlinking() {
    if (this.blinking) {
      this.blinking.kill();
      this.blinking = null;
    }
    gsap.set([this.eyeL, this.eyeR], { scaleY: this.eyeScale });
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private getAngle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  private getPosition(el: HTMLElement): { x: number, y: number } {
    let xPos = 0;
    let yPos = 0;
    let currentEl: HTMLElement | null = el;

    while (currentEl) {
      if (currentEl.tagName == "BODY") {
        const xScroll = currentEl.scrollLeft || document.documentElement.scrollLeft;
        const yScroll = currentEl.scrollTop || document.documentElement.scrollTop;
        xPos += (currentEl.offsetLeft - xScroll + currentEl.clientLeft);
        yPos += (currentEl.offsetTop - yScroll + currentEl.clientTop);
      } else {
        xPos += (currentEl.offsetLeft - currentEl.scrollLeft + currentEl.clientLeft);
        yPos += (currentEl.offsetTop - currentEl.scrollTop + currentEl.clientTop);
      }
      currentEl = currentEl.offsetParent as HTMLElement;
    }

    return { x: xPos, y: yPos };
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android|bb\d+|meego.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent);
  }

  private async initLoginForm() {
    // Get DOM elements with error checking - new simpler structure
    const emailComponent = document.querySelector('#loginEmail') as any;
    const passwordComponent = document.querySelector('#loginPassword') as any;
    
    // Get the native input elements from ion-input
    if (emailComponent) {
      if (emailComponent.getInputElement) {
        this.email = await emailComponent.getInputElement();
      } else {
        this.email = emailComponent.querySelector('input') || emailComponent;
      }
    }
    
    if (passwordComponent) {
      if (passwordComponent.getInputElement) {
        this.password = await passwordComponent.getInputElement();
      } else {
        this.password = passwordComponent.querySelector('input') || passwordComponent;
      }
    }
    
    // Debug: Log found elements
    console.log('Email input found:', this.email);
    console.log('Password input found:', this.password);
    
    this.mySVG = document.querySelector('.svgContainer') as HTMLElement;
    this.twoFingers = document.querySelector('.twoFingers') as HTMLElement;
    this.armL = document.querySelector('.armL') as HTMLElement;
    this.armR = document.querySelector('.armR') as HTMLElement;
    this.eyeL = document.querySelector('.eyeL') as HTMLElement;
    this.eyeR = document.querySelector('.eyeR') as HTMLElement;
    this.nose = document.querySelector('.nose') as HTMLElement;
    this.mouth = document.querySelector('.mouth') as HTMLElement;
    this.mouthBG = document.querySelector('.mouthBG') as SVGPathElement;
    this.mouthSmallBG = document.querySelector('.mouthSmallBG') as SVGPathElement;
    this.mouthMediumBG = document.querySelector('.mouthMediumBG') as SVGPathElement;
    this.mouthLargeBG = document.querySelector('.mouthLargeBG') as SVGPathElement;
    this.mouthMaskPath = document.querySelector('#mouthMaskPath') as SVGPathElement;
    this.mouthOutline = document.querySelector('.mouthOutline') as SVGPathElement;
    this.tooth = document.querySelector('.tooth') as SVGPathElement;
    this.tongue = document.querySelector('.tongue') as HTMLElement;
    this.chin = document.querySelector('.chin') as SVGPathElement;
    this.face = document.querySelector('.face') as SVGPathElement;
    this.eyebrow = document.querySelector('.eyebrow') as HTMLElement;
    this.outerEarL = document.querySelector('.earL .outerEar') as HTMLElement;
    this.outerEarR = document.querySelector('.earR .outerEar') as HTMLElement;
    this.earHairL = document.querySelector('.earL .earHair') as HTMLElement;
    this.earHairR = document.querySelector('.earR .earHair') as HTMLElement;
    this.hair = document.querySelector('.hair') as SVGPathElement;
    this.bodyBG = document.querySelector('.bodyBGnormal') as SVGPathElement;
    this.bodyBGchanged = document.querySelector('.bodyBGchanged') as SVGPathElement;

    console.log('SVG container found:', this.mySVG);
    console.log('Two fingers found:', this.twoFingers);
    console.log('Arm L found:', this.armL);
    console.log('Arm R found:', this.armR);

    // Check if all required elements are found
    if (!this.email || !this.password || !this.mySVG) {
      console.error('Required DOM elements not found. Retrying...');
      // Retry after a longer delay
      setTimeout(() => this.initLoginForm(), 1000);
      return;
    }

    // Calculate coordinates
    this.svgCoords = this.getPosition(this.mySVG);
    this.emailCoords = this.getPosition(this.email);
    this.screenCenter = this.svgCoords.x + (this.mySVG.offsetWidth / 2);
    this.eyeLCoords = { x: this.svgCoords.x + 84, y: this.svgCoords.y + 76 };
    this.eyeRCoords = { x: this.svgCoords.x + 113, y: this.svgCoords.y + 76 };
    this.noseCoords = { x: this.svgCoords.x + 97, y: this.svgCoords.y + 81 };
    this.mouthCoords = { x: this.svgCoords.x + 100, y: this.svgCoords.y + 100 };

    // Add event listeners
    if (this.email) {
      this.email.addEventListener('focus', this.onEmailFocus);
      this.email.addEventListener('blur', this.onEmailBlur);
      this.email.addEventListener('input', this.onEmailInput);
    }

    if (this.password) {
      this.password.addEventListener('focus', this.onPasswordFocus);
      this.password.addEventListener('blur', this.onPasswordBlur);
      this.password.addEventListener('input', this.onPasswordInput);
    }

    // For ion-toggle, we'll handle the toggle through the component's (ionChange) event
    // The old checkbox event listeners are no longer needed

    // Set initial positions
    gsap.set(this.armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
    gsap.set(this.armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });
    gsap.set(this.mouth, { transformOrigin: "center center" });

    // Start blinking
    this.startBlinking(5);

    // Set email scroll max
    this.emailScrollMax = this.email.scrollWidth;

    // Check if mobile device
    if (this.isMobileDevice()) {
      gsap.set(this.twoFingers, { transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: "power2.inOut" });
    }
  }
}
