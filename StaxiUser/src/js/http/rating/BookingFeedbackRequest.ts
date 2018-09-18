import { DfString, DfInteger, DfByte, DfList } from "../../../module";

class BookingFeedbackRequest {

    public phone: DfString = DfString.index(0);

    public password: DfString = DfString.index(1);

    public bookCode: DfString = DfString.index(2);

    public strDriverCode: DfString = DfString.index(3);

    public companyID: DfInteger = DfInteger.index(4);

    public rateNumber: DfByte = DfByte.index(5);

    public notes: DfString = DfString.index(6);

    public bookingTime: DfInteger = DfInteger.index(7);

    public feedbackTypeId: DfInteger = DfInteger.index(8);

    public files: DfList<FileUpload> = new DfList(new FileUpload(), 9);;
}

class FileUpload {
    public byteImages: DfList<DfByte> = new DfList(new DfByte(), 0);

    public FileUpload(byteImages: DfList<DfByte>) {
        this.byteImages = byteImages;
    }
}

export { BookingFeedbackRequest, FileUpload };