class BindingGroup{
    /**
     * @param {String} groupName
     * @param {boolean} isEditable if this binding group can be edited in a binding option menu
     * @param {boolean} [isEnabled]
     */
    constructor(groupName, isEditable, isEnabled) {
        this._groupName = groupName;
        this._actions = [];
        this._actionSubGroups = [];
        this._isEditable = isEditable;
        this._isEnabled = isEnabled ? isEnabled : true;
    }

    /**
     * Enable or disable this binding group. Disabled binding group don't parse inputs and thus don't fire callbacks when inputs are pressed.
     * Additionally, if copy to false, this group's subgroups won't be parsed either.
     * @param {boolean} enable
     */
    setEnabled(enable){
        this._isEnabled = enable;
    }

    /**
     * @param {number} delta the time in seconds since the last update
     */
    parseBindings(delta){
        if(!this._isEnabled) return;
        this._actions.forEach(action => {
           action.parseInputs(delta);
        });
        this._actionSubGroups.forEach(subGroup => {
            subGroup.parseBindings(delta);
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

        this._actionSubGroups.forEach(group => {
            actionsFound = actionsFound.concat(group.getActionsByName(actionName));
        });

        return actionsFound;
    }

    /**
     * @param {String} actionName
     * @return {null|AbstractInputAction}
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
     * Get all actions recursively from this group and its subgroups.
     * @returns {AbstractInputAction[]}
     */
    getAllActions(){
        let actions = this.getActions();
        this._actionSubGroups.forEach(group => {
            actions = actions.concat(group.getAllActions());
        });
        return actions;
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
     * @param {boolean} recursive search and remove in subgroups too.
     * @returns {boolean} true if an action has been found and deleted, false otherwise.
     */
    removeAction(action, recursive){
        let deletedAction = false;
        const actionIndex = this._actions.indexOf(action);
        if(actionIndex !== -1) {
            this._actions.splice(actionIndex, 1);
            deletedAction = true;
        }

        if(recursive){
            this._actionSubGroups.forEach(group => {
                const result = group.removeAction(action, recursive);
                deletedAction = deletedAction || result;
            });
        }

        return deletedAction;
    }

    /**
     * @returns {BindingGroup[]}
     */
    getSubGroups(){
        return this._actionSubGroups.slice();
    }

    /**
     * Add a subgroup to this group, only if it is not present already.
     * @param {BindingGroup} subGroup the subgroup to add to this group.
     */
    addSubGroup(subGroup){
        if(this._actionSubGroups.includes(subGroup)) return;
        this._actionSubGroups.push(subGroup);
    }

    /**
     * @return {String} the name of this group of actions.
     */
    getName(){
        return this._groupName;
    }
}