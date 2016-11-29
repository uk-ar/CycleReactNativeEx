#import "MySafariViewController.h"

//@interface MySafariViewController ()

//@end

@implementation MySafariViewController

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(presentSafari:(NSString *)url) {
  NSLog(@"Presenting with url %@", url);
  
  SFSafariViewController *safariViewController = [[SFSafariViewController alloc]
                                                  initWithURL:[NSURL URLWithString:url]
                                                  entersReaderIfAvailable:YES];
  
  safariViewController.delegate = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = [[
                                             [UIApplication sharedApplication] keyWindow] rootViewController];
    
    [rootViewController presentViewController:safariViewController animated:YES completion: nil];
  });
}

RCT_EXPORT_METHOD(getAppGroupPath:(NSString *) appGroupId :(RCTResponseSenderBlock)callback) {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSURL *destURL = [fileManager containerURLForSecurityApplicationGroupIdentifier: appGroupId];
  callback(@[[NSNull null], [destURL absoluteString]]); ;
}

- (NSDictionary *)constantsToExport
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSURL *destURL = [[fileManager containerURLForSecurityApplicationGroupIdentifier: @"group.org.reactjs.native.example.CycleReactNativeEx"]
                    URLByAppendingPathComponent:@"test.realm"];
  return @{ @"appGroupPath":[destURL absoluteString] };
}

@end


