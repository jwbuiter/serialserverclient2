import React from "react";
import ReactTable from "react-table";

let id = 0;

export default function ReactTableWrapper(props) {
  const columns = props.columns.map(column => {
    id++;
    return {
      id,
      style: props.style,
      Header: (
        <b>
          {column.Headers.reduce((acc, cur) => (
            <>
              {acc}
              <br />
              {cur}
            </>
          ))}
        </b>
      ),
      ...column
    };
  });

  return <ReactTable data={props.data} columns={columns} />;
}
