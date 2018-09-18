import BAMessage from "./BAMessage";

export default interface MessageEvent{
    sendBAMessage(baMessage:BAMessage, connectionID:number);
}