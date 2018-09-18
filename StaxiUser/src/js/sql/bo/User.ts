import { Utils } from "../../../module";

/**
 * Đối tượng user
 * @author ĐvHiện
 * Created on 07/06/2018
 */
class User {
  // Id
  public userId: number = -1;

  // Số điện thoại đăng ký
  public phone: string = "";

  // Email đăng ký
  public email: string = "";

  // Tên người sử dụng
  public name: string = "";

  // Mã thiết bị
  public clientId: string = "";

  // Mã N/A
  public naCode: string = "";

  // Thời gian bị khóa
  public liftbanTime: number = 0;

  public password: string = "";

  // Mã giới thiệu
  public refID: string = "";

  public refIDtemp: string = "";

  public isActive: boolean = false;

  public createDate: number = 1;

  public uuid: string = "";

  //Checkbox đồng ý điều khoản sử dụng
  public isCheckRule: boolean = false;

  //uri image profile
  public profileImageUri: string = "";

  /* Client có khởi động lại app hay không */
  public isRestartApp: boolean = false;

  /* Client step */
  public clientStep: number;

  /** kiểm tra trạng thái user đăng ký hay chưa */
  public isRegisted(): boolean {
    return (
      this.password != undefined &&
      this.password.trim() != "" &&
      this.phone != undefined &&
      this.phone.trim() != ""
    );
  }

  clone(user: User) {
     // Handle the 3 simple types, and null or undefined
     if (null == user || "object" != typeof user) return this;

     for (let attr in user) {
       if (user.hasOwnProperty(attr)) {
           this[attr] = user[attr];
       }
     }
  }
}

export default User;
