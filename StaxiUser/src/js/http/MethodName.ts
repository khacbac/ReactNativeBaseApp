enum MethodName {
    CustSyncData = "SyncDataV3", // Đồng bộ khách hàng
    Register = "Register",
    Validate = "Validate",
    OnlineHistory = 'OnlineHistory', // Lịch sử online
    AppFeedback = "AppFeedback",
    GetCustomerHelper = "GetCustomerHelper",
    RemoveAcc = "Delete2",
    UpdateAcc = "Trusted2",
    GetNearCars = "RealTimeCarInfo3",
    CalcPrice = "CalcPriceNewV3",
    GetAddress = "GetAddress",
    GetSaleOffCode = "GetSaleOffCode",
    CheckSaleOffCode = "CheckSaleOffCodeV2",
    DriverFeedback = "DriverFeedback",
    ScheduleCancel = "CancelScheduleBooking",
    BOOKING_VIA = "BookingViaHTTP"
}

export default MethodName;
