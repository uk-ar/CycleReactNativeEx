#import "MySafariViewController.h"

@implementation MySafariViewController
// We have to share this code from both host app & app ext
//http://stackoverflow.com/a/25408472
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSURL *destURL = [fileManager containerURLForSecurityApplicationGroupIdentifier: @"group.org.reactjs.native.example.CycleReactNativeEx"];
  // TODO:FIX appGroup in xcode.proj when upgrade
  //return @{ @"appGroupPath":[destURL absoluteString] };
  return @{ @"appGroupPath":destURL.path };
}

@end
