enum CallBackType {
    NONE,
  
    /**Gủi message thành công, Trường hợp này được gọi trong thread background*/
    SENT_SUCCESS,
  
    /**Gủi message bị lỗi, Trường hợp này được gọi trong thread background*/
    SENT_FAIL,
  
    /**dữ liệu bị lỗi**/
    SENT_INVALID_DATA
  }

  export default CallBackType;