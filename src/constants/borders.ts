const BORDER = {
  UP: 0x01,
  DOWN: 0x02,
  LEFT: 0x04,
  RIGHT: 0x08,
};

export function getBorder(i: number) : number {
  let border = 0;
  if (i % 3 === 0) border |= BORDER.RIGHT;
  else if (i % 3 === 2) border |= BORDER.LEFT;
  else border |= BORDER.LEFT | BORDER.RIGHT;

  if (i < 3) border |= BORDER.DOWN;
  else if (i > 5) border |= BORDER.UP;
  else border |= BORDER.UP | BORDER.DOWN;

  return border;
}

export const getBorderClasses = (flags: number): string => {
  const classes = [];
  
  if (flags & BORDER.UP) classes.push('border-up');
  if (flags & BORDER.DOWN) classes.push('border-down');
  if (flags & BORDER.LEFT) classes.push('border-left');
  if (flags & BORDER.RIGHT) classes.push('border-right');
  
  return classes.join(' ');
};