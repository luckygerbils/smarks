import React, { useCallback, useState } from "react";

interface MoveIndicatorProps {
  level?: number,
  parentBeingDraggedOver?: boolean,
  onDrop: () => any,
}

export function MoveIndicator({ 
  level=0,
  parentBeingDraggedOver=false,
  onDrop 
}: MoveIndicatorProps) {
  const [beingDraggedOver, setBeingDraggedOver] = useState(false);
  
  const allowDrop = useCallback(event => event.preventDefault(), []);
  const show = useCallback(() => setBeingDraggedOver(true), [setBeingDraggedOver]);
  const hide = useCallback(() => setBeingDraggedOver(false), [setBeingDraggedOver]);
  const drop = useCallback(e => {
    e.preventDefault();
    setBeingDraggedOver(false);
    onDrop();
  }, [setBeingDraggedOver, onDrop]);

  return (
    <div 
      style={{
        padding: `0.25rem 0 0.25rem ${level*2}rem`,
      }}
      onDragOver={allowDrop}
      onDragEnter={show}
      onDragLeave={hide}
      onDrop={drop}
    >
      <div style={{
        width: "4rem", 
        height: "4px", 
        backgroundColor: (beingDraggedOver || parentBeingDraggedOver) ? "-moz-menuhover" : "transparent" }} 
      />
    </div>
  );
}