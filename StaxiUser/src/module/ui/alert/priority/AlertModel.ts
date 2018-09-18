import Utils from '../../../Utils';

export default class AlertModel {
  public priority: number;
  public msg: string;
  public onClickListener: Function;
  public textColor: string = "";
  public bgColor: string = "";

  constructor(priority: number, msg: string, bgColor?: string) {
    this.msg = msg;
    this.priority = priority;
    this.bgColor = bgColor || "";
  }

  /**
   * xác định độ ưu tiên để hiện thị thông báo
   * @param alertModel 
   */
  public isPriority(alertModel: AlertModel): boolean {
    if (typeof alertModel === "undefined" || alertModel === null) {
      return true;
    }

    return this.priority < alertModel.priority;
  }

  public setOnClickListener(onClick: Function) {
    this.onClickListener = onClick;
  }
}
