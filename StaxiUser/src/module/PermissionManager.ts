import { PermissionsAndroid, Alert } from "react-native";

/**
 * lớp này xử lý chưa hoàn thiện, sẽ xử lý sau, đang xử lý trên native
 */
class PermissionManager {
  /**
   * kiểm tra quyền
   * @param permissions
   */
  static checkPermissions(permissions: string[]) {
     //khởi tạo mảng permission;
     let permiss = new Array<Permission>();
     permissions.forEach(item=>{
       permiss.push(new Permission(item, false));
     })
     return this.checkLoop(permiss);
  }

  /**
   * kiểm tra vòng các đối tượng
   * @param permissions
   */
  static async checkLoop(permissions:Array<Permission>):Promise<any>{
    try {
      let permisItem = await this.hasPermissionsDenided(permissions);
      console.log(`checkPermissionItem ===` + permisItem);
      if (!permisItem) {
        return Promise.resolve(true);
      }else{
        permisItem.isChecked = true;

        //check tiếp nếu vẫn có có quyền chưa check
        this.checkLoop(permissions);
      }
    } catch (err) {
      return Promise.reject(false);
    }
  }

  /**
   * kiểm tra có quyền denied ko
   * @param permissions
   */
  private static async hasPermissionsDenided(permissions:Array<Permission>): Promise<any> {
    try {
      //kiểm tra permission đã cho phép hay chưa
      let permisItem;
      for(const item of permissions){
        if(!item.isChecked){
          console.log(`${item.isChecked} ======== ${item.name}`);
          permisItem = item;
          break;
        }
      }
      //nếu tất cả đã cho phép rồi thì bỏ qua
      if(!permisItem) return Promise.resolve(null)

      //kiểm tra quyền với name được chọn
      let granted = await PermissionsAndroid.check(permisItem.name);
      return Promise.resolve(granted?null:permisItem);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  private static async checkPermissionItem(permission) {
    console.log(`${permission}>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    try {
      const granted = await PermissionsAndroid.request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`You can use the ${permission}`);
      } else {
        console.log(`${permission} permission denied`);
      }
    } catch (error) {
      console.log(error);
    }

    console.log(`${permission}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
  }
}

class Permission{
  public name:string;
  public isChecked:boolean;
  constructor(name, isChecked){
    this.name = name;
    this.isChecked = isChecked;
  }
}

export default PermissionManager;
