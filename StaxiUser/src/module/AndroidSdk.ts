import{Platform, BackHandler, NativeEventSubscription} from "react-native";
import { Utils } from ".";
class AndroidSdk {

    public static isAndroid(){
        return Platform.OS === 'android';
    }

	/**
	 * @return true when the caller API version is at least ICS 14
	 */
	public static iceCreamSandwich() : boolean {
		return this.isAndroid() && Platform.Version >= 14;
	}

	/**
	 * @return true when the caller API version is at least jellyBean 16 v4.1
	 */
	public static  jellyBean() : boolean{
		return this.isAndroid() && Platform.Version >= 16;
	}

	/**
	 * @return true when the caller API version is at least jellyBean MR1 17 v4.2
	 */
	public static  jellyBeanMR1() : boolean{
		return this.isAndroid() && Platform.Version >= 17;
	}

	/**
	 * @return true when the caller API version is at least jellyBean MR2 18. v4.3
	 */
	public static  jellyBeanMR2() : boolean{
		return this.isAndroid() && Platform.Version >= 18;
	}

	/**
	 * @return true when the caller API version is at least Kitkat 19 v4.4
	 */
	public static  kitkat() : boolean{
		return this.isAndroid() && Platform.Version >= 19;
	}

	/**
	 * @return true when the caller API version is at least Kitkat Watch 20 v4.4w
	 */
	public static  kitkatWatch() : boolean{
		return this.isAndroid() && Platform.Version >= 20;
	}

	/**
	 * @return true when the caller API version is at least lollipop 21 v5.0
	 */
	public static  lollipop() : boolean{
		return this.isAndroid() && Platform.Version >= 21;
	}

	/**
	 * @return true when the caller API version is at least lollipop 22 v5.1
	 */
	public static  lollipopMR1() : boolean{
		return this.isAndroid() && Platform.Version >= 22;
	}
	
	/**
	 * @return true when the caller API version is at least Marshmallow 23 v6.0
	 */
	public static  marshmallow() : boolean{
		return this.isAndroid() && Platform.Version >= 23;
	}


    /**
     * @return true when the caller API version is at least nougat 24 v7.0
     */
    public static  nougat() : boolean{
        return this.isAndroid() && Platform.Version >= 24;
    }

    /**
     * @return true when the caller API version is at least nougat 25 v7.1
     */
    public static  nougatMR1() : boolean{
        return this.isAndroid() && Platform.Version >= 25;
    }

	/**
	 * @return true when the caller API version is at least oreo 26 v8
	 */
	public static  oreo() : boolean{
		return this.isAndroid() && Platform.Version >= 26;
	}

	/**
	 * @param apiLevel
	 *            minimum API level version that has to support the device
	 * @return true when the caller API version is at least apiLevel
	 */
	public static  isAtLeastAPI(apiLevel:number) {
		return this.isAndroid() && Platform.Version >= apiLevel;
	}

	/**
	 * thêm sự kiện lắng nghe khi click back trên android
	 * @param handleBackPress
	 */
	public static addBackListener(handleBackPress:Function):NativeEventSubscription{
		
		//nếu không phải android thì bỏ qua
		if(!this.isAndroid()) return null;

		//xóa lắng nghe hàm này trước khi thêm vào
		// BackHandler.removeEventListener('hardwareBackPress', handleBackPress());

		//thêm sự kiện
		// let event = BackHandler.addEventListener('hardwareBackPress', () => handleBackPress());
		let event = BackHandler.addEventListener('hardwareBackPress', () => {
			return handleBackPress();
		});

		//tra về sự kiện lắng nghe
		return event;
	}

	/**
	 * xóa sự kiện lắng nghe
	 * @param event 
	 */
	public static removeBackListener(event:NativeEventSubscription):void{
		//nếu không phải android thì bỏ qua
		if(!this.isAndroid()) return;

		if(!Utils.isNull(event)){
			event.remove();
		}
	}
}

export default AndroidSdk;