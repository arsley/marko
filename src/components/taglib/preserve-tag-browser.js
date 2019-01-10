var componentsUtil = require("../util");
var componentLookup = componentsUtil.___componentLookup;

module.exports = function render(input, out) {
    var componentsContext = out.___components;

    if (componentsContext) {
        // See if the DOM node with the given ID already exists.
        // If so, then reuse the existing DOM node instead of re-rendering
        // the children. We have to put a placeholder node that will get
        // replaced out if we find that the DOM node has already been rendered
        if (!("if" in input) || input["if"]) {
            var parentComponent =
                componentsContext.___componentDef.___component;
            var ownerComponent = out.___assignedComponentDef.___component;
            var globalComponentsContext = componentsContext.___globalContext;
            var key = input.key;
            var componentId;
            var component;

            if (key) {
                if (isAutoKey(key)) {
                    if (ownerComponent !== parentComponent) {
                        key += ":" + ownerComponent.id;
                    }
                    component = parentComponent;
                } else {
                    component = ownerComponent;
                }

                if (component.___keyedElements[key]) {
                    var bodyOnly = input.bodyOnly === true;
                    // Don't actually render anything since the element is already in the DOM,
                    // but keep track that the node is being preserved so that we can ignore
                    // it while transforming the old DOM
                    if (bodyOnly) {
                        globalComponentsContext.___preservedElBodies[
                            key
                        ] = true;
                    } else {
                        // If we are preserving the entire DOM node (not just the body)
                        // then that means that we have need to render a placeholder to
                        // mark the target location. We can then replace the placeholder
                        // node with the existing DOM node
                        out.element(
                            "",
                            null,
                            key,
                            null,
                            0,
                            8 /* FLAG_PRESERVE */
                        );
                        globalComponentsContext.___preservedEls[key] = true;
                    }

                    return;
                }
            } else if ((componentId = input.cid)) {
                var existingComponent = componentLookup[componentId];
                if (existingComponent) {
                    out.___preserveComponent(existingComponent);
                    globalComponentsContext.___renderedComponentsById[
                        componentId
                    ] = true;
                    return;
                }
            }
        }
    }

    if (input.renderBody) {
        input.renderBody(out);
    }
};

function isAutoKey(key) {
    return !/^@/.test(key);
}
