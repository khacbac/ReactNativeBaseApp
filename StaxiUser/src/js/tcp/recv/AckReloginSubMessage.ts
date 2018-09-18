import { DfString, DfByte, DfList, DefinedBuffer, ByteHelper } from "../../../module";
import CarsInfoMessage from "./CarsInfoMessage";
import CancelInfo from "./CancelInfo";
import OperatorDispatchingMessage from "./OperatorDispatchingMessage";
import AckReloginMessage from "./AckReloginMessage";
import { AbstractDefineType, ISerialize } from "../../../module/js-serialize/DefinedType";
import DoneInfo from "./DoneInfo";
import LogFile from "../../../module/LogFile";

export default class AckReloginSubMessage implements ISerialize{
  /** Mã cuốc */
  public tripID: DfString = DfString.index(0);

  /** Trạng thái trong cuốc của xe */
  public tripStep: DfByte = DfByte.index(1);

  /**Trạng thái hiện tại của cuốc*/
  public subStep: DfByte = DfByte.index(2);

  /** Thông tin xe */
  public carInfo: CarsInfoMessage = new CarsInfoMessage(3);

  /** Thông tin kết thúc*/
  public doneInfo: DoneInfo = DoneInfo.index(4);

  /** Thông tin hủy */
  public cancelInfo: CancelInfo = new CancelInfo(5);

  /* Dùng list để tránh null từ server: mặc định là 2 byte */
  public odList: DfList<OperatorDispatchingMessage> = DfList.index(
    new OperatorDispatchingMessage(),
    6
  );

  public propertyIndex = 0;

  public static parse(reloginMessage: AckReloginMessage): AckReloginSubMessage {
    let ack = new AckReloginSubMessage();
    try {
      let fieldMap = reloginMessage.fieldMap.value;

      // console.log("AckReloginSubMessage fieldMap.value === ", reloginMessage.fieldMap.value);

      LogFile.logBitSet(fieldMap);

      // Lấy thông tin info
      let fieldBits: Map<number, boolean> = new Map();
      for (let i = 0; i < 32; i++) {
        let b = (fieldMap & (1 << i)) != 0;
        if (b) {
          fieldBits.set(i, b);
        }
      }
      console.log("AckReloginSubMessage fieldBits === ", fieldBits);
      // LogFile.logBinary(reloginMessage.stepInfo.value);
      

      let buffer = DefinedBuffer.wrap(reloginMessage.stepInfo.value);
      // gán giá trị các tất cả các trường
      let keys = Object.keys(ack);
      let key;
      let value;
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        // console.log("AckReloginSubMessage parse ===key = ", key);
        value = ack[key];
        if (AbstractDefineType.isSerialize(value)) {
          // console.log("AckReloginSubMessage parse ===value = ", value);
          //Lấy trạng thái để cập nhật
          if (fieldBits.get(value.propertyIndex)) {
            //   ByteUtils.putValueToField(field, ack, buffer, propertyIndex);
            ByteHelper.deserializeObject(buffer, value);
            // console.log("AckReloginSubMessage parse ===value 2= ", key + " ===" + JSON.stringify(ack[key]));
          }
        }
      }
    } catch (e) {
      LogFile.e(e);
    }

    // LogFile.e(ack);

    return ack;
  }

  /**
   * có thông tin lái xe
   */
  public isHasCarInfo(){
    return this.carInfo != null && this.carInfo.infoMessages != null && this.carInfo.infoMessages.value.length > 0;
  }

  
}
