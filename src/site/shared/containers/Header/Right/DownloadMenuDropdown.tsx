/* eslint-disable jsx-a11y/img-redundant-alt */
import {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";
import {SaveFile}           from "shared/utils/Exporter";

import {useSharedDispatch, useSharedSelector} from "shared/utils/hooks/useShared";

import {CloseHeaderMenus, OpenHeaderMenu, OpenHeaderPopup} from "shared/state/Header";

import {Dropdown} from "./Dropdown";


type Props = {
    helpers: CircuitInfoHelpers;
}
export const DownloadMenuDropdown = ({ helpers: { GetSerializedCircuit } }: Props) => {
    const { curMenu, circuitName } = useSharedSelector(
        state => ({ curMenu: state.header.curMenu, circuitName: state.circuit.name })
    );
    const dispatch = useSharedDispatch();

    return (
        <Dropdown open={(curMenu === "download")}
                  btnInfo={{ title: "Download current scene", src: "img/icons/download.svg" }}
                  onClick={() => dispatch(OpenHeaderMenu("download"))}
                  onClose={() => dispatch(CloseHeaderMenus())}>
            <div role="button"
                 tabIndex={0}
                 title="Download circuit locally"
                 onClick={() => SaveFile(GetSerializedCircuit(), circuitName)}>
                <img src="img/icons/download.svg" height="100%" alt="Download current scene" />
                <span>Download</span>
            </div>
            <div title="Export as Image"
                 role="button"
                 tabIndex={0}
                 onClick={() => {
                    dispatch(CloseHeaderMenus());
                    dispatch(OpenHeaderPopup("image_exporter"));
                }}>
                <img src="img/icons/png_download.svg" height="100%" alt="Export current scene as an image" />
                <span>Export Image</span>
            </div>
        </Dropdown>
    );
}
