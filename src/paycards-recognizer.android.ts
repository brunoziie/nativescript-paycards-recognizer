declare const cards: any;

import { Card } from "./paycards-recognizer.common";
import * as application from 'tns-core-modules/application';

export class PaycardsRecognizer {
    static REQUEST_CODE_SCAN_CARD: number = 31618;

    recognize () : Promise<Card> {
        const ScanCardIntent = cards.pay.paycardsrecognizer.sdk.ScanCardIntent;
        const Builder = ScanCardIntent.Builder;
        const intent = new Builder(application.android.context).build();
        const foregroundActivity = application.android.foregroundActivity;

        foregroundActivity.startActivityForResult(intent, PaycardsRecognizer.REQUEST_CODE_SCAN_CARD);

        return new Promise((resolve, reject) => {
            application.android.on('activityResult', (args: any) => {
                if (
                    args.requestCode === PaycardsRecognizer.REQUEST_CODE_SCAN_CARD &&
                    args.resultCode === android.app.Activity.RESULT_OK
                ) {
                    const result: any = args.intent.getParcelableExtra(ScanCardIntent.RESULT_PAYCARDS_CARD);
                    const card = Card.fromAndroidIntent(result);
                    resolve(card);
                }
            });
        });
    }
}