import { FusedLocation, Location, FusedLocationModule } from "../../module";


export default class TestViewModel extends FusedLocation {
    private fusedLocationModule: FusedLocationModule;
    
    constructor() {
        super();

        if (this.fusedLocationModule == null) {
            this.fusedLocationModule = new FusedLocationModule();
          }
      
          this.fusedLocationModule.startOnEvent(this);
      }

    startUpdatingLocation() {
        FusedLocationModule.startLocationUpdates()
    }

    stopUpdatingLocation() {
        FusedLocationModule.stopLocationUpdates()
    }

    onGpsStatusChanged(state: number) {
        console.log('onGpsStatusChanged', state);
        
    }

    onLocationChanged(option?: Location) {
        //xử lý ở đối tượng lắng nghe
        console.log('onLocationChanged', option);
    }
    
}