import CountDownTimer from "../utils/CountDownTimer";

export default class WaitGpsDialog extends CountDownTimer{

    private static MAX_WAITING_GPS_TIME = 12000;
    private static REPEAT_GPS_TIMEOUT = 3000;

    private onGpsCallBack:Function;

    private getCurrentLatLng:Function;
    
    constructor(onGpsCallBack:Function, getCurrentLatLng:Function){
        super(WaitGpsDialog.MAX_WAITING_GPS_TIME, WaitGpsDialog.REPEAT_GPS_TIMEOUT);
        this.onGpsCallBack = onGpsCallBack;
        this.getCurrentLatLng = getCurrentLatLng;
    }

    onTick(millisUntilFinished: number){
        let coordinate = this.getCurrentLatLng()
        console.log(`getCurrentLatLng: ${coordinate}`);

        if(coordinate != null){
            //kết thúc tiến trình
            this.cancel();

            //trả vị trí về
            if(this.onGpsCallBack != null){
                this.onGpsCallBack(coordinate);
            }
        }
        
    }

    /**
     * kết thúc timeout đợi location
     */
    onFinish(){
        let coordinate = this.getCurrentLatLng()
        console.log(`getCurrentLatLng: ${coordinate}`);
        if(this.onGpsCallBack != null){
            this.onGpsCallBack(coordinate);
        }
    }

}