import {
  EmitterSubscription,
  EventSubscriptionVendor,
  NativeEventEmitter
} from "react-native";

export default abstract class NativeEventProcess {

  /** đối tượng nhận sự kiện */
  protected emitterSubscription: EmitterSubscription;

  /** module xử lý */
  public abstract getModule(): EventSubscriptionVendor;

  /** phân loại sự kiện */
  public abstract getEventType(): string;

  /** trạng thái đã remove tiến trình lắng nghe*/
  protected isRemoved:boolean = false;

  public setListener(event: (...args: any[]) => any, context?: any) {
    //nếu không định ngĩa module và lại nhận dữ liệu thì bỏ qua
    if (
      this.getModule() == null ||
      this.getEventType() == null ||
      event == null
    )
      return;

    //xóa tín hiệu lắng nghe trước đó
    if (this.emitterSubscription != null) {
      this.removeEmitterSubscription();
    }

    //gán trạng thái chưa xóa
    this.isRemoved = false;

    //lắng nghe sự kiện trả về khi start
    this.emitterSubscription = new NativeEventEmitter(
      this.getModule()
    ).addListener(this.getEventType(), event, context);
  }

  /**
   * xóa đối tượng lắng nghe
   */
  public removeEmitterSubscription(){
    
    this.isRemoved = true;

    if (this.emitterSubscription) {
      this.emitterSubscription.remove();
      this.emitterSubscription = null;
    }
  };
}
