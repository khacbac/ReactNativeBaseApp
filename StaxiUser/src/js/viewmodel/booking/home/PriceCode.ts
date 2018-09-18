/**
 * Các mã giá cước
 * @author Đv Hiện
 * Created on 26/07/2018
 */
enum PriceCode {
    PRICE_DEFAULT = 0,
    PRICE_OPEN = 1, // Giá mở cửa
    PRICE_LEVEL_ONE = 2, // Giá level 1
    PRICE_LEVEL_TWO = 3, // Giá level 2
    PRICE_RETURN = 4, // Giá chiều về
}
export default PriceCode;