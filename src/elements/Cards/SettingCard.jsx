import React from 'react'
import SoundControl from '../SoundControl/SoundControl'
import {
  Card,
  CardHeader,
  CardBody, Typography
} from "@material-tailwind/react"

const SettingCard = (props) => {
  return (
    <Card className="w-96">
      <CardHeader color = "blue-gray" className="flex relative h-12">
        <Typography className = "m-auto align-middle text-center font-sans font-size-21 text-3xl font-bold">Settings</Typography>
      </CardHeader>
      <CardBody className="flex-col">
        <Typography variant="h5" className="mb-2 text-center">
          Adthan Sounds
        </Typography>
        <Typography className = "flex-col place-items-center space-y-3">
          <SoundControl name = 'Fajr' data = {props.data} setData = {props.setData} update_function = {props.update_function}></SoundControl>
          <SoundControl name = 'Duhur' data = {props.data} setData = {props.setData} update_function = {props.update_function}></SoundControl>
          <SoundControl name = 'Asr' data = {props.data} setData = {props.setData} update_function = {props.update_function}></SoundControl>
          <SoundControl name = 'Maghrib' data = {props.data} setData = {props.setData} update_function = {props.update_function}></SoundControl>
          <SoundControl name = 'Isha' data = {props.data} setData = {props.setData} update_function = {props.update_function}></SoundControl>
        </Typography>
      </CardBody>
    </Card>
  )
}

export default SettingCard