export function windowOpen(url: string, width = 600, height = 600): WindowProxy | null {
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

export async function onHrefUpdate(popup: WindowProxy, callback: (searchParams: URLSearchParams) => boolean): Promise<void> {
  const initialUrl = popup.location.href;

  const waiter = new Promise<void>(resolve => setInterval(() => {
      try {
        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl !== initialUrl) {
          if(callback(new URL(currentUrl).searchParams)) resolve();
        }
      } catch (e) {
        /* Ignore DOMException while loading */
      }
    }, 100)
  );

  const timeour = new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5));

  await Promise.race([waiter, timeour]);
  popup.close();
}
