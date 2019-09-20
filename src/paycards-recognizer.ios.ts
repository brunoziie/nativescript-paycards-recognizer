/// <reference path="./typing.d.ts" />

import { Card } from './paycards-recognizer.common';

class RecognizerViewController extends UIViewController implements PayCardsRecognizerPlatformDelegate {
    public static ObjCProtocols = [PayCardsRecognizerPlatformDelegate];

    public static ObjCExposedMethods = {
        onBackButtonClick: { 
            returns: interop.types.void, 
            params: [ interop.types.id ]
        }
    };

    private recognizer: PayCardsRecognizer;
    private _callback: Function = null;

    viewDidLoad () {
        super.viewDidLoad();

        this.recognizer = PayCardsRecognizer.alloc().initWithDelegateResultModeContainerFrameColor(
            this,
            PayCardsRecognizerResultModeAsync,
            this.view,
            UIColor.greenColor
        );
    }

    viewWillAppear (animated: boolean) {
        super.viewWillAppear(animated);
         
        const backButton: UIBarButtonItem = UIBarButtonItem.alloc()
            .initWithTitleStyleTargetAction(
                'Cancel',
                UIBarButtonItemStyle.Plain,
                this,
                'onBackButtonClick'
            );

        // this.navigationItem.title = 'Foo';
        this.navigationItem.hidesBackButton = false;
        this.navigationItem.leftBarButtonItem = backButton;

	    this.recognizer.startCamera();
    }

    viewDidDisappear (animated: boolean) {
	    super.viewDidDisappear(animated)
	    this.recognizer.stopCamera();
    }

    payCardsRecognizerDidRecognize(recognizer: PayCardsRecognizer, result: any): void {
        if (result.isCompleted) {
            if (this._callback) {
                const card = Card.fromIOSResult(result);
                this._callback(card);
            }

            getViewControllerToPresentFrom()
                .dismissViewControllerAnimatedCompletion(true, null);
        }
    }

    onBackButtonClick () {
        getViewControllerToPresentFrom()
            .dismissViewControllerAnimatedCompletion(true, null);
    }

    setCallback (callback: Function) {
        this._callback = callback;
    }
}

function getViewControllerToPresentFrom(): UIViewController {
    let frame = require('tns-core-modules/ui/frame');
    let viewController: UIViewController;
    let topMostFrame = frame.topmost();

    if (topMostFrame) {
        viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;

        if (viewController) {
            while (viewController.parentViewController) {
                // find top-most view controler
                viewController = viewController.parentViewController;
            }
    
            while (viewController.presentedViewController) {
                // find last presented modal
                viewController = viewController.presentedViewController;
            }
        }
    }

    if (!viewController) {
        viewController = UIApplication.sharedApplication.keyWindow.rootViewController;
    }

    return viewController;
}



export class PaycardsRecognizer {
    recognize () : Promise<Card> {
        const recognizerView = RecognizerViewController.new();
        const nav: UINavigationController = UINavigationController.alloc().initWithRootViewController(recognizerView);

        nav.navigationBar.barTintColor = UIColor.blackColor;
        nav.navigationBar.tintColor = UIColor.whiteColor;
        nav.navigationBar.titleTextAttributes = NSDictionary.dictionaryWithObjectForKey(UIColor.whiteColor, NSForegroundColorAttributeName);
        nav.navigationBar.barStyle = UIBarStyle.Black;

        setTimeout(() => {
            getViewControllerToPresentFrom()
                .presentViewControllerAnimatedCompletion(nav, true, () => {});
        }, 0);

        return Promise.resolve(null);
    }
}