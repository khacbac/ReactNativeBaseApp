/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-07-10 02:50:22
 * @modify date 2018-07-10 02:50:22
 * @desc [Khởi tạo cuốc]
*/

import AbstractSentMessage from "./AbstractSentMessage";
import { BAMessageType } from "../../../module/tcp/BAMessageType";
import AddressSerialize from "../../../module/js-serialize/serialize/AddressSerialize";
import { DfString, DfInteger, DfLong, DfLatLng, DfByte, DfShort, DfBoolean, DfList, DfNumberArray, DataType, DfFloat } from "../../../module/js-serialize/DefinedType";
import { MessageType } from "../MessageType";
import { VehicleWithPrice } from "../../http/estimate/CalcPriceResponse";

export default class InitBookMessage extends AbstractSentMessage {

  /***mã hãng*/
  public companyKey: DfInteger = DfInteger.index(0);

  /***Thời gian đón khách*/
  public catchedTime: DfLong = DfLong.index(1);

  /***Thông tin điểm đón */
  public sourceAddress: AddressSerialize = AddressSerialize.index(2);

  /**Thông tin điểm đến */
  public destAddress: AddressSerialize = AddressSerialize.index(3);

  /**Vị trí người dùng hiện tại*/
  public currentCoordinate: DfLatLng = DfLatLng.index(4);

  /** Số điện thoại */
  public phone: DfString = DfString.index(5);

  /* Số lượng xe */
  public countCar: DfByte = DfByte.index(6);

  /* Loại xe */
  public carType: DfShort = DfShort.index(7);

  /* Loại cuốc */
  public bookType: DfByte = DfByte.index(8);

  /* Độ ưu tiên */
  public priority: DfByte = DfByte.index(9);

  /* Đánh dấu xem có nhận cuội gọi hay không */
  public isReceivedCall: DfBoolean = DfBoolean.index(10);

  /* Ghi chú */
  public comment: DfString = DfString.index(11);

  /* Mã khuyến mại */
  public promotion: DfString = DfString.index(12);

  /* Biển số xe */
  public vehiclePlates: DfList<DfString> = DfList.index(new DfString(), 13);

  /* Mã tuyến */
  public routeId: DfInteger = DfInteger.index(14);

  /* Độ ưu tiên tìm kiếm */
  public searchOption: DfByte = DfByte.index(15);

  /* Danh sách hãng yêu thích */
  public favComp: DfNumberArray = DfNumberArray.index(DataType.INT, 16);

  /* Danh sách hãng bị chặn */
  public blockComp: DfNumberArray = DfNumberArray.index(DataType.INT, 17);

  /* Thông tin bookID cuốc cũ */
  public oldBookID: DfString = DfString.index(18);

  /* Khoảng cách giữa 2 điểm */
  public distance: DfFloat = DfFloat.index(19);

  /* Loại cuốc */
  public bookTripType: DfByte = DfByte.index(20);

  /* Tiền cước di chuyển */
  public childPrices: DfList<VehicleWithPrice> = DfList.index(new VehicleWithPrice(), 21);

  public getSentMessageType(): BAMessageType {
    return MessageType.INIT_BOOK;
  }
}

enum Priority {
  NORMAL, IMMEDIATE, FUTURE
}
