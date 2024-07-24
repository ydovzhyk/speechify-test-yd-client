import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfirmation } from "@/redux/technical/technical-selectors";
import { setRecBtn } from "@/redux/technical/technical-slice";
import s from "./CountdownCircle.module.scss";

const CountdownCircle = () => {
  const dispatch = useDispatch();
  const isConfirmation = useSelector(getConfirmation);
  const [count, setCount] = useState("WAIT");
  const [progress, setProgress] = useState(100);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (isConfirmation) {
      setCount(3);
      setIsCounting(true);
    }
  }, [isConfirmation]);

  useEffect(() => {
    if (!isCounting) return;

    const countInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearInterval(countInterval);
          dispatch(setRecBtn(true));
          return "SPEAK";
        }
        if (prevCount === "SPEAK") {
          return "SPEAK";
        }
        return prevCount - 1;
      });
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 0) {
          return 100;
        }
        return prevProgress - 100 / 4;
      });
    }, 1500);

    return () => {
      clearInterval(countInterval);
      clearInterval(progressInterval);
    };
  }, [isCounting]);

  return (
    <div className={s.countdown_circle}>
      <svg viewBox="0 0 36 36" className={s.circular_chart}>
        <path
          className={s.circle_bg}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${s.circle}`}
          strokeDasharray={`${progress}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y={count === "SPEAK" || count === "WAIT" ? "21.35" : "22.35"}
          className={
            count === "SPEAK" || count === "WAIT" ? s.word : s.percentage
          }
        >
          {count}
        </text>
      </svg>
    </div>
  );
};

export default CountdownCircle;
