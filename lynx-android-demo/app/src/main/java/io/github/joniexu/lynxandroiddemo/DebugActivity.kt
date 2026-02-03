package io.github.joniexu.lynxandroiddemo

import android.app.Activity
import android.os.Bundle
import com.lynx.tasm.LynxView
import com.lynx.tasm.LynxViewBuilder
import com.lynx.tasm.TemplateData
import io.github.joniexu.lynxandroiddemo.providers.CommonTemplateProvider

class DebugActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val lynxView = buildLynxView()
        setContentView(lynxView)
        val url = intent.getStringExtra("url")
        if (url != null) {
            lynxView.renderTemplateUrl(url, TemplateData.empty())
        }
    }

    private fun buildLynxView(): LynxView {
        val viewBuilder = LynxViewBuilder()
        viewBuilder.setTemplateProvider(CommonTemplateProvider(this))
        return viewBuilder.build(this)
    }
}