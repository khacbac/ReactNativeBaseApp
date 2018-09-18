import Landmark from "../sql/bo/Landmark";
import VehicleType from "../sql/bo/VehicleType";
import Route from "../sql/bo/Route";
import Company from "../sql/bo/Company";

/**
 * @author Nguyễn Đức Lực
 * @email lucnd@binhanh.vn
 * @create date 2018-08-21 01:24:14
 * @modify date 2018-08-21 01:24:14
 * @desc [Lưu trữ thông tin vùng]
*/

export default class Region {

    /** lưu thông tin vùng*/
    public landmark: Landmark;

    /** lưu thông tin tuyến */
    public routes: Route[];

    /**Lưu thông tin công ty, key là id của công ty */
    public companies: Map<number, Company>;

    /** loại xe trong tuyến, key là id của tuyến */
    public vehicleTypeInRoute: Map<number, Array<VehicleType>>;
}