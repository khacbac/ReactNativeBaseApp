export default interface IeRatingPresenter {

    onInit(): void;

    setContent(): void;

    // getListRating(): Array<Object>;

    // onTouchRating(item: Object): void;

    onSendRating(ratingCount: number, note: string): void;

    onExitRating(): void;

    onBackPress(): void;
}