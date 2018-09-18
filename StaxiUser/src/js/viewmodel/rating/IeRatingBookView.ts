import RatingStaus from "./RatingStatus";

export default interface IeRatingBookView {

    onInit(): void;

    setContent(): void;

    // updateAfterRating(newRatings: Array<Object>, ratingStatus: RatingStaus, ratingCount: number): void;

    unRating(msg: string): void;

    ratingUnNote(msg: string): void;

    failSendRating(msg: string): void;

    successRating(msg: string): void;

}