import {Create} from "serialeazy";

import {DigitalComponent, InputPort, OutputPort} from "digital/models";

import {ICData} from "digital/models/ioobjects";

import {Mux} from "digital/models/ioobjects/other/Mux";


/**
 * This function checks if a component can be used to replace another component.
 * If it can, then true is returned, otherwise return false.
 * A replacement is considered valid if the replacement has as many input ports as the original has in use and
 * as many output ports as the original has in use (in use defined as having 1+ wire(s) connected).
 * Select ports are counted as input ports.
 *
 * @param original    The component to be replaced.
 * @param replacement The ID or ICData to try to replace against the .
 * @returns             An instance, of the DigitalComponent that can replace, the ICData if it can replace,
 *              or null if replacement can not replace.
 * @throws An error if replacement is a string and not a valid component id.
 */
export function CanReplace(original: DigitalComponent, replacement: string | ICData): boolean {
    const origInputs = original.getPorts().filter(port => port instanceof InputPort).length;
    const origOutputs = original.getPorts().filter(port => port instanceof OutputPort).length;

    if (replacement instanceof ICData) {
        return replacement.getInputCount() >= origInputs && replacement.getOutputPortCount() >= origOutputs;
    }

    const replacementComponent = Create<DigitalComponent>(replacement);
    if (!replacementComponent)
        throw new Error(`Supplied replacement id "${replacement}" is invalid`);
    const replacementInputs = replacementComponent.getInputPortCount();
    const replacementOutputs = replacementComponent.getOutputPortCount();
    const inOutContains = replacementInputs.contains(origInputs) && replacementOutputs.contains(origOutputs);
    if (original instanceof Mux)
        return inOutContains && (replacementComponent instanceof Mux
                                 || original.getSelectPorts().every(port => port.getWires().length === 0));
    return inOutContains;
}