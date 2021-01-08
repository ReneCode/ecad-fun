import React from "react"

import "./Popover.scss"

type Props = {
    top: number,
    left:number,
    children:React.ReactNode
}
const Popover:React.FC<Props> = ({top, left, children}) => {
    return <div className="popover" style={{top, left}}>popover</div>
}

export default Popover;