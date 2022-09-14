import projectorIcon from "./icons/projector.png";
import soundIcon from "./icons/sound.png";
import disabledAccessIcon from "./icons/disabledAccess.png";
import wifiIcon from "./icons/wifi.png";
import ethernetIcon from "./icons/ethernet.png";
//<a href="https://www.flaticon.com/free-icons/ethernet" title="ethernet icons">Ethernet icons created by Pixelmeetup - Flaticon</a>

//This component displays the icons resources according to the properties received that 
//determinate weather each icon has to be displayed or not.
function Resources(props) {
    let projector = props.projector ? <img src={projectorIcon} className={props.colorIcon} alt="icon" /> : null;
    let sound = props.sound ? <img src={soundIcon} className={props.colorIcon} alt="icon" /> : null;
    let disabledAccess = props.disableAccess ? (
        <img src={disabledAccessIcon} className={props.colorIcon} alt="icon" />
    ) : null;
    let wifi = props.wifi ? <img src={wifiIcon} className={props.colorIcon} alt="icon" /> : null;
    let ethernet = props.ethernet ? <img src={ethernetIcon} className={props.colorIcon} alt="icon" /> : null;

    return (
        <div>
            {projector}
            {sound}
            {disabledAccess}
            {wifi}
            {ethernet}
        </div>
    );
}

export default Resources;
