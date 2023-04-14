import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Logo from "./elements/Logo/Logo.jsx";
import SettingCard from "./elements/Cards/SettingCard";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import adthan from "./assets/normal adthan.wav";
import {listen} from "@tauri-apps/api/event"
import {BaseDirectory, createDir, exists, writeFile} from "@tauri-apps/api/fs"

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [prayertimesobj, setPrayertimesobj] = useState({});

  
  let data = {
    'Fajr': 0,
    'Duhur': 1,
    'Asr': 2,
    'Maghrib': 0,
    'Isha' : 1
  }

  const adthanplayer = new Audio(adthan)


  async function requestPerm(){    
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
  }
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }
  async function update() {
    return await invoke("update");
  }
  async function start() {
    await invoke("start");
  }
  async function stop() {
    await invoke("stop");
  }

  const InitiateData = async (stuff) => 
    {
      if (await exists('sleekadthan\\settings.json', {dir: BaseDirectory.AppData}))
      {
        console.log('im esxist')
        try { // if exists import settings
            const readdata = await readTextFile('sleekadthan\\settings.json', {dir: BaseDirectory.AppData})
            data = JSON.parse(readdata);
          } catch (e) {
            console.log(e);
          }
      }
      else 
      {
        console.log("i dont exists")
        try {
          await createDir("sleekadthan", {
              dir: BaseDirectory.AppData,
              recursive: true,
              });
          
          await writeFile(
              "/sleekadthan/", 
              JSON.stringify(notifydata), 
              {dir: BaseDirectory.AppData}
          )
      } catch (e) {
          console.error(e)
        }
      }
    }

  const checktime = (jsonprayertimeobject) => {
    const today = new Date("2023-03-18T06:06Z");
    for (const prayer in jsonprayertimeobject) {
      const prayertime =  new Date(today.toISOString().split('T')[0] + 'T' + jsonprayertimeobject[prayer]+':00'+'Z');
      if (adthanplayer.paused=== true && prayertime.getTime() === today.getTime())
      {
        //TODO: check for settings -> ensure that settings are followed
        //TODO: play sperate adthan for fajrs
        sendNotification('It is ' + prayer + ' time');
        adthanplayer.play();
      }
    }
  }

  useEffect(()=>{
    let temp = {};
    requestPerm();

    update()
      .then(value => {
        temp = JSON.parse(value);
        setPrayertimesobj(temp);
      })
      .catch(err => {
      return err
      })
    const stoplistener = listen('stop', (event) => {
      console.log("hi")
      adthanplayer.pause();
    });
    setInterval(() => {
      checktime(temp)
    }, 1000);

    InitiateData();

	}, [])

  return (
    <div className="flex-col space-y-10 mt-20">
      <div className="row">
        <Logo></Logo>
      </div>
      <div className="flex flex-wrap items-center gap-8 justify-center">
        <SettingCard data={data}></SettingCard>
      </div>
      
    </div>
  );
}

export default App;
