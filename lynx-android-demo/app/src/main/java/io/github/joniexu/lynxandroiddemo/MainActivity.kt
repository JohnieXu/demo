package io.github.joniexu.lynxandroiddemo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.lynx.tasm.LynxBooleanOption
import com.lynx.tasm.LynxView
import com.lynx.tasm.LynxViewBuilder
import com.lynx.xelement.XElementBehaviors
import io.github.joniexu.lynxandroiddemo.providers.CommonTemplateProvider
import io.github.joniexu.lynxandroiddemo.providers.GenericResourceFetcher
import io.github.joniexu.lynxandroiddemo.ui.theme.LynxAndroidDemoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val lynxView = buildLynxView()
        setContentView(lynxView)

        val url = "main.lynx.bundle"
        val url2 = "http://192.168.124.6:3000/index.lynx.bundle?fullscreen=true"
        lynxView.renderTemplateUrl(url2, "")
//        setContent {
//            LynxAndroidDemoTheme {
//                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
//                    Greeting(
//                        name = "Android",
//                        modifier = Modifier.padding(innerPadding)
//                    )
//                }
//            }
//        }
    }

    private fun buildLynxView(): LynxView {
        val viewBuilder = LynxViewBuilder()
        viewBuilder.isEnableGenericResourceFetcher = LynxBooleanOption.TRUE
        viewBuilder.addBehaviors(XElementBehaviors().create())
        viewBuilder.setTemplateProvider(CommonTemplateProvider(this))
        viewBuilder.setGenericResourceFetcher(GenericResourceFetcher())
        return viewBuilder.build(this)
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    LynxAndroidDemoTheme {
        Greeting("Android")
    }
}