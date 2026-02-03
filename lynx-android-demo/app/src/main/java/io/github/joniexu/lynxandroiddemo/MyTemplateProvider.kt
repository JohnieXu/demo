package io.github.joniexu.lynxandroiddemo

import android.content.Context
import com.lynx.tasm.provider.AbsTemplateProvider
import okio.ByteString.Companion.toByteString
import okio.IOException
import java.io.ByteArrayOutputStream

class MyTemplateProvider(context: Context): AbsTemplateProvider() {
    private var mContext: Context = context.applicationContext
    override fun loadTemplate(
        url: String,
        callback: Callback?
    ) {

        Thread {
            try {
                mContext.assets.open(url).use { inputStream ->
                    ByteArrayOutputStream().use { byteArrayOutputStream ->
                        val buffer = ByteArray(1024)
                        var length: Int
                        while ((inputStream.read(buffer).also { length = it }) != -1) {
                            byteArrayOutputStream.write(buffer, 0, length)
                        }
                        callback?.onSuccess(byteArrayOutputStream.toByteArray())
                    }
                }
            } catch (e: IOException) {
                callback?.onFailed(e.message)
            }
        }.start()
    }
}