
import {motion} from "framer-motion";



const KpiCard = ({title,count}:{title:string,count:string}) => {
    return (
        <motion.div className="p-5 bg-white border rounded shadow-sm" style={{padding: "10px",minWidth:"100px",alignItems:"center",justifyContent:"center",display:"flex",flexDirection:"column",borderRadius:"10px",backgroundColor:"#fff",boxShadow:"0 0 10px 0 rgba(0,0,0,.1)"}}
         whileHover={{
            position: 'relative',
            zIndex: 1,
            border: '1px solid white',
            scale: 1.2,
            transition: {
                duration: .2
            },
            backgroundColor: '#f8f9fa',
         }}
        >
            <div className="text-base text-black">{title}</div>
            <div className="flex items-center pt-1">
                {
                    title === "Last Log" ?
                        <div className="text-2xl font-bold text-gray-400">{count} Minutes ago</div>
                        :
                        <div className="text-2xl font-bold text-gray-400">{count}</div>
                }
            </div>
        </motion.div>
    )
}

export default KpiCard;