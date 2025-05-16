package com.avalanchewallet

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "AvalancheWallet"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        fabricEnabled
      ) {
        // react-native-gesture-handler v2 için eklenmesi gereken kısım:
        // Dokümantasyona göre, new architecture (Fabric) kullanılıyorsa bu override gerekli olmayabilir
        // veya farklılık gösterebilir. Şimdilik standart yöntemi ekliyoruz.
        // Eğer sorun devam ederse, Fabric için özel kurulum adımlarına bakmak gerekebilir.
        override fun onCreate(savedInstanceState: Bundle?) {
          super.onCreate(null) // ÖNEMLİ: savedInstanceState'i null olarak geçirin
        }
      }
  }
}
