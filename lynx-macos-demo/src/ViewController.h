#import <Cocoa/Cocoa.h>
#include "lynx_view.h"

@interface ViewController : NSViewController
@property(nonatomic) std::shared_ptr<lynx::pub::LynxView> lynxView;
@end
