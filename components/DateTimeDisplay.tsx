import React from "react";

const DateTimeDisplay = ({ value, type, isDanger }:{value:number,type:string,isDanger:boolean}) => {
  return (
    <div className='flex flex-col items-center mx-5' style={isDanger?{color:'red'}:{}}>
      <p className="font-bold" style={{fontSize:'calc(1rem + 1vw)'}}>{value}</p>
      <span>{type}</span>
    </div>
  );
};

export default DateTimeDisplay;
