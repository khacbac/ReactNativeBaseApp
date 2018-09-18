export default class GpsConfig {
  /**Thời gian cập nhật gps*/
  public updateTimer = 3000;
  /**
   * Độ chính xác vị trí tính bằng m và có thể chấp nhận được
   */
  public maxAccuracy = 2000;

  /**Vận tốc tối đa cho phép đơn vị m/s*/
  public maxAllowVelocity = 40;

  /**Thời gian lớn nhất để lấy 1 vị trí*/
  public maxTimeForGetLocation = 30000;
  /**
   * cập nhật lại giá trị
   * @param gpsConfig
   */
  public setGpsConfig(gpsConfig: GpsConfig) {
    this.updateTimer = gpsConfig.updateTimer;
    this.maxAccuracy = gpsConfig.maxAccuracy;
    this.maxAllowVelocity = gpsConfig.maxAllowVelocity;
    this.maxTimeForGetLocation = gpsConfig.maxTimeForGetLocation;
  }
}
