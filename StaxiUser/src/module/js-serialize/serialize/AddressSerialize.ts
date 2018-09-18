import { DfLatLng, DfString, AbstractSerialize } from "../DefinedType";
import Address from "./Address";
import { LatLng } from "../..";

export default class AddressSerialize extends AbstractSerialize {

    /**Tọa độ điểm*/
    public location: DfLatLng = DfLatLng.index(0);

    /**Thông tin địa chỉ*/
    public formattedAddress: DfString = DfString.index(1);

    /**Tên địa điểm*/
    public name: DfString = DfString.index(2);

    public static index(index:number):AddressSerialize{
        return new AddressSerialize(index);
    }

    constructor(index?:number){
        super(index);
    }

    public toAddress():Address{
        let address = new Address();
        address.location = new LatLng(this.location.getLat(), this.location.getLng());
        address.formattedAddress = this.formattedAddress.value;
        address.name = this.name.value;
        return new Address();
    }
}