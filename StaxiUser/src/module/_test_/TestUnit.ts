import { DfByte, DfShort, DfInteger, DfLong, DfFloat, DfDouble, DfBoolean, DfString, DfLatLng, DfList } from "../js-serialize/DefinedType";
import { ByteHelper } from "..";
import MapUtils from "../maps/MapUtils";
import SphericalUtil from "../maps/SphericalUtil";

class TestUnit {

  testObject = () => {
    var model = new Model();
    model.byte = new DfByte(255);
    model.short = new DfShort(35000);
    model.int = new DfInteger(10000000);
    model.long = new DfLong(new Date().getTime());
    model.float = new DfFloat(Math.PI);
    model.double = new DfDouble(Math.PI * 3);
    model.bool = new DfBoolean(true);
    model.str = new DfString("Nguyễn Đức Lực");
    model.latlng = new DfLatLng(20.976543, 105.841751);

    let ob = new Ob();
    ob.arr.putValue(model);
    ob.arr.putValue(model);
    ob.arr.putValue(model);

    var arr = ByteHelper.serialize(ob);

    var model1 = new Ob();
    ByteHelper.deserialize(arr, model1);
  };

  static testFloat() {
    let value = 0.15625;
    let floatToIntBits = DfFloat.floatToIntBits(value);

    console.log("value ==" + value);

    console.log("floatToIntBits ==" + floatToIntBits);

    // let intBitsToFloat = 0x3e200000;
    console.log("intBitsToFloat ==" + DfFloat.intBitsToFloat(floatToIntBits));
  }

  static testDistance() {
    let from = { latitude: 20.973986, longitude: 105.840913};
    let to = { latitude: 21.027870, longitude: 105.852283};

    console.log('Test thử hàm tính khoảng cách --------------------------------')
    console.log("MapUtils: ", MapUtils.calculationByDistance(from, to));
    console.log("SphericalUtils: ", SphericalUtil.computeDistanceBetween(from, to));
  }
}

class Ob {
  public bool: DfBoolean = new DfBoolean(true);
  public str: DfString = new DfString("lucnd");
  public arr: DfList<Model> = new DfList(new Model());
}

class Model {
  public byte: DfByte = new DfByte();
  public short: DfShort = new DfShort();
  public int: DfInteger = new DfInteger();
  public long: DfLong = new DfLong();
  public float: DfLong = new DfFloat();
  public double: DfLong = new DfDouble();
  public bool: DfBoolean = new DfBoolean();
  public str: DfString = new DfString();
  public latlng: DfLatLng = new DfLatLng();
}

export default TestUnit;
