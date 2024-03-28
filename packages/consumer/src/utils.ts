export function windowOpen(
  url: string,
  width = 600,
  height = 600,
): WindowProxy | null {
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

const FIVE_MIN = 5 * 60 * 1000;
export async function onHrefUpdate(
  popup: WindowProxy,
  callback: (searchParams: URLSearchParams) => Promise<boolean>,
  onClosed: () => void,
): Promise<void> {
  const initialUrl = popup.location.href;

  const waiter = new Promise<void>((resolve) =>
    setInterval(() => {
      try {
        if (popup.closed) {
          onClosed();
          resolve();
        }

        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl !== initialUrl) {
          void callback(new URL(currentUrl).searchParams).then((ok) => {
            if (ok) resolve();
          });
        }
      } catch (e) {
        /* Ignore DOMException while loading */
      }
    }, 250),
  );

  const timeour = new Promise((resolve) => setTimeout(resolve, FIVE_MIN));

  await Promise.race([waiter, timeour]);
  popup.close();
}
