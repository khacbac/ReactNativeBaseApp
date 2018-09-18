enum CipherType {
  NONE = 0,
  NOT_SESSION_KEY = 1,
  SESSION_KEY = 2
}

enum PriorityType {
  /**Loại message không ưu tiên*/
  NONE,

  /**Loại message cho kết nối với server login, relogin*/
  CONNECTION,

  /**Loại message cho duy trì kết nối với server**/
  MAINTAIN_CONNECTION,

  /**Loại message cho việc ngắt kết nối với server logout*/
  INTERRUPT_CONNECTION,

  /**Loại message looper => gửi liên tục**/
  LOOPER
}

class BAMessageType {

  /***mã bản tin */
  private id: number;

  /*** mẫu đối tượng đề chuyển đổi dữ liệu byte thành đối tượng */
  private recvInstance: Function;

  /** loại mã hóa */
  private mCipherType: CipherType = CipherType.SESSION_KEY;

  
  /**Lưu trữ độ ưu tiên của message khi nhận nhiều message
   * giá trị càng nhỏ độ ưu tiên càng cao
   * giá trị -1 là mặc định, ko có ưu tiên
   * */
  private mPriorityType: PriorityType;

  constructor(
    id: number,
    cls?: Function,
    cipherType?: CipherType,
    priorityType?: PriorityType
  ) {
    this.id = id;
    this.recvInstance = cls || null;
    this.mCipherType = cipherType || CipherType.SESSION_KEY;
    this.mPriorityType = priorityType || PriorityType.NONE;
    // console.log(this);
  }

  public getId(): number {
    return this.id;
  }

  public getReceivedInstance(): Object {
    return this.recvInstance();
  }

  public getCipherType(): CipherType {
    return this.mCipherType;
  }

  public getPriorityType(): PriorityType {
    return this.mPriorityType;
  }

  /*** Lưu trữ các thông tin bản tin */
  private static mMap:Map<number, BAMessageType> = new Map<number, BAMessageType>();

  public static add(
		id: number,
    instance?: Function,
    cipherType?: CipherType,
    priorityType?: PriorityType):BAMessageType{
		let type = new BAMessageType(id, instance, cipherType, priorityType);
    this.mMap.set(id, type);
    return type;
  }
  /**
   * lấy loại đối tượng theo id
   * @param id
   */
  public static getMessageType(id: number): BAMessageType {
    let ret = this.mMap.get(id);
    // console.log("getMessageType", ret);
    return ret||new BAMessageType(-1);
  }
}

//khởi tạo đối tượng message type
// var MessageType: Type = MessageType || new Type();


//public các đối tượng
export {CipherType, BAMessageType, PriorityType };
