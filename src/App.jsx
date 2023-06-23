import { BaseDirectory, readTextFile, writeTextFile, createDir } from "@tauri-apps/api/fs";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import "./App.css";
import adthan from "./assets/normal adthan.wav";
import SettingCard from "./elements/Cards/SettingCard";
import Logo from "./elements/Logo/Logo.jsx";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState(""); 
  const [prayertimesobj, setPrayertimesobj] = useState({});
  const path = "settings.json"

  const [data, setData] = useState({
    'Fajr': 0,
    'Duhur': 1,
    'Asr': 2,
    'Maghrib': 0,
    'Isha' : 1
  })

  const adthanplayer = new Audio(adthan)


  async function requestPerm(){    
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
  }
  async function update() {
    return await invoke("update");
  }


  const InitiateData = async () => 
    {
      //first see if dir exists...
      await createDir('data', { dir: BaseDirectory.AppData, recursive: true });

      try {
        setData(JSON.parse(await readTextFile(path, {dir: BaseDirectory.AppData})))
      } catch (e) {
        try{
          await writeTextFile(path, JSON.stringify(data), {dir: BaseDirectory.AppData})
        }
        catch (e)
        {
          console.log(e)
        }
      }
    }
  
  const UpdateData = async (new_data) => {
    await writeTextFile(path, JSON.stringify(new_data),{dir: BaseDirectory.AppData})
    console.log("saved: ", new_data)
  }

  const checktime = (jsonprayertimeobject) => {
    const today = new Date();
    for (const prayer in jsonprayertimeobject) {
      const prayertime =  new Date(today.toISOString().split('T')[0] + 'T' + jsonprayertimeobject[prayer]+':00'+'Z');
      if (adthanplayer.paused=== true && prayertime.getTime() === today.getTime())
      {
        if (data[prayer] == 0) { 
          sendNotification('It is ' + prayer + ' time');
          adthanplayer.play()
        }

        if (data[prayer] == 1) { 
          sendNotification('It is ' + prayer + ' time');
        }
        
        if (data[prayer] == 2) { 
          return
        }
        //TODO: play sperate adthan for fajrs     
      }
    }
  } 
  useEffect(()=>{
    InitiateData();
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
    setInterval(() => {
      checktime(temp)
    }, 1000);

	}, [])

  return (
    <div className="flex-col space-y-10 mt-20">
      <div className="row">
        <Logo></Logo>
      </div>
      <div className="flex flex-wrap items-center gap-8 justify-center">
        <SettingCard data={data} setData = {setData} update_function = {UpdateData}></SettingCard>
      </div>
      
    </div>
  );
}

export default App;
