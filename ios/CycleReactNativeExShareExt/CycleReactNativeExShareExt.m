#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@interface CycleReactNativeExShareExt : ReactNativeShareExtension
@end

@implementation CycleReactNativeExShareExt

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"CycleReactNativeExShareExt"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;
  return rootView;
}

@end
