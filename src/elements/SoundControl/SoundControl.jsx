import { IconButton } from '@material-tailwind/react'


const val = ['fas fa-bell','fas fa-bell-slash','fas fa-volume-xmark']


const SoundControl = (props) => {

    const handleClick = () => {
        let name = props.name
        let data = props.data
        const newnewid = data[name]===2? 0: data[name]+1
        let new_data = { ...data, [name]: newnewid}
        props.setData(new_data)
        console.log(newnewid)
        props.update_function(new_data)
    }

    return (
        <div className='flex text-xl w-full bg-gray-800 rounded-lg text-white'>
            <div>
                <IconButton className={`${val[props.data[props.name]]}`} onClick={handleClick}>
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
