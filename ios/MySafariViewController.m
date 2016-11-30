#import "MySafariViewController.h"

@implementation MySafariViewController

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSURL *destURL = [[fileManager containerURLForSecurityApplicationGroupIdentifier: @"group.org.reactjs.native.example.CycleReactNativeEx"]
                    URLByAppendingPathComponent:@"test.realm"];
  // TODO:FIX appGroup when upgrade
  return @{ @"appGroupPath":[destURL absoluteString] };
  //return @{ @"appGroupPath":@"bar" };
}

@end
