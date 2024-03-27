export function windowOpen(url: string): WindowProxy | null {
  const width = 600,
    height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  return window.open(
    url,
    "",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
  );
}
