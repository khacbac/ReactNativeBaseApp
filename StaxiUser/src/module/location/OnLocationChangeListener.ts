import Location from "./Location";
export default interface OnLocationChangeListener{
    /** dữ liệu gửi lên server thành công hay không */
    onLocationChanged(option?:Location);
}