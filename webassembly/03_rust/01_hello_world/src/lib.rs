mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn hello(s: &str) -> String {
    return format!("Hello {}", s);
}
