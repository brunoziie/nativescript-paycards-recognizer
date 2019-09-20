export class Card {
    number: string;
    holder: string;
    exp_month: string;
    exp_year: string;

    constructor () {
        this.number = null;
        this.holder = null;
        this.exp_month = null;
        this.exp_year = null;
    }

    static fromAndroidIntent (intentResult: any) {
        const card = new Card();

        card.number = intentResult.getCardNumber();
        card.holder = intentResult.getCardHolderName();

        const expiration = intentResult.getExpirationDate();

        if (expiration) {
            const [month, year] = expiration.split('/');
            card.exp_month = month;
            card.exp_year = year;
        }

        return card;
    }

    static fromIOSResult (result) {
        const card = new Card();

        card.number = result.recognizedNumber;
        card.holder = result.recognizedHolderName;
        card.exp_month = result.recognizedExpireDateMonth;
        card.exp_year = result.recognizedExpireDateYear;

        return card;
    }
}