import { DfString, DfByte, DfLong } from "../../../module";

export default class AckCommandInfoMessage {
  /* Mã cuốc */
  public bookId: DfString = DfString.index(0);

  /**
   * Mã lỗi
   * 0: thành công
   * 1: thông tin login không đúng
   * 2: tk đang bị khóa
   * */
  public code: DfByte = DfByte.index(1);

  /* Thời gian khóa */
  public dateBan: DfLong = DfLong.index(2);
}
