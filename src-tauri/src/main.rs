// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::SystemTray;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};
use std::io::Read;
use std::error::Error;
use reqwest::blocking::get;
use serde_json::Value;



fn req() -> Result<Value, Box<dyn Error>> {
  let mut res = get("http://api.aladhan.com/v1/timingsByCity/18-03-2023?city=Toronto&country=Canada&method=2")?; // api error possilbe
  let mut body = String::new();
  res.read_to_string(&mut body)?; // mis read error possible
  let jsoned:Value = serde_json::from_str(&body)?; //mis read error possible
  Ok(jsoned)
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn update() -> String{
  let body = req(); //some random ass shit?
  match body {
    Ok(v) => format!("{}", v["data"]["timings"]),
    Err(e) => format!("ERROR {}", e),
  }
}


fn tray_event(app: &tauri::AppHandle,  event: tauri::SystemTrayEvent) { // this take in the event...
  match event {
    SystemTrayEvent::LeftClick { tray_id:_, position:_, size:_, .. } =>{
     
      app.emit_to("main", "stop", Some(())).unwrap_or_default(); // ignore return impossible to fail since window is always in scope..

    }
    SystemTrayEvent::MenuItemClick { id, .. } => {
      match id.as_str() {
        "quit" => {
          std::process::exit(0);
        }
        "show" => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
        }
        _ => {}
      }
    }
    _ => {}
  }
}





fn main() {
  // setup sound sink
  // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("show".to_string(), "Show");
  let tray_menu = SystemTrayMenu::new()
      .add_item(quit)
      .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(hide);
  let tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
      .system_tray(tray)
      .on_system_tray_event(tray_event)
      .on_window_event(|event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            event.window().hide().unwrap();
            api.prevent_close();
        }
        _ => {}
      })
      .invoke_handler(tauri::generate_handler![greet, update])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
