class BindingGroup{
    constructor() {
        this._actions = [];
    }

    /**
     * @param {number} delta the time in seconds since the last update
     */
    parseBindings(delta){
        this._actions.forEach(action => {
           action.parseInputs(delta);
        });
    }

    /**
     * @param actionName the action name (or part of it) to search for.
     * @returns {AbstractInputAction[]}
     */
    getActionsByName(actionName){
        let actionsFound = [];
        this._actions.forEach(action => {
            if (action.getName().toLowerCase().includes(actionName.toLowerCase())){
                actionsFound.push(action);
            }
        });
        return actionsFound;
    }

    /**
     * @param {String} actionName
     * @return {null|AbstractInputAction} thre first action by this name, null if not found.
     */
    getActionByName(actionName){
        const actions = this.getActionsByName(actionName);
        if(actions.length > 1) {
            console.log('Warning, action name "' + actionName + '" have several actions registered to it!');
        } else if(actions.length === 0){
            console.log('Warning, action name "' + actionName + '" have no action registered to it!');
            return null;
        }
        return actions[0];
    }

    /**
     * Get the actions of this group, but not its subgroups.
     * @returns {AbstractInputAction[]}
     */
    getActions(){
        return this._actions.slice();
    }

    /**
     * Add an action to this group, only if it is not present already.
     * @param {AbstractInputAction} action the action to add to this group.
     */
    addAction(action){
        if(this._actions.includes(action)) return;
        this._actions.push(action);
    }

    /**
     * @param {AbstractInputAction} action the action to remove.
     * @returns {boolean} true if an action has been found and deleted, false otherwise.
     */
    removeAction(action){
        let deletedAction = false;
        const actionIndex = this._actions.indexOf(action);
        if(actionIndex !== -1) {
            this._actions.splice(actionIndex, 1);
            deletedAction = true;
        }

        return deletedAction;
    }
}
