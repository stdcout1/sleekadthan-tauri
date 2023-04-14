import React, { useEffect } from 'react'
import { IconButton } from '@material-tailwind/react'
import { useState } from 'react'


const val = ['fas fa-bell','fas fa-bell-slash','fas fa-volume-xmark']


const SoundControl = (props) => {
    const [newId, setNewId] = useState(props.data[props.name]);

    const handleClick = () => {
        const newnewid = newId>1? 0: newId+1
        setNewId(newnewid)
        props.mainclick()
        // TODO: Save settings
        //first open data
        //if does not exist make a sample
        //if it does import via json parse
        //update the js object
        //save it to file
    }

    return (
        <div className='flex text-xl w-full bg-gray-800 rounded-lg text-white'>
            <div>
                <IconButton className={`${val[newId]}`} onClick={handleClick}>
                </IconButton>   
            </div>
            <div className='place-self-center w-full h-full relative text-center right-6 pointer-events-none'>
                <p1 className = 'text-center'>
                    {props.name}
                </p1>
            </div>
        </div>
    )
}

export default SoundControl