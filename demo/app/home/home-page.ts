import { PaycardsRecognizer } from 'nativescript-paycards-recognizer';

/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "tns-core-modules/ui/page";
import { HomeViewModel } from "./home-view-model";
import { Card } from 'nativescript-paycards-recognizer/paycards-recognizer.common';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new HomeViewModel();
}


export function recognize () {
    (new PaycardsRecognizer()).recognize()
        .then((card: Card) => {
            console.log(card);
        })
        .catch(e => {
            console.log(e);
        });
} 