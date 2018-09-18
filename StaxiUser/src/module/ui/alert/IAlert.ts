import { Dialog } from "../..";

export default interface IAlert{
    show(onDismiss?:Function);
    showDialog(dialog: Dialog);
}