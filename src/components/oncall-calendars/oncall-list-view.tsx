import React from "react";
import { OnCall } from "../../generated/client";
import { useAtomValue } from "jotai";
import { oncallAtom } from "../../atoms/oncall";
import { Checkbox } from "@mui/material";

/**
 * Component properties
 */
interface Props {
  selectedYear: number;
}

const OnCallListView = ({ selectedYear }: Props) => {
  const onCallData = useAtomValue(oncallAtom);
  console.log(onCallData);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", textAlign: "center" }}>
          <strong>Paid</strong>
        </div>
        <div style={{ width: "50%", textAlign: "center" }}>
          <strong>Week</strong>
        </div>
        <div style={{ width: "50%", textAlign: "center" }}>
          <strong>Person</strong>
        </div>
      </div>
      {onCallData
        .sort((a, b) => Number(b.Week) - Number(a.Week))
        .map((item) => {
          return (
            <div style={{ display: "flex", textAlign: "center" }}>
              <Checkbox />
              <div style={{ width: "50%", textAlign: "center" }}>{item.Week}</div>
              <div style={{ width: "50%", textAlign: "center" }}>{item.Person}</div>
            </div>
          );
        })}
    </div>
  );
};

export default OnCallListView;
