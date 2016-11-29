//
//  MySafariViewController.h
//  CycleReactNativeEx
//
//  Created by 有澤 悠紀 on 2016/11/30.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <RCTBridge.h>
#import <SafariServices/SafariServices.h>
//@interface MySafariViewController : UIViewController
@interface MySafariViewController : NSObject <RCTBridgeModule>
@end
