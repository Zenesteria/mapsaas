import React from "react";
import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "@/util/useCountdown";
import Link from "next/link";

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }:{days:number, hours:number,minutes:number,seconds:number}) => {
  return (
    <div className="flex items-center justify-center p-3">
        <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} />
        <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
        <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
        <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
    </div>
  );
};

const CountdownTimer = ({ targetDate }:{targetDate:string}) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
