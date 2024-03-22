export function windowOpen(url: string): WindowProxy | null {
  const width = 600,
    height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const popUp = window.open(
    url,
    "",
    `popup=yes toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=yes, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`,
  );

  const opts = {capture: true};

  ['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach((type) => {
    popUp?.addEventListener(type, (ev) => { console.log(type, ev)});
  });
  popUp?.addEventListener('freeze', (ev) => { console.log('freeze', ev)}, opts);
  popUp?.addEventListener('pagehide', (ev) => { console.log('pagehide', ev)}, opts);
  popUp?.addEventListener('unload', (ev) => { console.log('unload', ev)}, opts);


  popUp?.addEventListener('load', (ev) => { console.log('load', ev)});

  window.focus();

  setTimeout(() => {
    popUp?.focus();
  }, 10000)

  return popUp;
}
