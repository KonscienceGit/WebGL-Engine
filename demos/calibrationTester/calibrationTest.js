/*
 * Gamepad API Test
 * Original author: Ted Mielczarek <ted@mielczarek.org>, 2013
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
const haveEvents = 'GamepadEvent' in window;
const haveWebkitEvents = 'WebKitGamepadEvent' in window;
const controllers = {};
const rAF = window.requestAnimationFrame;

function connecthandler(e) {
    addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    let i;
    controllers[gamepad.index] = gamepad;
    const controllerDiv = document.createElement("div");
    controllerDiv.setAttribute("id", "controller" + gamepad.index);
    const controllerName = document.createElement("h1");
    controllerName.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    controllerDiv.appendChild(controllerName);
    const buttonsBoxDiv = document.createElement("div");
    buttonsBoxDiv.className = "buttons";
    for (i = 0; i < gamepad.buttons.length; i++) {
        const button = document.createElement("span");
        button.className = "button";
        button.innerHTML = i;
        buttonsBoxDiv.appendChild(button);
    }
    controllerDiv.appendChild(buttonsBoxDiv);
    const axesBoxDiv = document.createElement("div");
    axesBoxDiv.className = "axes";
    for (i = 0; i < gamepad.axes.length; i++) {
        const axisColumnDiv = document.createElement("div");
        axisColumnDiv.className = "axisColumn";
        axesBoxDiv.appendChild(axisColumnDiv);

        const axisValue = document.createElement("div");
        axisValue.className = "axisValue";
        axisValue.innerHTML = "0";
        axisColumnDiv.appendChild(axisValue);

        const axisMeter = document.createElement("meter");
        axisMeter.className = "axis";
        axisMeter.setAttribute("min", "-1");
        axisMeter.setAttribute("max", "1");
        axisMeter.setAttribute("value", "0");
        axisMeter.innerHTML = i;
        axisColumnDiv.appendChild(axisMeter);


    }
    controllerDiv.appendChild(axesBoxDiv);
    document.getElementById("start").style.display = "none";
    document.body.appendChild(controllerDiv);
    rAF(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    const d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
}

function updateStatus() {
    scangamepads();
    for (j in controllers) {
        const controller = controllers[j];
        const d = document.getElementById("controller" + j);
        const buttons = d.getElementsByClassName("button");
        for (let i = 0; i<controller.buttons.length; i++) {
            const b = buttons[i];
            let val = controller.buttons[i];
            let pressed = val == 1.0;
            let touched = false;
            if (typeof(val) == "object") {
                pressed = val.pressed;
                if ('touched' in val) {
                    touched = val.touched;
                }
                val = val.value;
            }
            const pct = Math.round(val * 100) + "%";
            b.style.backgroundSize = pct + " " + pct;
            b.className = "button";
            if (pressed) {
                b.className += " pressed";
            }
            if (touched) {
                b.className += " touched";
            }
        }

        const axes = d.getElementsByClassName("axis");
        const axesValues = d.getElementsByClassName("axisValue");
        for (let i=0; i<controller.axes.length; i++) {
            const axis = axes[i];
            axis.setAttribute("value", controller.axes[i]);
            const axisValue = axesValues[i];
            const positiveSpace = controller.axes[i] > 0 ? " " : "";
            axisValue.innerHTML = "Axis " + i + ":         " + positiveSpace + controller.axes[i].toFixed(2);
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
            controllers[gamepads[i].index] = gamepads[i];
        }
    }
}

if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
    setInterval(scangamepads, 500);
}
