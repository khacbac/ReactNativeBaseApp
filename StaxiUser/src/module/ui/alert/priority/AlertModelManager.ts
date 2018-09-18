import AlertModel from './AlertModel';
import { Utils } from '../../..';

export default class AlertModelManager {
    private mAlertModels: AlertModel[];

    private mActive: AlertModel;

    public getActive(): AlertModel {
        return this.mActive;
    }

    /**
     * thiết lập alert model
     * @return trả về model active
     */
    public setAlertModel(alertModel: AlertModel): AlertModel{
        if (Utils.isNull(this.mActive) || this.mActive.priority === alertModel.priority) {
            this.mActive = alertModel;
            return alertModel;
        }

        //khởi tạo nếu chưa có
        if(Utils.isNull(this.mAlertModels)){
            this.mAlertModels = [];
        }

        //nếu thông báo hiện tại có độ ưu tiên cao hơn
        if(this.mActive.isPriority(alertModel)){
            //thêm thông báo mới vào queue và giữ nguyên hiện thị thông báo cũ
            this.put(alertModel);
            //Nếu thông báo hiện tại có độ ưu tiên thấp hơn
        }else{
            //đẩy thông báo đang hiện thị vào queue
            this.put(this.mActive);

            //gán active lại cho thông báo mới
            this.mActive = alertModel;
        }

        return this.mActive;
    }
  
    private put(alertModel: AlertModel){
        if(Utils.isNull(this.mAlertModels)) return;

        let alert: AlertModel;
        for(let i = 0; i < this.mAlertModels.length; i++) {
            alert = this.mAlertModels[i];
            if (alert.priority === alertModel.priority) {
                this.mAlertModels[i] = alertModel;
                return;
            }
        }

        this.mAlertModels.push(alertModel);
    }
    
    /**
     * hủy active
     */
    public deactive(){
        this.mActive = null;
    }

    public get(priority: number): AlertModel {
        if(Utils.isNull(this.mActive)) return null;

        // nếu đang là loại active hiện tại
        if (this.mActive.priority === priority) {
            return this.mActive;
        }

        //nếu không phải là active thì lấy trong queue
        if(!Utils.isNull(this.mAlertModels) && this.mAlertModels.length > 0){
            let alertItem: AlertModel;
            for(let i = 0; i < this.mAlertModels.length; i++) {
                alertItem = this.mAlertModels[i];
                if (alertItem.priority === priority) {
                    return alertItem;
                }
            }
        }

        return null;
    }

    /**
     * xóa thông báo theo mức đọ ưu tiên
     * @return: trả về thông báo tiếp theo có độ ưu tiên cao nhất nếu có
     */
    public remove(priority: number): AlertModel{
        if(Utils.isNull(this.mActive)) return null;

        //nếu ẩn thông báo có độ ưu tiên thấp hơn thì sẽ remove khỏi queue và không ẩn thông báo
        if(this.mActive.priority != priority) {
            //khiểm tra trong queue có alert này không có thì remove
            if(!Utils.isNull(this.mAlertModels) &&  this.mAlertModels.length > 0) {
                let alertItem: AlertModel;
                for (let i = 0; i < this.mAlertModels.length; i++) {
                    alertItem = this.mAlertModels[i];
                    if (alertItem.priority === priority) {
                        this.mAlertModels.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            //Nếu ẩn thông báo ẩn là thông báo đang hiện thị thì kiểm tra xem
            //trong queue còn thông báo nào không để hiện thị lên, nếu không có ẩn luôn thông báo
            //khiểm tra xem có còn thông báo nữa không
            if(!Utils.isNull(this.mAlertModels) && this.mAlertModels.length > 0) {
                this.mActive = this.getHightPriorityAlertModel();
                let alertItem: AlertModel;
                for (let i = 0; i < this.mAlertModels.length; i++) {
                    alertItem = this.mAlertModels[i];
                    if (alertItem.priority === priority) {
                        this.mAlertModels.splice(i, 1);
                        break;
                    }
                }
            } else {
                this.mActive = null;
            }
        }

        return this.mActive;
    }

    /**
     * Lấy thông báo có độ ưu tiên cao nhất
     */
    public getActiveHightPriority(): AlertModel {
        if(this.mActive != null) return this.mActive;
        return this.getHightPriorityAlertModel();
    }
    
    /**
     * Lấy thông báo có độ ưu tiên cao nhất
     */
    public getHightPriorityAlertModel(): AlertModel{
        if (Utils.isNull(this.mAlertModels) || this.mAlertModels.length === 0) {
            return null;
        }

        let maxPriority: number = Number.MAX_SAFE_INTEGER;
        let alertTemp: AlertModel;
        let index = 0;
        for (let i = 0; i < this.mAlertModels.length; i++) {
            alertTemp = this.mAlertModels[i];
            if (alertTemp.priority < maxPriority){
                index = i;
                maxPriority = alertTemp.priority;
            }
        }

        //nếu không có độ ưu tiên nào nhở hơn => thì lấy item đầu tiên
        return this.mAlertModels[index];
    }
    /**
     * xóa toàn bộ thông báo
     */
    public clear(){
        this.mAlertModels = [];
        this.mActive = null;
    }
}
