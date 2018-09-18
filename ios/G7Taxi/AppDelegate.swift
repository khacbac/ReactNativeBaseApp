//
//  AppDelegate.swift
//  G7Taxi
//
//  Created by Administrator on 9/4/18.
//  Copyright © 2018 Administrator. All rights reserved.
//

import UIKit
import GoogleMaps

let moduleName = "G7Taxi"

let AppleID: String = "1401914283"

let googleMapKey = "AIzaSyDZLFM0Z6ZOWe8wsuWHNZK71N2UzYB4Cag"
//let googleMapKey = "AIzaSyDPSqrc29jQ4psuq5ukus4cp_o7sFsDpx8"

#if DEBUG

let tcpIP = "210.211.127.109"

let tcpPort:UInt16 = 7502

let httpIP = "http://210.211.127.109:7508/api/"

#else

//let tcpIP = "g7.staxi.vn"
//
//let tcpPort:UInt16 = 7502
//
//let httpIP = "http://g7.staxi.vn:7508/api/"

let tcpIP = "210.211.127.109"

let tcpPort:UInt16 = 7502

let httpIP = "http://210.211.127.109:7508/api/"

#endif

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var bridge: RCTBridge!

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        GMSServices.provideAPIKey(googleMapKey)
        
        #if DEBUG
        let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
        #else
        let jsCodeLocation = URL(fileURLWithPath: Bundle.main.path(forResource: "main", ofType: "jsbundle")!)
        #endif
        
        let rootView = RCTRootView(bundleURL:jsCodeLocation, moduleName: moduleName, initialProperties: nil, launchOptions:launchOptions)
        
        self.bridge = rootView?.bridge
        
        self.window = UIWindow(frame: UIScreen.main.bounds)
        let rootViewController = UIViewController()
        
        rootViewController.view = rootView
        
        self.window!.rootViewController = rootViewController;
        self.window!.makeKeyAndVisible()
        
        return true
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        print("applicationWillEnterForeground")
        if PermissionManager.share.checkLocationPermission() < 2 {
            PermissionManager.share.openUserSetting()
        } else {
            PermissionManager.share.updateLocationServiceStatus()
        }
        
        NotificationCenter.default.post(name: notificationAppWillEnterForeground, object: nil, userInfo: nil)
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
        print("applicationDidBecomeActive")
        NotificationCenter.default.post(name: notificationAppBecomeActive, object: nil, userInfo: nil)
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
        print("applicationDidEnterBackground")
        NotificationCenter.default.post(name: notificationAppDidEnterBackground, object: nil, userInfo: nil)
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        print("applicationWillTerminate")
        NotificationCenter.default.post(name: notificationAppWillTerminate, object: nil, userInfo: nil)
    }
    
    // related with notification
    func application(_ application: UIApplication, didRegister notificationSettings: UIUserNotificationSettings) {
        print("didRegister notificationSettings \(notificationSettings.types.rawValue)")
        
    }


}

