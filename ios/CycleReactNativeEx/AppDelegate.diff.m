diff --git a/AppDelegate.m b/AppDelegate.apphub.m
index 55abfbd..3220cb0 100644
--- a/AppDelegate.m
+++ b/AppDelegate.apphub.m
@@ -6,6 +6,7 @@
  * LICENSE file in the root directory of this source tree. An additional grant
  * of patent rights can be found in the PATENTS file in the same directory.
  */
+#import "AppHub.h"
 #import "AppDelegate.h"
 
 #import "RCTBundleURLProvider.h"
@@ -15,9 +16,13 @@
 
 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 {
+  [AppHub setApplicationID:@"T6DAeuLSqcjbmrpL0FTd"];
   NSURL *jsCodeLocation;
 
-  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
+  AHBuild *build = [[AppHub buildManager] currentBuild];
+  [AppHub buildManager].cellularDownloadsEnabled = YES;
+  jsCodeLocation = [build.bundle URLForResource:@"main"
+                                  withExtension:@"jsbundle"];
 
   RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                       moduleName:@"CycleReactNativeEx"
