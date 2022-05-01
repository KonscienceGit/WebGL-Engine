/**
 * This define the base of each states.
 * Use states to define which part of the software/game the user/player is in (in the main menu, in the actual game, in the in-game menu, in the player inventory menu etc...)
 * Note: a state can be reused, as long as start and finish are properly called between uses.
 * @abstract
 */
class AbstractState {
    constructor() {
        this.ANIMATE_IN = 0;
        this.ANIMATE_OUT = 1;
        this._currentState = 0;

        this._animateInLength = 1.0;
        this._animateOutLength = 1.0;
        this._animateCurrentTime = 0.0;
        this._goToNextState = false;
        this._isActive = false;
    }

    /**
     * Update this state, passing along the delta time (in seconds) since the last update.
     * Should not be overrided in a typical class implementation.
     * @param {number} delta in seconds.
     */
    updateState(delta){
        switch (this._currentState){
            default:
            case 0:// Start
                this._goToNextState = false;
                this._currentState = 0;
                this._animateCurrentTime = 0.0;
                this._isActive = true;
                this.start();
                this._currentState++;
                break;

            case 1:// Animate In
                this.animate(this._animateInLength, delta, this.ANIMATE_IN);
                break;

            case 2:// Main Loop
                this.mainLoop(delta);
                break;

            case 3:// Animate Out
                this.animate(this._animateOutLength, delta, this.ANIMATE_OUT);
                break;

            case 4:// Finish
                this.finish();
                this._isActive = false;
                this._goToNextState = true;
                this._currentState = 0;
                break;
        }
    }

    animate(animationLength, delta, animationType){
        if(animationLength <= 0){// No animation
            this._currentState++;
        } else {
            let animationDelta;
            let animationState;
            if (this._animateCurrentTime >= animationLength){// End animation
                this._currentState++;
                animationDelta = this._animateCurrentTime - animationLength;
                animationState = 1.0;
            } else {// Continue animation
                animationDelta = delta;
                animationState = this._animateCurrentTime / animationLength;
                this._animateCurrentTime += delta;
            }
            if(animationType === this.ANIMATE_IN){
                this.animateIn(animationDelta, animationState);
            } else {
                this.animateOut(animationDelta, animationState);
            }
        }
    }

    /**
     * @public
     * Set this state to go to the next state. (Will animateOut and call finish before actually change state)
     */
    setReadyForNextState(){
        if(this._currentState === 2){
            this._currentState = 3;
            this._animateCurrentTime = 0.0;
        }
    }

    /**
     * @public
     * @return {boolean} Return if this state have finished and the next state can take over.
     */
    goToNextState(){
        return this._goToNextState;
    }

    isActive(){
        return this._isActive;
    }

    isInMainLoop(){
        return this.isActive() && this._currentState === 2;
    }

    /**
     * @abstract
     * This (re)initialize this state to it's starting status.
     * Called when this state become active.
     * This is usually used to enable the adequate inputs, position objects in the scene, make them visible, initialize the status and scores, etc.
     */
    start(){
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * Animate this state when it become active, just after calling start().
     * AnimateIn is then called until the animationState reach 1.0, the time it takes is defined by setAnimateInLength(seconds).
     * @param {number} delta in seconds.
     * @param {number} animationState the state of animation, from 0.0 (start) to 1.0 (end).
     */
    animateIn(delta, animationState){
        ConsoleUtils.nonImplementedError();
    }

    /**
     * Where the main action of this state happen.
     * This state is called after animateIn() fionishes animating.
     * @param {number} delta in seconds.
     */
    mainLoop(delta){
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * Animate this state when it's going towards it's inactive state, before aclling finish().
     * AnimateOut is then called until the animationState reach 1.0, the time it takes is defined by setAnimateOutLength(seconds).
     * @param {number} delta in seconds.
     * @param {number} animationState the state of animation, from 0.0 (start) to 1.0 (end).
     */
    animateOut(delta, animationState){
        ConsoleUtils.nonImplementedError();
    }

    /**
     * This allow to cleanup this state before leaving for the next state.
     * Called after animateOut() finish and before the final transition from this state to another.
     * This is usually used to disable this state inputs, hide this state objects by making them invisible, reset the status and scores, etc.
     * @abstract
     */
    finish(){
        ConsoleUtils.nonImplementedError();
    }

    /** @param {number} seconds */
    setAnimateInLength(seconds){
        this._animateInLength = seconds;
    }

    /** @param {number} seconds */
    setAnimateOutLength(seconds){
        this._animateOutLength = seconds;
    }

    /**
     * @abstract
     * Return the next state following this state. One game state can lead to several different states, depending on the context, you can get creative.
     * @returns {AbstractState}
     */
    getNextState(){
        ConsoleUtils.nonImplementedError();
        return null;
    }
}
